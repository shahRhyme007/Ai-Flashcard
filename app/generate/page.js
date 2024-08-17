'use client'

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveFlashcardsCollection, getFlashcardsCollections } from "@/firebase/operations";
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material";
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Ensure db is properly imported

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [collectionName, setCollectionName] = useState(''); // Use this for the collection's name
    const [open, setOpen] = useState(false);
    const [recentCollections, setRecentCollections] = useState([]);
    const router = useRouter();

    // Fetch user's flashcards from Firestore
    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;

            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    // setFlashCards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }

        getFlashcards();
    }, [user]);

    // Fetch recent collections when the user is loaded
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const userCollections = await getFlashcardsCollections(user.id);
                console.log('Fetched Collections:', userCollections); // Debugging: Log the collections
                setRecentCollections(userCollections.slice(0, 5)); // Get the 5 most recent collections
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        if (user) {
            fetchCollections();
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.');
            return;
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            });

            if (!response.ok) {
                throw new Error('Failed to generate flashcards');
            }

            const data = await response.json();
            setFlashCards(data);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('An error occurred while generating flashcards. Please try again.');
        }
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!collectionName) {
            alert('Please enter a name for your flashcards collection.');
            return;
        }

        try {
            await saveFlashcardsCollection(user.id, collectionName, flashcards);
            alert("Flashcards saved successfully!");
            handleClose();

            // Refresh the recent collections after saving
            const updatedCollections = await getFlashcardsCollections(user.id);
            setRecentCollections(updatedCollections.slice(0, 5));
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert("Failed to save flashcards. Please try again.");
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ width: '65%' }}>
                    <Typography variant="h4">
                        Generate Flashcards
                    </Typography>
                    <Paper sx={{ p: 4, width: "100%" }}>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter Text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                            Submit
                        </Button>
                    </Paper>

                    {flashcards.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant='h5'>Flashcards Preview</Typography>
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card>
                                            <CardActionArea onClick={() => handleCardClick(index)}>
                                                <CardContent>
                                                    <Box sx={{
                                                        perspective: "1000px",
                                                        '& > div': {
                                                            transition: 'transform 0.6s',
                                                            transformStyle: 'preserve-3d',
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: "200px",
                                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                            transform: flipped[index]
                                                                ? 'rotateY(180deg)'
                                                                : "rotateY(0deg)"
                                                        },
                                                        '& > div > div': {
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: "100%",
                                                            backfaceVisibility: 'hidden',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: 2,
                                                            boxSizing: "border-box"
                                                        },
                                                        '& > div > div:nth-of-type(2)': {
                                                            transform: "rotateY(180deg)"
                                                        },
                                                    }}>
                                                        <div>
                                                            <div>
                                                                <Typography variant="h5" component={"div"}>
                                                                    {flashcard.front}
                                                                </Typography>
                                                            </div>
                                                            <div style={{ overflow: "auto", display: 'flex', alignItems: 'flex-start' }}>
                                                                <Typography variant="h5" component={"div"}>
                                                                    {flashcard.back}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button variant="contained" color="secondary" onClick={handleOpen}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Right sidebar for recent collections */}
                <Box sx={{ width: '30%', paddingLeft: 4 }}>
                    <Typography variant="h6" gutterBottom>Recent Collections</Typography>
                    <Grid container spacing={2}>
                        {recentCollections.map((collection, index) => (
                            <Grid item xs={12} key={index}>
                                <Button
                                    color='secondary'
                                    sx={{ mb: 2, width: '100%', padding: '12px 24px', fontSize: '1rem', minWidth: '150px' }}
                                    variant="contained"
                                    fullWidth
                                    onClick={() => {
                                        console.log('Navigating to collection:', collection.id); // Debugging: Log the collection ID
                                        router.push(`/flashcards?collection=${collection.name}`);
                                    }}
                                >
                                    {collection.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        <Button variant="contained" color="primary"
                            sx={{
                                padding: '12px 24px',
                                fontSize: '1rem',
                                minWidth: '150px',
                            }}
                            fullWidth onClick={() => router.push("/flashcards")}>
                            View All Flashcards
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label='Collection Name'
                        type="text"
                        fullWidth
                        value={collectionName} // Changed to collectionName
                        onChange={(e) => setCollectionName(e.target.value)} // Changed to setCollectionName
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

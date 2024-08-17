'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteFlashcardCollection } from "@/firebase/operations" // Ensure this path is correct based on your project structure

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    const handleDeleteFlashcard = async (name) => {
        if (!user) return

        try {
            // Call the function to delete the flashcard collection from the database
            await deleteFlashcardCollection(user.id, name)

            // Update the UI by removing the flashcard from the state
            setFlashcards((prevFlashcards) => prevFlashcards.filter(f => f.name !== name))
        } catch (error) {
            console.error("Error deleting flashcard:", error)
        }
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '2rem', marginTop: '5rem' }}>All your Flashcards</h1>
            <Container maxWidth="100vw">
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDeleteFlashcard(flashcard.name)}
                                    sx={{ position: 'relative', top: '0', right: '0' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

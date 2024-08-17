import { db } from "@/firebase/firebase";
import { doc, writeBatch, getDoc, collection, getDocs, deleteDoc, setDoc } from "firebase/firestore";

// Function to save user data on signup
export const saveUserData = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.id);
    await setDoc(userDocRef, {
      email: user.email,
      createdAt: new Date(),
      flashcards: [],
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Function to save flashcard collections
export const saveFlashcardsCollection = async (userId, collectionName, flashcards) => {
  const batch = writeBatch(db);
  const userDocRef = doc(db, "users", userId);

  try {
    if (!userId || !collectionName || !flashcards) {
      throw new Error("Invalid input data.");
    }

    const docSnap = await getDoc(userDocRef);

    let collections = [];
    if (docSnap.exists()) {
      collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === collectionName)) {
        throw new Error("Flashcard collection with the same name already exists.");
      }
    }

    // Add the new collection to the array
    collections.push({ name: collectionName });
    batch.set(userDocRef, { flashcards: collections }, { merge: true });

    // Create a reference for the new flashcards collection
    const colRef = collection(userDocRef, collectionName);
    flashcards.forEach((flashcard, index) => {
      if (!flashcard.front || !flashcard.back) {
        throw new Error(`Invalid flashcard at index ${index}`);
      }
      const cardDocRef = doc(colRef);  // Automatically generates a unique ID
      batch.set(cardDocRef, flashcard);
    });

    // Commit the batch operation
    await batch.commit();
  } catch (error) {
    console.error("Error saving flashcards collection:", error);
    throw error;
  }
};

// Function to get all flashcard collections for a user
export const getFlashcardsCollections = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data().flashcards || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching flashcards collections:", error);
    throw error;
  }
};

// Function to get a single flashcard collection by name
export const getFlashcardCollectionByName = async (userId, collectionName) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const collectionRef = collection(userDocRef, collectionName);
    const snapshot = await getDocs(collectionRef);

    const flashcards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return flashcards;
  } catch (error) {
    console.error(`Error fetching flashcards collection "${collectionName}":`, error);
    throw error;
  }
};

// Function to delete a flashcard collection by name
export const deleteFlashcardCollection = async (userId, collectionName) => {
  const batch = writeBatch(db);
  const userDocRef = doc(db, "users", userId);
  const collectionRef = collection(userDocRef, collectionName);

  try {
    // Get all documents in the collection and delete them
    const snapshot = await getDocs(collectionRef);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Remove the collection name from the user's flashcards array
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      const updatedCollections = collections.filter((f) => f.name !== collectionName);
      batch.set(userDocRef, { flashcards: updatedCollections }, { merge: true });
    }

    await batch.commit();
  } catch (error) {
    console.error(`Error deleting flashcards collection "${collectionName}":`, error);
    throw error;
  }
};

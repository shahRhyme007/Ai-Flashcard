// page.js

'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material";
import Head from 'next/head'

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000' // Change this before deployment
      }
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>ai-flashcards</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static"> 
        <Toolbar>
          <Typography variant ='h6' style={{flexGrow:1}}>flashcards</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-in">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
      sx={{
        textAlign:'center',
        my:4
      }}>
        <Typography variant="h2" gutterBottom>Welcome to AI Flashcards</Typography>
        <Typography variant="h5" gutterBottom>The easiest way to make flashcards from scratch</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/generate" >Get Started</Button>
      </Box>
      
      <Box sx={{my:6}}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart flashcards</Typography>
            <Typography>
              {' '}
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              {' '}
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my:6, textAlign:'center'}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              padding:3,
              border: "1px solid grey",
              borderRadius: 2
            }}>
            <Typography variant="h5" gutterBottom>Basic</Typography>
            <Typography variant="h6" gutterBottom><b>Free</b></Typography>
            <Typography>
              {' '}
              Access to basic flashcards features and limited storage
            </Typography>
            <Button variant="contained" color="primary" sx={{mt:2}} href="/generate">
              Choose Basic
            </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              padding:3,
              border: "1px solid grey",
              borderRadius: 2
            }}>
            <Typography variant="h5" gutterBottom>Pro</Typography>
            <Typography variant="h6" gutterBottom>$10 / month</Typography>
            <Typography>
              {' '}
              Unlimited flashcards and storage with priority support.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>
              Choose Pro
            </Button>
            
            </Box>
          </Grid> 
        </Grid>
      </Box>

    </Container>
  )
}

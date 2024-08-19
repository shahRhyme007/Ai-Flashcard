
# AI-Flashcards

AI-Flashcards is a web application that allows users to create educational flashcards instantly using AI. Built with Next.js, Firebase, and Stripe, the app offers a seamless and personalized learning experience.

![image](https://github.com/user-attachments/assets/1d51db40-35bb-44ab-82bc-54bef0c4755f)

## Features

- **AI-Powered Flashcards**: Generate flashcards on any topic using GPT-4.
- **User Authentication**: Secure sign-up and login via Clerk.
- **Payment Integration**: Stripe-enabled payments for premium features.


https://github.com/user-attachments/assets/15fd8ccf-a080-4e6e-b178-25f9f5bbb8b1


## Installation

1. Clone the repository and navigate to the project directory:

   ```
   git clone https://github.com/yourusername/ai-flashcards.git
   cd ai-flashcards
   ```

2. Install dependencies:

 ```
   npm install
  ```

3. Set up environment variables in `.env.local`:

 ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
 ```

4. Run the development server:

  ```
   npm run dev
 ```

## Firebase & Stripe Setup

- Configure Firebase in `firebase.js`.
- Initialize Stripe in `get-stripe.js`.


## License

Licensed under the MIT License.

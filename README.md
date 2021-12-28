# Twitter clone with NextJS, Tailwind, Firebase, NextAuth and Recoil
 
 Sounds pretty cool

## Preview

Preview the example live on [my demo](https://twitter-clone-lime-eight.vercel.app/):

## How to use

- Clone this repo on your computer.
- Download and install Node.js
- Create a project in Firebase console. You need to configure a new google user account because you'll need the Google ID and Secret.
- Configure the Firestore database.
- Create a .env.local on root project and add these variables:
```
GOOGLE_ID=bla
GOOGLE_SECRET=bla
NEXT_PUBLIC_FIREBASE_KEY=bla
NEXT_PUBLIC_AUTH_DOMAIN=bla
NEXT_PUBLIC_PROJECT_ID=bla
NEXT_PUBLIC_STORAGE_BUCKET=bla
NEXT_PUBLIC_MESSAGING_SENDER_ID=bla
NEXT_PUBLIC_APP_ID=bla
JWT_SECRET=bla
NEXTAUTH_URL=http://localhost:3000
```
- and don't forget to replace bla by your firebase variables. You can choose whatever you want for the jwt secret

- final step, open the terminal:

```bash
npm install

npm run dev
```
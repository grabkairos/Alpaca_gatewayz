# Firebase Setup Guide

## Create Your Own Firebase Project

### Step 1: Create New Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it: `gatewayz-frontend` (or your preferred name)
4. Enable Google Analytics (optional)
5. Choose your region

### Step 2: Enable Required Services
1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

2. **Firestore Database**
   - Go to Firestore Database → Create Database
   - Start in test mode
   - Choose your region

3. **Storage**
   - Go to Storage → Get Started
   - Start in test mode
   - Choose your region

### Step 3: Get Configuration
1. Go to Project Settings → General
2. Scroll down to "Your apps"
3. Click "Web app" icon
4. Register app with name: `gatewayz-web`
5. Copy the config object

### Step 4: Update Your Code
Replace the config in `src/lib/firebase.ts` with your new config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 5: Set Up Security Rules
1. **Firestore Rules** (Project Settings → Firestore Database → Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

2. **Storage Rules** (Project Settings → Storage → Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Alternative: Use Environment Variables

Create `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then update `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```


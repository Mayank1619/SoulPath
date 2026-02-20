# Set Admin Role - Cloud Functions

This directory contains Firebase Cloud Functions for managing admin roles in the SoulPath blog system.

## Setup

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Deploy Functions

```bash
firebase deploy --only functions
```

Functions will be deployed to your Firebase project: `soulpath-795e4`

## Available Functions

### `setAdminRole(email)`
Make a user an admin.

**Usage:**
```typescript
import { httpsCallable } from "firebase/functions";
import { functions } from "./config/firebase";

const setAdminRole = httpsCallable(functions, "setAdminRole");

await setAdminRole({
  email: "user@example.com"
});
```

**Requirements:**
- Caller must be authenticated
- Caller must have `role: "admin"` claim

---

### `removeAdminRole(email)`
Remove admin role from a user.

**Usage:**
```typescript
const removeAdminRole = httpsCallable(functions, "removeAdminRole");

await removeAdminRole({
  email: "user@example.com"
});
```

---

### `getUserClaims(uid)`
Get a user's custom claims.

**Usage:**
```typescript
const getUserClaims = httpsCallable(functions, "getUserClaims");

const result = await getUserClaims({
  uid: "user-uid-here"
});

console.log(result.data.customClaims);
```

---

## Setting Your First Admin

Since the Cloud Functions require admin to use them, the first admin must be set manually:

### Option 1: Use MCP (Recommended for First Admin)

Use the Firebase Admin SDK locally:

```bash
node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().getUserByEmail('your-email@example.com')
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  })
  .then(() => {
    console.log('Admin role set successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
"
```

### Option 2: Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `soulpath-795e4` project
3. Go to **Build** → **Authentication**
4. Click **Users** tab
5. Find your user email in the table
6. Click the **three dots** next to the user
7. Select **Edit User**
8. Scroll down to **Custom Claims**
9. Enter: `{"role": "admin"}`
10. Click **Save**

### Option 3: Use Another Service (After First Admin Set)

Once you have one admin, they can use the `setAdminRole` function to make other users admins through the app UI.

## Creating an Admin Management UI

You can add this to your BlogAdmin component to let admins manage other admins:

```typescript
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

const setAdminRole = httpsCallable(functions, "setAdminRole");

async function makeUserAdmin(email: string) {
  try {
    const result = await setAdminRole({ email });
    console.log(result.data.message);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Troubleshooting

### "setAdminRole is not a function"
- Ensure Cloud Functions are deployed: `firebase deploy --only functions`
- Check function is exported in `index.ts`

### "permission-denied"
- You must be an admin to set admin roles
- Set yourself as admin first using one of the options above

### "Function not found"
- Deploy might not have completed
- Check: `firebase functions:list`
- Or redeploy: `firebase deploy --only functions`

## Notes

- Cloud Functions run on Node 18
- Admin SDK required for authentication
- Custom claims are cached, may take a minute to appear
- Session refresh required to see updated claims in app

[README_1.md](https://github.com/user-attachments/files/34537200/README_1.md)
# TTM Signers

A personal tracker for Through-The-Mail (TTM) autograph requests. Logs who requests were sent to, what was sent, and what came back.

## Stack

- **Frontend:** VS Code / JS (framework TBD)
- **Database:** Firebase Firestore
- **AI:** Firebase AI Logic (Gemini Developer API, no separate backend needed)

## Firebase Setup

```javascript
// firebase.js
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyAEbZkt1mAmL7ycHZD2tOFexROZ_GnN2h8",
  authDomain: "ttm-signers.firebaseapp.com",
  databaseURL: "https://ttm-signers-default-rtdb.firebaseio.com",
  projectId: "ttm-signers",
  storageBucket: "ttm-signers.firebasestorage.app",
  messagingSenderId: "926628780448",
  appId: "1:926628780448:web:4a95b224570be990186cc5",
  measurementId: "G-DS8EZ0F7F3"
};

const app = initializeApp(firebaseConfig);

export const ai = getAI(app, { backend: new GoogleAIBackend() });
export const model = getGenerativeModel(ai, { model: "gemini-3.7-flash" }); // deprecated, auto-routes to 3.8 — consider updating directly
```

```javascript
// grabInfo.js
import { model } from "./firebase";

async function grabInfo(promptText) {
  const result = await model.generateContent(promptText);
  console.log(result.response.text());
}
```

> Note: the Firebase web `apiKey` is not a secret — it's a public project identifier. Security comes from Firestore rules, not from hiding this value.

## Current Data Model (as-is)

Firestore, single collection:

```
Signers (collection)
  └─ Auto ID (document)
       Name: string
       Address: string
       Sports: string
```

One document observed: `Mike Mussina / 1302 Spruce St., Mour... / Baseball`.

**This is a contact list, not a tracker.** It has no concept of a request, a status, or an outcome — which is the actual point of a TTM log.

## Known Gaps / Recommendations

1. **`Sports` is freeform text.** Will drift ("Baseball" vs "baseball" vs "MLB") and break filtering/sorting. Should be a constrained enum.
2. **No request lifecycle.** Nothing captures: date mailed, item sent, status (mailed / returned signed / returned unsigned / no response / RTS), date returned. This is the core value of a tracker — turnaround time and success rate per signer.
3. **Signer ≠ Request.** A signer can receive multiple requests over time. Requests should be a subcollection or separate collection keyed to the signer, not fields flattened onto the signer doc.
4. **No address history.** Overwriting `Address` on update loses prior addresses (agents/fan clubs/signers move).
5. **No validation.** Firestore console accepts any input in any field — worth enforcing structure via rules even for single-user use, to avoid silent data corruption.

## Proposed Schema (not yet built)

```
signers (collection)
  {signerId}
    name: string
    sport: enum
    team/era: string (optional)
    currentAddress: string
    addressHistory: array<{ address, dateUpdated }>

requests (collection, or subcollection under signer)
  {requestId}
    signerId: reference
    dateMailed: timestamp
    itemSent: string
    status: enum [mailed, returned_signed, returned_unsigned, no_response, rts]
    dateReturned: timestamp | null
    notes: string
```

## AI Integration

Firebase AI Logic is wired up with Gemini. Model ID `gemini-3.7-flash` is valid (GA Aug 13, 2026) but now deprecated, auto-routing to `gemini-3.8-flash`.

**Open question:** what should the AI layer actually do here? Candidates discussed:
- Address lookups / verification
- Auto-drafting request letters
- Something else not yet specified

## Status

Early stage. Firebase project exists, schema is minimal, AI model is connected but unused. No UI built yet.

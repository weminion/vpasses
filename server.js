const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://vpasses.vercel.app', 'http://localhost:5173'],
}));
app.use(express.json());

const PORT = 3001;

// Load service account key from env or file
const key = process.env.GOOGLE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
  : require('./vpasses-496705-e80515465e53.json');

// Issuer ID (This should be obtained from Google Pay & Wallet Console)
// For demo purposes, we use a placeholder. User needs to replace this.
const ISSUER_ID = process.env.ISSUER_ID || '3388000000023144155';
const CLASS_ID = `${ISSUER_ID}.travel_pass_class_v4`;


app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.post('/create-pass-url', async (req, res) => {
    try {
        const credentials = key;

        const passObject = {
            id: `${ISSUER_ID}.travel_pass_${Date.now()}`,
            classId: CLASS_ID,
            state: 'ACTIVE',
            cardTitle: {
                defaultValue: { language: 'en-US', value: 'Travel Pass Demo' }
            },
            header: {
                defaultValue: { language: 'en-US', value: 'VIETNAM TRAVEL' }
            },
        };

        const payload = {
            iss: credentials.client_email,
            aud: 'google',
            typ: 'savetowallet',
            origins: ['https://vpasses.vercel.app'],
            payload: {
                genericObjects: [passObject]
            }
        };

        // Sign the JWT
        const token = jwt.sign(payload, credentials.private_key, { algorithm: 'RS256' });

        const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

        res.json({ url: saveUrl });
    } catch (error) {
        console.error('Error creating pass URL:', error);
        res.status(500).json({ error: 'Failed to create pass URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

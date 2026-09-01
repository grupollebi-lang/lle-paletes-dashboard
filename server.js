import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/paletes', async (req, res) => {
  try {
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({ credentials: creds, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });
    const data = await sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEETS_ID, range: 'Página1!A:X' });
    const paletes = (data.data.values || []).slice(1).map(r => ({ oc: r[2], transportadora: r[4], qtd: r[14], devolvida: r[20], status: r[20] > 0 ? 'OK' : 'ABERTO' }));
    res.json({ paletes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

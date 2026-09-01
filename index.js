import { google } from 'googleapis';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));
const app = express();
app.use(cors());
app.use(express.static('public'));

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1i_Tphd3s4yq2IdtKIVj9xn7TKCEJaenoARPqFdK1QhQ';

async function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  }).getClient();
}

async function fetchData() {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth



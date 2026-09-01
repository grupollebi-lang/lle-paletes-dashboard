import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Página1!A:X',
    });

    const rows = response.data.values || [];
    const paletes = rows.slice(1).map((r, i) => ({
      id: i,
      oc: r[2] || '-',
      transportadora: r[4] || '-',
      qtd: parseFloat(r[14]) || 0,
      devolvida: r[20] ? parseFloat(r[20]) : null,
      status: r[20] && parseFloat(r[20]) > 0 ? 'DEVOLVIDA' : 'EM ABERTO',
    }));

    res.json({ timestamp: new Date().toLocaleString('pt-BR'), paletes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

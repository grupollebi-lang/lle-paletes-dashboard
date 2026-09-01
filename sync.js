import { google } from 'googleapis';
import fs from 'fs';

async function sync() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'Página1!A:X',
  });

  const rows = res.data.values || [];
  const paletes = rows.slice(1).map((r, i) => ({
    id: i,
    oc: r[2] || '-',
    transportadora: r[4] || '-',
    rota: r[3] || '-',
    qtd: parseFloat(r[14]) || 0,
    devolvida: r[20] ? parseFloat(r[20]) : null,
    status: r[20] && parseFloat(r[20]) > 0 ? 'DEVOLVIDA' : 'EM ABERTO',
    valor: (parseFloat(r[14]) || 0) * (parseFloat(r[16]) || 0),
  }));

  const data = {
    timestamp: new Date().toLocaleString('pt-BR'),
    total: paletes.length,
    devolvidos: paletes.filter(p => p.status === 'DEVOLVIDA').length,
    paletes,
  };

  fs.writeFileSync('public/data.json', JSON.stringify(data, null, 2));
  console.log('✅ Dados sincronizados:', paletes.length, 'registros');
}

sync().catch(e => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});

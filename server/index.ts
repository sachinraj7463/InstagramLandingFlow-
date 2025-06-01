import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});


// All other routes -> index.html (for React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`[express] serving on http://localhost:${PORT}`);
});

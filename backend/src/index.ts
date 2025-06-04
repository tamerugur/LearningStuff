import express from 'express';

const app = express();
const PORT = 3001;

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from TypeScript backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
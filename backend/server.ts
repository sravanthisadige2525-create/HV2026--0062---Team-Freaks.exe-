import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/profile', (_req, res) => {
  res.json({
    id: 'user_123',
    name: 'Aisha Student',
    role: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'Node.js'],
  });
});

app.post('/api/assessment', (req, res) => {
  const { answers = {} } = req.body ?? {};
  const score = Math.min(100, Math.max(60, Object.keys(answers).length * 12));

  res.json({
    success: true,
    score,
    summary: 'Assessment submitted successfully.',
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

require('dotenv').config()

import express from 'express';
import cors from 'cors';
import abTestRoute from './services/abtest';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/abtest', abTestRoute);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'All good :)' })
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
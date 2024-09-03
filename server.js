import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error(error));

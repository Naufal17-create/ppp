/**
 * Express.js Backend Server for Portfolio Naufal
 * Menyediakan REST API untuk musik, pesan kontak, dan rekomendasi lagu.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, '..', 'data');
const musicFile = path.join(dataDir, 'music.json');
const messagesFile = path.join(dataDir, 'messages.json');
const recsFile = path.join(dataDir, 'recommendations.json');

// Helper to read JSON
const readJson = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
};

// Helper to write JSON
const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// API: List Music
app.get('/api/music', (req, res) => {
  const music = readJson(musicFile);
  res.json({ success: true, data: music });
});

// API: Toggle Favorite
app.post('/api/music/favorite', (req, res) => {
  const { id } = req.body;
  const music = readJson(musicFile);
  const track = music.find((t) => t.id === id);

  if (!track) {
    return res.status(404).json({ success: false, message: 'Track tidak ditemukan' });
  }

  track.isFavorite = !track.isFavorite;
  track.likes = track.isFavorite ? track.likes + 1 : Math.max(0, track.likes - 1);
  writeJson(musicFile, music);

  res.json({ success: true, message: 'Status favorite diperbarui', track });
});

// API: List Recommendations
app.get('/api/music/recommendations', (req, res) => {
  const recs = readJson(recsFile);
  res.json({ success: true, data: recs });
});

// API: Add Recommendation
app.post('/api/music/recommend', (req, res) => {
  const { title, artist, recommender, note } = req.body;
  if (!title || !artist) {
    return res.status(400).json({ success: false, message: 'Judul dan artis wajib diisi' });
  }

  const recs = readJson(recsFile);
  const newRec = {
    id: `rec-${Date.now().toString(36)}`,
    title,
    artist,
    recommender: recommender || 'Pengunjung Web',
    date: new Date().toISOString().split('T')[0],
    note: note || ''
  };

  recs.push(newRec);
  writeJson(recsFile, recs);

  res.status(201).json({ success: true, message: 'Rekomendasi lagu berhasil ditambahkan!', recommendation: newRec });
});

// API: Contact Message
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
  }

  const messages = readJson(messagesFile);
  const newMsg = {
    id: `msg-${Date.now().toString(36)}`,
    name,
    email,
    subject: subject || 'Umum',
    message,
    createdAt: new Date().toLocaleString('id-ID')
  };

  messages.push(newMsg);
  writeJson(messagesFile, messages);

  res.status(201).json({ success: true, message: 'Pesan berhasil diterima server!' });
});

// API: Get Messages
app.get('/api/messages', (req, res) => {
  const messages = readJson(messagesFile);
  res.json({ success: true, count: messages.length, data: messages });
});

app.listen(PORT, () => {
  console.log(`Backend Express berjalan di http://localhost:${PORT}`);
});

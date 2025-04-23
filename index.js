const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const TournamentSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  ageGroup: String,
  mode: String,
  createdBy: String,
  groups: [{ name: String, teams: [String] }]
});

const MatchSchema = new mongoose.Schema({
  tournamentId: String,
  teamA: String,
  teamB: String,
  scoreA: Number,
  scoreB: Number,
  group: String
});

const User = mongoose.model('User', UserSchema);
const Tournament = mongoose.model('Tournament', TournamentSchema);
const Match = mongoose.model('Match', MatchSchema);

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/api/tournaments', async (req, res) => {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tournament = new Tournament({ ...req.body, createdBy: decoded.id });
    await tournament.save();
    res.json(tournament);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.put('/api/tournaments/:id/groups', async (req, res) => {
  const { id } = req.params;
  const { groups } = req.body;
  await Tournament.findByIdAndUpdate(id, { groups });
  res.json({ message: 'Gruppen aktualisiert' });
});

app.post('/api/matches/ko/:tournamentId', async (req, res) => {
  const { tournamentId } = req.params;
  const teams = req.body;
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const pairs = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    pairs.push([shuffled[i].name, shuffled[i + 1]?.name || "TBD"]);
  }
  const matches = pairs.map(([a, b]) => ({
    tournamentId,
    teamA: a,
    teamB: b,
    scoreA: 0,
    scoreB: 0,
  }));
  await Match.insertMany(matches);
  res.json({ message: 'KO-Runde erstellt' });
});

app.get('/api/tournaments', async (req, res) => {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tournaments = await Tournament.find({ createdBy: decoded.id });
    res.json(tournaments);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/matches', async (req, res) => {
  const match = new Match(req.body);
  await match.save();
  res.json(match);
});

app.get('/api/matches/:tournamentId', async (req, res) => {
  const matches = await Match.find({ tournamentId: req.params.tournamentId });
  res.json(matches);
});

app.get('/api/tournament/:id', async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);
  const matches = await Match.find({ tournamentId: req.params.id });
  res.json({ tournament, matches });
});

app.listen(5000, () => console.log('Server on http://localhost:5000'));
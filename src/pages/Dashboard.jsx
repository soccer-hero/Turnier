import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import TournamentList from '../components/TournamentList';

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    axios.get('/tournaments').then(res => setTournaments(res.data));
  }, []);

  return (
    <div>
      <h1>Deine Turniere</h1>
      <TournamentList tournaments={tournaments} />
    </div>
  );
}

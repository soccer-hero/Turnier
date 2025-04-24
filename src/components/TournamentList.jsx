import React from 'react';
import { Link } from 'react-router-dom';

export default function TournamentList({ tournaments }) {
  return (
    <ul>
      {tournaments.map((t) => (
        <li key={t._id}>
          <Link to={`/tournament/${t._id}`}>{t.name}</Link>
        </li>
      ))}
    </ul>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';
import GroupPhase from '../components/GroupPhase';
import KnockoutPhase from '../components/KnockoutPhase';

export default function TournamentDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Turnier: {id}</h1>
      <GroupPhase tournamentId={id} />
      <KnockoutPhase tournamentId={id} />
    </div>
  );
}

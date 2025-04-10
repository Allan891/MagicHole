import db from '../db/db';

import { Round, Player } from './GolfDatabaseTypes';

export function startRound(courseId: number, players: Player[]): Round {
  const startTime = new Date().toISOString();

  const result = createRound.run(courseId, startTime);
  const roundId = result.lastInsertRowid as number;


  for (const player of players) {
    createPlayer.run(roundId, player.id);
  }

  return {
    id: roundId,
    courseId,
    startTime,
  };
}

import { getHoles } from "@/utils";
import db from "./db";
import golfClubs from "@/constants/golfClubs";

class FetchInfo{
    async getRoundData(roundId:number): Promise<[roundId: (number | undefined), courseId: (number | undefined), timeStamp: (number | undefined), strokesEachHole: ((number | null)[])]> {
        let round = await db.getRoundById(roundId);
        const holes = await db.StrokeCountByRound(roundId);
        const holesCount = getHoles(round?.courseId)?.length;
        const strokes: (number | null)[] = Array(holesCount).fill(null);
        for (const hole of holes) {
            const i = hole.holeId;
            strokes[i] = hole?.strokeCount;
        }
  
        return {roundId, courseid: round?.courseId, timestamp: round?.time, strokes};
    }

    async getRoundDetails(roundId){
        console.log('roundId', roundId);
        let round = await db.getRoundById(roundId);
        let strokes = await db.getStrokesByRoundId(roundId);
        console.log('round:', round);
        console.log('strokes:', strokes);
        return {round, strokes};
    }

    async getLatestRoundsData(playerId: number, latestRoundsNr:number): Promise<([roundId: (number | undefined),courseId: (number | undefined), timeStamp: (number | undefined), strokesEachHole: ((number | null)[])])[]> {
        const rounds = await db.getLatestRoundsByPlayer(playerId, latestRoundsNr);
        const roundsData = [];
        for (const r of rounds){
            const thisRound = await this.getRoundData(r.id);
            console.log('thisRound', thisRound)
            roundsData.push(thisRound);
        }
        return roundsData;
    }

    async importGolfClubs() {
        if (!db) {
          console.error("Database connection is not available.");
          return;
        }
      
        for (const club of golfClubs) {
          try {
            const golfClub = {
                id: club.id,
                playerId: club.playerId,
                name: club.name,
                type: club.type,
                showInList: club.showInList,
                iconType: club.iconType
            };
            if (db.getGolfClubById(club.id) == null){
                await db.createGolfClub(golfClub);
            }
          }
          finally {}
        } 
      }

} export default new FetchInfo();

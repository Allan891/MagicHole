import db from "./db";

class FetchInfo{
    async getRoundData(roundId:number): Promise<[roundId: (number | undefined), courseId: (number | undefined), timeStamp: (number | undefined), strokesEachHole: ((number | null)[])]> {
        let round = await db.getRoundById(roundId);
        round = round[0];
        console.log(round);
        const holes = await db.StrokeCountByRound(roundId);
        const strokes: (number | null)[] = [];
        for (const hole of holes) {
            strokes.push(hole.strokeCount);
        }
  
        return {roundId, courseid: round?.courseId, timestamp: round?.time, strokes};
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

} export default new FetchInfo();

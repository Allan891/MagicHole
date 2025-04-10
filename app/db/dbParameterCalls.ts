import db from "./db";

class FetchInfo{
    async getRoundData(roundId:number): Promise<[roundId: (number | undefined), courseId: (number | undefined), timeStamp: (number | undefined), strokesEachHole: ((number | null)[])]> {
        let round = await db.getRoundById(roundId);
        //round = round[0];
        // console.log("DB round: ", round);
        // console.log("DB round 0: ", round[0]);
        const holes = await db.StrokeCountByRound(roundId);
        // console.log('holes:', holes);
        const strokes: (number | null)[] = [];
        for (const hole of holes) {
            // console.log('hole:', hole);
            // console.log('strokes: ', hole.strokeCount);
            strokes.push(hole.strokeCount);
        }
        // console.log('all strokes:', strokes)
        // console.log("db holes:", holes);
        // const strokes: (number | null)[] = [];
        // if (holes != null){
        //     for (const hole of holes) {
        //         const lastStroke = await db.getLastStrokeByRoundAndHoleId(roundId, hole.id);
        //         if (lastStroke != null) {
        //             strokes.push(lastStroke.strokeNr);
        //         }
        //         else {
        //             strokes.push(null);
        //         }
        //     }
        // } 
        // console.log([round?.id, round?.courseId, round?.time, strokes]);
        // console.log(round);
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

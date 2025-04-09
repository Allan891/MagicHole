import db from "./db";

class FetchInfo{
    async getRoundData(roundId:number): Promise<[roundId: (number | undefined), courseId: (number | undefined), timeStamp: (string | undefined), strokesEachHole: ((number | null)[])]> {
        const round = await db.getRoundById(roundId);
        const holes = await db.getHolesByRoundId(roundId);
        const strokes: (number | null)[] = [];
        if (holes != null){
            for (const hole of holes) {
                const lastStroke = await db.getLastStrokeByRoundAndHoleId(roundId, hole.id);
                if (lastStroke != null) {
                    strokes.push(lastStroke.strokeNr);
                }
                else {
                    strokes.push(null);
                }
            }
        } 
        return [round?.id, round?.courseId, round?.time, strokes];
    }

    async getLatestRoundsData(playerId: number, latestRoundsNr:number): Promise<([roundId: (number | undefined),courseId: (number | undefined), timeStamp: (string | undefined), strokesEachHole: ((number | null)[])])[]> {
        const rounds = await db.getLatestRoundsByPlayer(playerId, latestRoundsNr);
        const roundsData = [];
        for (const r of rounds){
            roundsData.push(await this.getRoundData(r.id));
        }
        return roundsData;
    }

}

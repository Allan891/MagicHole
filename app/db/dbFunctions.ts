import db from "./db";
import golfClubs from "@/constants/golfClubs";

class FillDbdata{
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
            const clubInDb = await db.getGolfClubById(golfClub.id);
            if (clubInDb == null){
                console.log('55555');
                await db.createGolfClub(golfClub);
                console.log('Club ', golfClub.type);
            }
          }
          finally {}
        } 
      }
     
} export default new FillDbdata();
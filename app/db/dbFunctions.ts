import db from "./db";
import golfClubs from "@/constants/golfClubs";
import { GolfClubType } from "./GolfDatabaseTypes";

class FillDbdata{
    async importGolfClubs() {
        if (!db) {
          console.error("Database connection is not available.");
          return;
        }
      
        for (const club of golfClubs) {
          try {
            let golfClub;
            if (club.type == GolfClubType.putter || club.type == GolfClubType.driver ||
            club.type == GolfClubType.sWedge || club.type == GolfClubType.pWedge ||
            club.type == GolfClubType.iron9 || club.type == GolfClubType.iron8 || club.type == GolfClubType.iron7 ||
            club.type == GolfClubType.iron6 || club.type == GolfClubType.iron5 ||
            club.type == GolfClubType.wood3){
               golfClub = {
                id: club.id,
                playerId: club.playerId,
                name: club.name,
                type: club.type,
                showInList: club.showInList,
                iconType: club.iconType
              };
            }
            else{
               golfClub = {
                id: club.id,
                playerId: club.playerId,
                name: club.name,
                type: club.type,
                showInList: 0,
                iconType: club.iconType
              };
            }
            const clubInDb = await db.getGolfClubById(golfClub.id);
            if (clubInDb == null){
                await db.createGolfClub(golfClub);
                console.log('Club ', golfClub.type);
            }
          }
          finally {}
        } 
      }
     
} export default new FillDbdata();
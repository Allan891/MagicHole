import {calculateBearing, calculateDistance, getHole, getPar} from '@/utils';
import db from '../app/db/db';
import { GolfClubType, Stroke, StrokeLieType } from '@/app/db/GolfDatabaseTypes';
import golfClubs from '@/constants/golfClubs';

export
  const calculateStrokesGained = (StartSlag:Stroke , slutSlag:Stroke, latitude:number , longitude:number): number=>{
    const prevRawSG = calculateRawSG(StartSlag,latitude,longitude);
    const currentRawSG = calculateRawSG(slutSlag,latitude,longitude);
    const prevSG = prevRawSG - 1 - currentRawSG;

    const rvalue = calculateRawSG(StartSlag,latitude,longitude) - 1 - calculateRawSG(slutSlag,latitude,longitude);
    return rvalue;
  }

export  const calculateRawSG = (slag:Stroke, latitude:number , longitude:number) => {
  if (slag.lie != StrokeLieType.tee && slag.lie != StrokeLieType.green &&
    slag.lie != StrokeLieType.sand && slag.lie != StrokeLieType.rough && slag.lie != StrokeLieType.recovery){
   slag.lie = StrokeLieType.fairway
 }
    const sGdata = require('../constants/StrokesGained.json')
    let sGDistance = sGdata.data.map(t=>t.Distance );
    let sGValues;
    switch(slag.lie){
     case (StrokeLieType.tee): {
         sGValues = sGdata.data.map(t=>t.Tee);
        break;
     }
     case (StrokeLieType.fairway): {
         sGValues = sGdata.data.map(t=>t.Fairway);
        break;
     }
     case (StrokeLieType.rough): {
         sGValues = sGdata.data.map(t=>t.Rough);
        break;
        }
     case (StrokeLieType.sand): {
         sGValues = sGdata.data.map(t=>t.Sand);
        break;
        }
     case (StrokeLieType.recovery):{
         sGValues = sGdata.data.map(t=>t.Recovery);
        break;
        }
     case (StrokeLieType.green): {
         sGValues = sGdata.green.map(t=>t.Green);
         sGDistance = sGdata.green.map(t=>t.Distance);
        // lie green doesnt exist in this table, it has its own table and is dealt with below.
        break;
        }
    }

    const DLeft = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    var indices = findSurroundingIndices(sGDistance,DLeft)
    var firstSG = sGValues[indices[0]]
    var secondSG = sGValues[indices[1]]
    var firstDistance = sGDistance[indices[0]]
    var secondDistance = sGDistance[indices[1]]
    var rvalue

    if (slag.lie != StrokeLieType.green){
        rvalue = firstSG + (DLeft - firstDistance)  / (secondDistance - firstDistance) * (secondSG - firstSG)
        return rvalue
    }
    const DLeftGreen = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)

    const firstSGGreen = sGValues[indices[0]]
    const secondSGGreen = sGValues[indices[1]]

    const firstDistanceGreen = sGDistance[indices[0]]
    const secondDistanceGreen = sGDistance[indices[1]]
    //TODO:
    //Lägg till manuell inmatning där man pekar mot flaggan istället för GPS koordinater

    if (slag.lie = StrokeLieType.green) // lie = 4 Equals "Green"
            rvalue = firstSGGreen + (DLeftGreen - firstDistanceGreen)  / (secondDistanceGreen - firstDistanceGreen) * (secondSGGreen - firstSGGreen)
            //console.log('SG Green:' , rvalue);

            return rvalue

 }

  const findSurroundingIndices = (distanceArray:number[], value:number) => {
    for (let i = 0; i < distanceArray.length - 1; i++) {
      if (distanceArray[i] <= value && value < distanceArray[i + 1]) {
        return [i, i + 1];
      }
    }
    return [distanceArray.length - 2, distanceArray.length - 1]; // fallback
  }

  export const calculateAverage = (array: number[]): (number | undefined) => {
    if (!array.length || array.length == 0 || !array) return -10;
    const sum = array.reduce((a: number, b: number): number => a + b);
    return sum / array.length;
};

export const getMedian = (arr: Stroke[] | null): number => {
  if (!arr || arr.length === 0 || arr[0].strokesGained == null) {
    return -10; // Return a default value or handle the error as needed
  }
  // 1. Extract values and sort numerically
  const values = arr
    .map(obj => obj.strokesGained)
    .sort((a, b) => a - b);
  // 2. Calculate median
  const mid = Math.floor(values.length / 2);

  return values.length % 2 !== 0
    ? values[mid]                 // Odd length: middle element
    : (values[mid - 1] + values[mid]) / 2; // Even length: average of two middle elements
};

export const categorizeStrokes =  (strokes: Stroke[]): Stroke[][] =>{
    let strokesTee: Stroke[] = [];
    let strokesApproach: Stroke[] = [];
    let strokesChip: Stroke[] = [];
    let strokesPutt: Stroke[] = [];
    for (const stroke of strokes) {

        if (stroke.golfClubId == 99){

          strokesPutt.push(stroke);
        } // Club 0 will always be putter.

        else if (stroke.distanceLeft < 50){
          strokesChip.push(stroke);
        }
        else if (stroke.lie == StrokeLieType.tee && stroke.distanceLeft > 200){
          strokesTee.push(stroke);
        }
        else{
          strokesApproach.push(stroke);
        }
        //stroke.category = ....
    }
    let returnValue: Stroke[][] = [];
    returnValue.push(strokesTee);

    returnValue.push(strokesApproach);
    returnValue.push(strokesChip);
    returnValue.push(strokesPutt);

    return returnValue;
}

export const generateStatTables = async (): Promise<Stroke[][]> =>{
    let strokesTee: Stroke[] = [];
    let strokesApproach: Stroke[] = [];
    let strokesChip: Stroke[] = [];
    let strokesPutt: Stroke[] = [];
    const strokes = await db.getStrokes();
    console.log('stats.ts => STROKES.LENGTH: ', strokes.length);
    console.log('stats.ts => STROKES: ', strokes);
    for (const stroke of strokes) {

        if (stroke.golfClubId == 99){

          strokesPutt.push(stroke);
        } // Club 0 will always be putter.

        else if (stroke.distanceLeft < 50){
          strokesChip.push(stroke);
        }
        else if (stroke.lie == StrokeLieType.tee && stroke.distanceLeft > 200){
          strokesTee.push(stroke);
        }
        else{
          strokesApproach.push(stroke);
        }
    }
    console.log('Tee strokes:', strokesTee.length);
    console.log('Approach strokes:', strokesApproach.length);
    console.log('Chip strokes:', strokesChip.length);
    console.log('Putt strokes:', strokesPutt.length);
    let returnValue: Stroke[][] = [];
    returnValue.push(strokesTee);
    returnValue.push(strokesApproach);
    returnValue.push(strokesChip);
    returnValue.push(strokesPutt);

    return returnValue;

};



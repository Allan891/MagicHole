import {calculateBearing, calculateDistance, getHole, getPar} from '@/utils';
import db from '../app/db/db';

export
  const calculateStrokesGained = (StartSlag:Stroke , slutSlag:Stroke, latitude:number , longitude:number): number=>{
    console.log('calc strokes gained start');
    const rvalue = calculateRawSG(StartSlag,latitude,longitude) - 1 - calculateRawSG(slutSlag,latitude,longitude)
    //console.log("Strokes Gained: ", rvalue)
    console.log('calc strokes gained end');
    return rvalue
  }

export  const calculateRawSG = (slag:Stroke, latitude:number , longitude:number) => {
    if (slag.lie != 0 && slag.lie != 1 && slag.lie != 2 && slag.lie != 3 && slag.lie != 4){
      slag.lie = 1 //lie = 1 Equals "Fairway"
    }
    const sGdata = require('../constants/StrokesGained.json')
    //console.log('sGdata', sGdata.data["Distance (Meters)"])
    let sGDistance = sGdata.data.map(t=>t.Distance )
    //console.log('column', sGDistance)

    //const sGDistance = sGdata.data["Distance (Meters)"]
    let sGValues
    //var name = "Fairway"

    //console.log('slag.lie ', slag.lie)
    switch(slag.lie){
     case (0): {
         sGValues = sGdata.data.map(t=>t.Tee)
        break;
     }
     case (1): {
         sGValues = sGdata.data.map(t=>t.Fairway)
        break;
     }
     case (2): {
         sGValues = sGdata.data.map(t=>t.Rough)
        break;
        }
     case (3): {
         sGValues = sGdata.data.map(t=>t.Sand)
        break;
        }
     case (5):{
         sGValues = sGdata.data.map(t=>t.Recovery)
        break;
        }
     case (4): {
         sGValues = sGdata.green.map(t=>t.Green)
        // lie green doesnt exist in this table, it has its own table and is dealt with below.
        break;
        }
    }
   // var sGValues = sGdata.data.map(t=>t.name)

    //sGdata.data[slag.lie]
    //console.log('SGVALUES', sGValues)
    const DLeft = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    //console.log('sGDistance', sGDistance)
    var indices = findSurroundingIndices(sGDistance,DLeft)
    var firstSG = sGValues[indices[0]]
    var secondSG = sGValues[indices[1]]
    var firstDistance = sGDistance[indices[0]]
    var secondDistance = sGDistance[indices[1]]
    var rvalue

    if (slag.lie != 4){ ///lie = 4 Equals "Green"


        rvalue = firstSG + (DLeft - firstDistance)  / (secondDistance - firstDistance) * (secondSG - firstSG)

        console.log('Distance: ', DLeft, ' Lie: ', slag.lie ,' Raw Strokes Gained: ', rvalue)
        return rvalue
    }
    console.log('sGDistanceGreen');
    const sGDistanceGreen = sGdata.green.map(t=>t.Distance )
    console.log('1');
    const DLeftGreen = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)

    console.log('2');

    const firstSGGreen = sGValues[indices[0]]
    const secondSGGreen = sGValues[indices[1]]
    //const firstSGGreen = sGdata.green["Green"][indices[0]]
    //const secondSGGreen = sGdata.green["Green"][indices[1]]
    console.log('3');
    const firstDistanceGreen = sGDistanceGreen[indices[0]]
    const secondDistanceGreen = sGDistanceGreen[indices[1]]
    console.log('4');
    //TODO:
    //Lägg till manuell inmatning där man pekar mot flaggan istället för GPS koordinater

    console.log('All Green Data Loaded');
    if (slag.lie = 4) // lie = 4 Equals "Green"
            console.log('Green SG Calculation Started');
            rvalue = firstSGGreen + (DLeftGreen - firstDistanceGreen)  / (secondDistanceGreen - firstDistanceGreen) * (secondSGGreen - firstSGGreen)
            //console.log('Raw Strokes Gained: ', rvalue)
            console.log('Green SG Calculation Done');
            return rvalue

 }

  const findSurroundingIndices = (distanceArray:number[], value:number) => {
      //console.log("asdf")
    for (let i = 0; i < distanceArray.length - 1; i++) {
      if (distanceArray[i] <= value && value < distanceArray[i + 1]) {
        return [i, i + 1];
      }
    }
    //console.log("Indices",distanceArray.length - 2, distanceArray.length - 1)
    return [distanceArray.length - 2, distanceArray.length - 1]; // fallback
  }

  export const calculateAverage = (array: number[]): (number | undefined) => {
    //console.log('array.length: ', array.length);
    if (!array.length) return -10;
    const sum = array.reduce((a: number, b: number): number => a + b);
    return sum / array.length;
};

export const getMedian = (arr: stroke[] | null): number => {
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

//export const generateStatTables = async (): Promise<[strokesTee: stroke[], strokesApproach: stroke[], strokesChip: stroke[], strokesPutt: stroke[]]>=>{
export const generateStatTables = async (): stroke[][] =>{
    let strokesTee: stroke[] = [];
    let strokesApproach: stroke[] = [];
    let strokesChip: stroke[] = [];
    let strokesPutt: stroke[] = [];
    const strokes = await db.getStrokes();
    for (const stroke of strokes) {
        //console.log('Stroke: ', stroke);
        // const myRound = await db.getRoundById(stroke.roundId);
        // console.log('myRound:' , myRound);
        // if (!myRound?.courseId) continue;
        // const hole = getHole(myRound.courseId, stroke.holeId)
        // const par = getPar(myRound.courseId);
        //console.log('par: ', par);
        //const dbhole = async db.getHole
        // const distance = calculateDistance(stroke.startLatitude, stroke.startLongitude, hole.greenMiddle.latitude, hole.greenMiddle.longitude );
        // stroke.distance = distance;
        //let category = 0;
        //console.log('distance: ', distance);
        //console.log('par: ',par[stroke.holeId],' lie: ',stroke.lie);
        if (stroke.golfClubId == 0){
          strokesPutt.push(stroke);
        } // Club 0 will always be putter.

        else if (stroke.distanceLeft < 50){
          strokesChip.push(stroke);
        }
        else if (stroke.lie == 0 && stroke.distanceLeft > 200){
          strokesTee.push(stroke);
        }
        else{
          strokesApproach.push(stroke);
          //console.log('stroketables1: ',strokesApproach);
        }
        //stroke.category = ....
    }
    console.log('ALL STROKES CATEGORIZED');
    let returnValue: stroke[][] = [];
    returnValue.push(strokesTee);

    returnValue.push(strokesApproach);
    returnValue.push(strokesChip);
    returnValue.push(strokesPutt);

    return returnValue;

};



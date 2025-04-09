import {calculateBearing, calculateDistance} from '@/utils';

export 
  const calculateStrokesGained = (StartSlag:Stroke , slutSlag:Stroke, latitude:number , longitude:number) =>{
    return calculateRawSG(StartSlag,latitude,longitude) - 1 - calculateRawSG(slutSlag,latitude,longitude)

  }
  
  const calculateRawSG = (slag:Stroke, latitude:number , longitude:number) => {
    //TODO:
    //Måste Lägga in slag.lie
    if (!slag.lie){
      slag.lie = "Fairway"
    }
    const sGdata = require('./constants/StokesGained.json')
    
    const sGDistance = sGdata.data["Distance (Meters)"]
    const sGValues = sGdata.data[slag.lie]
    const DLeft = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    const indices = findSurroundingIndices(sGDistance,DLeft)
    const firstSG = sGValues[indices[0]]
    const secondSG = sGValues[indices[1]]
    const firstDistance = sGDistance[indices[0]]
    const secondDistance = sGDistance[indices[1]] 
    if (slag.lie != "Green"){
      try{
        return firstSG + (DLeft - firstDistance)  / (secondDistance - firstDistance) * (secondSG - firstSG)
      }
    }
    const sGDistanceGreen = sGdata.green["Distance (Meters)"]
    const DLeftGreen = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    const firstSGGreen = sGdata.green["Green"][indices[0]]
    const secondSGGreen = sGdata.green["Green"][indices[1]]
    const firstDistanceGreen = sGDistanceGreen[indices[0]]
    const secondDistanceGreen = sGDistanceGreen[indices[1]] 
    //TODO: 
    //Lägg till manuell inmatning där man pekar mot flaggan istället för GPS koordinater
    if (slag.lie = "green")
        try{
            return firstSGGreen + (DLeftGreen - firstDistanceGreen)  / (secondDistanceGreen - firstDistanceGreen) * (secondSGGreen - firstSGGreen)
        }

 }

  const findSurroundingIndices = (distanceArray:number[], value:number) => {
    for (let i = 0; i < distanceArray.length - 1; i++) {
      if (distanceArray[i] <= value && value < distanceArray[i + 1]) {
        return [i, i + 1];
      }
    }
    return [distanceArray.length - 2, distanceArray.length - 1]; // fallback
  }


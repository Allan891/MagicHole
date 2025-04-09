import {calculateBearing, calculateDistance} from '@/utils';

export 
  const calculateStrokesGained = (StartSlag:Stroke , slutSlag:Stroke, latitude:number , longitude:number) =>{
    var rvalue = calculateRawSG(StartSlag,latitude,longitude) - 1 - calculateRawSG(slutSlag,latitude,longitude)
    console.log("Strokes Gained: ", rvalue)
    return rvalue
  }
  
  const calculateRawSG = (slag:Stroke, latitude:number , longitude:number) => {
    if (!slag.lie){
      slag.lie = 1 //lie = 1 Equals "Fairway"
    }
    const sGdata = require('../constants/StrokesGained.json')
    //console.log('sGdata', sGdata.data["Distance (Meters)"])




    var sGDistance = sGdata.data.map(t=>t.Distance )

    //console.log('column', sGDistance)

    //const sGDistance = sGdata.data["Distance (Meters)"]
    var sGValues
    //var name = "Fairway"

    console.log('slag.lie ', slag.lie)
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
     case (4):{
         sGValues = sGdata.data.map(t=>t.Recovery)
        break;
        }
     case (5): {
         sGValues = sGdata.data.map(t=>t.Green)
        break;
        }
    }
   // var sGValues = sGdata.data.map(t=>t.name)

    //sGdata.data[slag.lie]
    console.log('SGVALUES', sGValues)
    const DLeft = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    console.log('sGDistance', sGDistance)
    var indices = findSurroundingIndices(sGDistance,DLeft)
    var firstSG = sGValues[indices[0]]
    var secondSG = sGValues[indices[1]]
    var firstDistance = sGDistance[indices[0]]
    var secondDistance = sGDistance[indices[1]]
    var rvalue
    if (slag.lie != 4){ ///lie = 4 Equals "Green"


        rvalue = firstSG + (DLeft - firstDistance)  / (secondDistance - firstDistance) * (secondSG - firstSG)
        console.log('Raw Strokes Gained: ', rvalue)
        return rvalue
    }
    const sGDistanceGreen = sGdata.green["Distance (Meters)"]
    const DLeftGreen = calculateDistance(slag.startLatitude, slag.startLongitude,latitude,longitude)
    const firstSGGreen = sGdata.green["Green"][indices[0]]
    const secondSGGreen = sGdata.green["Green"][indices[1]]
    const firstDistanceGreen = sGDistanceGreen[indices[0]]
    const secondDistanceGreen = sGDistanceGreen[indices[1]] 
    //TODO: 
    //Lägg till manuell inmatning där man pekar mot flaggan istället för GPS koordinater


    if (slag.lie = 4) // lie = 4 Equals "Green"

            rvalue = firstSGGreen + (DLeftGreen - firstDistanceGreen)  / (secondDistanceGreen - firstDistanceGreen) * (secondSGGreen - firstSGGreen)
            console.log('Raw Strokes Gained: ', rvalue)
            return rvalue

 }

  const findSurroundingIndices = (distanceArray:number[], value:number) => {
      console.log("asdf")
    for (let i = 0; i < distanceArray.length - 1; i++) {
      if (distanceArray[i] <= value && value < distanceArray[i + 1]) {
        return [i, i + 1];
      }
    }
    console.log("Indices",distanceArray.length - 2, distanceArray.length - 1)
    return [distanceArray.length - 2, distanceArray.length - 1]; // fallback
  }


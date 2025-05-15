
export const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const rad = Math.PI / 180;
    const deltaLng = (lng2 - lng1) * rad;
    const y = Math.sin(deltaLng) * Math.cos(lat2 * rad);
    const x =
      Math.cos(lat1 * rad) * Math.sin(lat2 * rad) -
      Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(deltaLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  function quadraticBezierCurve(p1, p2, controlPoint, numPoints) {
    const points = [];
    const step = 1 / (numPoints - 1);
  
    for (let t = 0; t <= 1; t += step) {
      const x =
        (1 - t) ** 2 * p1[0] +
        2 * (1 - t) * t * controlPoint[0] +
        t ** 2 * p2[0];
      const y =
        (1 - t) ** 2 * p1[1] +
        2 * (1 - t) * t * controlPoint[1] +
        t ** 2 * p2[1];
      const coord = { latitude: x, longitude: y };
      points.push(coord);
    }
  
    return points;
  }
  
  const calculateControlPoint = (p1, p2, curveStrength = 1) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const d = Math.sqrt(dx ** 2 + dy ** 2);
  
    const h = d * 2 * curveStrength;
    const w = d / 2 * curveStrength;
  
    const x_m = (p1[0] + p2[0]) / 2;
    const y_m = (p1[1] + p2[1]) / 2;
  
    const x_c = x_m + ((h * dy) / (2 * d)) * (w / d);
    const y_c = y_m - ((h * dx) / (2 * d)) * (w / d);
  
    return [x_c, y_c];
  };
  
  export const getPoints = (places, curveStrength = 1) => {
    if (!places || places.length < 2) return [];
  
    let curvedPoints = [];
  
    for (let i = 0; i < places.length - 1; i++) {
      const start = places[i];
      const end = places[i + 1];
  
      const p1 = [start.latitude, start.longitude];
      const p2 = [end.latitude, end.longitude];
  
      const distance = calculateDistance(p1[0], p1[1], p2[0], p2[1]);
  
      let segment;
  
      if (distance < 10) {
        // Just use a straight line
        segment = [
          { latitude: p1[0], longitude: p1[1] },
          { latitude: p2[0], longitude: p2[1] },
        ];
      } else {
        const controlPoint = calculateControlPoint(p1, p2, curveStrength);
        segment = quadraticBezierCurve(p1, p2, controlPoint, 20);
      }
  
      if (i > 0) segment.shift(); // avoid duplicate points
      curvedPoints = curvedPoints.concat(segment);
    }
  
    return curvedPoints;
  };
  
  
  
  
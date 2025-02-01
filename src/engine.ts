export const getDistance = (fromPos: number, toPos: number) =>
  Math.abs(fromPos - toPos);

export const calcLikelyhood = (distance: number, blocked: number) => {
  //   console.clear();
  console.log("distance", distance);
  console.log("blocked", blocked);
  let hits = 0;
  for (let x = 1; x < 7; x++) {
    for (let y = 1; y < 7; y++) {
      if (x === distance || y === distance) {
        hits++;
      } else {
        if (
          x + y === distance ||
          (x === y &&
            (x + x + y === distance ||
              x + y + y === distance ||
              x + x + y + y === distance))
        ) {
          if (x > blocked || y > blocked) {
            hits++;
            console.log("combo hit", x, y, blocked);
          } else {
            console.log("combo", x, y);
          }
        }
      }
    }
  }
  console.log("total hits", hits);
  return hits;
};

export const formatLikelyhood = (hits: number) =>
  Math.round((hits / 36 + Number.EPSILON) * 10000) / 100;

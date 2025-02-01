export const getDistance = (
  fromPos: string | undefined,
  toPos: string | undefined
) => {
  if (!fromPos || !toPos) return;
  return Math.abs(parseInt(fromPos, 10) - parseInt(toPos, 10));
};

export const calcLikelyhood = (
  fromPos: string,
  toPos: string,
  blockers: { blocked: string | undefined }[]
) => {
  //   console.clear();
  const distance = getDistance(fromPos, toPos);
  console.log("distance", distance);
  console.log("blockers", blockers);

  const start = Math.min(parseInt(fromPos, 10), parseInt(toPos, 10));
  const end = Math.max(parseInt(fromPos, 10), parseInt(toPos, 10));
  console.log("start", start);
  console.log("end", end);

  const blockedPips = blockers
    .map((b) => b.blocked)
    .filter((b) => b !== undefined)
    .map((b) => parseInt(b, 10));

  const hits: [number, number][] = [];

  for (let dieOne = 1; dieOne < 7; dieOne++) {
    let blockedOne = false;

    if (blockedPips.includes(start + dieOne)) {
      console.log("blocked dieOne", dieOne);
      blockedOne = true;
    }

    for (let dieTwo = 1; dieTwo < 7; dieTwo++) {
      let blockedTwo = false;

      if (blockedPips.includes(start + dieOne + dieTwo)) {
        console.log("blocked dieTwo", dieTwo);
        blockedTwo = true;
      }

      if (!blockedOne && start + dieOne === end) hits.push([dieOne, dieTwo]);
      else if (!blockedTwo && start + dieTwo === end)
        hits.push([dieOne, dieTwo]);
      else if (!blockedOne && !blockedTwo && start + dieOne + dieTwo === end) {
        hits.push([dieOne, dieTwo]);
      } else if (dieOne === dieTwo) {
        //doubling
        if (!blockedOne && start + dieOne + dieOne === end)
          hits.push([dieOne, dieTwo]);
        else if (
          !blockedOne &&
          !blockedTwo &&
          start + dieOne + dieOne + dieTwo === end
        )
          hits.push([dieOne, dieTwo]);
        else if (
          !blockedOne &&
          !blockedTwo &&
          start + dieOne + dieOne + dieTwo + dieTwo === end
        )
          hits.push([dieOne, dieTwo]);
        else if (
          !blockedOne &&
          !blockedTwo &&
          start + dieOne + dieTwo + dieTwo + dieTwo === end
        )
          hits.push([dieOne, dieTwo]);
        else if (!blockedTwo && start + dieTwo + dieTwo + dieTwo === end)
          hits.push([dieOne, dieTwo]);
      }
    }
  }

  console.log("total hits", hits.length);
  console.log("hits", hits);
  return hits;
};

export const formatLikelyhood = (hits: number) =>
  Math.round((hits / 36 + Number.EPSILON) * 10000) / 100;

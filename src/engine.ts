export const getDistance = (
  fromPos: string | undefined,
  toPos: string | undefined
) => {
  if (!fromPos || !toPos) return;
  return Math.abs(parseInt(fromPos, 10) - parseInt(toPos, 10));
};

export const getValidBlockedPips = (
  blockers: { blocked?: string | undefined }[] | undefined
) => {
  if (!blockers) return [];
  return blockers
    .map((b) => {
      if (b.blocked?.length) return b.blocked;
    })
    .filter((b) => {
      return b !== undefined;
    })
    .map((b) => parseInt(b, 10));
};

export const calcLikelyhood = (
  fromPos: string,
  toPos: string,
  blockers: { blocked: string | undefined }[]
) => {
  const start = Math.min(parseInt(fromPos, 10), parseInt(toPos, 10));
  const end = Math.max(parseInt(fromPos, 10), parseInt(toPos, 10));

  const blockedPips = getValidBlockedPips(blockers);

  const hits: [number, number][] = [];

  for (let dieOne = 1; dieOne < 7; dieOne++) {
    let blockedOne = false;

    if (blockedPips.includes(start + dieOne)) {
      blockedOne = true;
    }

    for (let dieTwo = dieOne; dieTwo < 7; dieTwo++) {
      let blockedTwo = false;

      if (blockedPips.includes(start + dieOne + dieTwo)) {
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

  return hits;
};

export const formatLikelyhood = (hits: number) =>
  Math.round((hits / 36 + Number.EPSILON) * 10000) / 100;

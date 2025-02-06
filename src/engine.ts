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
    for (let dieTwo = dieOne; dieTwo < 7; dieTwo++) {
      if (!blockedPips.includes(start + dieOne) && start + dieOne === end)
        hits.push([dieOne, dieTwo]); // direct hit on die one
      else if (!blockedPips.includes(start + dieTwo) && start + dieTwo === end)
        // direct hit on die two
        hits.push([dieOne, dieTwo]);
      else if (
        !blockedPips.includes(start + dieOne) &&
        start + dieOne + dieTwo === end
      ) {
        // hit on dieOne then dieTwo
        hits.push([dieOne, dieTwo]);
      } else if (
        !blockedPips.includes(start + dieTwo) &&
        start + dieTwo + dieOne === end
      ) {
        // hit on dieTwo then dieOne
        hits.push([dieOne, dieTwo]);
      } else if (dieOne === dieTwo) {
        //doubling
        if (!blockedPips.includes(start + dieOne) && start + dieOne * 2 === end)
          hits.push([dieOne, dieTwo]); // hit on double two steps
        else if (
          !blockedPips.includes(start + dieOne) &&
          !blockedPips.includes(start + dieOne * 2) &&
          start + dieOne * 3 === end
        )
          hits.push([dieOne, dieTwo]); // hit on double three steps
        else if (
          !blockedPips.includes(start + dieOne) &&
          !blockedPips.includes(start + dieOne * 2) &&
          !blockedPips.includes(start + dieOne * 3) &&
          start + dieOne * 4 === end
        )
          hits.push([dieOne, dieTwo]); // hit on double four steps
      }
    }
  }

  return hits;
};

export const formatLikelyhood = (hits: number) =>
  Math.round((hits / 36 + Number.EPSILON) * 10000) / 100;

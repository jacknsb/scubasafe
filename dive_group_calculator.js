const diveTable = {
 const diveTable = {
  3: [
    { time: 60, group: "A" },
    { time: 120, group: "B" },
    { time: 210, group: "C" },
    { time: 300, group: "D" },
  ],
  4.5: [
    { time: 35, group: "A" },
    { time: 70, group: "B" },
    { time: 110, group: "C" },
    { time: 160, group: "D" },
    { time: 225, group: "E" },
    { time: 350, group: "G" },
  ],
  6: [
    { time: 25, group: "A" },
    { time: 50, group: "B" },
    { time: 75, group: "C" },
    { time: 100, group: "D" },
    { time: 135, group: "E" },
    { time: 180, group: "F" },
    { time: 240, group: "G" },
    { time: 325, group: "H" },
  ],
  7.5: [
    { time: 20, group: "A" },
    { time: 35, group: "B" },
    { time: 55, group: "C" },
    { time: 75, group: "D" },
    { time: 100, group: "E" },
    { time: 125, group: "F" },
    { time: 160, group: "G" },
    { time: 195, group: "H" },
    { time: 245, group: "I" },
  ],
  9: [
    { time: 15, group: "A" },
    { time: 30, group: "B" },
    { time: 45, group: "C" },
    { time: 60, group: "D" },
    { time: 75, group: "E" },
    { time: 95, group: "F" },
    { time: 120, group: "G" },
    { time: 145, group: "H" },
    { time: 170, group: "I" },
    { time: 205, group: "J" },
  ],
  10.5: [
    { time: 5, group: "A" },
    { time: 15, group: "B" },
    { time: 25, group: "C" },
    { time: 40, group: "D" },
    { time: 50, group: "E" },
    { time: 60, group: "F" },
    { time: 80, group: "G" },
    { time: 100, group: "H" },
    { time: 120, group: "I" },
    { time: 140, group: "J" },
    { time: 160, group: "K" },
  ],
    12: [
    { time: 5, group: "A" },
    { time: 15, group: "B" },
    { time: 25, group: "C" },
    { time: 30, group: "D" },
    { time: 40, group: "E" },
    { time: 50, group: "F" },
    { time: 70, group: "G" },
    { time: 80, group: "H" },
    { time: 100, group: "I" },
    { time: 110, group: "J" },
    { time: 130, group: "K" },
  ],
  15: [
    { time: 5, group: "A" },
    { time: 10, group: "B" },
    { time: 15, group: "C" },
    { time: 25, group: "D" },
    { time: 30, group: "E" },
    { time: 40, group: "F" },
    { time: 50, group: "G" },
    { time: 60, group: "H" },
    { time: 70, group: "I" },
  ],
  18: [
    { time: 5, group: "A" },
    { time: 10, group: "B" },
    { time: 15, group: "C" },
    { time: 20, group: "D" },
    { time: 25, group: "E" },
    { time: 30, group: "F" },
    { time: 40, group: "G" },
    { time: 50, group: "H" },
  ],
  21: [
    { time: 5, group: "A" },
    { time: 5, group: "B" },
    { time: 10, group: "C" },
    { time: 15, group: "D" },
    { time: 20, group: "E" },
    { time: 30, group: "F" },
    { time: 35, group: "G" },
    { time: 40, group: "H" },
  ],
  24: [
    { time: 5, group: "A" },
    { time: 5, group: "B" },
    { time: 10, group: "C" },
    { time: 15, group: "D" },
    { time: 20, group: "E" },
    { time: 25, group: "F" },
    { time: 30, group: "G" },
  ],
  27: [
    { time: 5, group: "A" },
    { time: 5, group: "B" },
    { time: 10, group: "C" },
    { time: 12, group: "D" },
    { time: 15, group: "E" },
    { time: 20, group: "F" },
    { time: 25, group: "G" },
  ],
    30: [
    { time: 5, group: "A" },
    { time: 5, group: "B" },
    { time: 7, group: "C" },
    { time: 10, group: "D" },
    { time: 15, group: "E" },
    { time: 20, group: "F" },
  ],
  33: [
    { time: 5, group: "B" },
    { time: 5, group: "C" },
    { time: 10, group: "D" },
    { time: 13, group: "E" },
    { time: 15, group: "F" },
  ],
  36: [
    { time: 5, group: "B" },
    { time: 5, group: "C" },
    { time: 10, group: "D" },
  ],
  39: [
    { time: 5, group: "B" },
    { time: 5, group: "C" },
  ],
};

};

function findNearestDepth(depth) {
  const depths = Object.keys(diveTable).map(Number);
  return depths.reduce((prev, curr) => (Math.abs(curr - depth) < Math.abs(prev - depth) ? curr : prev));
}

function getDiveGroup(depth, duration) {
  const roundedDepth = findNearestDepth(depth);
  const diveData = diveTable[roundedDepth];
  const diveGroup = diveData.find((entry) => entry.time >= duration);

  if (!diveGroup) {
    throw new Error('No dive group found for the given depth and duration.');
  }

  return diveGroup.group;
}

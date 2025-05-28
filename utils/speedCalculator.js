export function calculateSpeed(position1, position2, time1, time2) {
  const distance = Math.sqrt(
    Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2)
  );
  const timeDiff = (time2 - time1) / 1000; // convert ms to s
  return distance / timeDiff; // speed in px/s
}

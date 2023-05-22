export function secondsIntoTime(sec: number): string {
  const seconds = `${sec % 60}`;
  const minutes = `${Math.floor(sec / 60)}`;
  return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

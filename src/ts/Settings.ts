import { getLocalStorageItem } from "./utils/getLocalStorageItem";

export class Settings {
  private bombs: number;
  private mode: "easy" | "medium" | "hard";
  private ostVolume: number;
  private effectsVolume: number;
  private lightMode: "light" | "dark";

  constructor() {
    this.bombs = Number(localStorage.getItem("bombs")) || 40;
    this.mode = getLocalStorageItem("mode") || "medium";
    this.ostVolume = getLocalStorageItem("ostVolume") || 30;
    this.effectsVolume = getLocalStorageItem("effectsVolume") || 30;
    this.lightMode = getLocalStorageItem("lightMode") || "light";
  }

  public getBombs(): number {
    return this.bombs;
  }

  public setBombs(value: number): void {
    this.bombs = value;
  }
}

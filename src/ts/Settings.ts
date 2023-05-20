import { Observable } from "./behavioral/Observable";
import { getLocalStorageItem } from "./utils/getLocalStorageItem";

export type Mode = "easy" | "medium" | "hard";

const defaultBombs = 10;
const defaultMode = "easy";
const defaultVolume = 30;
const defaultLightMode = "light";

export class Settings {
  private bombs: number = defaultBombs;
  private mode: Mode;
  public ostVolume: Observable<number>;
  public effectsVolume: Observable<number>;
  private lightMode: "light" | "dark";

  constructor() {
    const savedBombs = getLocalStorageItem("bombs");
    if (savedBombs !== null) {
      this.bombs = Number(savedBombs);
    }
    this.mode = getLocalStorageItem("mode") || defaultMode;
    const savedOstVolume = getLocalStorageItem("ostVolume");
    this.ostVolume =
      savedOstVolume !== null
        ? new Observable(Number(savedOstVolume))
        : new Observable(defaultVolume);
    const savedEffectsVolume = getLocalStorageItem("effectsVolume");
    this.effectsVolume =
      savedEffectsVolume !== null
        ? new Observable(Number(savedEffectsVolume))
        : new Observable(Number(defaultVolume));
    this.lightMode = getLocalStorageItem("lightMode") || defaultLightMode;
  }

  public getBombs(): number {
    return this.bombs;
  }

  public setBombs(value: number): void {
    this.bombs = value;
  }

  public getMode(): Mode {
    return this.mode;
  }

  public setMode(value: Mode): void {
    this.mode = value;
    console.log(this.mode);
  }
}

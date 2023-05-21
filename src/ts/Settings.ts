import { localStorageManager } from "./LocalStorageManager";
import { Observable } from "./behavioral/Observable";
import { getLocalStorageItem } from "./utils/getLocalStorageItem";

export type Mode = "easy" | "medium" | "hard";
export type LightMode = "dark" | "light";
interface ISave {
  bombs: number;
  mode: Mode;
  ostVolume: number;
  effectsVolume: number;
  lightMode: LightMode;
}

const defaultBombs = 10;
const defaultMode = "easy";
const defaultVolume = 30;
const defaultLightMode = "light";

export class Settings {
  private bombs: number = defaultBombs;
  private mode: Mode;
  public ostVolume: Observable<number>;
  public effectsVolume: Observable<number>;
  private lightMode: LightMode;

  constructor() {
    const save = localStorageManager.getItem<ISave>("settings", {
      bombs: defaultBombs,
      mode: defaultMode,
      ostVolume: defaultVolume,
      effectsVolume: defaultVolume,
      lightMode: defaultLightMode,
    });
    this.bombs = save.bombs;
    this.mode = save.mode;
    this.ostVolume = new Observable(save.ostVolume);
    this.effectsVolume = new Observable(save.effectsVolume);
    this.lightMode = save.lightMode;
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
  }

  public getLightMode(): LightMode {
    return this.lightMode;
  }

  public setLightMode(): void {
    this.lightMode = this.lightMode === "light" ? "dark" : "light";
  }

  public toLocalStorage(): void {
    const settingsSave = {
      bombs: this.bombs,
      mode: this.mode,
      ostVolume: this.ostVolume.getValue(),
      effectsVolume: this.effectsVolume.getValue(),
      lightMode: this.lightMode,
    };
    localStorageManager.setItem("settings", settingsSave);
  }
}

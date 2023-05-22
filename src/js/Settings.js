import { localStorageManager } from "./LocalStorageManager.js";
import { Observable } from "./behavioral/Observable.js";
const defaultBombs = 10;
const defaultMode = "easy";
const defaultVolume = 30;
const defaultLightMode = "light";
export class Settings {
  constructor() {
    this.bombs = defaultBombs;
    const save = localStorageManager.getItem("settings", {
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
  getBombs() {
    return this.bombs;
  }
  setBombs(value) {
    this.bombs = value;
  }
  getMode() {
    return this.mode;
  }
  setMode(value) {
    this.mode = value;
  }
  getLightMode() {
    return this.lightMode;
  }
  setLightMode() {
    this.lightMode = this.lightMode === "light" ? "dark" : "light";
  }
  toLocalStorage() {
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

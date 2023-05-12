import { BaseComponent } from "./components/BaseComponent";

interface SettingsConstructor {
  theme: ThemeState;
  volume: number;
  difficulty: string;
}

type ThemeState = "day" | "night";

class Settings {
  #theme: ThemeState;
  #volume: number;
  #difficulty: string;

  constructor({ theme, volume, difficulty }: SettingsConstructor) {
    this.#theme = theme;
    this.#volume = volume;
    this.#difficulty = difficulty;
  }

  public get theme(): ThemeState {
    return this.#theme;
  }

  public set theme(value: ThemeState) {
    this.#theme = value;
  }
}

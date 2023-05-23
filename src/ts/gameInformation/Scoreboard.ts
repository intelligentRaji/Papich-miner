import { Score } from "./Score";
import { BaseComponent } from "../components/BaseComponent";
import { localStorageManager } from "../LocalStorageManager";
import { Mode } from "../Settings";
import { ModalComponent } from "../components/ModalComponent";
import { ButtonComponent } from "../components/ButtonComponent";

export interface IScore {
  bombs: number;
  time: string;
  mode: "hard" | "medium" | "easy";
}

type Cache = Map<IScore, Score>;

export class Scoreboard extends ModalComponent {
  private scoresArray: IScore[];
  private cache: Cache;
  private readonly button: ButtonComponent;
  private readonly scoreboardInfrmation: BaseComponent;
  private readonly bombs: BaseComponent;
  private readonly time: BaseComponent;
  private readonly mode: BaseComponent;
  private readonly scores: BaseComponent;

  constructor(parent: HTMLElement) {
    super({ parent, className: "scoreboard" });
    this.cache = new Map();
    this.scoresArray = localStorageManager.getItem("scoreboard", []);
    this.button = new ButtonComponent({
      parent: document.body,
      className: "scoreboard-button",
      callback: this.visibilityMechanic,
      text: "РЕЗУЛЬТАТЫ",
    });
    this.scoreboardInfrmation = new BaseComponent({
      parent: this.element,
      className: "scoreboard-information",
    });
    this.bombs = new BaseComponent({
      tag: "span",
      className: "scoreboard-bombs",
      parent: this.scoreboardInfrmation.element,
      text: "Бомбы",
    });
    this.time = new BaseComponent({
      tag: "span",
      className: "scoreboard-time",
      parent: this.scoreboardInfrmation.element,
      text: "Время",
    });
    this.mode = new BaseComponent({
      tag: "span",
      className: "scoreboard-mode",
      parent: this.scoreboardInfrmation.element,
      text: "Сложность",
    });
    this.scores = new BaseComponent({
      className: "scoreboard-scores",
      parent: this.element,
    });
    this.createScoreList();
  }

  private removeOldScore(): void {
    if (this.scoresArray.length > 10) {
      this.cache.delete(this.scoresArray[0]);
      this.scoresArray.shift();
    }
  }

  private destroyAllScores(): void {
    [...this.cache.values()].forEach((score) => {
      score.destroy();
    });
  }

  private addScore(obj: IScore): void {
    this.scoresArray.push(obj);
  }

  private getSortedScores(): IScore[] {
    return this.scoresArray.slice().sort((a, b) => {
      if (a.bombs < b.bombs) {
        return -1;
      }
      if (a.bombs > b.bombs) {
        return 1;
      }

      const difficulty = {
        hard: 2,
        medium: 1,
        easy: 0,
      };
      if (difficulty[a.mode] > difficulty[b.mode]) {
        return -1;
      }
      if (difficulty[a.mode] < difficulty[b.mode]) {
        return 1;
      }

      const aTime = a.time.replace(":", "");
      const bTime = b.time.replace(":", "");
      if (Number(aTime) < Number(bTime)) {
        return -1;
      }
      if (Number(aTime) > Number(bTime)) {
        return 1;
      }

      return 0;
    });
  }

  private getDifficultyName(mode: Mode): string {
    switch (mode) {
      case "easy":
        return "СЛОЖНЫЙ";

      case "medium":
        return "РЕЗИДЕНТ ГЛОБУС 4";

      case "hard":
        return "9 КЛАСС";

      default:
        return "";
    }
  }

  public createScoreList(obj?: IScore): void {
    if (obj) {
      this.addScore(obj);
      this.destroyAllScores();
      this.removeOldScore();
    }

    const sortedArray = this.getSortedScores();

    sortedArray.forEach((item) => {
      const cachedElement = this.cache.get(item);
      if (cachedElement !== undefined) {
        this.scores.element.append(cachedElement.element);
      }
      if (cachedElement === undefined) {
        const element = new Score({
          parent: this.scores.element,
          bombs: item.bombs,
          time: item.time,
          mode: this.getDifficultyName(item.mode),
        });
        this.cache.set(item, element);
      }
    });
  }

  public toLocalStorage(): void {
    localStorageManager.setItem("scoreboard", this.scoresArray);
  }
}

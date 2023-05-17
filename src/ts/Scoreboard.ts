import { Score } from "./Score";
import { BaseComponent } from "./components/BaseComponent";

export interface IScore {
  bombs: number;
  time: string;
  mode: "hard" | "medium" | "easy";
}

type Cache = Map<IScore, Score>;

export class Scoreboard extends BaseComponent {
  private scoresArray: IScore[];
  private cache: Cache;
  private readonly scoreboardInfrmation: BaseComponent;
  private readonly bombs: BaseComponent;
  private readonly time: BaseComponent;
  private readonly mode: BaseComponent;
  private readonly scores: BaseComponent;

  constructor(parent: HTMLElement) {
    super({ parent, className: "scoreboard" });
    this.scoresArray = [];
    this.cache = new Map();
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
      this.scoresArray.shift();
    }
  }

  private destroy(): void {
    Object.values(this.cache).forEach((score) => {
      score.destroy();
    });
  }

  private addScore(obj: IScore): void {
    this.scoresArray.push(obj);
  }

  private getSortedScores(): IScore[] {
    return this.scoresArray.sort((a, b) => {
      if (a.bombs < b.bombs) {
        return 1;
      }
      if (a.bombs > b.bombs) {
        return -1;
      }

      const difficulty = {
        hard: 2,
        medium: 1,
        easy: 0,
      };
      if (difficulty[a.mode] > difficulty[b.mode]) {
        return 1;
      }
      if (difficulty[a.mode] < difficulty[b.mode]) {
        return -1;
      }

      if (Number(a.time) < Number(b.time)) {
        return 1;
      }
      if (Number(a.time) > Number(b.time)) {
        return -1;
      }

      return 0;
    });
  }

  public createScoreList(obj?: IScore): void {
    if (obj) {
      this.addScore(obj);
      this.removeOldScore();
      this.destroy();
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
          mode: item.mode,
        });
        this.cache.set(item, element);
      }
    });
  }
}

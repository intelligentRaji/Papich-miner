import { Miner } from "./Miner";
import { BaseComponent } from "./components/BaseComponent";
import { Cell } from "./Cell";
import { InformationPanel } from "./InformationPanel";
import { Observable } from "./Observable";
import { Scoreboard } from "./Scoreboard";

export class Game extends BaseComponent {
  public readonly miner: Miner;
  public readonly informationPanel: InformationPanel;
  public readonly scoreboard: Scoreboard;
  public bombs!: Cell[];
  public cellsLeft = 100;
  public bombsLeft = new Observable(0);
  public missedFlags: Cell[] = [];
  public clicks = new Observable(0);

  constructor(parent: HTMLElement) {
    super({ parent, className: "game" });
    this.bombs = [];
    this.informationPanel = new InformationPanel(this.element);
    this.clicks.subscribe((value) => {
      this.informationPanel.plusClick(value);
    });
    this.bombsLeft.subscribe((value) => {
      this.informationPanel.setBombsCount(value);
    });
    this.miner = new Miner({
      parent: this.element,
    });
    this.scoreboard = new Scoreboard(this.element);
    this.miner.addEvent("click", this.gameStart);
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.miner.fields.forEach((row) =>
      row.forEach((cell) => {
        cell.subscribe("minus", () => {
          this.minusCell();
        });
        cell.subscribe("endGame", (element: Cell) => {
          this.endGame(element);
        });
        cell.subscribe("addFlag", () => {
          this.addFlag(cell);
        });
        cell.subscribe("removeFlag", () => {
          this.removeFlag(cell);
        });
        cell.subscribe("addClick", () => {
          this.clicks.notify((value) => value + 1);
        });
      })
    );
  }

  private gameStart = (e: Event): void => {
    if (e.target instanceof HTMLButtonElement) {
      this.miner.startGame(e.target);
    }
    this.miner.removeEvent("click", this.gameStart);
    this.informationPanel.start();
  };

  public addBomb(cell: Cell): void {
    this.bombs.push(cell);
    this.bombsLeft.notify((value) => value + 1);
    this.minusCell();
  }

  public minusCell(): void {
    this.cellsLeft -= 1;
  }

  private addMissedFlag(cell: Cell): void {
    if (!cell.state.isBomb) {
      this.missedFlags.push(cell);
    }
  }

  private removeMissedFlag(cell: Cell): void {
    if (!cell.state.isBomb) {
      this.missedFlags = this.missedFlags.filter((element) => element !== cell);
    }
  }

  private minusBombsLeft(): void {
    this.bombsLeft.notify((value) => value - 1);
  }

  private plusBombsLeft(): void {
    this.bombsLeft.notify((value) => value + 1);
  }

  public addFlag(cell: Cell): void {
    this.minusBombsLeft();
    this.addMissedFlag(cell);
  }

  public removeFlag(cell: Cell): void {
    this.plusBombsLeft();
    this.removeMissedFlag(cell);
  }

  private endGame(cell: Cell): void {
    this.bombs.forEach((bomb) => {
      if (bomb !== cell && !bomb.state.isFlaged) {
        bomb.openBombAutomaticly();
      }
    });
    this.missedFlags.forEach((flag) => flag.openFlagAutomaticly());
    const time = this.informationPanel.end();
    this.scoreboard.createScoreList({
      bombs: this.bombsLeft.getValue(),
      time,
      mode: "medium",
    });
  }

  private resetBombsCount(): void {
    this.bombsLeft.notify(0);
  }
}

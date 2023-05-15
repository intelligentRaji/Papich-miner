import { Miner } from "./Miner";
import { BaseComponent } from "./components/BaseComponent";
import { Cell } from "./Cell";
import { InformationPanel } from "./InformationPanel";

export class Game extends BaseComponent {
  public readonly miner: Miner;
  public readonly informationPanel: InformationPanel;
  public bombs!: Cell[];
  public cellsLeft = 100;
  public bombsLeft = 0;
  public missedFlags: Cell[] = [];

  constructor(parent: HTMLElement) {
    super({ parent, className: "game" });
    this.bombs = [];
    this.informationPanel = new InformationPanel(this.element);
    this.miner = new Miner({
      parent: this.element,
    });
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
    this.bombsLeft += 1;
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
    this.bombsLeft -= 1;
    this.informationPanel.setBombsCount(this.bombsLeft);
  }

  private plusBombsLeft(): void {
    this.bombsLeft += 1;
    this.informationPanel.setBombsCount(this.bombsLeft);
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
    this.informationPanel.end();
  }
}

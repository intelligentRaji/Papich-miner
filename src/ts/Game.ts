import { Miner } from "./Miner";
import { BaseComponent } from "./components/BaseComponent";
import { Cell } from "./Cell";

export class Game extends BaseComponent {
  public readonly miner: Miner;
  public bombs!: Cell[];
  public cellsLeft = 100;

  constructor(parent: HTMLElement) {
    super({ parent, className: "game" });
    this.bombs = [];
    this.miner = new Miner({
      parent: this.element,
    });
    this.miner.element.onclick = this.gameStart.bind(this);
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.miner.fields.forEach((row) =>
      row.forEach((cell) =>
        cell.subscribe("open", () => {
          this.minusCell();
        })
      )
    );
  }

  private gameStart(e: Event): void {
    if (e.target instanceof HTMLButtonElement) {
      this.miner.startGame(e.target);
    }
  }

  public addBomb(element: Cell): void {
    this.bombs.push(element);
    this.minusCell();
  }

  public minusCell(): void {
    this.cellsLeft -= 1;
    console.log(this.cellsLeft);
  }
}

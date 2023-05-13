import { Cell } from "./Cell";
import { BaseComponent } from "./components/BaseComponent";
import { getRandomNumber } from "./utils/getRandomNumber";

interface MinerConstructor {
  parent: HTMLElement;
}

export class Miner extends BaseComponent {
  public readonly fields: Cell[][];
  private readonly size: number;

  constructor({ parent }: MinerConstructor) {
    super({ tag: "div", className: "miner", parent });
    this.size = 10;
    this.fields = this.getCells();
    this.stylize("gridTemplateColumns", "repeat(10, 1fr)");
    this.stylize("gridTemplateRows", "repeat(10, 1fr)");
  }

  private getCells(): Cell[][] {
    return Array.from({ length: this.size }, (_, i) =>
      Array.from({ length: this.size }, (q, j) => {
        const element = new Cell({
          parent: this.element,
          className: `cell ${i * 10 + j}`,
          coordinates: { i, j },
        });
        element.subscribe("flag", this.RightClickMechanic.bind(this));
        return element;
      })
    );
  }

  private plantBombs(numberOfBombs: number, index: number): void {
    let counter = 0;
    const indexI = Math.floor(index / 10);
    const indexJ = index % 10;
    while (counter !== numberOfBombs) {
      const number = getRandomNumber(0, this.size * this.size - 1);
      const i = Math.floor(number / 10);
      const j = number % 10;
      const bombField = this.fields[i][j];
      if (
        !(
          i >= indexI - 1 &&
          i <= indexI + 1 &&
          j >= indexJ - 1 &&
          j <= indexJ + 1
        ) &&
        !bombField.state.isBomb
      ) {
        bombField.state.RezanskiSahar();
        bombField.stylize("backgroundColor", "red");
        if (bombField.bombsAround.length !== 0) {
          bombField.bombsAround = [];
        }
        this.emit("plantBombs", bombField);
        this.calculateBombsAround(bombField, i, j);
        counter += 1;
      }
    }
  }

  private calculateBombsAround(element: Cell, i: number, j: number): void {
    for (let x = i - 1; x <= i + 1; x += 1) {
      for (let y = j - 1; y <= j + 1; y += 1) {
        if (
          x >= 0 &&
          x < this.fields.length &&
          y >= 0 &&
          y < this.fields.length &&
          !this.fields[x][y].state.isBomb
        ) {
          this.fields[x][y].addBomb(element);
        }
      }
    }
  }

  public RightClickMechanic(
    i: number,
    j: number,
    mode: "flag" | "question"
  ): void {
    for (let x = i - 1; x <= i + 1; x += 1) {
      for (let y = j - 1; y <= j + 1; y += 1) {
        if (
          x >= 0 &&
          x < this.fields.length &&
          y >= 0 &&
          y < this.fields.length
        ) {
          if (mode === "flag") {
            this.fields[x][y].falgsAround += 1;
          }
          if (mode === "question") {
            this.fields[x][y].falgsAround -= 1;
          }
        }
      }
    }
  }

  public startGame(element: HTMLElement): void {
    const index = Number(element.className.split(" ")[1]);
    this.plantBombs(10, index);
    this.element.onclick = null;
  }
}

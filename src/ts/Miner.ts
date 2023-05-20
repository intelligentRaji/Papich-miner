import { Cell } from "./Cell";
import { Mode } from "./Settings";
import { BaseComponent } from "./components/BaseComponent";
import { getRandomNumber } from "./utils/getRandomNumber";

interface MinerConstructor {
  parent: HTMLElement;
  numberOfBombs: number;
  mode: Mode;
}

type OpenMode = "flag" | "question" | "open" | "bomb";

export class Miner extends BaseComponent {
  public readonly cells: Cell[][];
  private readonly size: number;
  private numberOfBombs: number;

  constructor({ parent, numberOfBombs, mode }: MinerConstructor) {
    super({ tag: "div", className: "miner", parent });
    this.size = this.getSizeOfField(mode);
    this.numberOfBombs = numberOfBombs;
    this.cells = this.getCells();
    this.stylize("gridTemplateColumns", `repeat(${this.size}, 1fr)`);
    this.stylize("gridTemplateRows", `repeat(${this.size}, 1fr)`);
  }

  private getCells(): Cell[][] {
    return Array.from({ length: this.size }, (_, i) =>
      Array.from({ length: this.size }, (q, j) => {
        const element = new Cell({
          parent: this.element,
          className: `cell ${i * this.size + j}`,
          coordinates: { i, j },
        });
        element.subscribe("flag", this.calculations.bind(this));
        element.subscribe(
          "open",
          (row: number, column: number, mode: OpenMode) =>
            this.calculations(row, column, mode)
        );
        return element;
      })
    );
  }

  private plantBombs(numberOfBombs: number, index: number): void {
    let counter = 0;
    const indexI = Math.floor(index / this.size);
    const indexJ = index % this.size;
    const element = this.cells[indexI][indexJ];
    element.emit("addClick");
    while (counter !== numberOfBombs) {
      const i = getRandomNumber(0, this.size - 1);
      const j = getRandomNumber(0, this.size - 1);
      const bombCell = this.cells[i][j];
      if (
        !(
          i >= indexI - 1 &&
          i <= indexI + 1 &&
          j >= indexJ - 1 &&
          j <= indexJ + 1
        ) &&
        !bombCell.state.isBomb
      ) {
        bombCell.state.RezanskiSahar();
        this.emit("plantBombs", bombCell);
        this.calculations(i, j, "bomb");
        counter += 1;
      }
    }
    element.openCell(true);
  }

  public calculations(i: number, j: number, mode: OpenMode): void {
    for (let x = i - 1; x <= i + 1; x += 1) {
      for (let y = j - 1; y <= j + 1; y += 1) {
        if (
          x >= 0 &&
          x < this.cells.length &&
          y >= 0 &&
          y < this.cells.length
        ) {
          const element = this.cells[x][y];
          switch (mode) {
            case "bomb":
              element.addBomb();
              break;

            case "flag":
              element.addToFlagsAround();
              break;

            case "question":
              element.removeFromFlagsAround();
              break;

            case "open":
              this.openCell(element);
              break;

            default:
              break;
          }
        }
      }
    }
  }

  private openCell(element: Cell): void {
    if (!element.state.isFlaged && !element.state.podVoprosikom) {
      if (!element.state.isBomb) {
        if (element.bombsAround === 0) {
          element.openCell();
        }
        if (element.bombsAround > 0) {
          element.openCell(false);
        }
      }
      if (element.state.isBomb) {
        element.openBomb();
      }
    }
  }

  public startGame(element: HTMLElement): void {
    const index = Number(element.className.split(" ")[1]);
    this.plantBombs(this.numberOfBombs, index);
    this.element.onclick = null;
    this.cells.forEach((row) =>
      row.forEach((cell) => {
        cell.addEvent("click", () => {
          cell.openMechanic();
        });
        cell.addEvent("contextmenu", (e) => {
          cell.rightClickMechanic(e);
        });
      })
    );
  }

  private getSizeOfField(mode: string): number {
    switch (mode) {
      case "easy":
        return 10;

      case "medium":
        return 15;

      case "hard":
        return 25;

      default:
        return 10;
    }
  }
}

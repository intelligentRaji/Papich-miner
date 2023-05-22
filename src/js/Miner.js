import { Cell } from "./Cell.js";
import { localStorageManager } from "./LocalStorageManager.js";
import { BaseComponent } from "./components/BaseComponent.js";
import { getRandomNumber } from "./utils/getRandomNumber.js";
export class Miner extends BaseComponent {
  constructor({ parent, numberOfBombs, mode, className, isStarted, callback }) {
    super({ className, parent });
    this.size = this.getSizeOfField(mode);
    this.callback = callback;
    this.numberOfBombs = numberOfBombs;
    if (isStarted) {
      const save = localStorageManager.getItem("cells");
      this.cells =
        save === null ? this.getCells() : this.getCellsFromLocalStorage(save);
    } else {
      this.cells = this.getCells();
    }
    this.stylize("gridTemplateColumns", `repeat(${this.size}, 1fr)`);
    this.stylize("gridTemplateRows", `repeat(${this.size}, 1fr)`);
  }
  getCells() {
    return Array.from({ length: this.size }, (_, i) =>
      Array.from({ length: this.size }, (q, j) => {
        const element = new Cell({
          parent: this.element,
          className: `cell ${i * this.size + j}`,
          coordinates: { i, j },
        });
        this.subscribeCell(element);
        return element;
      })
    );
  }
  plantBombs(numberOfBombs, element, indexI, indexJ) {
    let counter = 0;
    if (!element.state.isFlaged && !element.state.podVoprosikom) {
      element.emit("addClick");
      while (counter !== numberOfBombs) {
        const i = getRandomNumber(0, this.size - 1);
        const j = getRandomNumber(0, this.size - 1);
        const bombCell = this.cells[i][j];
        if (numberOfBombs <= 90) {
          if (
            !(
              i >= indexI - 1 &&
              i <= indexI + 1 &&
              j >= indexJ - 1 &&
              j <= indexJ + 1
            ) &&
            !bombCell.state.isBomb
          ) {
            this.plantBomb(bombCell, i, j);
            counter += 1;
          }
        }
        if (numberOfBombs > 90) {
          if (!(i !== indexI && j !== indexJ && bombCell.state.isBomb)) {
            this.plantBomb(bombCell, i, j);
            counter += 1;
          }
        }
      }
      element.openCell(true);
    }
  }
  calculations(i, j, mode) {
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
  openCell(element) {
    if (!element.state.isFlaged && !element.state.podVoprosikom) {
      if (!element.state.isBomb) {
        element.openCell(element.bombsAround === 0);
      }
      if (element.state.isBomb) {
        element.openBomb();
      }
    }
  }
  startGame(element, i, j) {
    this.plantBombs(this.numberOfBombs, element, i, j);
    this.element.onclick = null;
    this.cells.forEach((row) =>
      row.forEach((cell) => {
        cell.addEvent("click", cell.openMechanic);
      })
    );
  }
  getSizeOfField(mode) {
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
  subscribeCell(cell) {
    cell.subscribe("flag", this.calculations.bind(this));
    cell.subscribe("open", (row, column, mode) =>
      this.calculations(row, column, mode)
    );
  }
  getCellsFromLocalStorage(save) {
    return Array.from(save, (row1, i) =>
      row1.map((cell, j) => {
        const element = new Cell({
          parent: this.element,
          className: cell.className,
          coordinates: { i, j },
          save: cell,
        });
        element.addEvent("click", element.openMechanic);
        this.subscribeCell(element);
        return element;
      })
    );
  }
  toLocalStorage() {
    const save = this.cells.map((row) =>
      row.map((cell) => cell.toLocalStorage())
    );
    localStorageManager.setItem("cells", save);
  }
  plantBomb(bomb, i, j) {
    bomb.state.RezanskiSahar();
    this.callback({ i, j });
    this.calculations(i, j, "bomb");
  }
}

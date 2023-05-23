import { CellState } from "./CellState.js";
import { BaseComponent } from "./components/BaseComponent.js";
const defaultSettings = {
  className: "",
  bombsAround: 0,
  flagsAround: 0,
  state: {
    isBomb: false,
    isOpen: 0,
    isFlaged: false,
    podVoprosikom: false,
    isClosed: true,
  },
};
export class Cell extends BaseComponent {
  constructor({ parent, className, coordinates, save = defaultSettings }) {
    super({ tag: "button", className, parent });
    this.rightClickMechanic = (e) => {
      e.preventDefault();
      this.emit("flagAudio");
      if (this.state.podVoprosikom) {
        this.close();
      } else if (this.state.isFlaged) {
        this.makeQuestioned();
      } else if (this.state.isClosed) {
        this.hoistFlag();
      }
    };
    this.openMechanic = () => {
      if (!this.state.isFlaged && !this.state.podVoprosikom) {
        this.emit("addClick");
        if (!this.state.isBomb) {
          this.openCell();
        }
        if (this.state.isBomb) {
          this.openBomb();
        }
      }
    };
    this.bombsAround = save.bombsAround;
    this.flagsAround = save.flagsAround;
    this.row = coordinates.i;
    this.column = coordinates.j;
    this.state = new CellState(save.state);
    this.addEvent("contextmenu", this.rightClickMechanic);
    if (this.bombsAround > 0 && this.state.isOpen) {
      this.stylizeCommonCell();
    }
  }
  addBomb() {
    this.bombsAround += 1;
  }
  hoistFlag() {
    this.state.hoistFlag();
    this.addClass("flaged");
    this.emit("addFlag", { i: this.row, j: this.column });
    this.emit("flag", this.row, this.column, "flag");
  }
  makeQuestioned() {
    this.state.makeQuestioned();
    this.removeClass("flaged");
    this.addClass("questioned");
    this.emit("removeFlag");
    this.emit("flag", this.row, this.column, "question");
  }
  close() {
    this.state.close();
    this.removeClass("questioned");
  }
  openBomb() {
    this.addClass("opened-bomb");
    this.emit("loose", { i: this.row, j: this.column });
  }
  openBombAutomaticly() {
    this.addClass("bomb");
  }
  openFlagAutomaticly() {
    this.addClass("missed");
  }
  openCell(mode = true) {
    if (this.state.isOpen === 0) {
      this.emit("openAudio");
      this.state.open();
      if (this.bombsAround > 0) {
        this.stylizeCommonCell();
      }
      this.addClass("opened");
      this.emit("minus");
      this.emit("win");
    }
    if (
      this.state.isOpen === 1 &&
      this.bombsAround <= this.flagsAround &&
      mode
    ) {
      this.state.open();
      this.emit("open", this.row, this.column, "open");
    }
  }
  stylizeCommonCell() {
    this.setTextContent(`${this.bombsAround}`);
    this.stylize("color", this.getColor());
  }
  addToFlagsAround() {
    this.flagsAround += 1;
  }
  removeFromFlagsAround() {
    this.flagsAround -= 1;
  }
  getColor() {
    switch (this.bombsAround) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "red";
      case 4:
        return "darkblue";
      case 5:
        return "brown";
      case 6:
        return "turquoise";
      case 7:
        return "black";
      case 8:
        return "white";
      default:
        return "";
    }
  }
  removeListeners() {
    this.removeEvent("contextmenu", this.rightClickMechanic);
    this.removeEvent("click", this.openMechanic);
  }
  toLocalStorage() {
    return {
      className: this.getClassName(),
      bombsAround: this.bombsAround,
      flagsAround: this.flagsAround,
      state: this.state.toLocalStorage(),
    };
  }
}

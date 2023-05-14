import { CellState } from "./CellState";
import { BaseComponent } from "./components/BaseComponent";

interface FieldConstructor {
  parent: HTMLElement;
  className: string;
  coordinates: {
    i: number;
    j: number;
  };
}

export class Cell extends BaseComponent {
  public readonly row: number;
  public readonly column: number;
  public bombsAround: number = 0;
  public flagsAround: number = 0;
  public state: CellState;

  constructor({ parent, className, coordinates }: FieldConstructor) {
    super({ tag: "button", className, parent });
    this.row = coordinates.i;
    this.column = coordinates.j;
    this.state = new CellState();
  }

  public addBomb(): void {
    this.bombsAround += 1;
  }

  public rightClickMechanic = (e: Event): void => {
    e.preventDefault();
    if (this.state.podVoprosikom) {
      this.close();
    } else if (this.state.isFlaged) {
      this.makeQuestioned();
    } else if (this.state.isClosed) {
      this.hoistFlag();
    }
  };

  private hoistFlag(): void {
    this.state.hoistFlag();
    this.addClass("flaged");
    this.emit("addFlag");
    this.emit("flag", this.row, this.column, "flag");
  }

  private makeQuestioned(): void {
    this.state.makeQuestioned();
    this.removeClass("flaged");
    this.addClass("questioned");
    this.emit("removeFlag");
    this.emit("flag", this.row, this.column, "question");
  }

  private close(): void {
    this.state.close();
    this.removeClass("questioned");
  }

  public openMechanic = (): void => {
    if (!this.state.isFlaged && !this.state.podVoprosikom) {
      if (!this.state.isBomb) {
        this.openCell();
      }
      if (this.state.isBomb) {
        this.openBomb();
      }
    }
  };

  public openBomb(): void {
    this.addClass("opened-bomb");
    this.emit("endGame", this.element);
  }

  public openBombAutomaticly(): void {
    this.addClass("bomb");
  }

  public openFlagAutomaticly(): void {
    this.addClass("missed");
  }

  public openCell(mode = true): void {
    if (this.flagsAround <= this.bombsAround) {
      if (this.state.isOpen === 0) {
        this.state.open();
        if (this.bombsAround > 0) {
          this.setTextContent(`${this.bombsAround}`);
          this.stylize("color", this.getColor());
          this.stylize("fontSize", `${this.element.clientWidth / 2}px`);
        }
        this.addClass("opened");
        this.emit("minus");
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
  }

  public addToFlagsAround(): void {
    this.flagsAround += 1;
  }

  public removeFromFlagsAround(): void {
    this.flagsAround -= 1;
  }

  private getColor(): string {
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
}

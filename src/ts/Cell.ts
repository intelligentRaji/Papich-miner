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
  public bombsAround: Cell[] = [];
  public falgsAround: number = 0;
  public state: CellState;

  constructor({ parent, className, coordinates }: FieldConstructor) {
    super({ tag: "button", className, parent });
    this.row = coordinates.i;
    this.column = coordinates.j;
    this.state = new CellState();
  }

  public addBomb(bomb: Cell): void {
    this.bombsAround.push(bomb);
  }

  public rightClickMechanic = (): void => {
    if (this.state.podVoprosikom) {
      this.clear();
    }
    if (this.state.isFlaged) {
      this.makeQuestioned();
    }
    if (!this.state.isFlaged && !this.state.podVoprosikom) {
      this.hoistFlag();
    }
  };

  private hoistFlag(): void {
    this.state.hoistFlag();
    this.addClass("flaged");
    this.emit("flag", [this.row, this.column, "flag"]);
  }

  private makeQuestioned(): void {
    this.state.makeQuestioned();
    this.removeClass("flaged");
    this.addClass("questioned");
    this.emit("flag", [this.row, this.column, "question"]);
  }

  private clear(): void {
    this.state.clear();
    this.removeClass("questioned", "flaged");
  }

  public open = (): void => {
    this.state.open();
    this.setTextContent(`${this.bombsAround.length}`);
    this.stylize("color", this.getColor());
    this.addClass("opened");
    this.emit("open");
  };

  private addListeners(): void {
    this.addEvent("click", this.open);
    this.removeEvent("click", this.rightClickMechanic);
  }

  private getColor(): string {
    switch (this.bombsAround.length) {
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

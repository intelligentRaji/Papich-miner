import { IProps, CellState } from "./CellState";
import { BaseComponent } from "./components/BaseComponent";

export interface Save {
  bombsAround: number;
  flagsAround: number;
  state: IProps;
}

interface FieldConstructor {
  parent: HTMLElement;
  className: string;
  coordinates: {
    i: number;
    j: number;
  };
  save?: Save;
}

const defaultSettings: Save = {
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
  public readonly row: number;
  public readonly column: number;
  public bombsAround: number;
  public flagsAround: number;
  public state: CellState;

  constructor({
    parent,
    className,
    coordinates,
    save = defaultSettings,
  }: FieldConstructor) {
    super({ tag: "button", className, parent });
    this.bombsAround = save.bombsAround;
    this.flagsAround = save.flagsAround;
    this.row = coordinates.i;
    this.column = coordinates.j;
    this.state = new CellState(save.state);
    this.addEvent("contextmenu", this.rightClickMechanic);
  }

  public addBomb(): void {
    this.bombsAround += 1;
  }

  public rightClickMechanic = (e: Event): void => {
    e.preventDefault();
    this.emit("flagAudio");
    console.log(this.state.isClosed);
    if (this.state.podVoprosikom) {
      this.close();
    } else if (this.state.isFlaged) {
      this.makeQuestioned();
    } else if (this.state.isClosed) {
      this.hoistFlag();
    }
  };

  public hoistFlag(): void {
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
      this.emit("addClick");
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
    this.emit("loose", this.element);
  }

  public openBombAutomaticly(): void {
    this.addClass("bomb");
  }

  public openFlagAutomaticly(): void {
    this.addClass("missed");
  }

  public openCell(mode = true): void {
    if (this.state.isOpen === 0) {
      this.emit("openAudio");
      this.state.open();
      if (this.bombsAround > 0) {
        this.setTextContent(`${this.bombsAround}`);
        this.stylize("color", this.getColor());
        this.stylize("fontSize", `${this.element.clientWidth / 2}px`);
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

  public removeListeners(): void {
    this.removeEvent("contextmenu", this.rightClickMechanic);
    this.removeEvent("click", this.openMechanic);
  }

  public toLocalStorage(): Save {
    return {
      bombsAround: this.bombsAround,
      flagsAround: this.flagsAround,
      state: this.state.toLocalStorage(),
    };
  }
}

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
  public isBomb = false;
  public isOpen = false;
  public isFlaged = false;
  public podVoprosikom = false;

  constructor({ parent, className, coordinates }: FieldConstructor) {
    super({ tag: "button", className, parent });
    this.row = coordinates.i;
    this.column = coordinates.j;
  }

  public addBomb(bomb: Cell): void {
    this.bombsAround.push(bomb);
  }

  public rightClickMechanic(): void {
    if (this.podVoprosikom) {
      this.clear();
    }
    if (this.isFlaged) {
      this.makeQuestioned();
    }
    if (!this.isFlaged && !this.podVoprosikom) {
      this.hoistFlag();
    }
  }

  private hoistFlag(): void {
    this.isFlaged = true;
    this.element.classList.add("flaged");
    this.emit("flag", [this.row, this.column, "flag"]);
  }

  private makeQuestioned(): void {
    this.isFlaged = false;
    this.podVoprosikom = true;
    this.element.classList.remove("flaged");
    this.element.classList.add("questioned");
    this.emit("flag", [this.row, this.column, "question"]);
  }

  private clear(): void {
    this.podVoprosikom = false;
    this.element.classList.remove("questioned", "flaged");
  }

  public open(): void {
    this.isOpen = true;
    this.element.textContent = `${this.bombsAround.length}`;
    this.element.style.color = this.getColor();
    this.element.classList.add("opened");
    this.emit("open");
  }

  private addListeners(): void {
    this.element.onclick = this.open.bind(this);
    this.element.oncontextmenu = this.rightClickMechanic.bind(this);
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

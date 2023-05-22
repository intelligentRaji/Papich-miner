import { BaseComponent } from "../components/BaseComponent";

interface IBombsController {
  parent: HTMLElement;
  reset: () => void;
  numberOfBombs: number;
}

export class BombsControler extends BaseComponent<HTMLInputElement> {
  private reset: () => void;

  constructor({ parent, reset, numberOfBombs }: IBombsController) {
    super({ tag: "input", className: "bombs-controler", parent, type: "text" });
    this.element.maxLength = 2;
    this.setValue(numberOfBombs);
    this.reset = reset;
    this.element.addEventListener("change", () => {
      this.change();
    });
  }

  public getValue(): number {
    return Number(this.element.value);
  }

  public setValue(value: number = this.getValue()): void {
    if (value < 10) {
      this.element.value = "10";
    } else {
      this.element.value = String(value);
    }
  }

  public change(value?: number): void {
    this.setValue(value);
    this.emit("changeBombs", this.getValue());
    this.reset();
  }
}

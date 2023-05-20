import { BaseComponent } from "../components/BaseComponent";

export class BombsControler extends BaseComponent<HTMLInputElement> {
  constructor(parent: HTMLElement) {
    super({ tag: "input", className: "bombs-controler", parent, type: "text" });
    this.element.maxLength = 2;
    this.element.addEventListener("change", () => {
      this.change();
    });
  }

  public getValue(): number {
    return Number(this.element.value);
  }

  public setValue(value: number = this.getValue()): void {
    this.element.value = String(this.getValue());
  }

  private change(): void {
    this.setValue();
    this.emit("changeBombs", this.getValue());
  }
}

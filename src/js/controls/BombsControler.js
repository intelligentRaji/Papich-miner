import { BaseComponent } from "../components/BaseComponent.js";
export class BombsControler extends BaseComponent {
  constructor({ parent, reset, numberOfBombs }) {
    super({ tag: "input", className: "bombs-controler", parent, type: "text" });
    this.element.maxLength = 2;
    this.setValue(numberOfBombs);
    this.reset = reset;
    this.element.addEventListener("change", () => {
      this.change();
    });
  }
  getValue() {
    return Number(this.element.value);
  }
  setValue(value = this.getValue()) {
    if (value < 10) {
      this.element.value = "10";
    } else {
      this.element.value = String(value);
    }
  }
  change(value) {
    this.setValue(value);
    this.emit("changeBombs", this.getValue());
    this.reset();
  }
}

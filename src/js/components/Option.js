import { BaseComponent } from "./BaseComponent.js";
export class Option extends BaseComponent {
  constructor({ parent, value, text, selected }) {
    super({ tag: "option", className: "option", text, parent });
    this.setValue(value);
    if (selected) {
      this.element.selected = true;
    }
  }
  setValue(value) {
    this.element.value = value;
  }
}

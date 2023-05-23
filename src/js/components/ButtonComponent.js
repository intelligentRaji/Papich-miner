import { BaseComponent } from "./BaseComponent.js";
export class ButtonComponent extends BaseComponent {
  constructor({ parent, className, callback, text }) {
    super({ tag: "button", className, parent, text });
    if (callback) {
      this.addEvent("click", callback);
    }
  }
}

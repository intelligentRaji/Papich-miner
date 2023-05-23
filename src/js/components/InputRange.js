import { localStorageManager } from "../LocalStorageManager.js";
import { BaseComponent } from "./BaseComponent.js";
export class InputRange extends BaseComponent {
  constructor({ parent, className, notify, value }) {
    super({ tag: "input", parent, className, type: "range" });
    this.notify = notify;
    this.element.addEventListener("input", () => {
      notify(Number(this.getValue()));
    });
    this.setValue(value);
    this.valueBeforeMuted = localStorageManager.getItem(
      `valueBeforeMuted${this.getClassName()}`,
      this.getValue()
    );
    this.isMuted = localStorageManager.getItem(
      `isMuted${this.getClassName()}`,
      false
    );
  }
  setValue(value) {
    this.element.value = value;
    this.notify(Number(this.getValue()));
  }
  getValue() {
    return this.element.value;
  }
  mute() {
    this.isMuted = true;
    this.valueBeforeMuted = this.getValue();
    this.setValue("0");
    this.notify(0);
  }
  unmute() {
    this.isMuted = false;
    this.setValue(this.valueBeforeMuted);
  }
  toLocalStorage() {
    localStorageManager.setItem(
      `valueBeforeMuted${this.getClassName()}`,
      this.valueBeforeMuted
    );
    localStorageManager.setItem(`isMuted${this.getClassName()}`, this.isMuted);
  }
}

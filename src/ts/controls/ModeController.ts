import { BaseComponent } from "../components/BaseComponent";
import { Mode } from "../Settings";
import { Option } from "../components/Option";

interface IModeController {
  parent: HTMLElement;
  mode: Mode;
  reset: () => void;
}

export class ModeController extends BaseComponent<HTMLSelectElement> {
  private readonly mods = {
    easy: "СЛОЖНО! (легко)",
    medium: "Загадка с глобусом (средне)",
    hard: "Нарисовать звезду (сложно)",
  };

  constructor({ parent, mode, reset }: IModeController) {
    super({ tag: "select", parent, className: "mode-controller" });
    Object.entries(this.mods).forEach((item) => {
      if (item[0] === mode) {
        const element = new Option({
          text: item[1],
          parent: this.element,
          selected: true,
          value: item[0],
        });
      }
      if (item[0] !== mode) {
        const element = new Option({
          text: item[1],
          parent: this.element,
          value: item[0],
        });
      }
    });
    this.addEvent("change", () => {
      this.emit("changeMode", this.getValue());
      const gameMode = this.getValue();
      if (gameMode === "medium") {
        this.emit("changeBombs", 40);
      }
      if (gameMode === "hard") {
        this.emit("changeBombs", 99);
      }
      if (gameMode === "easy") {
        this.emit("changeBombs", 10);
      }
      reset();
    });
  }

  private getValue(): string {
    return this.element.value;
  }
}

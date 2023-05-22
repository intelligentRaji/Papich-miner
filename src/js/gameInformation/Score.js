import { BaseComponent } from "../components/BaseComponent.js";
export class Score extends BaseComponent {
  constructor({ parent, time, bombs, mode }) {
    super({ parent, className: "score" });
    this.bombs = new BaseComponent({
      tag: "span",
      className: "score-bombs",
      parent: this.element,
      text: String(bombs),
    });
    this.time = new BaseComponent({
      tag: "span",
      className: "score-time",
      parent: this.element,
      text: time,
    });
    this.mode = new BaseComponent({
      tag: "span",
      className: "score-mode",
      parent: this.element,
      text: `${mode}`,
    });
  }
}

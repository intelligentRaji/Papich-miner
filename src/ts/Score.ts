import { BaseComponent } from "./components/BaseComponent";

interface IScoreElement {
  parent: HTMLElement;
  bombs: number;
  time: string;
  mode: string;
}

export class Score extends BaseComponent {
  private bombs: BaseComponent;
  private time: BaseComponent;
  private mode: BaseComponent;

  constructor({ parent, time, bombs, mode }: IScoreElement) {
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

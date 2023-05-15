import { Timer } from "./Timer";
import { BaseComponent } from "./components/BaseComponent";

export class InformationPanel extends BaseComponent {
  private readonly timer: Timer;
  private readonly bombsCounter: BaseComponent;

  constructor(parent: HTMLElement) {
    super({ className: "information-panel", parent });
    this.timer = new Timer(this.element);
    this.bombsCounter = new BaseComponent({
      tag: "span",
      className: "bombs-counter",
      parent: this.element,
      text: "0",
    });
  }

  public start(): void {
    this.timer.start();
  }

  public setBombsCount(bombsLeft: number): void {
    this.bombsCounter.setTextContent(`${bombsLeft}`);
  }

  public end(): void {
    this.timer.stop();
  }
}

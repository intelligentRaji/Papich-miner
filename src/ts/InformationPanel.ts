import { Timer } from "./Timer";
import { BaseComponent } from "./components/BaseComponent";

export class InformationPanel extends BaseComponent {
  private readonly timer: Timer;
  private readonly bombsCounter: BaseComponent;
  private readonly clicksCounter: BaseComponent;

  constructor(parent: HTMLElement) {
    super({ className: "information-panel", parent });
    this.timer = new Timer(this.element);
    this.clicksCounter = new BaseComponent({
      tag: "span",
      className: "clicks-counter",
      parent: this.element,
      text: "0",
    });
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
    this.bombsCounter.setTextContent(`Бомбы: ${bombsLeft}`);
  }

  public plusClick(number: number): void {
    this.clicksCounter.setTextContent(`Клики: ${number}`);
  }

  public end(): string {
    return this.timer.stop();
  }
}

import { Timer } from "./Timer";
import { BaseComponent } from "../components/BaseComponent";

export class InformationPanel extends BaseComponent {
  private readonly timer: Timer;
  private readonly bombsCounter: BaseComponent;
  private readonly clicksCounter: BaseComponent;

  constructor(parent: HTMLElement, isStarted: boolean) {
    super({ className: "information-panel", parent });
    this.timer = new Timer(this.element, isStarted);
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

  public reset(): void {
    this.timer.stop();
    this.timer.reset();
  }

  public toLocalStorage(): void {
    this.timer.toLocalStorage();
  }

  public getTime(): string {
    return this.timer.getTime();
  }

  public getClicks(): string {
    if (this.clicksCounter.element.textContent) {
      return this.clicksCounter.element.textContent;
    }
    return "0";
  }
}

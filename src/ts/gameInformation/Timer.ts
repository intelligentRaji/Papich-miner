import { localStorageManager } from "../LocalStorageManager";
import { BaseComponent } from "../components/BaseComponent";
import { secondsIntoTime } from "../utils/secondsIntoTime";

declare function setInterval(
  callback: () => void,
  delay: number,
  ...args: number[]
): number;

const defaultTime = 0;

export class Timer extends BaseComponent {
  private seconds: number;
  private interval!: number;

  constructor(parent: HTMLElement, isStarted: boolean) {
    super({ tag: "span", className: "timer", parent });
    this.seconds = isStarted
      ? localStorageManager.getItem("time", defaultTime)
      : defaultTime;
    this.setTextContent(secondsIntoTime(this.seconds));
  }

  private plusSecond(): void {
    this.seconds += 1;
    this.setTextContent(secondsIntoTime(this.seconds));
  }

  public start(): void {
    this.interval = setInterval(() => {
      this.plusSecond();
    }, 1000);
  }

  public stop(): string {
    clearInterval(this.interval);
    return this.getTime();
  }

  public reset(): void {
    this.seconds = 0;
    this.setTextContent("00:00");
  }

  public getTime(): string {
    if (this.element.textContent) {
      return this.element.textContent;
    }
    return "00:00";
  }

  public toLocalStorage(): void {
    localStorageManager.setItem("time", this.seconds);
  }
}

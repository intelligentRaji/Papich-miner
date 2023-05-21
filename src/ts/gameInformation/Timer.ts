import { localStorageManager } from "../LocalStorageManager";
import { BaseComponent } from "../components/BaseComponent";

declare function setInterval(
  callback: () => void,
  delay: number,
  ...args: number[]
): number;

const defaultTime = 0;

export class Timer extends BaseComponent {
  private seconds: number;
  private interval!: number;

  constructor(parent: HTMLElement) {
    super({ tag: "span", className: "timer", parent, text: "00:00" });
    this.seconds = localStorageManager.getItem("time", defaultTime);
  }

  private plusSecond(): void {
    this.seconds += 1;
    const seconds = `${this.seconds % 60}`;
    const minutes = `${Math.floor(this.seconds / 60)}`;
    this.setTextContent(
      `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
    );
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

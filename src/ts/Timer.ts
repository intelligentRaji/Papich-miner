import { BaseComponent } from "./components/BaseComponent";

declare function setInterval(
  callback: () => void,
  delay: number,
  ...args: number[]
): number;

export class Timer extends BaseComponent {
  private seconds = 0;
  private interval!: number;

  constructor(parent: HTMLElement) {
    super({ tag: "span", className: "timer", parent, text: "00:00" });
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

  public stop(): void {
    clearInterval(this.interval);
  }

  public restart(): void {
    this.setTextContent("00:00");
  }
}

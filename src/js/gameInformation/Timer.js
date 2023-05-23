import { localStorageManager } from "../LocalStorageManager.js";
import { BaseComponent } from "../components/BaseComponent.js";
import { secondsIntoTime } from "../utils/secondsIntoTime.js";
const defaultTime = 0;
export class Timer extends BaseComponent {
  constructor(parent, isStarted) {
    super({ tag: "span", className: "timer", parent });
    this.seconds = isStarted
      ? localStorageManager.getItem("time", defaultTime)
      : defaultTime;
    this.setTextContent(secondsIntoTime(this.seconds));
  }
  plusSecond() {
    this.seconds += 1;
    this.setTextContent(secondsIntoTime(this.seconds));
  }
  start() {
    this.interval = setInterval(() => {
      this.plusSecond();
    }, 1000);
  }
  stop() {
    clearInterval(this.interval);
    return this.getTime();
  }
  reset() {
    this.seconds = 0;
    this.setTextContent("00:00");
  }
  getTime() {
    if (this.element.textContent) {
      return this.element.textContent;
    }
    return "00:00";
  }
  toLocalStorage() {
    localStorageManager.setItem("time", this.seconds);
  }
}

import { Timer } from "./Timer";
import { BaseComponent } from "../components/BaseComponent";
export class InformationPanel extends BaseComponent {
    constructor(parent, isStarted) {
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
    start() {
        this.timer.start();
    }
    setBombsCount(bombsLeft) {
        this.bombsCounter.setTextContent(`Бомбы: ${bombsLeft}`);
    }
    plusClick(number) {
        this.clicksCounter.setTextContent(`Клики: ${number}`);
    }
    end() {
        return this.timer.stop();
    }
    reset() {
        this.timer.stop();
        this.timer.reset();
    }
    toLocalStorage() {
        this.timer.toLocalStorage();
    }
    getTime() {
        return this.timer.getTime();
    }
    getClicks() {
        if (this.clicksCounter.element.textContent) {
            return this.clicksCounter.element.textContent;
        }
        return "0";
    }
}

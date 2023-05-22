import { BaseComponent } from "../components/BaseComponent";
import { Option } from "../components/Option";
export class ModeController extends BaseComponent {
    constructor({ parent, mode, reset }) {
        super({ tag: "select", parent, className: "mode-controller" });
        this.mods = {
            easy: "СЛОЖНО! (легко)",
            medium: "Загадка с глобусом (средне)",
            hard: "Нарисовать звезду (сложно)",
        };
        Object.entries(this.mods).forEach((item) => {
            if (item[0] === mode) {
                const element = new Option({
                    text: item[1],
                    parent: this.element,
                    selected: true,
                    value: item[0],
                });
            }
            if (item[0] !== mode) {
                const element = new Option({
                    text: item[1],
                    parent: this.element,
                    value: item[0],
                });
            }
        });
        this.addEvent("change", () => {
            this.emit("changeMode", this.getValue());
            const gameMode = this.getValue();
            if (gameMode === "medium") {
                this.emit("changeBombs", 40);
            }
            if (gameMode === "hard") {
                this.emit("changeBombs", 99);
            }
            if (gameMode === "easy") {
                this.emit("changeBombs", 10);
            }
            reset();
        });
    }
    getValue() {
        return this.element.value;
    }
}

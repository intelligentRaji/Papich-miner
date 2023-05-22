import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { LightModeButton } from "./LightModeButton";
export class Controls extends BaseComponent {
    constructor({ parent, ostCallback, effectsCallback, ostValue, effectsValue, mode, lightMode, reset, numberOfBombs, }) {
        super({ parent, className: "controls" });
        this.container = new BaseComponent({
            className: "container",
            parent: this.element,
        });
        this.bombsWrapper = new BaseComponent({
            className: "bombs-wrapper",
            parent: this.container.element,
        });
        this.bombsText = new BaseComponent({
            tag: "span",
            className: "bombs-text",
            parent: this.bombsWrapper.element,
            text: "Бомбы",
        });
        this.bombsControler = new BombsControler({
            parent: this.bombsWrapper.element,
            reset,
            numberOfBombs,
        });
        this.ostVolumeController = new VolumeControler({
            parent: this.container.element,
            className: "ost-volume",
            callback: ostCallback,
            value: ostValue,
            type: "ost",
        });
        this.effectsVolumeController = new VolumeControler({
            parent: this.container.element,
            className: "effects-volume",
            callback: effectsCallback,
            value: effectsValue,
            type: "effects",
        });
        this.modeController = new ModeController({
            parent: this.container.element,
            mode,
            reset,
        });
        this.modeController.subscribe("changeBombs", (value) => {
            this.bombsControler.change(value);
        });
        this.lightModeButton = new LightModeButton(this.container.element, lightMode);
        this.resetButton = new BaseComponent({
            parent: this.container.element,
            tag: "button",
            text: "Начать заново",
            className: "reset-button",
        });
        this.resetButton.addEvent("click", reset);
    }
    getBombs() {
        return this.bombsControler.getValue();
    }
    toLocalStorage() {
        this.ostVolumeController.toLocalStorage();
        this.effectsVolumeController.toLocalStorage();
    }
}

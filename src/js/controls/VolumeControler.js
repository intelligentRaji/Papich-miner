import { BaseComponent } from "../components/BaseComponent";
import { InputRange } from "../components/InputRange";
import { VolumeButton } from "../components/VolumeButton";
export class VolumeControler extends BaseComponent {
    constructor({ parent, className, callback, value, type }) {
        super({ parent, className: `${className} volume` });
        this.button = new VolumeButton(this.element, `${className}-button volume-button`, type);
        this.range = new InputRange({
            parent: this.element,
            className: `${className}-range range`,
            notify: callback,
            value,
        });
        this.button.subscribe("mute", () => {
            this.range.mute();
        });
        this.button.subscribe("unmute", () => {
            this.range.unmute();
        });
    }
    toLocalStorage() {
        this.range.toLocalStorage();
        this.button.toLocalStorage();
    }
}

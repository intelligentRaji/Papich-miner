import { localStorageManager } from "../LocalStorageManager";
import { BaseComponent } from "./BaseComponent";
export class VolumeButton extends BaseComponent {
    constructor(parent, className, type) {
        super({ parent, className, tag: "button" });
        this.type = type;
        this.element.addEventListener("click", () => {
            this.action();
        });
        this.isMuted = localStorageManager.getItem(`${this.type}isMuted`, false);
        if (this.isMuted) {
            this.addClass("muted");
        }
    }
    action() {
        if (this.isMuted) {
            this.unmute();
        }
        else {
            this.mute();
        }
    }
    mute() {
        this.addClass("muted");
        this.isMuted = true;
        this.emit("mute");
    }
    unmute() {
        this.removeClass("muted");
        this.isMuted = false;
        this.emit("unmute");
    }
    toLocalStorage() {
        localStorageManager.setItem(`${this.type}isMuted`, this.isMuted);
    }
}

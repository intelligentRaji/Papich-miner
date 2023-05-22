import { BaseComponent } from "../components/BaseComponent";
export class LightModeButton extends BaseComponent {
    constructor(parent, mode) {
        super({ tag: "button", className: "lightmode-button", parent });
        this.lightMode = mode;
        this.changeLightMode();
        this.addEvent("click", () => {
            this.action();
        });
    }
    action() {
        this.emit("setLightMode");
        this.setLightMode();
        this.changeLightMode();
    }
    changeLightMode() {
        document.documentElement.setAttribute("data-theme", `${this.lightMode}`);
    }
    setLightMode() {
        this.lightMode = this.lightMode === "light" ? "dark" : "light";
    }
}

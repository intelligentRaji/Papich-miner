import { BaseComponent } from "../components/BaseComponent";
import { LightMode } from "../Settings";

export class LightModeButton extends BaseComponent {
  private lightMode: LightMode;

  constructor(parent: HTMLElement, mode: LightMode) {
    super({ tag: "button", className: "lightmode-button", parent });
    this.lightMode = mode;
    this.changeLightMode();
    this.addEvent("click", () => {
      this.action();
    });
  }

  public action(): void {
    this.emit("setLightMode");
    this.setLightMode();
    this.changeLightMode();
  }

  private changeLightMode(): void {
    document.documentElement.setAttribute("data-theme", `${this.lightMode}`);
  }

  private setLightMode(): void {
    this.lightMode = this.lightMode === "light" ? "dark" : "light";
  }
}

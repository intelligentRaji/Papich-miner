import { BaseComponent } from "../components/BaseComponent";
import { LightMode } from "../Settings";

export class LightModeButton extends BaseComponent {
  private lightMode: LightMode;

  constructor(parent: HTMLElement, mode: LightMode) {
    super({ tag: "button", className: "lightmode-button", parent });
    this.lightMode = mode;
    this.addEvent("click", () => {
      this.changeLightMode();
    });
  }

  public changeLightMode(): void {
    this.emit("setLightMode");
    if (this.lightMode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    this.setLightMode();
  }

  private setLightMode(): void {
    this.lightMode = this.lightMode === "light" ? "dark" : "light";
  }
}

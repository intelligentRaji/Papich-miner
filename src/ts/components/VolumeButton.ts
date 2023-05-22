import { localStorageManager } from "../LocalStorageManager";
import { BaseComponent } from "./BaseComponent";
import { InputRange } from "./InputRange";

export class VolumeButton extends BaseComponent {
  private isMuted: boolean;
  private type: string;

  constructor(parent: HTMLElement, className: string, type: string) {
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

  public action(): void {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  private mute(): void {
    this.addClass("muted");
    this.isMuted = true;
    this.emit("mute");
  }

  private unmute(): void {
    this.removeClass("muted");
    this.isMuted = false;
    this.emit("unmute");
  }

  public toLocalStorage(): void {
    localStorageManager.setItem(`${this.type}isMuted`, this.isMuted);
  }
}

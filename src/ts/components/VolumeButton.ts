import { BaseComponent } from "./BaseComponent";

export class VolumeButton extends BaseComponent {
  private isMuted = false;

  constructor(parent: HTMLElement, className: string) {
    super({ parent, className, tag: "button" });
    this.element.addEventListener("click", () => {
      this.action();
    });
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
}

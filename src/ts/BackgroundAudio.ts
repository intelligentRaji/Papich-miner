import { AudioComponent } from "./components/AudioComponent";

export class BackgroundAudio extends AudioComponent {
  private runOst = (): void => {
    this.runTrack("ost");
  };

  public win(): void {
    this.runTrack("win");
    this.element.removeEventListener("ended", this.runOst);
  }

  public end(): void {
    this.runTrack("loose");
    this.element.removeEventListener("ended", this.runOst);
  }

  public start(): void {
    this.runOst();
    this.element.addEventListener("ended", this.runOst);
  }
}

import { AudioComponent } from "./components/AudioComponent";

export class EffectsAudio extends AudioComponent {
  private isPlay = false;

  constructor() {
    super();
    this.element.addEventListener("ended", () => {
      this.isPlay = false;
    });
  }

  public action(type: string): void {
    if (!this.isPlay) {
      this.runTrack(type);
      this.isPlay = true;
    }
  }
}

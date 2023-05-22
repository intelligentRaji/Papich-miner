import { AudioComponent } from "../components/AudioComponent.js";
export class EffectsAudio extends AudioComponent {
  constructor() {
    super();
    this.isPlay = false;
    this.element.addEventListener("ended", () => {
      this.isPlay = false;
    });
  }
  action(type) {
    if (!this.isPlay) {
      this.runTrack(type);
      this.isPlay = true;
    }
  }
}

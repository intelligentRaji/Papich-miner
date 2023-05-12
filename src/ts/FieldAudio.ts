import { AudioComponent } from "./components/AudioComponent";
import { getRandomNumber } from "./utils/getRandomNumber";

interface IAudioAction {
  type?: string;
  path?: string;
}

type AudioRecord = Record<string, string[]>;

export class FieldAudio extends AudioComponent {
  private readonly audioFiles: AudioRecord;

  constructor(srcs: AudioRecord) {
    super();
    this.audioFiles = srcs;
  }

  public action({ type, path }: IAudioAction): void {
    if (type) {
      this.setRandomSrc(type);
    }
    if (path) {
      this.setSrc(path);
    }
    this.play();
  }

  private setRandomSrc(type: string): void {
    this.element.src =
      this.audioFiles[type][
        getRandomNumber(0, this.audioFiles[type].length - 1)
      ];
  }
}

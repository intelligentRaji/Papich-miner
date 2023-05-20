import { getRandomNumber } from "../utils/getRandomNumber";
import audioFiles from "../../json/audio.json";

type Libruary = Record<string, string[]>;

export class AudioComponent {
  protected readonly element: HTMLAudioElement;
  private readonly libruary: Libruary;

  constructor() {
    this.element = new Audio();
    this.libruary = audioFiles;
    this.element.volume = 0.1;
  }

  public play(): void {
    this.element.play();
  }

  protected setSrc(path: string): void {
    this.element.src = path;
  }

  protected setVolume(number: number): void {
    this.element.volume = number / 100;
  }

  protected replay(): void {
    this.element.currentTime = 0;
    this.play();
  }

  protected runTrack(type: string): void {
    const typeAudio = this.libruary[type];
    const number = getRandomNumber(0, typeAudio.length - 1);
    this.setSrc(typeAudio[number]);
    this.play();
  }

  public changeVolume(value: number): void {
    this.element.volume = value / 100;
  }
}

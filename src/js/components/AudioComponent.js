import { getRandomNumber } from "../utils/getRandomNumber.js";
import audioFiles from "../../json/audio.json";
export class AudioComponent {
  constructor() {
    this.element = new Audio();
    this.libruary = audioFiles;
    this.element.volume = 0.1;
  }
  play() {
    this.element.play();
  }
  setSrc(path) {
    this.element.src = path;
  }
  setVolume(number) {
    this.element.volume = number / 100;
  }
  replay() {
    this.element.currentTime = 0;
    this.play();
  }
  runTrack(type) {
    const typeAudio = this.libruary[type];
    const number = getRandomNumber(0, typeAudio.length - 1);
    this.setSrc(typeAudio[number]);
    this.play();
  }
  changeVolume(value) {
    this.element.volume = value / 100;
  }
  stop() {
    this.element.pause();
  }
}

import { AudioComponent } from "../components/AudioComponent";
export class BackgroundAudio extends AudioComponent {
    constructor() {
        super(...arguments);
        this.runOst = () => {
            this.runTrack("ost");
        };
    }
    win() {
        this.runTrack("win");
        this.element.removeEventListener("ended", this.runOst);
    }
    lose() {
        this.runTrack("loose");
        this.element.removeEventListener("ended", this.runOst);
    }
    start() {
        this.runOst();
        this.element.addEventListener("ended", this.runOst);
    }
}

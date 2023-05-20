import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { Mode } from "../Settings";

export type Notify = (params: number) => void;

interface ContolsConstructor {
  parent: HTMLElement;
  ostCallback: Notify;
  effectsCallback: Notify;
  ostValue: string;
  effectsValue: string;
  mode: Mode;
}

export class Controls extends BaseComponent {
  public readonly bombsControler: BombsControler;
  public readonly ostVolumeController: VolumeControler;
  public readonly effectsVolumeController: VolumeControler;
  public readonly modeController: ModeController;

  constructor({
    parent,
    ostCallback,
    effectsCallback,
    ostValue,
    effectsValue,
    mode,
  }: ContolsConstructor) {
    super({ parent, className: "controls" });
    this.bombsControler = new BombsControler(this.element);
    this.ostVolumeController = new VolumeControler({
      parent: this.element,
      className: "ost-volume",
      callback: ostCallback,
      value: ostValue,
    });
    this.effectsVolumeController = new VolumeControler({
      parent: this.element,
      className: "ost-volume",
      callback: effectsCallback,
      value: effectsValue,
    });
    this.modeController = new ModeController({ parent: this.element, mode });
  }

  public getBombs(): number {
    return this.bombsControler.getValue();
  }
}

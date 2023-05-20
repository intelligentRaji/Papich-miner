import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { LightMode, Mode } from "../Settings";
import { LightModeButton } from "./LightModeButton";

export type Notify = (params: number) => void;

interface ContolsConstructor {
  parent: HTMLElement;
  ostCallback: Notify;
  effectsCallback: Notify;
  ostValue: string;
  effectsValue: string;
  mode: Mode;
  lightMode: LightMode;
}

export class Controls extends BaseComponent {
  public readonly bombsControler: BombsControler;
  public readonly ostVolumeController: VolumeControler;
  public readonly effectsVolumeController: VolumeControler;
  public readonly modeController: ModeController;
  public readonly lightModeButton: LightModeButton;

  constructor({
    parent,
    ostCallback,
    effectsCallback,
    ostValue,
    effectsValue,
    mode,
    lightMode,
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
    this.lightModeButton = new LightModeButton(this.element, lightMode);
  }

  public getBombs(): number {
    return this.bombsControler.getValue();
  }
}

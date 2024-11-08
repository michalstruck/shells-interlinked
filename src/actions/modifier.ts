import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
  Target,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { type GlobalSettings } from "../types.global";
import { ModifierModeIconMap } from "../icons";

const getModifierIcon = (isShootMode: boolean) => {
  if (isShootMode) {
    return ModifierModeIconMap["changeMode"];
  }
  return ModifierModeIconMap["shootMode"];
};

const isShootModeDefault = false;

@action({ UUID: "com.michalstruck.shells-interlinked.modifier" })
export class ModifierButton extends SingletonAction {
  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    // set changeMode as default
    await streamDeck.settings.setGlobalSettings({
      isShootMode: isShootModeDefault,
    });
    const icon = getModifierIcon(isShootModeDefault);

    await ev.action.setImage(icon, { target: Target.HardwareAndSoftware });
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globalSettings =
      (await streamDeck.settings.getGlobalSettings<GlobalSettings>()) || {};

    const isShootMode = Boolean(globalSettings?.isShootMode);
    const icon = getModifierIcon(isShootMode);

    await ev.action.setImage(icon, { target: Target.HardwareAndSoftware });

    let newGlobalSettings = {
      ...globalSettings,
      isShootMode: !isShootMode,
    };
    await streamDeck.settings.setGlobalSettings<GlobalSettings>(
      newGlobalSettings
    );

    streamDeck.logger.info({
      origin: "modifier",
      newGlobalSettings,
    });
  }
}

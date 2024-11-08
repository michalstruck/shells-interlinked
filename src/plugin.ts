import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { ShellSwitch } from "./actions/shell-switch";
import { ModifierButton } from "./actions/modifier";

streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.actions.registerAction(new ShellSwitch());
streamDeck.actions.registerAction(new ModifierButton());

streamDeck.connect();

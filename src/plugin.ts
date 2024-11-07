import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { ShellSwitch } from "./actions/shell-switch";

streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.actions.registerAction(new ShellSwitch());

streamDeck.connect();

/*
 * Copyright (C) 2012-2022  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as preferences from "@/lib/preferences";
import * as data from "@/lib/data";
import { get_clock_drift, get_network_latency, socket } from "@/lib/sockets";
import { current_language } from "@/lib/translate";
import { Goban, THEMES, setGobanCallbacks } from "goban";
import { sfx } from "@/lib/sfx";

window["Goban"] = Goban;
//window["GoThemes"] = GoThemes;
//window["GoEngine"] = GoEngine;

(data as any).setDefault("custom.black", "#000000");
(data as any).setDefault("custom.white", "#FFFFFF");
(data as any).setDefault("custom.board", "#DCB35C");
(data as any).setDefault("custom.line", "#000000");
(data as any).setDefault("custom.url", "");

export function configure_goban() {
    setGobanCallbacks({
        defaultConfig: () => {
            return {
                server_socket: socket,
                player_id: data.get("user").anonymous ? 0 : data.get("user").id,
            };
        },

        getCoordinateDisplaySystem: (): "A1" | "1-1" => {
            switch (preferences.get("board-labeling")) {
                case "A1":
                    return "A1";
                case "1-1":
                    return "1-1";
                default:
                    // auto
                    switch (current_language) {
                        case "ko":
                        case "ja":
                        case "zh-cn":
                        case "zh-hk":
                        case "zh-tw":
                            return "1-1";
                        default:
                            return "A1";
                    }
            }
        },

        isAnalysisDisabled: (goban: Goban, perGameSettingAppliesToNonPlayers = false): boolean => {
            // The player's preference setting to always disable analysis overrides the per-game setting for
            // their own games.
            if (
                preferences.get("always-disable-analysis") &&
                goban.engine.isParticipant(data.get("user").id)
            ) {
                return true;
            }

            // If the user hasn't enabled the always-disable-analysis option (or they do not participate in this game),
            // we check the per-game setting.
            if (perGameSettingAppliesToNonPlayers) {
                // This is used for the SGF download which is disabled even for users that are not
                // participating in the game (or not signed in)
                return goban.engine.config.original_disable_analysis;
            } else {
                return goban.engine.config.disable_analysis;
            }
        },

        getClockDrift: (): number => get_clock_drift(),
        getNetworkLatency: (): number => get_network_latency(),
        getLocation: (): string => window.location.pathname,
        //getShowMoveNumbers: (): boolean => !!preferences.get("show-move-numbers"),
        getShowVariationMoveNumbers: (): boolean => {
            const location = window.location.pathname;
            // Hacky solution because if we check the global_goban's mode, it is undefined on page refresh,
            // we will just check the browser url to omit showing the numbers on the stones
            if (location.includes("/learn-to-play/")) {
                return false;
            }
            return preferences.get("show-variation-move-numbers");
        },
        getMoveTreeNumbering: (): "none" | "move-number" | "move-coordinates" =>
            preferences.get("move-tree-numbering"),
        getCDNReleaseBase: (): string => data.get("config.cdn_release"),
        getSoundEnabled: (): boolean => sfx.getVolume("master") > 0,
        getSoundVolume: (): number => sfx.getVolume("master"),

        watchSelectedThemes: (cb) => preferences.watchSelectedThemes(cb),
        getSelectedThemes: () => getSelectedThemes(),

        customBlackStoneColor: (): string => data.get("custom.black" as any),
        customBlackTextColor: (): string => data.get("custom.white" as any),
        customWhiteStoneColor: (): string => data.get("custom.white" as any),
        customWhiteTextColor: (): string => data.get("custom.black" as any),
        customBoardColor: (): string => data.get("custom.board" as any),
        customBoardLineColor: (): string => data.get("custom.line" as any),
        customBoardUrl: (): string => data.get("custom.url" as any),

        addCoordinatesToChatInput: (coordinates: string): void => {
            const chat_input = $(".chat-input");

            if (!chat_input.attr("disabled")) {
                const txt = (chat_input.val().trim() + " " + coordinates).trim();
                chat_input.val(txt);
            }
        },
    });
}

export function getSelectedThemes(): {
    board: string;
    black: string;
    white: string;
    "removal-graphic": "x";
    "removal-scale": number;
} {
    let board = preferences.get("goban-theme-board") || "Plain";
    let white = preferences.get("goban-theme-white") || "White";
    let black = preferences.get("goban-theme-black") || "DarkBlue";

    if (!(board in THEMES["board"])) {
        board = "Plain";
    }
    if (!(white in THEMES["white"])) {
        white = "White";
    }
    if (!(black in THEMES["black"])) {
        black = "DarkBlue";
    }

    return {
        board: board,
        white: white,
        black: black,
        "removal-graphic": "x",
        "removal-scale": 1,
    };
}

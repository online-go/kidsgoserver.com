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

import * as React from "react";
import { socket } from "@/lib/sockets";
import { chat_manager } from "@/lib/chat_manager";
import { Avatar, uiClassToRaceIdx } from "@kidsgo/components/Avatar";
import { bots_list } from "@/lib/bots";
//import { getUserRating } from "rank_utils";

interface OpponentListProperties {
    channel: string;
    value: string;
    handicap: number;
    captureGame?: boolean;
    onChange: (user: string, handicap: number, full_user: any) => void;
}

window["chat_manager"] = chat_manager;

export function ComputerOpponents(props: OpponentListProperties): JSX.Element {
    const sortBots = (botList: any[]) => {
        // we created these in order of easy to hard, so just sort by id for now
        return [...botList].sort((a, b) => a.id - b.id);
    };
    const [bots, setBots] = React.useState<Array<any>>(sortBots(bots_list()));

    React.useEffect(() => {
        const updateBots = (bots: any[]) => {
            const list = [];
            for (const id in bots) {
                list.push(bots[id]);
            }
            setBots(sortBots(list));
        };

        socket.on("active-bots", updateBots);
        return () => {
            socket.off("active-bots", updateBots);
        };
    }, []);

    React.useEffect(() => {
        if (props.captureGame) {
            const easyBot = bots.find(
                (bot) => bot.kidsgo_bot_name?.toLowerCase()?.includes("easy"),
            );
            if (easyBot && (!props.value || props.value !== easyBot.id || props.handicap !== 0)) {
                // Auto-select Easy bot and sync parent state
                props.onChange(easyBot.id, 0, easyBot);
            }
        }
    }, [props.captureGame, bots]);
    // Early return for capture mode - only show Easy bot
    if (props.captureGame) {
        const easyBot = bots.find((bot) => bot.kidsgo_bot_name?.toLowerCase()?.includes("easy"));

        if (!easyBot) {
            return;
        }

        const [race, idx] = uiClassToRaceIdx(easyBot.ui_class);
        const isSelected = props.value === easyBot.id && props.handicap === 0;

        return (
            <div className="OpponentList-container">
                <div className="OpponentList ComputerOpponents">
                    <h4>Bots to Play</h4>
                    <span
                        className={`bot ${isSelected ? "active" : ""}`}
                        onClick={() => {
                            props.onChange(easyBot.id, 0, easyBot);
                        }}
                    >
                        <Avatar race={race} idx={idx} />
                        Easy
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="OpponentList-container">
            <div className="OpponentList ComputerOpponents">
                <h4>Bots to Play</h4>
                {(bots.length >= 1 || null) &&
                    bots
                        .filter((bot) => !!bot.kidsgo_bot_name)

                        .map((bot: any) => {
                            const [race, idx] = uiClassToRaceIdx(bot.ui_class);
                            const handicaps =
                                bot.kidsgo_bot_name?.toLowerCase()?.indexOf("easy") >= 0
                                    ? [4, 2, 0]
                                    : [0];

                            return (
                                <React.Fragment key={bot.id}>
                                    {handicaps.map((handicap) => {
                                        let botDisplayName = bot.kidsgo_bot_name;

                                        if (
                                            bot.kidsgo_bot_name?.toLowerCase()?.indexOf("easy") >= 0
                                        ) {
                                            if (handicap === 4) {
                                                botDisplayName = "Beginner";
                                            } else if (handicap === 2) {
                                                botDisplayName = "Weak";
                                            } else if (handicap === 0) {
                                                botDisplayName = "Easy";
                                            }
                                        }

                                        return (
                                            <span
                                                key={bot.id + "-" + handicap}
                                                className={
                                                    "bot" +
                                                    (props.value === bot.id &&
                                                    (handicaps.length === 1 ||
                                                        props.handicap === handicap ||
                                                        (handicap === 0 &&
                                                            handicaps.indexOf(props.handicap) < 0))
                                                        ? " active"
                                                        : "")
                                                }
                                                onClick={() => {
                                                    props.onChange(bot.id, handicap, bot);
                                                }}
                                            >
                                                <Avatar race={race} idx={idx} />
                                                {botDisplayName}
                                            </span>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
            </div>
        </div>
    );
}

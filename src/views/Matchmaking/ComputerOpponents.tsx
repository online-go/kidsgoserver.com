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
import { socket } from "sockets";
import { chat_manager } from "chat_manager";
import { Avatar, uiClassToRaceIdx } from "Avatar";
import { bots_list } from "bots";
//import { getUserRating } from "rank_utils";

interface OpponentListProperties {
    channel: string;
    value: string;
    handicap: number;
    onChange: (user: string, handicap: number, full_user: any) => void;
}

window["chat_manager"] = chat_manager;

export function ComputerOpponents(props: OpponentListProperties): JSX.Element {
    const [bots, setBots] = React.useState<Array<any>>(bots_list());

    React.useEffect(() => {
        const updateBots = (bots: any[]) => {
            const list = [];
            for (const id in bots) {
                list.push(bots[id]);
            }
            //list.sort((a, b) => getUserRating(a).rating - getUserRating(b).rating);
            // we created these in order of easy to hard, so just sort by id for now
            list.sort((a, b) => a.id - b.id);

            setBots(list);
        };

        socket.on("active-bots", updateBots);
        return () => {
            socket.off("active-bots", updateBots);
        };
    }, []);

    return (
        <div className="OpponentList-container">
            <div className="OpponentList ComputerOpponents">
                <h4>Computer Opponents</h4>
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
                                    {handicaps.map((handicap) => (
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
                                            {bot.kidsgo_bot_name}
                                            {handicap > 0
                                                ? handicap === 1
                                                    ? " with no Komi"
                                                    : ` + ${handicap}`
                                                : ""}
                                        </span>
                                    ))}
                                </React.Fragment>
                            );
                        })}
            </div>
        </div>
    );
}

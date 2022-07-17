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
import { chat_manager, ChatChannelProxy } from "chat_manager";
import { useUser } from "hooks";
import { Avatar, uiClassToRaceIdx } from "Avatar";
import { bots_list } from "bots";
//import { getUserRating } from "rank_utils";

interface OpponentListProperties {
    channel: string;
    value: string;
    handicap: number;
    onChange: (user: string, handicap: number) => void;
}

window["chat_manager"] = chat_manager;

export function OpponentList(props: OpponentListProperties): JSX.Element {
    const user = useUser();
    const [, refresh] = React.useState<number>(0);
    const proxy = React.useRef<ChatChannelProxy>();
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
    React.useEffect(() => {
        proxy.current = chat_manager.join(props.channel);
        proxy.current.on("join", () => refresh(Math.random()));
        proxy.current.on("part", () => refresh(Math.random()));
        window["proxy"] = proxy.current;
        refresh(proxy.current.channel.users_by_name.length);

        return () => {
            proxy.current.part();
        };
    }, [props.channel, user.username, user.ui_class]);

    const sorted_users: Array<any> = proxy.current?.channel.users_by_name || [];

    return (
        <div className="OpponentList-container">
            <div className="OpponentList">
                {(sorted_users.length > 1 || null) && ( // > 1 because this player is always in the list
                    <>
                        <h4>Kids to Play</h4>
                        {sorted_users
                            .filter((u) => u.id !== user.id && u.id > 0)
                            .map((user) => {
                                const [race, idx] = uiClassToRaceIdx(user.ui_class);

                                return (
                                    <span
                                        key={user.id}
                                        className={
                                            "kid" + (props.value === user.id ? " active" : "")
                                        }
                                        onClick={() => props.onChange(user.id, 0)}
                                    >
                                        <Avatar race={race} idx={idx} />
                                        {user.username}
                                    </span>
                                );
                            })}
                    </>
                )}

                <h4>Computer Opponents</h4>
                {(bots.length >= 1 || null) &&
                    bots
                        .filter((bot) => !!bot.kidsgo_bot_name)
                        .map((bot: any) => {
                            const [race, idx] = uiClassToRaceIdx(bot.ui_class);

                            return (
                                <React.Fragment key={bot.id}>
                                    {[4, 3, 2, 1, 0].map((handicap) => (
                                        <span
                                            key={bot.id + "-" + handicap}
                                            className={
                                                "bot" +
                                                (props.value === bot.id &&
                                                props.handicap === handicap
                                                    ? " active"
                                                    : "")
                                            }
                                            onClick={() => {
                                                props.onChange(bot.id, handicap);
                                            }}
                                        >
                                            <Avatar race={race} idx={idx} />
                                            {bot.kidsgo_bot_name}
                                            {handicap > 0
                                                ? handicap === 1
                                                    ? " with no Komi"
                                                    : ` + ${handicap} stones`
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

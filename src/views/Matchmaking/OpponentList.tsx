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
import { chat_manager, ChatChannelProxy } from "chat_manager";
import { useUser } from "hooks";
import { Avatar, uiClassToRaceIdx } from "Avatar";

interface OpponentListProperties {
    channel: string;
    value: string;
    onChange: (user: string) => void;
}

export function OpponentList(props: OpponentListProperties): JSX.Element {
    const user = useUser();
    const [, refresh] = React.useState<number>(0);
    const proxy = React.useRef<ChatChannelProxy>();

    React.useEffect(() => {
        proxy.current = chat_manager.join(props.channel);
        proxy.current.on("join", () => refresh(proxy.current.channel.users_by_name.length));
        proxy.current.on("part", () => refresh(proxy.current.channel.users_by_name.length));
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
                <h4>Computer Opponents</h4>
                <span className="disabled">
                    <Avatar race={"aquatic"} idx={9} />
                    Easy Computer
                </span>
                <span className="disabled">
                    <Avatar race={"bird"} idx={26} />
                    Medium Computer
                </span>
                <span className="disabled">
                    <Avatar race={"wisdom"} idx={2} />
                    Hard Computer
                </span>

                {(sorted_users.length > 1 || null) && ( // > 1 because this player is always in the list
                    <>
                        <h4>Kids to Play</h4>
                        {sorted_users
                            .filter((u) => u.id !== user.id)
                            .map((user) => {
                                const [race, idx] = uiClassToRaceIdx(user.ui_class);

                                return (
                                    <span
                                        key={user.id}
                                        className={
                                            "kid" + (props.value === user.id ? " active" : "")
                                        }
                                        onClick={() => props.onChange(user.id)}
                                    >
                                        <Avatar race={race} idx={idx} />
                                        {user.username}
                                    </span>
                                );
                            })}
                    </>
                )}
            </div>
        </div>
    );
}

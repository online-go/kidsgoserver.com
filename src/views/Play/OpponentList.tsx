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

interface OpponentListProperties {
    channel: string;
    value: string;
    onChange: (user: string) => void;
}

export function OpponentList(props: OpponentListProperties): JSX.Element {
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
    }, [props.channel]);

    const sorted_users: Array<any> = proxy.current?.channel.users_by_name || [];

    return (
        <div className="OpponentList">
            <select size={6} value={props.value} onChange={(ev) => props.onChange(ev.target.value)}>
                <option value="easy">Easy Computer</option>
                <option value="medium">Medium Computer</option>
                <option value="hard">Hard Computer</option>
                {sorted_users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username}
                    </option>
                ))}
            </select>
        </div>
    );
}

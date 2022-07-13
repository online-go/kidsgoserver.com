/*
 * Copyright (C) 2012-2020  Online-Go.com
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
import { Goban } from "goban";

interface ChatBubbleProps {
    user_id?: number;
    side: "opponent" | "player";
    goban?: Goban;
}

export function ChatBubble({ user_id, side, goban }: ChatBubbleProps): JSX.Element {
    const [line, setLine] = React.useState<any>(null);

    const doSetChat = (line) => {
        setLine(line);
        setTimeout(() => {
            setLine(null);
        }, 30000);
    };

    React.useEffect(() => {
        if (!goban) {
            return;
        }

        let load_time = Date.now();

        const onChat = (line) => {
            if (load_time + 3000 > Date.now()) {
                return;
            }

            if (line.player_id === user_id) {
                console.log(line);
                doSetChat(line);
            }
        };

        const onLoad = () => {
            load_time = Date.now();
        };

        goban.on("chat", onChat);
        goban.on("load", onLoad);
        return () => {
            goban.off("chat", onChat);
            goban.off("load", onLoad);
        };
    }, [goban, side, user_id]);

    if (!line) {
        return null;
    }

    return (
        <div className={`ChatBubble ${side}`} onClick={() => setLine(null)}>
            <div className="chat-bubble-body">
                <div className="chat-bubble-body-text">{line.body}</div>
            </div>
        </div>
    );
}

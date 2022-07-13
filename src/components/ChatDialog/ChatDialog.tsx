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
import * as ReactDOM from "react-dom/client";
import { KBShortcut } from "KBShortcut";
import { Goban } from "goban";

interface ChatDialogProps {
    goban?: Goban;
    onClose: () => void;
}

export function ChatDialog(props: ChatDialogProps): JSX.Element {
    const phrases = ["Have a good game!", "Nice move!", "Well played!", "Thanks for the game!"];

    if (!props.goban) {
        return null;
    }
    /*
    const openChat = () => {
        //console.log("Open chat");
        //goban_ref.current?.sendChat("Hello world", "main");
        //console.log("sent");
        openChat(goban_ref.current);
    };
    */

    const send = (message: string) => {
        props.goban.sendChat(message, "main");
        props.onClose();
    };

    return (
        <div className="ChatDialog-container">
            <KBShortcut shortcut="esc" action={props.onClose} />
            <div className="ChatDialog">
                <div className="ChatDialog-phrases">
                    {phrases.map((phrase, i) => (
                        <div key={i} className="phrase" onClick={() => send(phrase)}>
                            {phrase}
                        </div>
                    ))}
                </div>

                <div className="ChatDialog-buttons">
                    <button className="primary-button" onClick={props.onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

interface OpenChatProps {
    goban: Goban;
}

let root: ReactDOM.Root;

export function openChat(props: OpenChatProps): void {
    const container = document.createElement("DIV");
    document.body.append(container);

    root = ReactDOM.createRoot(container);
    const onClose = () => {
        root.unmount();
    };

    root.render(
        <React.StrictMode>
            <ChatDialog goban={props.goban} onClose={onClose} />
        </React.StrictMode>,
    );
}

export function closeChat(): void {
    root.unmount();
}

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
import { useUser } from "hooks";
import { post } from "requests";
//import { useState } from "react";
//import { Link } from "react-router-dom";
import { _, interpolate } from "translate";
import * as data from "data";
import cached from "cached";
import { ChatUserList } from "ChatUserList";
//import * as preferences from "preferences";
//import { errorAlerter, ignore } from "misc";

export function Play(): JSX.Element {
    const user = useUser();
    useEnsureUserIsCreated();

    const play = (e) => {
        console.log("PLAY");
    };

    const canPlay = !user.anonymous;
    console.log(canPlay);

    return (
        <div id="Play" className="bg-earth">
            <div className="container">
                <div className="left">
                    <CharacterManagement />

                    <OpponentSelection />
                </div>
                <div className="right">
                    <button className="btn btn-primary" disabled={!canPlay} onClick={play}>
                        PLAY
                    </button>
                </div>
            </div>
        </div>
    );
}

function CharacterManagement(): JSX.Element {
    return (
        <div className="AvatarSelection">
            <h3>Avatar</h3>
            <AvatarSelection />
            <NameSelection />
        </div>
    );
}

function AvatarSelection(): JSX.Element {
    return <div className="AvatarSelection" />;
}

function NameSelection(): JSX.Element {
    const user = useUser();
    const [refreshing, setRefreshing] = React.useState(false);

    if (user.anonymous) {
        return <div className="NameSelection" />;
    }

    const refresh = (e) => {
        setRefreshing(true);
        post("me/kidsgo/regenerate_username")
            .then((config) => {
                data.set(cached.config, config);
                setRefreshing(false);
            })
            .catch((err) => {
                setRefreshing(false);
            });
    };

    return (
        <div className={`NameSelection ${refreshing ? "refreshing" : ""}`}>
            <span className="username">{user.username}</span>
            <span className="refresh" onClick={refresh}>
                &#10226;
            </span>
        </div>
    );
}

function OpponentSelection(): JSX.Element {
    return (
        <div className="OpponentSelection">
            <h3>Opponent</h3>
            <select multiple={true} size={6}>
                <option value="easy">Easy Computer</option>
                <option value="medium">Medium Computer</option>
                <option value="hard">Hard Computer</option>
            </select>
            <ChatUserList channel="kidsgo" />
        </div>
    );
}

function useEnsureUserIsCreated(): void {
    const user = useUser();

    React.useEffect(() => {
        if (user.anonymous) {
            post("/api/v0/register/kidsgo")
                .then((config) => {
                    console.log(config);
                    data.set(cached.config, config);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [user.anonymous]);
}

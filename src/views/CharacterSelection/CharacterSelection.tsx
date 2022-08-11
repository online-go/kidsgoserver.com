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
import * as data from "data";
import cached from "cached";
import { useNavigate } from "react-router-dom";
import { useUser } from "hooks";
import { post } from "requests";
import { BackButton } from "BackButton";
import { _ } from "translate";
import { useEnsureUserIsCreated } from "Matchmaking";
import {
    AvatarSelection,
    Race,
    raceIdxToUiClass,
    uiClassToRaceIdx,
    avatar_background_class,
} from "Avatar";

export function CharacterSelection(): JSX.Element {
    useEnsureUserIsCreated();

    const navigate = useNavigate();
    const user = useUser();
    const [race, idx] = uiClassToRaceIdx(user.ui_class);
    const [avatarRace, setAvatarRace] = React.useState<Race>(race);
    const [avatarIdx, setAvatarIdx] = React.useState(idx);
    const last_ui_class = React.useRef<string>(raceIdxToUiClass(race, idx));
    const updating = React.useRef<boolean>(false);

    const update_server = (ui_class: string): void => {
        last_ui_class.current = ui_class;
        if (updating.current) {
            return;
        }

        updating.current = true;

        post("kidsgo/update_avatar", { ui_class })
            .then(() => {
                updating.current = false;
                if (ui_class !== last_ui_class.current) {
                    update_server(last_ui_class.current);
                }
            })
            .catch((err) => {
                updating.current = false;
                console.error("Failed to update avatar", err);
            });
    };

    const update = (race: Race, idx: number): void => {
        setAvatarRace(race);
        setAvatarIdx(idx);

        update_server(raceIdxToUiClass(race, idx));

        const config = data.get("cached.config");
        config.user.ui_class = raceIdxToUiClass(race, idx);
        data.setWithoutEmit("cached.config", config);
        data.setWithoutEmit("config", config);
        data.set("config.user", JSON.parse(JSON.stringify(config.user)));
        data.set("user", JSON.parse(JSON.stringify(config.user)));
    };

    return (
        <div id="CharacterSelection" className={avatar_background_class(race)}>
            <BackButton onClick={() => navigate("/play")} />

            <NameSelection />

            <AvatarSelection race={avatarRace} idx={avatarIdx} onChange={update} />
        </div>
    );
}

function NameSelection(): JSX.Element {
    const user = useUser();
    const [refreshing, setRefreshing] = React.useState(false);

    if (user.anonymous) {
        return <div className="NameSelection" />;
    }

    console.log("user", user);

    const refresh = (e) => {
        setRefreshing(true);
        post("kidsgo/regenerate_username")
            .then((config) => {
                data.set(cached.config, config);
                console.log("should be ", config.user);
                setRefreshing(false);
            })
            .catch((err) => {
                console.error(err);
                setRefreshing(false);
            });
    };

    return (
        <div className={`NameSelection ${refreshing ? "refreshing" : ""}`}>
            <div className="title">CHARACTER SELECTION</div>
            <div className="username">{user.username}</div>
            <button className="refresh" onClick={refresh}>
                Generate New Name
            </button>
        </div>
    );
}

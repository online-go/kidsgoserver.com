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
import * as data from "@/lib/data";
import cached from "@/lib/cached";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/hooks";
import { post, get } from "@/lib/requests";
import { BackButton } from "@kidsgo/components/BackButton";
import { SpaceBackground } from "@kidsgo/components/SpaceBackground";
import { _ } from "@/lib/translate";
import { useEnsureUserIsCreated } from "@kidsgo/views/Matchmaking";
import {
    AvatarSelection,
    Race,
    raceIdxToUiClass,
    uiClassToRaceIdx,
    avatar_background_class,
    planet_for_race,
} from "@kidsgo/components/Avatar";

export function CharacterSelection(): JSX.Element {
    useEnsureUserIsCreated();

    const navigate = useNavigate();
    const user = useUser();
    const [race, idx] = uiClassToRaceIdx(user.ui_class);
    const [avatarRace, setAvatarRace] = React.useState<Race>(race);
    const [avatarIdx, setAvatarIdx] = React.useState(idx);

    const last_ui_class = React.useRef<string>(raceIdxToUiClass(race, idx));
    const previousRace = React.useRef<Race>(race);

    function syncUserData(newConfig: any) {
        data.set(cached.config, newConfig);
        data.setWithoutEmit("cached.config", newConfig);
        data.setWithoutEmit("config", newConfig);
        data.set("config.user", JSON.parse(JSON.stringify(newConfig.user)));
        data.set("user", JSON.parse(JSON.stringify(newConfig.user)));
    }

    const regenerateUsername = async () => {
        const config = data.get("cached.config");
        const ui_class = config?.user?.ui_class;

        try {
            const newConfig = await post("kidsgo/regenerate_username", {
                ui_class,
            });
            syncUserData(newConfig);
        } catch (err) {
            console.error("Failed to regenerate name", err);
        }
    };

    const handleRaceChange = async (newRace: Race, newIdx: number) => {
        const raceChanged = previousRace.current !== newRace;
        const new_ui_class = raceIdxToUiClass(newRace, newIdx);

        setAvatarRace(newRace);
        setAvatarIdx(newIdx);
        last_ui_class.current = new_ui_class;

        if (raceChanged) {
            previousRace.current = newRace;
        }

        // We need to regenerate a new username from the backend when only the Avatar race changes, but not when the idx changes
        // idx is changed on the frontend when you click the left and right arrows on the Avatar
        try {
            await post("kidsgo/update_avatar", { ui_class: new_ui_class });

            if (raceChanged) {
                try {
                    const newConfig = await post("kidsgo/regenerate_username", {
                        ui_class: new_ui_class,
                    });
                    syncUserData(newConfig);
                } catch (err) {
                    console.error("Failed to regenerate name", err);
                }
                // Necessary otherwise if we refresh the page after changing the alien index by using the left/right arrows, we lose the avatar we were on
            } else {
                const config = data.get("cached.config");
                config.user.ui_class = new_ui_class;
                data.setWithoutEmit("cached.config", config);
                data.setWithoutEmit("config", config);
                data.set("config.user", JSON.parse(JSON.stringify(config.user)));
                data.set("user", JSON.parse(JSON.stringify(config.user)));
            }
        } catch (err) {
            console.error("Failed to update avatar", err);
        }
    };

    return (
        <div id="CharacterSelection" className={avatar_background_class(avatarRace)}>
            <SpaceBackground planet={planet_for_race(avatarRace)} />
            <BackButton onClick={() => navigate("/play")} />
            <div className="HelpButton" onClick={() => navigate("/help")}></div>
            <NameSelection onRegenerate={() => regenerateUsername()} />
            <AvatarSelection race={avatarRace} idx={avatarIdx} onChange={handleRaceChange} />
            <button className="ok" onClick={() => navigate("/play")}>
                Done — I love it!
            </button>
        </div>
    );
}

function NameSelection({ onRegenerate }: { onRegenerate: () => void }): JSX.Element {
    const user = useUser();

    if (user.anonymous) {
        return <div className="NameSelection" />;
    }

    return (
        <div className={"NameSelection"}>
            <div className="title">PLAYER AVATAR</div>
            <div className="username">{user.username}</div>
            <button className="regenerate" onClick={onRegenerate}>
                Change Name
            </button>
        </div>
    );
}

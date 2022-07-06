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
import { useState, useEffect } from "react";
import { avatars, Race } from "./avatar_list";

export interface AvatarSelectionInterface {
    race: Race;
    idx: number;
    onChange: (race: Race, idx: number) => void;
}

export function AvatarSelection(props: AvatarSelectionInterface): JSX.Element {
    let [race, setRace] = useState(props.race);
    let [idx, setIdx] = useState(props.idx);

    if (!(race in avatars)) {
        setRace((race = "aquatic"));
        props.onChange(race, idx);
    }
    if (avatars[race].indexOf(idx) < 0) {
        setIdx((idx = avatars[race][0]));
        props.onChange(race, idx);
    }

    const increment = (inc: number): void => {
        let real_idx = avatars[race].indexOf(idx);
        real_idx += inc;
        if (real_idx < 0) {
            real_idx = avatars[race].length - 1;
        }
        if (real_idx > avatars[race].length - 1) {
            real_idx = 0;
        }

        setIdx((idx = avatars[race][real_idx]));
        props.onChange(race, idx);
    };

    const updateRace = (r: Race): void => {
        setRace((race = r));
        props.onChange(race, idx);
    };

    return (
        <div className="AvatarSelection">
            <div className="buttons">
                <button
                    className={race === "aquatic" ? "active" : ""}
                    onClick={() => updateRace("aquatic")}
                >
                    Aquatic
                </button>
                <button
                    className={race === "fuzzball" ? "active" : ""}
                    onClick={() => updateRace("fuzzball")}
                >
                    Fuzzball
                </button>
                <button
                    className={race === "bird" ? "active" : ""}
                    onClick={() => updateRace("bird")}
                >
                    Bird
                </button>
                <button
                    className={race === "wisdom" ? "active" : ""}
                    onClick={() => updateRace("wisdom")}
                >
                    Wisdom
                </button>
                <button
                    className={race === "robot" ? "active" : ""}
                    onClick={() => updateRace("robot")}
                >
                    Robot
                </button>
            </div>

            <div className="selector">
                <div className="previous" onClick={() => increment(-1)}>
                    &lt;
                </div>
                <div className="Avatar">
                    <div className={`Avatar-svg avatar-${race}-${idx}`} />
                </div>
                <div className="next" onClick={() => increment(1)}>
                    &gt;
                </div>
            </div>
        </div>
    );
}

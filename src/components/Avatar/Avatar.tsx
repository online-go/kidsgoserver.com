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
import { avatar_list } from "./avatar_list";

window['avatar_list'] = avatar_list;

type Race = 'aquatic' | 'bird' | 'fuzzball' | 'wisdom';

export interface AvatarInterface {
    race: Race;
    random?: boolean;
}

export function Avatar({race, random}:AvatarInterface):JSX.Element {
    let [_race, set_race] = useState(race);
    let [idx, set_idx] = useState(4);

    useEffect(() => {
        let interval;
        if (random) {
            interval = setInterval(() => {
                let item = avatar_list[Math.floor(Math.random() * avatar_list.length)];
                set_race(item.race as Race);
                set_idx(item.id);
            }, 10000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [random]);


    return (
        <div className='Avatar'>
            <div className={`Avatar-svg avatar-${_race}-${idx}`} />
        </div>
    );
}

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
import * as player_cache from "player_cache";
import { uiClassToRaceIdx } from "./util";
import { Race } from "./avatar_list";

export function usePlayerRace(user_id: number): Race | null {
    const [race, setRace] = React.useState<string>(null);

    React.useEffect(() => {
        if (user_id) {
            setRace(null);
            player_cache
                .fetch(user_id, ["ui_class"])
                .then((user) => {
                    const [r] = uiClassToRaceIdx(user.ui_class);
                    setRace(r);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [user_id]);

    if (!race || !user_id) {
        return null;
    }

    return race as Race;
}

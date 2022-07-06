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

import { Race, avatars } from "./avatar_list";

export function uiClassToRaceIdx(uiClass: string): [Race, number] {
    if (uiClass) {
        const parts = uiClass.split(" ");

        for (const part of parts) {
            if (/[a-z]+[-][0-9]+/.test(part)) {
                let [r, i] = part.split("-");

                switch (r) {
                    case "aquatic":
                    case "bird":
                    case "fuzzball":
                    case "wisdom":
                    case "robot":
                        break;
                    default:
                        r = "aquatic";
                }

                return [r as Race, parseInt(i)];
            }
        }
    }

    return ["aquatic", avatars["aquatic"][0]];
}

export function raceIdxToUiClass(race: Race, idx: number): string {
    return `${race}-${idx}`;
}

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

import { Goban, JGOFNumericPlayerColor } from "goban";

export function countPasses(goban: Goban): { black: number; white: number } {
    let black = 0;
    let white = 0;
    if (!goban || !goban.engine) {
        return { black, white };
    }

    const root = goban.engine.move_tree;

    for (let cur = root.next(true); cur; cur = cur.next(true)) {
        if (cur.passed()) {
            if (cur.player === JGOFNumericPlayerColor.BLACK) {
                white++;
            } else {
                black++;
            }
        }
    }

    if (goban.engine.phase === "finished") {
        if (goban.engine.colorToMove() === "white") {
            // aga rules, white must pass last, so we give black an extra point
            // here if that hasn't happened explicitly
            black += 1;
        }
    }

    return { black, white };
}

window["countPasses"] = countPasses;

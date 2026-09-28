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

// Room left around the board for its frame (the Goban-container's 1.5rem
// padding each side plus border and some slack). It was a flat 60px when
// the root font size was fixed at 14px; the root now grows on big screens,
// so it's kept in rem. Too little room and the framed board outgrows its
// flex slot, which grows to fit, which grows the board again.
const FRAME_ALLOWANCE_REM = 60 / 14;

export function boardTargetSize(width: number, height: number): number {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 14;
    return Math.min(width, height) - FRAME_ALLOWANCE_REM * rem;
}

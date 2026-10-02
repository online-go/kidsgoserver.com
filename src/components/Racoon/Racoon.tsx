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
import Lottie from "lottie-react";
import { useLottieAnimation, cdnBase } from "@kidsgo/lib/lottie-loader";

export type RacoonPointDirection = "up" | "mid" | "down";

// A request to point; `nonce` changes so the same direction can be requested
// twice in a row.
export interface RacoonPoint {
    direction: RacoonPointDirection;
    nonce: number;
}

interface RacoonProperties {
    point?: RacoonPoint | null;
    // The board's slot. He hides when he'd be drawn taller than the board.
    boardRef?: { current?: HTMLElement | null };
}

const POINT_FILES: Record<RacoonPointDirection, string> = {
    up: "LEARN_CHAR-ANIM_RACCOON_01_ANIM_POINTS_01_UP_v01.json",
    down: "LEARN_CHAR-ANIM_RACCOON_01_ANIM_POINTS_02_DOWN_v01.json",
    mid: "LEARN_CHAR-ANIM_RACCOON_01_ANIM_POINTS_03_MID_v01.json",
};

// The raccoon's 1600px compositions leave the left half empty for his pointing
// arm. Crop the view tightly around his idle pose (with a little room for the
// bob) so he fills his box like the old static art did; the pointing arm is
// allowed to draw past the crop (see Racoon.styl).
const RACCOON_VIEWBOX = "704 112 720 1376";
const RACCOON_ASPECT = 1376 / 720;

// True when the raccoon, drawn to fit `box`, would stand taller than the
// board in `board`. He's hidden with `visibility` so his box keeps its size
// and the check can't flip-flop as the layout settles.
function useTallerThanBoard(
    box: React.RefObject<HTMLElement>,
    board: { current?: HTMLElement | null } | undefined,
): boolean {
    const [taller, setTaller] = React.useState(false);

    React.useEffect(() => {
        if (!box.current || !board?.current) {
            return;
        }
        const check = () => {
            const b = box.current;
            const g = board.current;
            if (!b || !g) {
                return;
            }
            const style = getComputedStyle(b);
            const height =
                b.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
            const drawn = Math.min(height, b.clientWidth * RACCOON_ASPECT);
            const board_size = Math.min(g.clientWidth, g.clientHeight);
            setTaller(drawn > board_size);
        };
        const observer = new ResizeObserver(check);
        observer.observe(box.current);
        observer.observe(board.current);
        return () => observer.disconnect();
    }, [box, board]);

    return taller;
}

// Picks a pointing direction from where a click landed inside `target`.
export function pointDirectionForClick(
    ev: React.MouseEvent,
    target: HTMLElement | null,
): RacoonPointDirection {
    if (!target) {
        return "mid";
    }
    const rect = target.getBoundingClientRect();
    const frac = (ev.clientY - rect.top) / Math.max(rect.height, 1);
    if (frac < 1 / 3) {
        return "up";
    }
    if (frac > 2 / 3) {
        return "down";
    }
    return "mid";
}

// Idles in a loop; when asked to point, plays the matching pointing clip once
// (he looks over, points, pauses, returns) and then goes back to idling.
// Requests that arrive while he's already pointing are ignored so repeated
// clicks don't make him twitch.
export function Racoon(props: RacoonProperties): JSX.Element {
    const base = `${cdnBase()}/pages/lessons/`;
    const idle = useLottieAnimation(base + "LEARN_CHAR-ANIM_RACCOON_02_IDLE_v02.json");
    const pointUp = useLottieAnimation(base + POINT_FILES.up);
    const pointMid = useLottieAnimation(base + POINT_FILES.mid);
    const pointDown = useLottieAnimation(base + POINT_FILES.down);
    const pointing = { up: pointUp, mid: pointMid, down: pointDown };

    const [active, setActive] = React.useState<RacoonPointDirection | null>(null);
    const last_nonce = React.useRef<number | null>(null);

    React.useEffect(() => {
        const point = props.point;
        if (!point || point.nonce === last_nonce.current) {
            return;
        }
        last_nonce.current = point.nonce;
        if (active === null && pointing[point.direction]) {
            setActive(point.direction);
        }
    }, [props.point]);

    const data = active ? pointing[active] : idle;
    const box = React.useRef<HTMLDivElement>(null);
    const hidden = useTallerThanBoard(box, props.boardRef);

    return (
        <div className={"Racoon" + (hidden ? " Racoon-hidden" : "")} ref={box}>
            {data && (
                <Lottie
                    // Remount when the clip changes so the new one starts at frame 0.
                    key={active ?? "idle"}
                    animationData={data}
                    loop={active === null}
                    autoplay
                    onComplete={() => setActive(null)}
                    rendererSettings={{ viewBoxSize: RACCOON_VIEWBOX }}
                    className="Racoon-animation"
                />
            )}
        </div>
    );
}

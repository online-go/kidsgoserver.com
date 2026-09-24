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

    return (
        <div className="Racoon">
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

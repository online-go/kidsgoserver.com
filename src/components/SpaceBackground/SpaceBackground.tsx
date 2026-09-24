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
import { PlanetColor } from "@kidsgo/components/Avatar";

export const STARS_ANIMATION_PATH = "/pages/home/STARS_ANIM_01_v01.json";
export const SATELLITE_ANIMATION_PATH = "/backgrounds/Satellite_01_LOOP_v01.json";

// Black space behind everything, the home page's twinkling stars over it, a
// satellite drifting across, then the planet (transparent sky) on top. Mount
// it as the first child of a page root that has `position` set; it sits at
// z-index -1 so the page's normal content paints over it.
export function SpaceBackground({ planet }: { planet?: PlanetColor | null }): JSX.Element {
    const stars = useLottieAnimation(cdnBase() + STARS_ANIMATION_PATH);
    const satellite = useLottieAnimation(cdnBase() + SATELLITE_ANIMATION_PATH);

    return (
        <div className="SpaceBackground">
            {stars && (
                <Lottie
                    animationData={stars}
                    loop
                    autoplay
                    className="SpaceBackground-stars"
                    // The stars were drawn for the home page and all sit in the top
                    // half of the composition, so pin it to the top where the
                    // sky is instead of centring it.
                    rendererSettings={{ preserveAspectRatio: "xMidYMin slice" }}
                />
            )}
            {satellite && (
                <div className="SpaceBackground-satellite-track">
                    <Lottie
                        animationData={satellite}
                        loop
                        autoplay
                        className="SpaceBackground-satellite"
                    />
                </div>
            )}
            {planet && <div className={`SpaceBackground-planet planet-${planet}`} />}
        </div>
    );
}

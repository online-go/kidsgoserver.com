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
import { _ } from "translate";
import { useNavigate } from "react-router-dom";
import { kidsgo_sfx } from "kidsgo-sfx";

const ROCKET_LAUNCH_DURATION = 1.25; // seconds. This should match the time in LandingPage.styl to sync animation and navigation
let navigate_timeout;

export function LandingPage(): JSX.Element {
    const navigate = useNavigate();
    const [learn_to_play_launching, set_learn_to_play_launching]: [boolean, (tf: boolean) => void] =
        React.useState(false as boolean);
    const [play_launching, set_play_launching]: [boolean, (tf: boolean) => void] = React.useState(
        false as boolean,
    );

    function learnToPlay() {
        if (learn_to_play_launching) {
            return;
        }
        if (play_launching) {
            set_learn_to_play_launching(false);
            if (navigate_timeout) {
                clearTimeout(navigate_timeout);
            }
        }

        kidsgo_sfx.play("rocket");
        set_learn_to_play_launching(true);

        navigate_timeout = setTimeout(() => {
            navigate("/learn-to-play");
        }, ROCKET_LAUNCH_DURATION * 1000);
    }

    function play() {
        if (play_launching) {
            return;
        }
        if (learn_to_play_launching) {
            set_learn_to_play_launching(false);
            if (navigate_timeout) {
                clearTimeout(navigate_timeout);
            }
        }
        kidsgo_sfx.play("rocket");
        set_play_launching(true);

        setTimeout(() => set_play_launching(false), 3000);
        navigate_timeout = setTimeout(() => {
            navigate("/play");
        }, ROCKET_LAUNCH_DURATION * 1000);
    }

    return (
        <div id="LandingPage">
            <div className="spacer" />
            <div className="mountain-background">
                <div className="logo" />
                <div
                    className={`learn-to-play-rocket ${learn_to_play_launching ? "launch" : ""}`}
                    onClick={learnToPlay}
                >
                    <span className="label">LEARN</span>
                    <div className="flames" />
                </div>

                <div className={`play-rocket ${play_launching ? "launch" : ""}`} onClick={play}>
                    <span className="label">PLAY</span>
                    <div className="flames" />
                </div>
                <div className="learn-launchpad launchpad" />
                <div className="play-launchpad launchpad" />
            </div>
            <div className="spacer" />
        </div>
    );
}

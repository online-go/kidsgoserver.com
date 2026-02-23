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
import { _ } from "@/lib/translate";
import { useNavigate } from "react-router-dom";
import { kidsgo_sfx } from "@kidsgo/lib/kidsgo-sfx";
import { useUser } from "@/lib/hooks";
import Lottie from "lottie-react";

const animationCache = new Map<string, object>();

function useLottieAnimation(path: string): object | null {
    const [animation, setAnimation] = React.useState<object | null>(
        animationCache.get(path) ?? null,
    );
    React.useEffect(() => {
        if (animationCache.has(path)) {
            setAnimation(animationCache.get(path)!);
            return;
        }
        const controller = new AbortController();
        fetch(path, { signal: controller.signal, credentials: "omit" })
            .then((r) => r.json())
            .then((data) => {
                animationCache.set(path, data);
                setAnimation(data);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            });
        return () => controller.abort();
    }, [path]);
    return animation;
}

const ROCKET_LAUNCH_DURATION = 1.25; // seconds. This should match the time in LandingPage.styl to sync animation and navigation
let navigate_timeout;

export function LandingPage(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const cdnBase = window["cdn_service"] + "/" + window["kidsgo_release"];
    const starsAnimation = useLottieAnimation(`${cdnBase}/pages/home/STARS_ANIM_01_v01.json`);
    const raccoonAnimation = useLottieAnimation(
        `${cdnBase}/pages/home/RACCOON_CAR-ANIM_01_v01.json`,
    );
    const rocketLearnIdle = useLottieAnimation(`${cdnBase}/pages/home/ROCKET_LEARN_IDLE_v01.json`);
    const rocketLearnLaunch = useLottieAnimation(
        `${cdnBase}/pages/home/ROCKET_LEARN_LAUNCH_v01.json`,
    );
    const rocketPlayIdle = useLottieAnimation(`${cdnBase}/pages/home/ROCKET_PLAY_IDLE_v01.json`);
    const rocketPlayLaunch = useLottieAnimation(
        `${cdnBase}/pages/home/ROCKET_PLAY_LAUNCH_v01.json`,
    );
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
            void navigate("/learn-to-play");
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
            void navigate("/character-selection");
        }, ROCKET_LAUNCH_DURATION * 1000);
    }

    return (
        <div id="LandingPage">
            <div className="spacer" />
            <div className="mountain-background">
                {starsAnimation && (
                    <Lottie
                        animationData={starsAnimation}
                        loop
                        autoplay
                        className="stars-animation"
                    />
                )}
                {raccoonAnimation && (
                    <Lottie
                        animationData={raccoonAnimation}
                        loop
                        autoplay
                        className="raccoon-animation"
                    />
                )}
                <div className="logo" />
                <div
                    className={`learn-to-play-rocket ${learn_to_play_launching ? "launch" : ""}`}
                    onClick={learnToPlay}
                >
                    {learn_to_play_launching && rocketLearnLaunch ? (
                        <Lottie
                            animationData={rocketLearnLaunch}
                            loop={false}
                            autoplay
                            className="rocket-animation"
                        />
                    ) : (
                        rocketLearnIdle && (
                            <Lottie
                                animationData={rocketLearnIdle}
                                loop
                                autoplay
                                className="rocket-animation"
                            />
                        )
                    )}
                </div>

                <div className={`play-rocket ${play_launching ? "launch" : ""}`} onClick={play}>
                    {play_launching && rocketPlayLaunch ? (
                        <Lottie
                            animationData={rocketPlayLaunch}
                            loop={false}
                            autoplay
                            className="rocket-animation"
                        />
                    ) : (
                        rocketPlayIdle && (
                            <Lottie
                                animationData={rocketPlayIdle}
                                loop
                                autoplay
                                className="rocket-animation"
                            />
                        )
                    )}
                </div>
            </div>
            <div className="spacer" />
        </div>
    );
}

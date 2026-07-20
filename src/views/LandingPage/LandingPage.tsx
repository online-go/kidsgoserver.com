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

// The v03 launch compositions animate their own liftoff: ignition at ~1.6s,
// craft fully off-canvas by ~4.3s, smoke synced to match.
const ROCKET_NAVIGATE_DELAY = 4.5; // seconds
let navigate_timeout;

interface RocketAnimations {
    idleBase: object | null;
    idleSmoke: object | null;
    idleCraft: object | null;
    idleCraftHover: object | null;
    launchBase: object | null;
    launchSmoke: object | null;
    launchCraft: object | null;
    popup: object | null;
}

function useRocketAnimations(cdnBase: string, rocket: "PLAY" | "LEARN"): RocketAnimations {
    return {
        idleBase: useLottieAnimation(`${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_BASE_v03.json`),
        idleSmoke: useLottieAnimation(`${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_SMOKE_v03.json`),
        idleCraft: useLottieAnimation(`${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_CRAFT_v03.json`),
        idleCraftHover: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_CRAFT_HOVER_v03.json`,
        ),
        launchBase: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_BASE_v03.json`,
        ),
        launchSmoke: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_SMOKE_v03.json`,
        ),
        launchCraft: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_CRAFT_v03.json`,
        ),
        popup: useLottieAnimation(`${cdnBase}/pages/home/HOME_POP-UP_${rocket}_ANIM_v02.json`),
    };
}

function Rocket({
    className,
    animations,
    launching,
    onClick,
    onHoverChange,
}: {
    className: string;
    animations: RocketAnimations;
    launching: boolean;
    onClick: () => void;
    onHoverChange: (hovering: boolean) => void;
}): JSX.Element {
    const [hovering, set_hovering_state] = React.useState(false);
    function set_hovering(tf: boolean) {
        set_hovering_state(tf);
        onHoverChange(tf);
    }
    const idleCraft =
        hovering && animations.idleCraftHover ? animations.idleCraftHover : animations.idleCraft;

    return (
        <div
            className={className}
            onClick={onClick}
            onMouseEnter={() => set_hovering(true)}
            onMouseLeave={() => set_hovering(false)}
        >
            {launching ? (
                <>
                    {animations.launchSmoke && (
                        <Lottie
                            animationData={animations.launchSmoke}
                            loop={false}
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                    {animations.launchBase && (
                        <Lottie
                            animationData={animations.launchBase}
                            loop={false}
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                    {animations.launchCraft && (
                        <Lottie
                            animationData={animations.launchCraft}
                            loop={false}
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                </>
            ) : (
                <>
                    {animations.idleSmoke && (
                        <Lottie
                            animationData={animations.idleSmoke}
                            loop
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                    {animations.idleBase && (
                        <Lottie
                            animationData={animations.idleBase}
                            loop
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                    {idleCraft && (
                        <Lottie
                            animationData={idleCraft}
                            loop
                            autoplay
                            className="rocket-animation"
                        />
                    )}
                </>
            )}
        </div>
    );
}

export function LandingPage(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const cdnBase = window["cdn_service"] + "/" + window["kidsgo_release"];
    const starsAnimation = useLottieAnimation(`${cdnBase}/pages/home/STARS_ANIM_01_v01.json`);
    const raccoonAnimation = useLottieAnimation(
        `${cdnBase}/pages/home/RACCOON_CAR-ANIM_IDLE_01_v03.json`,
    );
    const learnAnimations = useRocketAnimations(cdnBase, "LEARN");
    const playAnimations = useRocketAnimations(cdnBase, "PLAY");
    const [learn_to_play_launching, set_learn_to_play_launching]: [boolean, (tf: boolean) => void] =
        React.useState(false as boolean);
    const [play_launching, set_play_launching]: [boolean, (tf: boolean) => void] = React.useState(
        false as boolean,
    );
    const [learn_hovering, set_learn_hovering] = React.useState(false);
    const [play_hovering, set_play_hovering] = React.useState(false);

    function launch(
        launching: boolean,
        other_launching: boolean,
        set_launching: (tf: boolean) => void,
        set_other_launching: (tf: boolean) => void,
        destination: string,
    ) {
        if (launching) {
            return;
        }
        if (other_launching) {
            set_other_launching(false);
            if (navigate_timeout) {
                clearTimeout(navigate_timeout);
            }
        }

        kidsgo_sfx.play("rocket");
        set_launching(true);

        navigate_timeout = setTimeout(() => {
            void navigate(destination);
        }, ROCKET_NAVIGATE_DELAY * 1000);
    }

    function learnToPlay() {
        launch(
            learn_to_play_launching,
            play_launching,
            set_learn_to_play_launching,
            set_play_launching,
            "/learn-to-play",
        );
    }

    function play() {
        launch(
            play_launching,
            learn_to_play_launching,
            set_play_launching,
            set_learn_to_play_launching,
            "/character-selection",
        );
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
                {learn_hovering && !learn_to_play_launching && learnAnimations.popup && (
                    <Lottie
                        animationData={learnAnimations.popup}
                        loop={false}
                        autoplay
                        className="rocket-popup learn-popup"
                    />
                )}
                {play_hovering && !play_launching && playAnimations.popup && (
                    <Lottie
                        animationData={playAnimations.popup}
                        loop={false}
                        autoplay
                        className="rocket-popup play-popup"
                    />
                )}
                <Rocket
                    className="learn-to-play-rocket"
                    animations={learnAnimations}
                    launching={learn_to_play_launching}
                    onClick={learnToPlay}
                    onHoverChange={set_learn_hovering}
                />
                <Rocket
                    className="play-rocket"
                    animations={playAnimations}
                    launching={play_launching}
                    onClick={play}
                    onHoverChange={set_play_hovering}
                />
            </div>
            <div className="spacer" />
        </div>
    );
}

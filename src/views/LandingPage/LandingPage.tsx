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
import Lottie, { LottieRefCurrentProps } from "lottie-react";

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

// The v04 launch compositions animate their own liftoff: ignition at ~1.6s,
// craft fully off-canvas by ~4.3s, smoke synced to match. We skip the first
// chunk of that pre-liftoff pause so the rocket reacts faster to the click.
const LAUNCH_SKIP_FRAMES = 40; // 60fps composition frames
// After the rocket has flown off-canvas we hand off to the cutscene overlay
// (airlock -> video -> skip) rather than navigating straight to the page.
const ROCKET_NAVIGATE_DELAY = 3.8; // seconds; ~4.5s full sequence minus the skip
// Skip button: the "in" animation runs frames 0-35, then it idles by looping
// frames 35-176 (matches the After Effects loop expression from the animator).
const SKIP_INTRO_END = 35;
const SKIP_LOOP_END = 176;
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
    // True once the idle layers that show during the dark intro are all loaded.
    ready: boolean;
}

function useRocketAnimations(cdnBase: string, rocket: "PLAY" | "LEARN"): RocketAnimations {
    const idleBase = useLottieAnimation(
        `${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_BASE_v03.json`,
    );
    const idleSmoke = useLottieAnimation(
        `${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_SMOKE_v03.json`,
    );
    const idleCraft = useLottieAnimation(
        `${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_CRAFT_${
            rocket === "PLAY" ? "v04" : "v03"
        }.json`,
    );
    return {
        idleBase,
        idleSmoke,
        idleCraft,
        idleCraftHover: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_IDLE_CRAFT_HOVER_v03.json`,
        ),
        launchBase: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_BASE_v04.json`,
        ),
        launchSmoke: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_SMOKE_v04.json`,
        ),
        launchCraft: useLottieAnimation(
            `${cdnBase}/pages/home/ROCKET_${rocket}_LAUNCH_CRAFT_v04.json`,
        ),
        popup: useLottieAnimation(`${cdnBase}/pages/home/HOME_POP-UP_${rocket}_ANIM_v02.json`),
        ready: !!idleBase && !!idleSmoke && !!idleCraft,
    };
}

function LaunchLayer({ data }: { data: object }): JSX.Element {
    const ref = React.useRef<LottieRefCurrentProps>(null);
    return (
        <Lottie
            lottieRef={ref}
            animationData={data}
            loop={false}
            autoplay
            onDOMLoaded={() => ref.current?.goToAndPlay(LAUNCH_SKIP_FRAMES, true)}
            className="rocket-animation"
        />
    );
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
                    {animations.launchSmoke && <LaunchLayer data={animations.launchSmoke} />}
                    {animations.launchBase && <LaunchLayer data={animations.launchBase} />}
                    {animations.launchCraft && <LaunchLayer data={animations.launchCraft} />}
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

// Full-screen overlay played after a rocket launches: the airlock transition
// loops while the (large) cutscene video buffers, then the video plays with a
// skip button overlaid. Skipping or the video ending navigates onward.
function Cutscene({
    variant,
    cdnBase,
    onDone,
}: {
    variant: "LEARN" | "PLAY";
    cdnBase: string;
    onDone: () => void;
}): JSX.Element {
    const airlock = useLottieAnimation(
        `${cdnBase}/pages/home/GFX_TRANSITION_AIRLOCK_${variant}_01_v04_loop.json`,
    );
    const skip = useLottieAnimation(`${cdnBase}/pages/home/BUTTON_SKIP_${variant}_v03.json`);
    const videoUrl = `${cdnBase}/pages/home/KidsGoServer_Animation_CUT-SCENE_${variant}_v06.mp4`;

    const skipRef = React.useRef<LottieRefCurrentProps>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const doneRef = React.useRef(false);

    const [phase, setPhase] = React.useState<"airlock" | "video">("airlock");
    const [videoReady, setVideoReady] = React.useState(false);
    const [airlockLooped, setAirlockLooped] = React.useState(false);

    function finish() {
        if (doneRef.current) {
            return;
        }
        doneRef.current = true;
        onDone();
    }

    // Leave the airlock only once the video can play through AND the airlock has
    // shown at least one full loop, so the hand-off never flashes or stalls.
    React.useEffect(() => {
        if (phase === "airlock" && videoReady && airlockLooped) {
            setPhase("video");
        }
    }, [phase, videoReady, airlockLooped]);

    // Safety net: never loop the airlock forever. Once it has shown a loop, give
    // the video a few seconds to buffer, then advance regardless (play() keeps
    // buffering). If the video can't load at all, skip straight to the page.
    React.useEffect(() => {
        if (!airlockLooped) {
            return;
        }
        const t = setTimeout(() => setVideoReady(true), 5000);
        return () => clearTimeout(t);
    }, [airlockLooped]);

    React.useEffect(() => {
        if (phase !== "video" || !videoRef.current) {
            return;
        }
        const el = videoRef.current;
        el.play().catch(() => {
            // Autoplay-with-sound can be blocked this far from the click; fall
            // back to a muted play so the cutscene still runs.
            el.muted = true;
            void el.play().catch(() => undefined);
        });
    }, [phase]);

    return (
        <div className="cutscene-overlay">
            {phase === "airlock" && airlock && (
                <Lottie
                    animationData={airlock}
                    loop
                    autoplay
                    onLoopComplete={() => setAirlockLooped(true)}
                    className="cutscene-square"
                />
            )}
            <video
                ref={videoRef}
                src={videoUrl}
                preload="auto"
                playsInline
                onCanPlayThrough={() => setVideoReady(true)}
                onEnded={finish}
                onError={finish}
                className={`cutscene-square cutscene-video ${phase === "video" ? "visible" : ""}`}
            />
            {phase === "video" && skip && (
                <div className="cutscene-square cutscene-skip" onClick={finish}>
                    <Lottie
                        lottieRef={skipRef}
                        animationData={skip}
                        loop
                        autoplay={false}
                        onDOMLoaded={() =>
                            skipRef.current?.playSegments(
                                [
                                    [0, SKIP_INTRO_END],
                                    [SKIP_INTRO_END, SKIP_LOOP_END],
                                ],
                                true,
                            )
                        }
                        className="cutscene-square"
                    />
                </div>
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
    const titleIntro = useLottieAnimation(`${cdnBase}/pages/home/TITLE_01_INTRO-ANIM_v02.json`);
    const titleIdle = useLottieAnimation(`${cdnBase}/pages/home/TITLE_01_IDLE_v02.json`);
    const [title_intro_done, set_title_intro_done] = React.useState(false);
    const learnAnimations = useRocketAnimations(cdnBase, "LEARN");
    const playAnimations = useRocketAnimations(cdnBase, "PLAY");
    const [learn_to_play_launching, set_learn_to_play_launching]: [boolean, (tf: boolean) => void] =
        React.useState(false as boolean);
    const [play_launching, set_play_launching]: [boolean, (tf: boolean) => void] = React.useState(
        false as boolean,
    );
    const [learn_hovering, set_learn_hovering] = React.useState(false);
    const [play_hovering, set_play_hovering] = React.useState(false);
    // Once a rocket has flown off, this holds the cutscene to play before we
    // land on the destination page.
    const [cutscene, set_cutscene] = React.useState<{
        variant: "LEARN" | "PLAY";
        destination: string;
    } | null>(null);

    // Gate the whole intro on every asset being ready so that on refresh the
    // scene never flashes a fully-lit raccoon before the dark-to-bright intro
    // plays. Until this is true we render nothing; once true, everything mounts
    // at once and the title intro + brightening start together.
    const assets_ready =
        !!starsAnimation &&
        !!raccoonAnimation &&
        !!titleIntro &&
        !!titleIdle &&
        learnAnimations.ready &&
        playAnimations.ready;

    function launch(
        launching: boolean,
        other_launching: boolean,
        set_launching: (tf: boolean) => void,
        set_other_launching: (tf: boolean) => void,
        variant: "LEARN" | "PLAY",
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
            set_cutscene({ variant, destination });
        }, ROCKET_NAVIGATE_DELAY * 1000);
    }

    function learnToPlay() {
        launch(
            learn_to_play_launching,
            play_launching,
            set_learn_to_play_launching,
            set_play_launching,
            "LEARN",
            "/learn-to-play",
        );
    }

    function play() {
        launch(
            play_launching,
            learn_to_play_launching,
            set_play_launching,
            set_learn_to_play_launching,
            "PLAY",
            "/character-selection",
        );
    }

    return (
        <div id="LandingPage">
            <div className="spacer" />
            <div className="mountain-background">
                {assets_ready && (
                    <div className={`scene ${title_intro_done ? "" : "intro-darkened"}`}>
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
                )}
                {assets_ready &&
                    (title_intro_done ? (
                        <Lottie
                            animationData={titleIdle}
                            loop
                            autoplay
                            className="title-animation"
                        />
                    ) : (
                        <Lottie
                            animationData={titleIntro}
                            loop={false}
                            autoplay
                            onComplete={() => set_title_intro_done(true)}
                            className="title-animation"
                        />
                    ))}
            </div>
            <div className="spacer" />
            {cutscene && (
                <Cutscene
                    variant={cutscene.variant}
                    cdnBase={cdnBase}
                    onDone={() => void navigate(cutscene.destination)}
                />
            )}
        </div>
    );
}

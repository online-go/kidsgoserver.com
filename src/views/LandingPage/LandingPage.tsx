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
import { hide_loading_screen } from "@kidsgo/lib/loading-screen";
import { uiClassToRaceIdx, avatar_background_class } from "@kidsgo/components/Avatar";
import { useUser } from "@/lib/hooks";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { MatteVideo } from "@kidsgo/components/MatteVideo";
import { playAirlockTransition } from "@kidsgo/components/AirlockTransition";

const animationCache = new Map<string, object>();

// Warms destination-page CSS background art, which the browser would otherwise
// only fetch on render. The map holds the Image handles so in-flight loads
// can't be garbage collected.
const preloaded_images = new Map<string, HTMLImageElement>();
function preload_image(url: string) {
    if (preloaded_images.has(url)) {
        return;
    }
    const img = new Image();
    img.src = url;
    preloaded_images.set(url, img);
}

// Shared so preload_animation and useLottieAnimation don't each fetch the same
// path before the first lands in animationCache.
const pendingAnimations = new Map<string, Promise<object>>();
function loadAnimation(path: string): Promise<object> {
    const cached = animationCache.get(path);
    if (cached) {
        return Promise.resolve(cached);
    }
    let pending = pendingAnimations.get(path);
    if (!pending) {
        pending = fetch(path, { credentials: "omit" })
            .then((r) => r.json())
            .then((data: object) => {
                animationCache.set(path, data);
                return data;
            })
            .finally(() => pendingAnimations.delete(path));
        pendingAnimations.set(path, pending);
    }
    return pending;
}

// Warm the cache ahead of the component that needs the animation.
function preload_animation(path: string) {
    loadAnimation(path).catch(() => {
        // The consuming component will retry and log.
    });
}

function useLottieAnimation(path: string): object | null {
    const [animation, setAnimation] = React.useState<object | null>(
        animationCache.get(path) ?? null,
    );
    React.useEffect(() => {
        let cancelled = false;
        loadAnimation(path)
            .then((data) => {
                if (!cancelled) {
                    setAnimation(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error(err);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [path]);
    return animation;
}

// The launch compositions animate their own liftoff (ignition ~1.6s, off-canvas
// by ~4.3s). We skip part of that pre-liftoff pause so the rocket reacts faster
// to the click.
const LAUNCH_SKIP_FRAMES = 40; // 60fps composition frames
// After the rocket has flown off-canvas we hand off to the cutscene overlay
// (video with skip button -> airlock door transition) rather than navigating
// straight to the page.
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
    popupVideo: string;
    // True once the idle layers that show during the dark intro are all loaded.
    ready: boolean;
}

function useRocketAnimations(cdnBase: string, rocket: "PLAY" | "LEARN"): RocketAnimations {
    const popupVideo = `${cdnBase}/pages/home/HOME_POP-UP_${rocket}_ANIM_v03_stacked.mp4`;
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
        popupVideo,
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
    popupClassName,
    popupShowing,
    animations,
    launching,
    onClick,
    onHoverChange,
}: {
    className: string;
    popupClassName: string;
    popupShowing: boolean;
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
            <MatteVideo
                src={animations.popupVideo}
                playing={popupShowing}
                className={`rocket-popup ${popupClassName} ${popupShowing ? "visible" : ""}`}
            />
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

// Full-screen overlay played after a rocket launches: video (with skip button)
// -> airlock doors close -> navigate while shut -> doors open on the
// destination page. Mounted hidden (`active` false) at rocket-click so its
// assets load during the launch animation.
function Cutscene({
    variant,
    cdnBase,
    active,
    onDone,
}: {
    variant: "LEARN" | "PLAY";
    cdnBase: string;
    active: boolean;
    onDone: () => void;
}): JSX.Element {
    const airlock = useLottieAnimation(
        `${cdnBase}/pages/home/GFX_TRANSITION_AIRLOCK_${variant}_01_v04_loop.json`,
    );
    const skip = useLottieAnimation(`${cdnBase}/pages/home/BUTTON_SKIP_${variant}_v03.json`);
    const videoUrl = `${cdnBase}/pages/home/KidsGoServer_Animation_CUT-SCENE_${variant}_v07.mp4`;

    const skipRef = React.useRef<LottieRefCurrentProps>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const doneRef = React.useRef(false);
    const airlockStartedRef = React.useRef(false);

    const [phase, setPhase] = React.useState<"video" | "airlock">("video");
    const [videoFailed, setVideoFailed] = React.useState(false);

    function finish() {
        if (doneRef.current) {
            return;
        }
        doneRef.current = true;
        onDone();
    }

    // Video ended, skipped, or failed: hand off to the airlock doors.
    function endVideo() {
        if (phase === "airlock") {
            return;
        }
        videoRef.current?.pause();
        setPhase("airlock");
    }

    // Video load failure: skip to the airlock, but never while still hidden
    // behind the launch animation.
    React.useEffect(() => {
        if (active && videoFailed) {
            endVideo();
        }
    }, [active, videoFailed]);

    // Hand off to the global airlock overlay, which navigates while the doors
    // are shut. If the animation never loads, navigate anyway rather than
    // stranding the user on a black screen.
    React.useEffect(() => {
        if (phase !== "airlock" || airlockStartedRef.current) {
            return;
        }
        if (airlock) {
            airlockStartedRef.current = true;
            playAirlockTransition(airlock, finish);
            return;
        }
        const t = setTimeout(() => {
            // Settle before navigating, or a JSON arriving after this plays
            // the doors over the page we already navigated to.
            airlockStartedRef.current = true;
            finish();
        }, 3000);
        return () => clearTimeout(t);
    }, [phase, airlock]);

    React.useEffect(() => {
        if (!active || phase !== "video" || !videoRef.current) {
            return;
        }
        const el = videoRef.current;
        el.play().catch(() => {
            // Autoplay-with-sound can be blocked this far from the click; fall
            // back to a muted play so the cutscene still runs.
            el.muted = true;
            void el.play().catch(() => undefined);
        });
    }, [active, phase]);

    return (
        <div className={`cutscene-overlay ${active ? "" : "preloading"}`}>
            <video
                ref={videoRef}
                src={videoUrl}
                preload="auto"
                playsInline
                onEnded={endVideo}
                onError={() => setVideoFailed(true)}
                // Held through the airlock phase: the video is paused, not
                // reset, so its last frame stays behind the closing doors
                // instead of the overlay's black background.
                className={`cutscene-square cutscene-video ${
                    active && (phase === "video" || phase === "airlock") ? "visible" : ""
                }`}
            />
            {active && phase === "video" && skip && (
                <div className="cutscene-square cutscene-skip" onClick={endVideo}>
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
    const learn_popup_showing = learn_hovering && !learn_to_play_launching;
    const play_popup_showing = play_hovering && !play_launching;
    // Set at rocket-click so the cutscene preloads; it stays hidden until
    // cutscene_visible flips true once the rocket has flown off.
    const [cutscene, set_cutscene] = React.useState<{
        variant: "LEARN" | "PLAY";
        destination: string;
    } | null>(null);
    const [cutscene_visible, set_cutscene_visible] = React.useState(false);

    // Gated on every asset being ready, so a refresh never flashes a fully-lit
    // raccoon before the dark-to-bright intro plays.
    const assets_ready =
        !!starsAnimation &&
        !!raccoonAnimation &&
        !!titleIntro &&
        !!titleIdle &&
        learnAnimations.ready &&
        playAnimations.ready;
    // Fallback if an asset fetch fails: show whatever loaded rather than
    // leaving a blank page behind the removed loading screen.
    const [assets_timed_out, set_assets_timed_out] = React.useState(false);
    // Dropped while the cutscene covers it: the hidden scene's Lotties keep
    // animating and compete for the main thread, which made the transition
    // choppy on phones.
    const show_scene = (assets_ready || assets_timed_out) && !cutscene_visible;

    // kidsgo.tsx leaves the raccoon loading screen up for us; remove it only
    // once our animations are ready, so the intro never flashes bare blue.
    React.useEffect(() => {
        if (assets_ready) {
            hide_loading_screen();
            return;
        }
        const t = setTimeout(() => {
            set_assets_timed_out(true);
            hide_loading_screen();
        }, 10000);
        return () => clearTimeout(t);
    }, [assets_ready]);
    React.useEffect(() => hide_loading_screen, []);

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

        // Fetched now, not at Cutscene mount, so it isn't still in flight when
        // the video ends and the doors are needed.
        preload_animation(
            `${cdnBase}/pages/home/GFX_TRANSITION_AIRLOCK_${variant}_01_v04_loop.json`,
        );

        // Warm the destination page's CSS background art (paths mirror the
        // page .styl files) so it isn't laggy when we land on it.
        if (variant === "LEARN") {
            preload_image(`${cdnBase}/pages/lessons/planet.jpg`);
            preload_image(`${cdnBase}/pages/lessons/background.svg`);
        } else {
            const [race, idx] = uiClassToRaceIdx(user.ui_class);
            const bg_color = avatar_background_class(race).replace("bg-", "");
            preload_image(`${cdnBase}/backgrounds/${bg_color}.jpg`);
            preload_image(`${cdnBase}/avatars/${race}/${idx}.svg`);
        }

        // Mount the cutscene immediately (hidden) so its video buffers while
        // the launch animation plays, then reveal it once the rocket is gone.
        set_cutscene({ variant, destination });
        set_cutscene_visible(false);
        navigate_timeout = setTimeout(() => {
            set_cutscene_visible(true);
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
        <div id="LandingPage" className={show_scene && !title_intro_done ? "intro-darkened" : ""}>
            <div className="spacer" />
            <div className="mountain-background">
                {show_scene && (
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
                        <Rocket
                            className="learn-to-play-rocket"
                            popupClassName="learn-popup"
                            popupShowing={learn_popup_showing}
                            animations={learnAnimations}
                            launching={learn_to_play_launching}
                            onClick={learnToPlay}
                            onHoverChange={set_learn_hovering}
                        />
                        <Rocket
                            className="play-rocket"
                            popupClassName="play-popup"
                            popupShowing={play_popup_showing}
                            animations={playAnimations}
                            launching={play_launching}
                            onClick={play}
                            onHoverChange={set_play_hovering}
                        />
                    </div>
                )}
                {show_scene &&
                    (title_intro_done
                        ? titleIdle && (
                              <Lottie
                                  animationData={titleIdle}
                                  loop
                                  autoplay
                                  className="title-animation"
                              />
                          )
                        : titleIntro && (
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
                    key={cutscene.variant}
                    variant={cutscene.variant}
                    cdnBase={cdnBase}
                    active={cutscene_visible}
                    onDone={() => void navigate(cutscene.destination)}
                />
            )}
        </div>
    );
}

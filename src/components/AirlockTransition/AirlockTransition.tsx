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
import Lottie, { LottieRefCurrentProps } from "lottie-react";

// The compositions close over frames 0-24 and then hold; there is no authored
// opening, so the open is this segment reversed.
const CLOSE_END_FRAME = 24;

// At the composition's native 60fps the close + open runs 0.8s, which reads as
// a flicker rather than as doors. 0.4 stretches it to ~2s.
const AIRLOCK_SPEED = 0.4;

interface AirlockRequest {
    animationData: object;
    onClosed: () => void;
}

let submit_request: ((req: AirlockRequest) => void) | null = null;

/**
 * Play the full-screen airlock door transition. `onClosed` fires while the
 * doors are fully shut -- navigate there -- and they then open on whatever
 * replaced the page. Called immediately if the animation data is missing or
 * the overlay host isn't mounted, so the caller still navigates.
 */
export function playAirlockTransition(animationData: object | null, onClosed: () => void): void {
    if (!animationData || !submit_request) {
        onClosed();
        return;
    }
    submit_request({ animationData, onClosed });
}

// Mounted once above the router's page content, so the overlay survives the
// navigation that happens while the doors are shut.
export function AirlockTransition(): JSX.Element | null {
    const [request, setRequest] = React.useState<AirlockRequest | null>(null);
    const [phase, setPhase] = React.useState<"closing" | "opening">("closing");
    const lottieRef = React.useRef<LottieRefCurrentProps>(null);

    React.useEffect(() => {
        submit_request = (req) => {
            setPhase("closing");
            setRequest(req);
        };
        return () => {
            submit_request = null;
        };
    }, []);

    // Deferred one commit past onClosed(): mounting the destination page is
    // synchronous work on the thread Lottie animates on, so opening in the same
    // tick stuttered on slower devices. The shut doors hide the extra frame.
    React.useEffect(() => {
        if (phase !== "opening") {
            return;
        }
        const lottie = lottieRef.current;
        if (!lottie) {
            return;
        }
        // playSegments() resets playback state, so the speed has to be set
        // after it -- setting it first left the open running at native 60fps.
        lottie.playSegments([CLOSE_END_FRAME, 0], true);
        lottie.setSpeed(AIRLOCK_SPEED);
    }, [phase]);

    if (!request) {
        return null;
    }

    return (
        <div className="AirlockTransition">
            <Lottie
                lottieRef={lottieRef}
                animationData={request.animationData}
                loop={false}
                autoplay={false}
                onDOMLoaded={() => {
                    lottieRef.current?.playSegments([0, CLOSE_END_FRAME], true);
                    lottieRef.current?.setSpeed(AIRLOCK_SPEED);
                }}
                onComplete={() => {
                    if (phase === "closing") {
                        // Fully shut: swap the page underneath.
                        request.onClosed();
                        setPhase("opening");
                    } else {
                        setRequest(null);
                    }
                }}
                className="airlock-square"
            />
        </div>
    );
}

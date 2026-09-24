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

interface LessonCompleteProps {
    onReplay: () => void;
    onNext: () => void;
}

// The animated "Lesson Complete" axolotl, with Replay Lesson on the left and
// Next Lesson on the right fading in as the axolotl arrives.
export function LessonComplete({ onReplay, onNext }: LessonCompleteProps): JSX.Element {
    const base = `${cdnBase()}/pages/lessons/`;
    const complete = useLottieAnimation(
        base + "LEARN_CHAR-ANIM_AXOLOTL_01_LESSON-COMPLETE_v06.json",
    );
    const replay = useLottieAnimation(base + "PLAY_BUTTON_REPLAY_01_v01.json");
    const next = useLottieAnimation(base + "PLAY_BUTTON_NEXT_01_v01.json");

    return (
        <div className="LessonComplete">
            {complete && (
                <Lottie
                    animationData={complete}
                    loop={false}
                    autoplay
                    className="LessonComplete-animation"
                />
            )}
            <div className="LessonComplete-buttons">
                {replay && (
                    <div className="LessonComplete-button" onClick={onReplay}>
                        <Lottie animationData={replay} loop={false} autoplay />
                    </div>
                )}
                {next && (
                    <div className="LessonComplete-button" onClick={onNext}>
                        <Lottie animationData={next} loop={false} autoplay />
                    </div>
                )}
            </div>
        </div>
    );
}

// The big idle axolotl for mid-lesson axolotl pages (no celebration).
export function LessonAxolotl(): JSX.Element {
    const idle = useLottieAnimation(
        `${cdnBase()}/pages/lessons/LEARN_CHAR-ANIM_AXOLOTL_02_IDLE_v01.json`,
    );
    return (
        <div className="LessonAxolotl">
            {idle && (
                <Lottie animationData={idle} loop autoplay className="LessonAxolotl-animation" />
            )}
        </div>
    );
}

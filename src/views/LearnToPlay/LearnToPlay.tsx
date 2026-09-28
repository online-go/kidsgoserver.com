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
import { useNavigate } from "react-router-dom";
import { BackButton } from "@kidsgo/components/BackButton";
import Lottie from "lottie-react";
import { useLottieAnimation } from "@kidsgo/lib/lottie-loader";
import { SpaceBackground } from "@kidsgo/components/SpaceBackground";
//import { useState } from "react";
//import { Link } from "react-router-dom";
//import { _ } from "translate";
//import * as data from "data";
//import * as preferences from "preferences";
//import { errorAlerter, ignore } from "misc";

export function LearnToPlay(): JSX.Element {
    const navigate = useNavigate();
    // Composed on the same 1920px square as background_v2.svg, so rendering it at
    // the square's full size puts the axolotl in the airlock window.
    const cdnBase = window["cdn_service"] + "/" + window["kidsgo_release"];
    const axolotl = useLottieAnimation(
        `${cdnBase}/pages/lessons/LEARN_CHAR-ANIM_AXOLOTL_02_IDLE_v01.json`,
    );

    function back() {
        void navigate("/");
    }

    return (
        <div id="LearnToPlay">
            <SpaceBackground />
            <BackButton onClick={back} />
            <div className="HelpButton" onClick={() => navigate("/help")}></div>
            <div className="spacer" />
            <div className="background-container">
                <div className="back-background" />
                <div className="background">
                    {axolotl && (
                        <Lottie
                            animationData={axolotl}
                            loop
                            autoplay
                            className="axolotl-animation"
                        />
                    )}
                    <div
                        className="chapter-container chapter-1-container"
                        onClick={() => navigateToChapter(1, navigate)}
                    >
                        <ChapterButton chapter={1} />
                        <div className="chapter-text">Capturing</div>
                    </div>

                    <div
                        className="chapter-container chapter-2-container"
                        onClick={() => navigateToChapter(2, navigate)}
                    >
                        <ChapterButton chapter={2} />
                        <div className="chapter-text">Territory</div>
                    </div>

                    {/* Continue the same pattern for remaining chapters */}
                    <div
                        className="chapter-container chapter-3-container"
                        onClick={() => navigateToChapter(3, navigate)}
                    >
                        <ChapterButton chapter={3} />
                        <div className="chapter-text">Eyes</div>
                    </div>

                    <div
                        className="chapter-container chapter-4-container"
                        onClick={() => navigateToChapter(4, navigate)}
                    >
                        <ChapterButton chapter={4} />
                        <div className="chapter-text">Ko</div>
                    </div>

                    <div
                        className="chapter-container chapter-5-container"
                        onClick={() => navigateToChapter(5, navigate)}
                    >
                        <ChapterButton chapter={5} />
                        <div className="chapter-text">Reading</div>
                    </div>

                    <div
                        className="chapter-container chapter-6-container"
                        onClick={() => navigateToChapter(6, navigate)}
                    >
                        <ChapterButton chapter={6} />
                        <div className="chapter-text">Connecting</div>
                    </div>

                    <div
                        className="chapter-container chapter-7-container"
                        onClick={() => navigateToChapter(7, navigate)}
                    >
                        <ChapterButton chapter={7} />
                        <div className="chapter-text">Scoring</div>
                    </div>

                    <div
                        className="chapter-container chapter-8-container"
                        onClick={() => navigateToChapter(8, navigate)}
                    >
                        <ChapterButton chapter={8} />
                        <div className="chapter-text">Problems</div>
                    </div>
                </div>
            </div>
            <div className="spacer" />
        </div>
    );
}

function navigateToChapter(chapter: number, navigate) {
    const last_visited_lesson_8_page = localStorage.getItem("last-visited-lesson-8-page");

    if (chapter < 8) {
        navigate(`/learn-to-play/${chapter}`);
    } else if (chapter === 8 && last_visited_lesson_8_page != null) {
        navigate(last_visited_lesson_8_page);
    } else if (chapter === 8) {
        navigate(`/learn-to-play/8/problems/capturing/1`);
    }
}

// Purely visual: the enclosing .chapter-container handles the click, so the
// hit area doesn't grow with the stone's hover scale.
export function ChapterButton({ chapter }: { chapter: number }): JSX.Element {
    return <span className={"ChapterButton" + ` chapter-${chapter}`}>{chapter}</span>;
}

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
import { useResizeDetector } from "react-resize-detector";
import { useState, useEffect, useRef, useCallback } from "react";
import { Content } from "./Content";
import { Link } from "react-router-dom";
import { _ } from "@/lib/translate";
import { decodeMoves, Goban, GobanCanvas, GobanConfig, prettyCoordinates } from "goban";
import { Racoon } from "@kidsgo/components/Racoon";
import { setContentNavigate } from "./Content";
import { PersistentElement } from "@/components/PersistentElement";
import { useNavigate } from "react-router-dom";
import { animateCaptures } from "@kidsgo/lib/animateCaptures";
import { BackButton } from "@kidsgo/components/BackButton";
import { sfx } from "@/lib/sfx";
import { sectionDisplayNames, sectionKeys, puzzleSectionMap } from "./PuzzleSections";

export function Puzzles({
    puzzles,
    sectionName,
    puzzleNumber,
}: {
    puzzles: Array<typeof Content>;
    sectionName: string;
    puzzleNumber: number;
}): JSX.Element {
    const navigate = useNavigate();
    setContentNavigate(useNavigate());

    const currentSectionIndex = sectionKeys.findIndex(
        (key) => key.toLowerCase() === sectionName.toLowerCase(),
    );

    const maxPuzzlesInCurrentSection = puzzles.length;

    let next;
    if (puzzleNumber + 1 < maxPuzzlesInCurrentSection) {
        // puzzleNumber is 0-indexed internally, +2 for URL (convert to 1-index and increment)
        next = `/learn-to-play/8/problems/${sectionName}/${puzzleNumber + 2}`;
    } else {
        // At last puzzle, move to next section or back to main page
        if (currentSectionIndex < sectionKeys.length - 1) {
            const nextSectionKey = sectionKeys[currentSectionIndex + 1];
            next = `/learn-to-play/8/problems/${nextSectionKey}/1`;
        } else {
            next = "/learn-to-play";
        }
    }
    let back;
    if (puzzleNumber > 0) {
        back = `/learn-to-play/8/problems/${sectionName}/${puzzleNumber}`;
    } else {
        // At first puzzle, go to previous section's last puzzle or main page
        if (currentSectionIndex > 0) {
            const prevSectionKey = sectionKeys[currentSectionIndex - 1];
            const prevSectionPuzzles = puzzleSectionMap[prevSectionKey];
            back = `/learn-to-play/8/problems/${prevSectionKey}/${prevSectionPuzzles.length}`;
        } else {
            // Pretty bad to be hard coded here, as if we add or remove pages from lesson 7, it won't go to the last page
            back = "/learn-to-play/7/19";
        }
    }

    const [container, _setContainer] = useState(document.createElement("div"));
    const goban_ref = useRef<Goban>(null);
    const cancel_animation_ref = useRef<() => void>(() => {});
    const audioRef = useRef<HTMLAudioElement>(null);
    const goban_opts_ref = useRef<any>({});
    const [text, setText]: [Array<JSX.Element>, (x: Array<JSX.Element>) => void] = useState<
        Array<JSX.Element>
    >([]);
    const [_hup, hup]: [number, (x: number) => void] = useState<number>(Math.random());
    const [replay, setReplay]: [number, (x: number) => void] = useState<number>(Math.random());
    const [showAxotol, setShowAxotol]: [boolean, (x: boolean) => void] = useState<boolean>(false);
    const [hidePlayButton, setHidePlayButton]: [boolean, (x: boolean) => void] =
        useState<boolean>(false);
    const [hintsOn, setHintsOn] = useState(false);

    const onResize = useCallback((width, height) => {
        const goban = goban_ref.current;
        if (goban) {
            const target_size = Math.min(width, height) - 60; // white padding border

            if (isNaN(target_size)) {
                hup(Math.random());
                return;
            }
            goban.setSquareSizeBasedOnDisplayWidth(target_size);
        }
    }, []);
    const board_container_resizer = useResizeDetector({
        onResize,
        refreshMode: "throttle",
        refreshOptions: {
            leading: true,
            trailing: true,
        },
        refreshRate: 10,
    });

    const displaySectionName = sectionDisplayNames[sectionName] || "";

    const sectionList = Object.entries(sectionDisplayNames).map(([key, value]) => (
        <div
            key={key}
            className={`section-link ${value === displaySectionName ? "active-section" : ""}`}
            onClick={() => navigate(`/learn-to-play/8/problems/${key}/1`)}
        >
            {value}
        </div>
    ));

    const removeHints = () => {
        const goban: Goban = goban_ref.current;
        const move = goban.engine.cur_move;
        move.branches.forEach((item) => goban.deleteCustomMark(item.x, item.y, "hint", true));
        setHintsOn(false);
    };

    const showHint = () => {
        const goban: Goban = goban_ref.current;

        if (hintsOn) {
            removeHints();
        } else if (!goban.engine.cur_move.correct_answer) {
            const branches = goban.engine.cur_move.findBranchesWithCorrectAnswer();
            branches.forEach((branch) => {
                goban.setCustomMark(branch.x, branch.y, "hint", true);
            });
            setHintsOn(true);
        }
    };

    useEffect(() => {
        console.log("Constructing puzzle", displaySectionName, puzzleNumber);
        const content = new puzzles[puzzleNumber]();
        let ct = 0;

        const target_text: Array<JSX.Element> = (
            Array.isArray(content.text()) ? content.text() : [content.text()]
        ) as Array<JSX.Element>;

        const animation = content.animate(() => {
            setText(target_text.slice(0, ct++));
            return target_text.length >= ct;
        }, 0);
        cancel_animation_ref.current = () => {
            animation.cancel();
            setText(target_text);
        };

        if (content.hidePlayButton()) {
            setHidePlayButton(true);
        } else {
            setHidePlayButton(false);
        }

        if (content.axolotlFace()) {
            setShowAxotol(true);
            return;
        } else {
            setShowAxotol(false);
        }

        const content_config = content.config();
        const opts: GobanConfig = Object.assign(
            {
                board_div: container || undefined,
                interactive: true,
                mode: "puzzle",
                width: 9,
                height: 9,
                circle_radius: 0.45,
                draw_top_labels: false,
                draw_right_labels: false,
                draw_left_labels: false,
                draw_bottom_labels: false,
                player_id: 0,
                server_socket: null,
                square_size: "auto",
                dont_draw_last_move: true,

                puzzle_opponent_move_mode: "automatic",
                puzzle_player_move_mode: "free",
                getPuzzlePlacementSetting: () => {
                    return { mode: "play" };
                },
            },
            content_config,
        ) as GobanConfig;

        goban_opts_ref.current = opts;
        console.log(opts);
        goban_ref.current = new GobanCanvas(opts);
        const goban: Goban = goban_ref.current;
        // This triggers the same re-render that the replay button does, and we pass this down to the Module classes where the puzzles are
        content.resetGoban = () => setReplay(Math.random());

        content.setGoban(goban);
        content.setNext(next);

        console.log("Listening for capturing");
        goban.on("captured-stones", ({ removed_stones }) => {
            console.log("Animating captures", removed_stones);
            animateCaptures(
                removed_stones,
                goban,
                (content_config as any)
                    ? goban.engine.colorToMove()
                    : goban.engine.colorNotToMove(),
            );
        });

        goban.on("audio-stone", (stone) =>
            sfx.playStonePlacementSound(stone.x, stone.y, stone.width, stone.height, stone.color),
        );

        goban.on("puzzle-correct-answer", () => {
            console.log("CORRECT!");
            goban.disableStonePlacement();
        });
        goban.on("puzzle-wrong-answer", () => {
            console.log("WRONG");
            goban.disableStonePlacement();
        });
        goban.on("error", () => {
            console.log("ERROR");
        });

        goban.setMode("puzzle");
        try {
            onResize(board_container_resizer.width, board_container_resizer.height);
        } catch (e) {
            setTimeout(() => {
                onResize(board_container_resizer.width, board_container_resizer.height);
            }, 1);
        }

        const onUpdate = () => {
            const mvs = decodeMoves(
                goban.engine.cur_move.getMoveStringToThisPoint(),
                goban.width,
                goban.height,
            );
            const move_string = mvs.map((p) => prettyCoordinates(p.x, p.y, goban.height)).join(",");
            console.log("Move string: ", move_string);
            removeHints();
        };

        goban.on("update", onUpdate);
        window["global_goban"] = goban;

        let t = setTimeout(() => {
            t = null;
            if (board_container_resizer.ref.current) {
                console.log(board_container_resizer.ref.current);
                const w = board_container_resizer.ref.current.clientWidth;
                const h = board_container_resizer.ref.current.clientHeight;
                onResize(w, h);
            }
        }, 10);

        const animation_interval = setInterval(() => {
            goban.redraw();
        }, 100);

        return () => {
            content.destroy();
            console.log(`puzzle ${displaySectionName} ${puzzleNumber} teardown`);
            if (t) {
                clearTimeout(t);
            }
            setText([]);
            goban_ref.current.destroy();
            goban_ref.current = null;
            goban_opts_ref.current = null;
            clearTimeout(animation_interval);
            hup(Math.random());
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [puzzles, sectionName, puzzleNumber, replay]);

    return (
        <>
            <div id="Lesson" className="bg-blue">
                <div className="landscape-top-spacer">
                    <div className="lesson-title">
                        {/* 0 indexed puzzleNumber */}
                        {displaySectionName} Problem {puzzleNumber + 1}: Blue to play
                    </div>
                </div>
                <div id="Lesson-bottom-container">
                    <div id="left-container">
                        <div className="explanation-text" onClick={cancel_animation_ref.current}>
                            {/* {text} */}
                            <div className="puzzle-sections">
                                {/* <h3>Blue to play</h3> */}
                                <h3>Problem Sections</h3>
                                {sectionList}
                            </div>
                        </div>
                        <div className="bottom-graphic">
                            <button onClick={showHint}>Hint</button>
                        </div>
                    </div>

                    <div id="board-container" ref={board_container_resizer.ref}>
                        {showAxotol ? (
                            <div className="big-axol-container">
                                <div className={`Axol ${hidePlayButton ? "center" : ""}`} />
                                {hidePlayButton ? null : (
                                    <button onClick={() => navigate("/play")}>Play</button>
                                )}
                            </div>
                        ) : (
                            <div className="Goban-container">
                                <div className="Goban">
                                    <PersistentElement elt={container} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div id="right-container">
                        <div className="top-spacer" />
                        <Racoon hover />
                        <div className="landscape-bottom-buttons">
                            <Link
                                to={back}
                                className="game-button-container"
                                onClick={() => {
                                    removeHints();
                                }}
                            >
                                <span className="stone-button-left" />
                                <span className="button-text">Back</span>
                            </Link>
                            <span
                                className="game-button-container"
                                onClick={() => {
                                    setReplay(Math.random());
                                    removeHints();
                                }}
                            >
                                <span className="stone-button-refresh" />
                                <span className="button-text">Replay</span>
                            </span>
                            <Link
                                to={next}
                                className="game-button-container"
                                onClick={() => {
                                    removeHints();
                                }}
                            >
                                <span className="stone-button-right" />
                                <span className="button-text">next</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="portrait-bottom-buttons">
                    <div className="left">
                        <Link
                            to={back}
                            className="game-button-container"
                            onClick={() => {
                                removeHints();
                            }}
                        >
                            <span className="stone-button-left" />
                            <span className="button-text">Back</span>
                        </Link>
                    </div>

                    <div className="puzzle-center">
                        {displaySectionName} {puzzleNumber + 1}: Blue to play
                    </div>

                    <div className="right">
                        <Link
                            to={next}
                            className="game-button-container"
                            onClick={() => {
                                removeHints();
                            }}
                        >
                            <span className="stone-button-right" />
                            <span className="button-text">Next</span>
                        </Link>
                    </div>
                </div>
            </div>

            <BackButton onClick={() => navigate("/learn-to-play")} />

            <div id="portrait-replay">
                <span
                    className="stone-button-refresh"
                    onClick={() => {
                        setReplay(Math.random());
                        removeHints();
                    }}
                />
            </div>
        </>
    );
}

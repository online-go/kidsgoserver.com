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
import { Link } from "react-router-dom";
import { _ } from "translate";
import { Goban, GoMath, GobanConfig } from "goban";
import { Racoon } from "Racoon";
import { setContentNavigate } from "./Content";
import { chapters } from "./chapters";
import { PersistentElement } from "PersistentElement";
import { useNavigate } from "react-router-dom";
import { animateCaptures } from "animateCaptures";
import { BackButton } from "BackButton";
import { sfx } from "sfx";

export function Lesson({ chapter, page }: { chapter: number; page: number }): JSX.Element {
    const navigate = useNavigate();
    setContentNavigate(useNavigate());
    //const id:number = parseInt(this.props.match?.params?.id);
    let next = "/learn-to-play/";
    {
        let next_page = page + 1;
        let next_chapter = chapter;
        if (next_page >= chapters[chapter].length) {
            next_chapter += 1;
            next_page = 0;
        }
        if (next_chapter >= chapters.length) {
            next = "/learn-to-play/";
        } else {
            next = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
        }
    }
    let back = "/learn-to-play/";
    {
        let next_page = page - 1;
        let next_chapter = chapter;
        back = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
        if (next_page < 0) {
            if (next_chapter === 0) {
                back = "/learn-to-play";
            } else {
                next_chapter -= 1;
                next_page = chapters[next_chapter].length - 1;
                back = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
            }
        }
    }

    const [container, _setContainer] = useState(document.createElement("div"));
    const goban_ref = useRef<Goban>(null);
    const cancel_animation_ref = useRef<() => void>(() => {});
    const goban_opts_ref = useRef<any>({});
    const [text, setText]: [Array<JSX.Element>, (x: Array<JSX.Element>) => void] = useState<
        Array<JSX.Element>
    >([]);
    const [_hup, hup]: [number, (x: number) => void] = useState<number>(Math.random());
    const [replay, setReplay]: [number, (x: number) => void] = useState<number>(Math.random());
    const [showAxotol, setShowAxotol]: [boolean, (x: boolean) => void] = useState<boolean>(false);
    const [hidePlayButton, setHidePlayButton]: [boolean, (x: boolean) => void] =
        useState<boolean>(false);
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

    useEffect(() => {
        console.log("Constructing game ", chapter, page);
        const content = new chapters[chapter][page]();

        let ct = 0;

        const target_text: Array<JSX.Element> = (
            Array.isArray(content.text()) ? content.text() : [content.text()]
        ) as Array<JSX.Element>;

        const animation = content.animate(() => {
            setText(target_text.slice(0, ct++));
            return target_text.length >= ct;
        }, 0); // Remove 500ms animation and replace with 0ms animation for text field in left panel since we have the audio now
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
                width: 7,
                height: 7,
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
        goban_ref.current = new Goban(opts);
        const goban: Goban = goban_ref.current;
        content.setGoban(goban);
        content.setNext(next);

        console.log("Listening for capturing");
        goban.on("captured-stones", ({ removed_stones }) => {
            console.log("Animating captures", removed_stones);
            // I'm not really sure why we need this flip_animated_capture_color
            // thing to begin with, but at this point I just want things to
            // work.
            animateCaptures(
                removed_stones,
                goban,
                (content_config as any).flip_animated_capture_color
                    ? goban.engine.colorToMove()
                    : goban.engine.colorNotToMove(),
            );
        });

        goban.on("audio-stone", (stone) =>
            sfx.playStonePlacementSound(stone.x, stone.y, stone.width, stone.height, stone.color),
        );

        goban.on("puzzle-correct-answer", () => {
            console.log("CORRECT!");
            /*
                this.correct_answer_triggered = true;
                sfx.play("tutorial-pass");
                setTimeout(this.next, 1000);
                this.instructional_goban.goban.disableStonePlacement();
                this.forceUpdate();
                 */
            goban.disableStonePlacement();
        });
        goban.on("puzzle-wrong-answer", () => {
            console.log("WRONG");
            /*
                this.wrong_answer_triggered = true;
                sfx.play("tutorial-fail");
                this.instructional_goban.goban.disableStonePlacement();
                this.forceUpdate();
                 */
            goban.engine.place(-1, -1);
            //goban.disableStonePlacement();
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
            const mvs = GoMath.decodeMoves(
                goban.engine.cur_move.getMoveStringToThisPoint(),
                goban.width,
                goban.height,
            );
            const move_string = mvs
                .map((p) => GoMath.prettyCoords(p.x, p.y, goban.height))
                .join(",");
            console.log("Move string: ", move_string);
            //this.setState({ move_string });
        };

        goban.on("update", onUpdate);
        window["global_goban"] = goban;

        let t = setTimeout(() => {
            t = null;
            console.log(board_container_resizer.ref.current);
            const w = board_container_resizer.ref.current.clientWidth;
            const h = board_container_resizer.ref.current.clientHeight;
            onResize(w, h);
        }, 10);

        const animation_interval = setInterval(() => {
            goban.redraw();
        }, 100);

        return () => {
            content.destroy();
            console.log(`lesson ${chapter} ${page} teardown`);
            if (t) {
                clearTimeout(t);
            }
            setText([]);
            goban_ref.current.destroy();
            goban_ref.current = null;
            goban_opts_ref.current = null;
            clearTimeout(animation_interval);
            hup(Math.random());
        };
    }, [chapter, page, replay]);

    return (
        <>
            <div id="Lesson" className="bg-blue">
                <div className="landscape-top-spacer">
                    <div className="lesson-title">Lesson {chapter + 1}</div>
                </div>
                <div id="Lesson-bottom-container">
                    <div id="left-container">
                        <div className="explanation-text" onClick={cancel_animation_ref.current}>
                            {text.map((e, idx) => (
                                <div className="fade-in" key={idx}>
                                    {e}
                                </div>
                            ))}
                        </div>
                        <div className="bottom-graphic" />
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
                            <Link to={back} className="game-button-container">
                                <span className="stone-button-left" />
                                <span className="button-text">Back</span>
                            </Link>
                            <span
                                className="game-button-container"
                                onClick={() => setReplay(Math.random())}
                            >
                                <span className="stone-button-refresh" />
                                <span className="button-text">Replay</span>
                            </span>
                            <Link to={next} className="game-button-container">
                                <span className="stone-button-right" />
                                <span className="button-text">next</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="portrait-bottom-buttons">
                    <div className="left">
                        <Link to={back} className="game-button-container">
                            <span className="stone-button-left" />
                            <span className="button-text">Back</span>
                        </Link>
                    </div>

                    <div className="center">Lesson {chapter + 1}</div>

                    <div className="right">
                        <Link to={next} className="game-button-container">
                            <span className="stone-button-right" />
                            <span className="button-text">Next</span>
                        </Link>
                    </div>
                </div>
            </div>

            <BackButton onClick={() => navigate("/learn-to-play")} />

            <div id="portrait-replay">
                <span className="stone-button-refresh" onClick={() => setReplay(Math.random())} />
            </div>
        </>
    );
}

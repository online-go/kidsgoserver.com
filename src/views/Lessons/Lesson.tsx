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
import * as data from "data";
import * as preferences from "preferences";
import { useResizeDetector } from 'react-resize-detector';
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { _, interpolate } from "translate";
import { errorAlerter, ignore, navigateTo } from "misc";
import { Goban, GoMath, GobanConfig } from "goban";
import { Racoon } from 'Racoon';
import { Content } from './Content';
import { chapters } from './chapters';
import { PersistentElement } from 'PersistentElement';

export function Lesson({chapter, page}:{chapter:number, page:number}):JSX.Element {
    //const id:number = parseInt(this.props.match?.params?.id);
    let next = '/';
    {
        let next_page = page + 1;
        let next_chapter = chapter;
        if (next_page >= chapters[chapter].length) {
            next_chapter += 1;
            next_page = 0;
        }
        if (next_chapter >= chapters.length) {
            next = '/';
        } else {
            next = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
        }
    }
    let back = '/';
    {
        let next_page = page - 1;
        let next_chapter = chapter;
        back = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
        if (next_page < 0) {
            if (next_chapter === 0) {
                back = '/learn-to-play';
            } else {
                next_chapter -= 1;
                next_page = chapters[next_chapter].length - 1;
                back = `/learn-to-play/${next_chapter + 1}/${next_page + 1}`;
            }
        }
    }

    let [container, setContainer] = useState(document.createElement("div"));
    let goban_ref = useRef<Goban>(null);
    let cancel_animation_ref = useRef<() => void>(() => {});
    let goban_opts_ref = useRef<any>({});
    let [text, setText]: [Array<JSX.Element>, (x:Array<JSX.Element>) => void] = useState<Array<JSX.Element>>([]);
    let [_hup, hup]: [number, (x:number) => void] = useState<number>(Math.random());
    const onResize = useCallback((width, height) => {
        let goban = goban_ref.current;
        if (goban) {
            let target_size = Math.min(width, height) - 60; // white padding border

            if (isNaN(target_size)) {
                hup(Math.random());
                return;
            }
            goban.setSquareSizeBasedOnDisplayWidth(target_size);
        }
    }, []);
    const board_container_resizer =  useResizeDetector({
        onResize,
        refreshMode: 'throttle',
        refreshOptions: {
            leading: true,
            trailing: true,
        },
        refreshRate: 10,
    });



    useEffect(() => {
        console.log("Constructing game ", chapter, page);
        let content = new chapters[chapter][page];

        let ct = 0;

        let target_text:Array<JSX.Element> = (Array.isArray(content.text()) ? content.text() : [content.text()]) as Array<JSX.Element>;

        let animation = content.animate(() => {
            setText(target_text.slice(0, ct++));
            return target_text.length >= ct;
        }, 500);
        cancel_animation_ref.current = () => {
            animation.cancel();
            setText(target_text);
        };

        let opts:GobanConfig = Object.assign({
            "board_div": container || undefined,
            "interactive": true,
            "mode": "puzzle",
            "width": 7,
            "height": 7,
            "draw_top_labels": false,
            "draw_right_labels": false,
            "draw_left_labels": false,
            "draw_bottom_labels": false,
            "player_id": 0,
            "server_socket": null,
            "square_size": "auto",

            "puzzle_opponent_move_mode": "automatic",
            "puzzle_player_move_mode": "free",
            "getPuzzlePlacementSetting": () => {
                return {"mode": "play"};
            },

        }, content.config()) as GobanConfig;

        goban_opts_ref.current = opts;
        console.log(opts);
        console.log("BUILDING NEW GOBAN");
        goban_ref.current = new Goban(opts);
        let goban:Goban = goban_ref.current;
        content.setGoban(goban);
        content.setNext(next);

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

        let onUpdate = () => {
            let mvs = GoMath.decodeMoves(
                goban.engine.cur_move.getMoveStringToThisPoint(),
                goban.width,
                goban.height);
            let move_string = mvs.map((p) => GoMath.prettyCoords(p.x, p.y, goban.height)).join(",");
            console.log("Move string: ", move_string);
            //this.setState({ move_string });
        };

        goban.on("update", onUpdate);
        window["global_goban"] = goban;

        let t = setTimeout(() => {
            t = null;
            console.log(board_container_resizer.ref.current);
            let w = board_container_resizer.ref.current.clientWidth;
            let h = board_container_resizer.ref.current.clientHeight;
            onResize(w, h);
        }, 10);

        return () => {
            content.destroy();
            console.log(`lesson ${chapter} ${page} teardown`);
            if (t) {
                clearTimeout(t);
            }
            goban_ref.current.destroy();
            goban_ref.current = null;
            goban_opts_ref.current = null;
            hup(Math.random());
        };
    }, [chapter, page]);


    /*
    useEffect(() => {
        console.log(board_container_resizer.width, board_container_resizer.height);
    }, [board_container_resizer.width, board_container_resizer.height]);
    */

    return (
        <>
            <div id='Lesson' className='bg-earth'>
                <div className='portrait-top-spacer'>
                    <div className='lesson-title'>
                        Lesson 1
                    </div>
                </div>
                <div id='Lesson-bottom-container'>

                    <div id='left-container'>
                        <div className='explanation-text' onClick={cancel_animation_ref.current}>
                            {text.map((e, idx) => (
                                <div className='fade-in' key={idx}>{e}</div>
                            ))}
                        </div>
                        <div className='bottom-graphic' />
                    </div>

                    <div id='board-container' ref={board_container_resizer.ref}>
                        <div className='Goban-container'>
                            <div className='Goban'>
                                <PersistentElement elt={container} />
                            </div>
                        </div>
                    </div>

                    <div id='right-container'>
                        <div className='top-spacer' />
                        <Racoon hover />
                        <div className='landscape-bottom-buttons'>
                            <Link to={back} className='game-button-container'>
                                <span className='stone-button-left' />
                                <span className='button-text'>Back</span>
                            </Link>
                            <Link to={next} className='game-button-container'>
                                <span className='stone-button-right' />
                                <span className='button-text'>next</span>
                            </Link>
                        </div>
                    </div>

                </div>



                <div className='portrait-bottom-buttons'>
                    <div className='left'>
                        <Link to={back} className='game-button-container'>
                            <span className='stone-button-left' />
                            <span className='button-text'>Back</span>
                        </Link>
                    </div>

                    <div className='center'>
                        Lesson 1
                    </div>

                    <div className='right'>
                        <Link to={next} className='game-button-container'>
                            <span className='stone-button-right' />
                            <span className='button-text'>Next</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div id='quit'>
                <Link to='/learn-to-play'><span className='stone-button-x' /></Link>
            </div>
            <div id='menu'>
                <i className='fa fa-ellipsis-h' />
            </div>
        </>
    );
}

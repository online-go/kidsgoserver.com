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
import { useNavigate, useParams } from "react-router-dom";
import { useResizeDetector } from "react-resize-detector";
import { useState, useEffect, useRef, useCallback } from "react";
import { _ } from "translate";
import { Goban, GoMath, GobanConfig } from "goban";
import { Avatar } from "Avatar";
import { Bowl } from "Bowl";
import { Captures } from "Captures";

export function Game(): JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const container = useRef<HTMLDivElement>(null);
    const goban_ref = useRef<Goban>(null);
    const goban_opts_ref = useRef<any>({});
    const [_hup, hup]: [number, (x: number) => void] = useState<number>(Math.random());

    const game_id = parseInt(params.id);

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
        console.log("Constructing game ", game_id);

        const opts: GobanConfig = {
            board_div: container.current || undefined,
            interactive: true,
            mode: "puzzle",
            width: 9,
            height: 9,
            draw_top_labels: false,
            draw_right_labels: false,
            draw_left_labels: false,
            draw_bottom_labels: false,
            player_id: 0,
            game_id: game_id,
            dont_draw_last_move: true,

            //server_socket: null,
            //"square_size": 20
        };

        goban_opts_ref.current = opts;
        goban_ref.current = new Goban(opts);
        const goban: Goban = goban_ref.current;
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
            //console.log("Move string: ", move_string);
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
        }, 1000);

        return () => {
            if (t) {
                clearTimeout(t);
            }
            goban.destroy();
            goban_ref.current = null;
            goban_opts_ref.current = null;
            console.log(`Game ${game_id} teardown`);
            hup(Math.random());
            setTimeout(() => {
                console.log("Redrawing");
                goban.redraw(true);
            }, 1);
            clearInterval(animation_interval);
        };
    }, [game_id, container]);

    /*
    useEffect(() => {
        console.log(board_container_resizer.width, board_container_resizer.height);
    }, [board_container_resizer.width, board_container_resizer.height]);
    */

    function quit() {
        navigate("/");
    }

    return (
        <>
            <div id="Game" className="bg-mars">
                <div className="portrait-top-spacer" />

                <div id="white-container">
                    <div className="top-spacer" />
                    <Bowl />
                    <Avatar race="aquatic" random />
                    <Captures />
                    <div className="landscape-bottom-buttons">
                        <div className="game-button-container">
                            <span className="stone-button-return" />
                            <span className="button-text">Undo</span>
                        </div>

                        <div className="game-button-container">
                            <span className="stone-button-chat" />
                            <span className="button-text">Chat</span>
                        </div>
                    </div>
                </div>

                <div id="board-container" ref={board_container_resizer.ref}>
                    <div className="Goban-container">
                        <div className="Goban">
                            <div ref={container}></div>
                        </div>
                    </div>
                </div>

                <div id="black-container">
                    <div className="top-spacer" />
                    <Captures />
                    <Avatar race="wisdom" random />
                    <Bowl />
                    <div className="landscape-bottom-buttons">
                        <div className="game-button-container">
                            <span className="stone-button-up" />
                            <span className="button-text">Pass</span>
                        </div>
                        <div className="game-button-container">
                            <span className="stone-button-flag" />
                            <span className="button-text">Resign</span>
                        </div>
                    </div>
                </div>

                <div className="portrait-bottom-buttons">
                    <div className="left">
                        <div className="game-button-container">
                            <span className="stone-button-return" />
                            <span className="button-text">Undo</span>
                        </div>

                        <div className="game-button-container">
                            <span className="stone-button-chat" />
                            <span className="button-text">Chat</span>
                        </div>
                    </div>

                    <div className="center">Opponent Name</div>

                    <div className="right">
                        <div className="game-button-container">
                            <span className="stone-button-up" />
                            <span className="button-text">Pass</span>
                        </div>
                        <div className="game-button-container">
                            <span className="stone-button-flag" />
                            <span className="button-text">Resign</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="quit">
                <span className="stone-button-x" onClick={quit} />
            </div>
            <div id="menu">
                <i className="fa fa-ellipsis-h" />
            </div>
        </>
    );
}

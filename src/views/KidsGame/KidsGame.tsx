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
import { useNavigate, useParams } from "react-router-dom";
import { useResizeDetector } from "react-resize-detector";
import { useState, useEffect, useRef, useCallback } from "react";
import { _ } from "translate";
import { Goban, GoMath, GobanConfig } from "goban";
import { PlayerAvatar } from "Avatar";
import { Bowl } from "Bowl";
import { Captures } from "Captures";
import { BackButton } from "BackButton";
import { PopupDialog, openPopup } from "PopupDialog";
import { usePlayerToMove, useShowUndoRequested, usePhase } from "Game/GameHooks";

export function KidsGame(): JSX.Element {
    const user = data.get("user");

    const params = useParams();
    const navigate = useNavigate();
    const container = useRef<HTMLDivElement>(null);
    const goban_ref = useRef<Goban>(null);
    const goban_opts_ref = useRef<any>({});
    const [_hup, hup]: [number, (x: number) => void] = useState<number>(Math.random());
    const player_to_move = usePlayerToMove(goban_ref.current);
    const show_undo_requested =
        useShowUndoRequested(goban_ref.current) && goban_ref.current?.engine.phase === "play";
    const [gameFinishedClosed, setGameFinishedClosed] = useState(false);
    const phase = usePhase(goban_ref.current);

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
            mode: "play",
            width: 9,
            height: 9,
            draw_top_labels: false,
            draw_right_labels: false,
            draw_left_labels: false,
            draw_bottom_labels: false,
            player_id: user.id,
            game_id: game_id,
            dont_draw_last_move: true,
            one_click_submit: true,

            //server_socket: null,
            //"square_size": 20
        };

        goban_opts_ref.current = opts;
        goban_ref.current = new Goban(opts);
        const goban: Goban = goban_ref.current;
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
            console.log(`KidsGame ${game_id} teardown`);
            hup(Math.random());
            setTimeout(() => {
                console.log("Redrawing");
                goban.redraw(true);
            }, 1);
            clearInterval(animation_interval);
        };
    }, [game_id, container]);

    function quit() {
        if (
            user.id in goban_ref.current.engine.player_pool &&
            goban_ref.current?.engine.phase === "play"
        ) {
            openPopup({
                text: _("Are you sure you want to quit this game?"),
            })
                .then(() => {
                    goban_ref.current.resign();
                    navigate("/play");
                })
                .catch(() => 0);
        } else {
            navigate("/play");
        }
    }

    const pass = () => {
        if (goban_ref.current) {
            goban_ref.current.pass();
        }
    };

    const requestUndo = () => {
        if (goban_ref.current) {
            goban_ref.current.requestUndo();
        }
    };

    const cancelUndo = () => {
        if (goban_ref.current) {
            goban_ref.current.cancelUndo();
        }
    };

    const acceptUndo = () => {
        if (goban_ref.current) {
            goban_ref.current.acceptUndo();
        }
    };

    const is_player = user.id in (goban_ref.current?.engine.player_pool || {});

    const opponent = is_player
        ? goban_ref.current?.engine.players.black.id === user.id
            ? goban_ref.current?.engine.players.white
            : goban_ref.current?.engine.players.black
        : goban_ref.current?.engine.players.black;
    const self_player = is_player
        ? goban_ref.current?.engine.players.black.id === user.id
            ? goban_ref.current?.engine.players.black
            : goban_ref.current?.engine.players.white
        : goban_ref.current?.engine.players.white;

    const move_number = goban_ref.current?.engine.last_official_move.move_number || 0;
    const can_undo =
        goban_ref.current?.engine.phase === "play" &&
        user.id !== player_to_move &&
        user.id in (goban_ref.current?.engine.player_pool || {}) &&
        move_number > 1;
    const can_pass = user.id === player_to_move;

    const winner_username =
        `${goban_ref.current?.engine.winner}` === `${user.id}`
            ? "You"
            : goban_ref.current?.engine.player_pool[goban_ref.current?.engine.winner]?.username;

    const result =
        phase === "finished" && winner_username === "You"
            ? "You have won by " + goban_ref.current?.engine.outcome
            : winner_username + " wins by " + goban_ref.current?.engine.outcome;

    return (
        <>
            <div id="KidsGame" className="bg-mars">
                <BackButton onClick={quit} />
                {show_undo_requested && (
                    <PopupDialog
                        text="Undo requested"
                        onAccept={player_to_move === user.id ? acceptUndo : null}
                        onCancel={
                            player_to_move === user.id ? cancelUndo : is_player ? cancelUndo : null
                        }
                    />
                )}
                {phase === "finished" && !gameFinishedClosed && (
                    <PopupDialog text={result} onAccept={() => setGameFinishedClosed(true)} />
                )}

                <div className="portrait-top-spacer" />

                <div id="opponent-container">
                    <div className="top-spacer" />
                    <Bowl bouncing={player_to_move === opponent?.id} />
                    <PlayerAvatar user_id={opponent?.id} />
                    <span className="username">{opponent?.username}</span>
                    <Captures />
                    <div className="landscape-bottom-buttons">
                        <StoneButton
                            onClick={requestUndo}
                            className="stone-button-return"
                            text="Undo"
                            disabled={!can_undo}
                        />
                    </div>
                </div>

                <div id="board-container" ref={board_container_resizer.ref}>
                    <div className="Goban-container">
                        <div className="Goban">
                            <div ref={container}></div>
                        </div>
                    </div>
                </div>

                <div id="my-container">
                    <div className="top-spacer" />
                    <Captures />
                    <PlayerAvatar user_id={self_player?.id} />
                    <span className="username">{self_player?.username}</span>
                    <Bowl bouncing={player_to_move === self_player?.id} />
                    <div className="landscape-bottom-buttons">
                        <StoneButton
                            onClick={pass}
                            className="stone-button-up"
                            text="Pass"
                            disabled={!can_pass}
                        />
                    </div>
                </div>

                <div className="portrait-bottom-buttons">
                    <div className="left">
                        <StoneButton
                            onClick={requestUndo}
                            className="stone-button-return"
                            text="Undo"
                            disabled={!can_undo}
                        />
                    </div>

                    <div className="center">Opponent Name</div>

                    <div className="right">
                        <StoneButton
                            onClick={pass}
                            className="stone-button-up"
                            text="Pass"
                            disabled={!can_pass}
                        />
                    </div>
                </div>
            </div>
        </>
    );
    /*
            <div id="menu">
                <i className="fa fa-ellipsis-h" />
            </div>
            */
}

interface StoneButtonProps {
    className: string;
    text: string;
    onClick: () => void;
    disabled: boolean;
}

function StoneButton({ className, text, onClick, disabled }): JSX.Element {
    return (
        <div className="StoneButton" onClick={disabled ? null : onClick}>
            <span className={className + (disabled ? " disabled" : "")} />
            <span className={"button-text" + (disabled ? " disabled" : "")}>{text}</span>
        </div>
    );
}

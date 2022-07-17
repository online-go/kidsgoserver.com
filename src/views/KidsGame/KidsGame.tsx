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
import {
    PlayerAvatar,
    //uiClassToRaceIdx,
    avatar_background_class,
    Race,
    usePlayerRace,
} from "Avatar";
import { Bowl } from "Bowl";
import { Captures } from "Captures";
import { BackButton } from "BackButton";
import { PopupDialog, openPopup, closePopup } from "PopupDialog";
import { ResultsDialog } from "ResultsDialog";
import { usePlayerToMove, useShowUndoRequested, usePhase } from "Game/GameHooks";
import { animateCaptures } from "animateCaptures";
import { ChatBubble } from "./ChatBubble";
import { openChat } from "ChatDialog";

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
    //const [race] = uiClassToRaceIdx(user.ui_class);
    const [whiteId, setWhiteId] = useState(0);
    const race = usePlayerRace(whiteId);

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
        const opts: GobanConfig = {
            board_div: container.current || undefined,
            interactive: true,
            mode: "play",
            width: 9,
            height: 9,
            connect_to_chat: true,
            draw_top_labels: false,
            draw_right_labels: false,
            draw_left_labels: false,
            draw_bottom_labels: false,
            player_id: user.id,
            game_id: game_id,
            dont_draw_last_move: false,
            last_move_radius: 0.45,
            one_click_submit: true,
            dont_show_messages: true,
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
            mvs.map((p) => GoMath.prettyCoords(p.x, p.y, goban.height));

            if (goban.engine.phase === "finished") {
                const s = goban.engine.computeScore(false);
                goban.showScores(s, true);
            }
        };

        const onCapturedStones = ({ removed_stones }) => {
            animateCaptures(removed_stones, goban, goban.engine.colorToMove());
        };

        let last_player_to_move = 0;
        let say_your_move_timeout = null;
        const sayYourMoveChecker = () => {
            if (goban.engine.phase === "play") {
                if (last_player_to_move !== goban.engine.playerToMove()) {
                    if (say_your_move_timeout) {
                        clearTimeout(say_your_move_timeout);
                    }
                    last_player_to_move = goban.engine.playerToMove();
                    if (goban.engine.playerToMove() === user.id) {
                        say_your_move_timeout = setTimeout(() => {
                            if (goban.engine.phase !== "play") {
                                return;
                            }
                            console.log("SHould be our move");
                            const opponent = is_player
                                ? goban_ref.current?.engine.players.black.id === user.id
                                    ? goban_ref.current?.engine.players.white
                                    : goban_ref.current?.engine.players.black
                                : goban_ref.current?.engine.players.black;

                            if (opponent) {
                                if (goban.engine.last_official_move.passed()) {
                                    goban.emit("chat", {
                                        body: "I've passed",
                                        player_id: opponent.id,
                                    });
                                } else {
                                    goban.emit("chat", {
                                        body: "Your move",
                                        player_id: opponent.id,
                                    });
                                }
                            }
                        }, 15000);
                    }
                }
            }
        };

        let pass_last_move = 0;

        const passStoneHandler = () => {
            if (goban.engine.phase === "play") {
                if (pass_last_move !== goban.engine.last_official_move.move_number) {
                    /* If we just joined the game, don't replay the animation */
                    if (pass_last_move !== 0) {
                        if (goban.engine.last_official_move.passed()) {
                            const color = goban.engine.colorToMove();
                            const other_color = color === "black" ? "white" : "black";
                            animateCaptures([{ x: -1, y: -1 }], goban, other_color);

                            if (
                                goban.engine.last_official_move.move_number > 1 &&
                                goban.engine.last_official_move.prev().passed()
                            ) {
                                if (color === "white") {
                                    animateCaptures([{ x: -1, y: -1 }], goban, "white");
                                }
                            }
                        }
                    }
                    pass_last_move = goban.engine.last_official_move.move_number;
                }
            }
        };

        goban.on("show-message", ({ formatted, message_id, parameters }) => {
            void openPopup({
                text: formatted,
                no_cancel: true,
            });
            //console.log("show-message", formatted, message_id, parameters);
        });
        goban.on("clear-message", () => {
            closePopup();
            //console.log("clear message");
        });

        goban.on("update", onUpdate);
        goban.on("update", sayYourMoveChecker);
        goban.on("update", passStoneHandler);
        goban.on("captured-stones", onCapturedStones);
        window["global_goban"] = goban;
        goban.on("load", () => {
            setWhiteId(goban.engine.players.white.id);
        });

        let t = setTimeout(() => {
            t = null;
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
            if (say_your_move_timeout) {
                clearTimeout(say_your_move_timeout);
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

    const opponent_color =
        opponent?.id === goban_ref.current?.engine.players.black.id ? "black" : "white";
    const self_color = opponent_color === "black" ? "white" : "black";

    const move_number = goban_ref.current?.engine.last_official_move.move_number || 0;
    const can_undo =
        goban_ref.current?.engine.phase === "play" &&
        user.id !== player_to_move &&
        user.id in (goban_ref.current?.engine.player_pool || {}) &&
        move_number > 1;
    const can_pass = user.id === player_to_move;
    const bot_game =
        isBot(goban_ref.current?.engine.players.black) ||
        isBot(goban_ref.current?.engine.players.white);

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
            <div id="KidsGame" className={race ? avatar_background_class(race as Race) : ""}>
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
                    <ResultsDialog
                        goban={goban_ref?.current}
                        onPlayAgain={() => {
                            navigate("/play");
                        }}
                        onClose={() => {
                            setGameFinishedClosed(true);
                        }}
                    />
                )}

                <div className="portrait-top-spacer" />

                <div id="opponent-container">
                    <div className="top-spacer" />
                    <Bowl
                        bouncing={player_to_move === opponent?.id}
                        color={opponent_color}
                        goban={goban_ref.current}
                    />
                    <div className="Player">
                        <PlayerAvatar user_id={opponent?.id} />
                        <ChatBubble
                            goban={goban_ref.current}
                            user_id={opponent?.id}
                            side="opponent"
                        />
                        {/* <span className="username">{opponent?.username}</span> */}
                    </div>
                    <Captures color={opponent_color} goban={goban_ref.current} />
                    <div className="landscape-bottom-buttons">
                        {(!bot_game || null) && (
                            <StoneButton
                                onClick={requestUndo}
                                className="stone-button-return"
                                text="Undo"
                                disabled={!can_undo}
                            />
                        )}
                        <StoneButton
                            onClick={() => openChat({ goban: goban_ref.current })}
                            className="stone-button-chat"
                            text="Chat"
                            disabled={!is_player}
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
                    <Captures color={self_color} goban={goban_ref.current} />
                    <div className="Player">
                        <PlayerAvatar user_id={self_player?.id} />
                        <ChatBubble
                            goban={goban_ref.current}
                            user_id={self_player?.id}
                            side="player"
                        />
                        {/* <span className="username">{self_player?.username}</span> */}
                    </div>
                    <Bowl
                        bouncing={player_to_move === self_player?.id}
                        color={self_color}
                        goban={goban_ref.current}
                    />
                    <div className="landscape-bottom-buttons">
                        {goban_ref.current?.engine.phase === "play" && (
                            <StoneButton
                                onClick={pass}
                                className="stone-button-up"
                                text="Pass"
                                disabled={!can_pass}
                            />
                        )}
                    </div>
                </div>

                {goban_ref.current?.engine.phase === "play" && (
                    <div className="portrait-bottom-buttons">
                        <div className="left">
                            {(!bot_game || null) && (
                                <StoneButton
                                    onClick={requestUndo}
                                    className="stone-button-return"
                                    text="Undo"
                                    disabled={!can_undo}
                                />
                            )}
                            <StoneButton
                                onClick={() => openChat({ goban: goban_ref.current })}
                                className="stone-button-chat"
                                text="Chat"
                                disabled={!is_player}
                            />
                        </div>

                        <div className="right">
                            <StoneButton
                                onClick={pass}
                                className="stone-button-up"
                                text="Pass"
                                disabled={!can_pass}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

interface StoneButtonProps {
    className: string;
    text: string;
    onClick: () => void;
    disabled: boolean;
}

function StoneButton({ className, text, onClick, disabled }: StoneButtonProps): JSX.Element {
    return (
        <div className="StoneButton" onClick={disabled ? null : onClick}>
            <span className={className + (disabled ? " disabled" : "")} />
            <span className={"button-text" + (disabled ? " disabled" : "")}>{text}</span>
        </div>
    );
}

function isBot(player: any): boolean {
    if (!player) {
        return false;
    }
    for (const keyword of ["fuego", "katago", "gnugo", "computer", "easy", "hard", "medium"]) {
        if (player.username.toLowerCase().includes(keyword)) {
            return true;
        }
    }
    return false;
}

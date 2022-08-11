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
import { useUser } from "hooks";
import { post, del } from "requests";
import { socket } from "sockets";
//import { useState } from "react";
//import { Link } from "react-router-dom";
import { _ } from "translate";
import * as data from "data";
import cached from "cached";
//import { OpponentList } from "./OpponentList";
import { ComputerOpponents } from "./ComputerOpponents";
import { KidOpponents } from "./KidOpponents";
//import * as preferences from "preferences";
//import { errorAlerter, ignore } from "misc";
import { notification_manager } from "Notifications";
import { ignore, errorAlerter } from "misc";
import { PopupDialog } from "PopupDialog";
import { closePopup, openPopup } from "PopupDialog";
import { uiClassToRaceIdx, avatar_background_class } from "Avatar";
import { BackButton } from "BackButton";
import { Avatar } from "Avatar";
import { ActiveGamesList } from "./ActiveGamesList";
import { bots } from "bots";

type ChallengeDetails = rest_api.ChallengeDetails;

export function Matchmaking(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const [opponent, _setOpponent] = React.useState("easy");
    const [game_to_view, _setGameToView] = React.useState<any>(null);
    const [handicap, setHandicap] = React.useState(0);
    const [race, idx] = uiClassToRaceIdx(user.ui_class);

    useEnsureUserIsCreated();

    const setOpponent = (o: string) => {
        _setOpponent(o);
        _setGameToView(null);
    };
    const setGameToView = (g: any) => {
        _setOpponent(null);
        _setGameToView(g);
    };

    const play = (e) => {
        const hc = isBot(opponent) ? handicap : 0;

        const challenge: ChallengeDetails = {
            initialized: true,
            min_ranking: 0,
            max_ranking: 99,
            challenger_color: hc > 0 ? "black" : "random",
            rengo_auto_start: 0,
            game: {
                name: "Kidsgo Match",
                rules: "aga",
                ranked: false,
                width: 9,
                height: 9,
                handicap: hc,
                komi_auto: hc ? "custom" : "automatic",
                komi: hc ? 0.5 : null,
                disable_analysis: false,
                initial_state: null,
                private: false,
                rengo: false,
                rengo_casual_mode: false,
                pause_on_weekends: false,
                time_control: "simple",
                time_control_parameters: {
                    system: "simple",
                    speed: "live",
                    per_move: 45 * 60, // 45 minute move time
                    pause_on_weekends: false,
                },
            },
        };

        openPopup({ text: `Sending challenge`, no_accept: true, no_cancel: true })
            .then(() => {})
            .catch(() => {});
        post(`players/${opponent}/challenge`, challenge)
            .then((res) => {
                const challenge_id = res.challenge;
                const game_id = typeof res.game === "object" ? res.game.id : res.game;
                let keepalive_interval;

                notification_manager.event_emitter.on("notification", checkForReject);

                closePopup();
                openPopup({ text: `Waiting for opponent to accept challenge`, no_accept: true })
                    .then(() => {
                        off();
                    })
                    .catch(() => {
                        off();
                        del("me/challenges/%%", challenge_id).then(ignore).catch(ignore);
                    });
                active_check();

                function active_check() {
                    keepalive_interval = setInterval(() => {
                        socket.send("challenge/keepalive", {
                            challenge_id: challenge_id,
                            game_id: game_id,
                        });
                    }, 1000);
                    socket.send("game/connect", { game_id: game_id });
                    socket.on(`game/${game_id}/gamedata`, onGamedata);
                }

                function onGamedata() {
                    off();
                    closePopup();
                    //sfx.play("game_started", 3000);
                    navigate(`/game/${game_id}`);
                }

                function onRejected(message?: string) {
                    off();
                    closePopup();
                    openPopup({
                        text: message || "Your challenge was declined",
                        no_cancel: true,
                    })
                        .then(() => 0)
                        .catch(() => 0);
                }

                function off() {
                    clearTimeout(keepalive_interval);
                    socket.send("game/disconnect", { game_id: game_id });
                    socket.off(`game/${game_id}/gamedata`, onGamedata);
                    socket.off(`game/${game_id}/rejected`, onRejected);
                    notification_manager.event_emitter.off("notification", checkForReject);
                    closePopup();
                }

                function checkForReject(notification) {
                    console.log("challenge rejection check notification:", notification);
                    if (notification.type === "gameOfferRejected") {
                        /* non checked delete to purge old notifications that
                         * could be around after browser refreshes, connection
                         * drops, etc. */
                        notification_manager.deleteNotification(notification);
                        if (notification.game_id === game_id) {
                            onRejected(notification.message);
                        }
                    }
                }
            })
            .catch((err) => {
                closePopup();
                errorAlerter(err);
            });
    };
    const playOrView = (e) => {
        if (game_to_view) {
            navigate(`/game/${game_to_view.id}`);
        } else {
            play(e);
        }
    };
    function back() {
        navigate("/");
    }
    const setOpponentAndHandicap = (o: string, h: number) => {
        setOpponent(o);
        setHandicap(h);
    };

    // The 0-9 regex disabled the computer opponents for now.
    const canPlay =
        !user.anonymous && opponent && opponent !== `${user.id}` && /[0-9]+/.test(opponent);
    const canView = !!game_to_view;
    //const showGameSettings = canPlay && isBot(opponent);

    return (
        <div id="Matchmaking" className={avatar_background_class(race)}>
            <BackButton onClick={back} />
            <CheckForChallengeReceived />
            <div className="current-user-container">
                <div className="current-user-race-name">
                    <Avatar race={race} idx={idx} />
                    {user.username}
                </div>
                <div>
                    <button onClick={() => navigate("/character-selection")}>Change</button>
                </div>
            </div>

            <div className="outer-container">
                <div className="inner-container">
                    <div className="left">
                        <ComputerOpponents
                            channel="kidsgo"
                            value={opponent}
                            handicap={handicap}
                            onChange={setOpponentAndHandicap}
                        />
                    </div>
                    <div className="vs"></div>
                    <div className="right">
                        <KidOpponents
                            channel="kidsgo"
                            value={opponent}
                            handicap={handicap}
                            onChange={setOpponentAndHandicap}
                        />
                    </div>
                </div>
                {/*
                <div className="inner-container">
                    <ActiveGamesList value={game_to_view} onChange={setGameToView} />
                </div>
                */}
                <button
                    className="play primary-button"
                    disabled={!canPlay && !canView}
                    onClick={playOrView}
                >
                    {canPlay ? "Play!" : canView ? "View game" : "Choose your opponent"}
                </button>
                {/*
                {showGameSettings && (
                    <div>
                        <Handicap value={handicap} onChange={setHandicap} />
                    </div>
                )}
                */}
            </div>
        </div>
    );
}

export function useEnsureUserIsCreated(): void {
    const user = useUser();

    React.useEffect(() => {
        if (user.anonymous) {
            post("/api/v0/register/kidsgo")
                .then((config) => {
                    data.set(cached.config, config);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [user.anonymous]);
}

function CheckForChallengeReceived(): JSX.Element {
    const navigate = useNavigate();
    //const [active_challenge, setActiveChallenge] = React.useState(null);
    const [, refresh] = React.useState(0);
    const active_challenge = React.useRef(null);

    React.useEffect(() => {
        const checkForChallenge = (notification) => {
            if (notification.type === "challenge") {
                active_challenge.current = notification;
                refresh(Math.random());
            } else if (notification.type === "gameEnded") {
                notification_manager.deleteNotification(notification);
            } else if (notification.type === "gameStarted") {
                navigate(`/game/${notification.game_id}`);
                notification_manager.deleteNotification(notification);
            } else if (notification.type === "delete") {
                console.log("delete notification:", notification, active_challenge);
                if (active_challenge.current?.id === notification.id) {
                    active_challenge.current = null;
                    refresh(Math.random());
                }
            } else if (notification.type === "gameOfferRejected") {
                notification_manager.deleteNotification(notification);
            } else {
                console.log("Unhandled notification: ", notification);
            }
        };

        notification_manager.event_emitter.on("notification", checkForChallenge);
        return () => {
            notification_manager.event_emitter.off("notification", checkForChallenge);
        };
    }, []);

    const accept = () => {
        post("me/challenges/%%/accept", active_challenge.current.challenge_id, {})
            .then(() => {
                if (active_challenge.current) {
                    navigate(`/game/${active_challenge.current.game_id}`);
                }
            })
            .catch((err) => {
                active_challenge.current = null;
                refresh(Math.random());
                errorAlerter(err);
            });
    };

    const decline = () => {
        del("me/challenges/%%", active_challenge.current.challenge_id)
            .then(() => {
                active_challenge.current = null;
                refresh(Math.random());
            })
            .catch((err) => {
                active_challenge.current = null;
                refresh(Math.random());
                errorAlerter(err);
            });
    };

    if (active_challenge.current) {
        return (
            <PopupDialog
                text={`Challenge received from ${active_challenge.current.user.username}`}
                onAccept={accept}
                onCancel={decline}
            />
        );
    }

    return null;
}

function isBot(user_id: string | number): boolean {
    if (user_id in bots()) {
        return true;
    }

    return false;
}

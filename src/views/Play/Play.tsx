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
//import { useState } from "react";
//import { Link } from "react-router-dom";
import { _ } from "translate";
import * as data from "data";
import cached from "cached";
import { OpponentList } from "./OpponentList";
//import * as preferences from "preferences";
//import { errorAlerter, ignore } from "misc";
import { socket } from "sockets";
import swal from "sweetalert2";
import { notification_manager } from "Notifications";
import { ignore, errorAlerter } from "misc";
import { PopupDialog } from "PopupDialog";

type ChallengeDetails = rest_api.ChallengeDetails;

export function Play(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const [opponent, setOpponent] = React.useState("");
    useEnsureUserIsCreated();

    const play = (e) => {
        const challenge: ChallengeDetails = {
            initialized: true,
            min_ranking: 0,
            max_ranking: 99,
            challenger_color: "random",
            rengo_auto_start: 0,
            game: {
                name: "Kidsgo Match",
                rules: "aga",
                ranked: false,
                width: 9,
                height: 9,
                handicap: 0,
                komi_auto: null,
                komi: null,
                disable_analysis: false,
                initial_state: null,
                private: true,
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

        post(`players/${opponent}/challenge`, challenge)
            .then((res) => {
                // console.log("Challenge response: ", res);

                const challenge_id = res.challenge;
                const game_id = typeof res.game === "object" ? res.game.id : res.game;
                let keepalive_interval;

                notification_manager.event_emitter.on("notification", checkForReject);

                swal({
                    title: _("Waiting for opponent"),
                    html: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Cancel",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                    .then(() => {
                        off();
                        // cancel challenge
                        del("me/challenges/%%", challenge_id).then(ignore).catch(ignore);
                    })
                    .catch(() => {
                        off();
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
                    swal.close();
                    //sfx.play("game_started", 3000);
                    navigate(`/game/${game_id}`);
                }

                function onRejected(message?: string) {
                    off();
                    swal.close();
                    swal({
                        text: message || _("Game offer was rejected"),
                    }).catch(swal.noop);
                }

                function off() {
                    clearTimeout(keepalive_interval);
                    socket.send("game/disconnect", { game_id: game_id });
                    socket.off(`game/${game_id}/gamedata`, onGamedata);
                    socket.off(`game/${game_id}/rejected`, onRejected);
                    notification_manager.event_emitter.off("notification", checkForReject);
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
                swal.close();
                errorAlerter(err);
            });
    };

    const canPlay = !user.anonymous && opponent && opponent !== `${user.id}`;

    return (
        <div id="Play" className="bg-earth">
            <CheckForChallengeReceived />
            <div className="container">
                <div className="left">
                    <CharacterManagement />

                    <div className="OpponentSelection">
                        <h3>Opponent</h3>
                        <OpponentList channel="kidsgo" value={opponent} onChange={setOpponent} />
                    </div>
                </div>
                <div className="right">
                    <button className="btn btn-primary" disabled={!canPlay} onClick={play}>
                        PLAY
                    </button>
                </div>
            </div>
        </div>
    );
}

function CharacterManagement(): JSX.Element {
    return (
        <div className="AvatarSelection">
            <h3>Avatar</h3>
            <AvatarSelection />
            <NameSelection />
        </div>
    );
}

function AvatarSelection(): JSX.Element {
    return <div className="AvatarSelection" />;
}

function NameSelection(): JSX.Element {
    const user = useUser();
    const [refreshing, setRefreshing] = React.useState(false);

    if (user.anonymous) {
        return <div className="NameSelection" />;
    }

    const refresh = (e) => {
        setRefreshing(true);
        post("me/kidsgo/regenerate_username")
            .then((config) => {
                data.set(cached.config, config);
                setRefreshing(false);
            })
            .catch((err) => {
                setRefreshing(false);
            });
    };

    return (
        <div className={`NameSelection ${refreshing ? "refreshing" : ""}`}>
            <span className="username">{user.username}</span>
            <span className="refresh" onClick={refresh}>
                &#10226;
            </span>
        </div>
    );
}

function useEnsureUserIsCreated(): void {
    const user = useUser();

    React.useEffect(() => {
        if (user.anonymous) {
            post("/api/v0/register/kidsgo")
                .then((config) => {
                    console.log(config);
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
    const [active_challenge, setActiveChallenge] = React.useState(null);

    React.useEffect(() => {
        const checkForChallenge = (notification) => {
            /*
            if (notification.type === "gameOfferRejected") {
                notification_manager.deleteNotification(notification);
                if (notification.game_id === game_id) {
                    onRejected(notification.message);
                }
            }
            */
            if (notification.type === "challenge") {
                setActiveChallenge(notification);
                /*
                console.log("NOtificaiotn:", notification);

                swal({
                    title: "Challenge received",
                    html: `<span>Challenge received from <img className="challenger-icon" src="${notification.user.icon_url}></img> ${notification.user.username}</span>`,
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "Accept",
                    cancelButtonClass: "btn-danger",
                    cancelButtonText: "Decline",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                    .then(() => {
                        post("me/challenges/%%/accept", notification.challenge_id, {})
                            .then(() => {
                                this.del();
                                navigate(`/game/${notification.game_id}`);
                            })
                            .catch(this.onError);
                    })
                    .catch(() => {
                        //notification_manager.deleteNotification(this.props.notification);
                        //off();
                    });
                    */
            } else {
                console.log("challenge received check notification:", notification);
            }
        };

        notification_manager.event_emitter.on("notification", checkForChallenge);
        return () => {
            notification_manager.event_emitter.off("notification", checkForChallenge);
        };
    }, []);

    const accept = () => {
        post("me/challenges/%%/accept", active_challenge.challenge_id, {})
            .then(() => {
                navigate(`/game/${active_challenge.game_id}`);
            })
            .catch(errorAlerter);
    };

    const decline = () => {
        console.log("decline");
    };

    if (active_challenge) {
        return (
            <PopupDialog
                text={`Challenge received from ${active_challenge.user.username}`}
                onAccept={accept}
                onCancel={decline}
            />
        );
    }

    return null;
}

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
import { notification_manager } from "Notifications";
import { ignore, errorAlerter } from "misc";
import { PopupDialog } from "PopupDialog";
import { closePopup, openPopup } from "PopupDialog";
import { AvatarSelection, Race, raceIdxToUiClass, uiClassToRaceIdx } from "Avatar";
import { BackButton } from "BackButton";

type ChallengeDetails = rest_api.ChallengeDetails;

export function Matchmaking(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const [opponent, setOpponent] = React.useState("easy");
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

        post(`players/${opponent}/challenge`, challenge)
            .then((res) => {
                const challenge_id = res.challenge;
                const game_id = typeof res.game === "object" ? res.game.id : res.game;
                let keepalive_interval;

                notification_manager.event_emitter.on("notification", checkForReject);

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
    function back() {
        navigate("/");
    }

    // The 0-9 regex disabled the computer opponents for now.
    const canPlay =
        !user.anonymous && opponent && opponent !== `${user.id}` && /[0-9]+/.test(opponent);

    return (
        <div id="Matchmaking" className="bg-earth">
            <BackButton onClick={back} />
            <CheckForChallengeReceived />
            <div className="outer-container">
                <div className="inner-container">
                    <div className="left">
                        <CharacterManagement />
                    </div>
                    <div className="vs">
                        <span className="line" />
                        <span className="v">V</span>
                        <span className="s">S</span>
                        <span className="line" />
                    </div>
                    <div className="right">
                        <OpponentList channel="kidsgo" value={opponent} onChange={setOpponent} />
                    </div>
                </div>
                <button className="play" disabled={!canPlay} onClick={play}>
                    {canPlay ? "Play!" : "Choose your opponent"}
                </button>
            </div>
        </div>
    );
}

function CharacterManagement(): JSX.Element {
    const user = useUser();

    const [race, idx] = uiClassToRaceIdx(user.ui_class);
    const [avatarRace, setAvatarRace] = React.useState<Race>(race);
    const [avatarIdx, setAvatarIdx] = React.useState(idx);
    const last_ui_class = React.useRef<string>(raceIdxToUiClass(race, idx));
    const updating = React.useRef<boolean>(false);

    const update_server = (ui_class: string): void => {
        last_ui_class.current = ui_class;
        if (updating.current) {
            return;
        }

        updating.current = true;

        post("kidsgo/update_avatar", { ui_class })
            .then(() => {
                updating.current = false;
                if (ui_class !== last_ui_class.current) {
                    update_server(last_ui_class.current);
                }
            })
            .catch((err) => {
                updating.current = false;
                console.error("Failed to update avatar", err);
            });
    };

    const update = (race: Race, idx: number): void => {
        setAvatarRace(race);
        setAvatarIdx(idx);

        update_server(raceIdxToUiClass(race, idx));

        const config = data.get("cached.config");
        config.user.ui_class = raceIdxToUiClass(race, idx);
        data.setWithoutEmit("cached.config", config);
        data.setWithoutEmit("config", config);
        data.set("config.user", JSON.parse(JSON.stringify(config.user)));
        data.set("user", JSON.parse(JSON.stringify(config.user)));
    };

    return (
        <div className="CharacterManagement">
            <NameSelection />
            <AvatarSelection race={avatarRace} idx={avatarIdx} onChange={update} />
        </div>
    );
}

function NameSelection(): JSX.Element {
    const user = useUser();
    const [refreshing, setRefreshing] = React.useState(false);

    if (user.anonymous) {
        return <div className="NameSelection" />;
    }

    const refresh = (e) => {
        setRefreshing(true);
        post("kidsgo/regenerate_username")
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
            <span className="refresh" onClick={refresh} title="New name">
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

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
import { useUser } from "@/lib/hooks";
import { post, del } from "@/lib/requests";
import { socket } from "@/lib/sockets";
import * as data from "@/lib/data";
import cached from "@/lib/cached";
import { ComputerOpponents } from "./ComputerOpponents";
import { KidOpponents } from "./KidOpponents";
import { notification_manager } from "@/components/Notifications";
import { errorAlerter } from "@/lib/misc";
import { PopupDialog } from "@kidsgo/components/PopupDialog";
import { closePopup, openPopup } from "@kidsgo/components/PopupDialog";
import { uiClassToRaceIdx, avatar_background_class } from "@kidsgo/components/Avatar";
import { BackButton } from "@kidsgo/components/BackButton";
import { Avatar } from "@kidsgo/components/Avatar";
import { bots } from "@/lib/bots";
import { image_url } from "@kidsgo/lib/goban_themes";
import { SignIn } from "@kidsgo/components/SignIn";
import { reload_page } from "@kidsgo/lib/reload_page";
import { ActiveGamesList } from "./ActiveGamesList";

type ChallengeDetails = rest_api.ChallengeDetails;

const black_svg_url = image_url("dark_blue", "plain");
const white_svg_url = image_url("white", "plain");

export function Matchmaking(): JSX.Element {
    const navigate = useNavigate();
    const user = useUser();
    const [opponent, _setOpponent] = React.useState("easy");
    const [_opponent_object, setOpponentObject] = React.useState(null);
    const [game_to_view, _setGameToView] = React.useState<any>(null);
    const [handicap, setHandicap] = React.useState(0);
    const [race, idx] = uiClassToRaceIdx(user.ui_class);
    const [my_color, setMyColor] = React.useState<"black" | "white">("black");
    const [board_size, setBoardSize] = React.useState(9);
    const [captureGame, setCaptureGame] = React.useState(() => {
        return localStorage.getItem("gameMode") === "capture";
    });

    const handleGameModeChange = (isCaptureMode: boolean) => {
        setCaptureGame(isCaptureMode);

        // Sync to localStorage so kidsgo-routes.tsx can load the proper query parameter if we are playing the capture game
        if (isCaptureMode) {
            localStorage.setItem("gameMode", "capture");
        } else {
            localStorage.removeItem("gameMode");
        }
    };

    useEnsureUserIsCreated();

    // setup redirect back to home after an hour of inactivity
    React.useEffect(() => {
        const t = setTimeout(
            () => {
                void navigate("/");
            },
            60 * 60 * 1000,
        );
        return () => {
            clearTimeout(t);
        };
    }, []);

    React.useEffect(() => {
        return () => {
            closePopup();
        };
    }, []);

    const setOpponent = (o: string) => {
        _setOpponent(o);
        _setGameToView(null);
        if (isBot(o)) {
            setMyColor("black");
        }
    };
    /*
    const setGameToView = (g: any) => {
        _setOpponent(null);
        _setGameToView(g);
        setOpponentObject(null);
    };
    */

    const play = (_e) => {
        //const hc = isBot(opponent) ? handicap : 0;
        const hc = handicap;

        /*
        openPopup({
            text: (
                <ChallengeDialog
                    opponent={opponent_object}
                    onChange={(settings) => console.log(settings)}
                />
            ),
        })
            .then(() => {
            */
        const challenge: ChallengeDetails = {
            initialized: true,
            min_ranking: 0,
            max_ranking: 99,
            //challenger_color: hc > 0 ? "black" : "random",
            challenger_color: my_color,
            rengo_auto_start: 0,
            game: {
                name: "Kidsgo Match",
                rules: "aga",
                ranked: false,
                width: board_size,
                height: board_size,
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
                // we can actually be redirected before this returns if we receive the notification
                // before the post result, so in this case, just close things down and enjoy the game,
                // nothing else to do.
                if (window.location.pathname.startsWith("/game")) {
                    closePopup();
                    return;
                }

                const challenge_id = res.challenge;
                const game_id = typeof res.game === "object" ? res.game.id : res.game;
                let keepalive_interval;

                notification_manager.event_emitter.on("notification", checkForReject);

                closePopup();
                openPopup({
                    text: `Waiting for opponent to accept challenge`,
                    no_accept: true,
                })
                    .then(() => {
                        off(false);
                    })
                    .catch(() => {
                        console.log("going to cancel");
                        del("me/challenges/%%", challenge_id)
                            .then(() => off(true)) // we cancelled successfully, so fully disconnect from that game
                            .catch(() => off(false)); // we didn't cancel in time, game on!
                    });
                active_check();

                function active_check() {
                    keepalive_interval = setInterval(() => {
                        socket.send("challenge/keepalive", {
                            challenge_id: challenge_id,
                            game_id: game_id,
                        });
                    }, 1000);
                    /*
                    socket.send("game/connect", { game_id: game_id });
                    socket.on(`game/${game_id}/gamedata`, onGamedata);
                    */
                }

                /*
                function onGamedata() {
                    off(false);
                    closePopup();
                    navigate(`/game/${game_id}`);
                }
                */

                function onRejected(message?: string) {
                    off(true);
                    closePopup();
                    openPopup({
                        text: message || "Your challenge was declined",
                        no_cancel: true,
                    })
                        .then(() => 0)
                        .catch(() => 0);
                }

                function off(disconnect: boolean) {
                    clearTimeout(keepalive_interval);
                    if (disconnect) {
                        socket.send("game/disconnect", { game_id: game_id });
                    }
                    //socket.off(`game/${game_id}/gamedata`, onGamedata);
                    //socket.off(`game/${game_id}/rejected`, onRejected);
                    notification_manager.event_emitter.off("notification", checkForReject);
                    closePopup();
                }

                function checkForReject(notification) {
                    // console.log("challenge rejection check notification:", notification);
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
        /*
            })
            .catch((err) => {
                closePopup();
                errorAlerter(err);
            });
            */
    };
    const playOrView = (e) => {
        if (game_to_view) {
            void navigate(`/game/${game_to_view.id}`);
        } else {
            play(e);
        }
    };

    function back() {
        void navigate("/");
    }
    const setOpponentAndHandicap = (o: string, h: number, opponent_obj: any) => {
        setOpponent(o);
        setHandicap(h);
        setOpponentObject(opponent_obj);
    };

    // The 0-9 regex disabled the computer opponents for now.
    const canPlay =
        !user.anonymous && opponent && opponent !== `${user.id}` && /[0-9]+/.test(opponent);
    const canView = !!game_to_view;
    //const showGameSettings = canPlay && isBot(opponent);

    const openSignin = (): void => {
        openPopup({
            text: <SignIn />,
            className: "SignInPopup",
            no_cancel: true,
        })
            .then(() => {
                //
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div id="Matchmaking" className={avatar_background_class(race)}>
            <BackButton onClick={back} />
            <button id="Lessons-button" onClick={() => navigate("/learn-to-play")}>
                Lessons
            </button>
            <button id="Avatar-button" onClick={() => navigate("/character-selection")}>
                Avatar
            </button>
            <button id="Help-button" onClick={() => navigate("/help")}>
                Help
            </button>
            {/* <button>Character</button> */}
            <CheckForChallengeReceived />
            {/* <div className="current-user-container">
                <Avatar race={race} idx={idx} />
                {(!user.anonymous || null) && (
                    <div>
                        <div className="current-user-race-name">{user.username}</div>
                        <div>
                            <button onClick={() => navigate("/character-selection")}>Change</button>

                            <button className="sign-in" onClick={openSignin}>
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </div> */}

            <div className="outer-container">
                <button
                    className="play primary-button portrait"
                    disabled={!canPlay && !canView}
                    onClick={playOrView}
                >
                    {canPlay ? "Play!" : canView ? "View game" : "Choose your opponent"}
                </button>

                <div className="inner-container">
                    <div className="left">
                        <ComputerOpponents
                            channel="kidsgo"
                            value={opponent}
                            handicap={handicap}
                            captureGame={captureGame}
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

                <div className="settings">
                    I play as
                    <div className="color-selector">
                        <label>
                            <input
                                type="radio"
                                value={"black"}
                                onChange={() => setMyColor("black")}
                                checked={my_color === "black"}
                            />
                            <img src={black_svg_url} alt="black" />
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={"white"}
                                onChange={() => setMyColor("white")}
                                checked={my_color === "white"}
                            />
                            <img src={white_svg_url} alt="white" />
                        </label>
                    </div>
                    {my_color === "black" ? " with " : " and give "}
                    <select
                        value={handicap}
                        onChange={(ev) => setHandicap(parseInt(ev.target.value))}
                    >
                        <option value="0">no</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    {handicap === 1 ? " starting stone and no komi " : " extra stones. "}
                </div>
                <div className="settings">
                    Board size:
                    <input
                        type="radio"
                        id="board-size-9"
                        name="board-size"
                        checked={board_size === 9}
                        onChange={() => setBoardSize(9)}
                    />
                    <label htmlFor="board-size-9">9x9</label>
                    <input
                        type="radio"
                        id="board-size-13"
                        name="board-size"
                        checked={board_size === 13}
                        onChange={() => setBoardSize(13)}
                    />
                    <label htmlFor="board-size-13">13x13</label>
                </div>
                <div className="settings">
                    <div className="gamemode-spacer">
                        Game Mode:
                        <input
                            type="radio"
                            id="normal-game"
                            name="game-mode"
                            checked={captureGame === false}
                            onChange={() => handleGameModeChange(false)}
                        />
                        <label htmlFor="normal-game">Normal</label>
                        <input
                            type="radio"
                            id="first-capture"
                            name="game-mode"
                            checked={captureGame === true}
                            onChange={() => handleGameModeChange(true)}
                        />
                        <label htmlFor="first-capture">1st Capture</label>
                    </div>
                </div>

                <button
                    className="play primary-button landscape"
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
                    reload_page();
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
                void navigate(`/game/${notification.game_id}`);
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
        post(`me/challenges/${active_challenge.current.challenge_id}/accept`, {})
            .then(() => {
                if (active_challenge.current) {
                    void navigate(`/game/${active_challenge.current.game_id}`);
                }
            })
            .catch((err) => {
                active_challenge.current = null;
                refresh(Math.random());
                errorAlerter(err);
            });
    };

    const decline = () => {
        del(`me/challenges/${active_challenge.current.challenge_id}`)
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
        console.log(active_challenge.current);
        const my_color = active_challenge.current.challenger_color === "black" ? "white" : "black";
        const handicap = active_challenge.current.handicap;
        const svg = my_color === "black" ? black_svg_url : white_svg_url;
        const [race, idx] = uiClassToRaceIdx(active_challenge.current.user.ui_class);

        return (
            <PopupDialog
                text={
                    <div className="ReceivedChallenge">
                        <Avatar race={race} idx={idx} />
                        <div>
                            {active_challenge.current.user.username} would like to play with you.
                            You play as <img src={svg} alt={my_color} />{" "}
                            {handicap > 0
                                ? (my_color === "black" ? " and get " : " and give ") +
                                  handicap +
                                  " extra stones. "
                                : ""}
                        </div>
                    </div>
                }
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

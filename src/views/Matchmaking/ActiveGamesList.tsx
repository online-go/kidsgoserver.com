/*
 * Copyright (C) 2012-2022  Online-Go.com
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
import { socket } from "sockets";
import { PlayerAvatar } from "Avatar";

interface ActiveGamesListProperties {
    value: any;
    onChange: (game: string) => void;
}

export function ActiveGamesList(props: ActiveGamesListProperties): JSX.Element {
    const [active_games_count, setActiveGamesCount] = React.useState<number>(-1);
    const [games, setGames] = React.useState<any[]>([]);

    React.useEffect(() => {
        const updateCounts = (counts: any) => {
            setActiveGamesCount(counts.live);
        };
        socket.on(`gamelist-count-kidsgo`, updateCounts);
        socket.send("gamelist/count/subscribe", "kidsgo");

        return () => {
            socket.off(`gamelist-count-kidsgo`, updateCounts);
            socket.send("gamelist/count/unsubscribe", "kidsgo");
        };
    }, []);

    React.useEffect(() => {
        socket.send(
            "gamelist/query",
            {
                list: "kidsgo",
                sort_by: "rank",
                where: null,
                from: 0,
                limit: 100,
                channel: null,
            },
            (res: any) => {
                setGames(res.results);
            },
        );
    }, [active_games_count]);

    if (games.length <= 0) {
        return null;
    }

    return (
        <div className="ActiveGamesList">
            <h4>Games to watch</h4>
            {games.map((game) => {
                return (
                    <div
                        key={game.id}
                        className={"game" + (props.value?.id === game.id ? " active" : "")}
                        onClick={() => props.onChange(game)}
                    >
                        <span> vs </span>
                        <div className="players">
                            <div className="player-row">
                                <PlayerAvatar user_id={game.white.id} /> {game.white.username}
                            </div>
                            <div className="player-row">
                                <PlayerAvatar user_id={game.black.id} /> {game.black.username}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

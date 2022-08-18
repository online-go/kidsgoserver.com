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
import { Content } from "./Content";
import { PuzzleConfig, Goban } from "goban";

class Module2 extends Content {
    constructor() {
        super();
    }
}

class Page1 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <span>
                Based on the last lesson you might think the goal of this game is to capture stones,
                but actually whoever has the most territory wins.
            </span>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6e5f5g5",
                white: "",
            },
        };
    }
}

class Page2 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                Territory is the empty space we surround. Here is one kind of territory using the
                edge of the board. There are four points in the corner.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6e5f5g5",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("f7", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("g7", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("f6", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("g6", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                Here is another kind of territory, made by surrounding space in the middle. How many
                points of territory does Black have here?
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c5c4d3e3f4f5d6e6",
                white: "",
            },
        };
    }
}

class Page4 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>Four points is right.</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c5c4d3e3f4f5d6e6",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("e5", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("d4", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("e4", "4"));
    }
}

class Page5 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>How many points does Black have here?</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "a4b4b2c3d3e3e2e1",
                white: "a5b5c5c4d4e4f4f3f2f1",
            },
        };
    }
}

class Page6 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>The answer is 9 points for Black.</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "a4b4b2c3d3e3e2e1",
                white: "a5b5c5c4d4e4f4f3f2f1",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("a3", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("b3", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("a2", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("c2", "4"));
        this.delay(() => goban.setMarkByPrettyCoord("d2", "5"));
        this.delay(() => goban.setMarkByPrettyCoord("a1", "6"));
        this.delay(() => goban.setMarkByPrettyCoord("b1", "7"));
        this.delay(() => goban.setMarkByPrettyCoord("c1", "8"));
        this.delay(() => goban.setMarkByPrettyCoord("d1", "9"));
    }
}

class Page7 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                In Go, we play until the two colors are touching each other, and the empty space
                each surrounds is their territory.{" "}
            </p>,
            <p>Black has territory on the left, and White has it on the right. </p>,
            <p>Black also captured three stones, which went in the prisoner bowl.</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "b9b8c7c6c5c3d8d4d2d1e9e8e7e1e3e4e5f4",
                white: "d7d6d5e6f9f8f7f6f5f3f2f1g3g4g6e2",
            },
        };
    }
}

class Page8 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>We can see Black has 23 points.</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "b9b8c7c6c5c3d8d4d2d1e9e8e7e1e3e4e5f4",
                white: "d7d6d5e6f9f8f7f6f5f3f2f1g3g4g6e2",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("a9a8a7a6a5a4a3a2a1b7b6b5b4b3b2b1c9c8c1c2c4d3d9", "circle");
    }
}

class Page9 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>And it looks like White has 24, so White would win by one.</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "b9b8c7c6c5c3d8d4d2d1e9e8e7e1e3e4e5f4",
                white: "d7d6d5e6f9f8f7f6f5f3f2f1g3g4g6e2",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g9g8g7g5g2g1h9h8h7h6h5h4h3h2h1j9j8j7j6j5j4j3j2j1", "circle");
    }
}

class Page10 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                But, those three stones that Black captured are subtracted from White's territory.
                Now the score is Black 23 and White 21, so Black wins by two.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "b9b8c7c6c5c3d8d4d2d1e9e8e7e1e3e4e5f4",
                white: "d7d6d5e6f9f8f7f6f5f3f2f1g3g4g6e2g9g8g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g5g2g1h9h8h7h6h5h4h3h2h1j9j8j7j6j5j4j3j2j1", "circle");
        goban.setMarkByPrettyCoord("g9g8g7", "circle");
    }
}

class Page11 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                The game ends when both players pass. Can White play on Black's side? Yes, but they
                will likely be captured. Black could also play on White's side, but again they would
                likely be captured. But either side is free to try if they think they can make a
                group that won't be captured.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "b9b8c7c6c5c3d8d4d2d1e9e8e7e1e3e4e5f4",
                white: "d7d6d5e6f9f8f7f6f5f3f2f1g3g4g6e2",
            },
        };
    }
}

class Page12 extends Module2 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If you think the game is over, just pass a stone. If your opponent plays a stone
                then you can either play or pass. Two passes in a row ends the game. However, as
                Black played first, White must play (or pass) last.
            </p>,
            <p>
                You now know enough to play your first game of Go! There are actually two more
                rules, but it can be confusing at first. Play a couple games against the Easy Bot +4
                and then come back to read the rest of these lessons.
            </p>,
        ];
    }
    axolotlFace() {
        return true;
    }
}

export const module2: Array<typeof Content> = [
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Page9,
    Page10,
    Page11,
    Page12,
];

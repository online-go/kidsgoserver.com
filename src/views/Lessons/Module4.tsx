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
import { PuzzleConfig, Goban, JGOFNumericPlayerColor } from "goban";
import { openPopup } from "PopupDialog";

class Module4 extends Content {
    constructor() {
        super();
    }
}

class Page1 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Here is a situation that sometimes comes up. Notice that the White stone at A is in
                atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5",
                white: "d4e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "A");
    }
}

class Page2 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Since Black is capturing a stone, playing at B is allowed. But now Black is in
                atari..
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("e4", "B");
    }
}

class Page3 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>So White can play at A again and capture it. But now White is in atari...</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5",
                white: "d4e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "A");
    }
}

class Page4 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                So Black could capture, but then would be in atari again... This could go on
                forever, so there is a special rule to cover it.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("e4", "B");
    }
}

class Page5 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                The first player to capture a stone in a position like this starts what is called a
                ko. On this board, Black would start a ko by capturing at 1.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5",
                white: "d4e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "A");
        goban.setMarkByPrettyCoord("e4", "1");
    }
}

class Page6 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                The rule of ko prevents a player from immediately recapturing, but it only affects
                the first move after a capture.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "triangle");
        goban.setMarkByPrettyCoord("e4", "1");
    }
}

class Page7 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Basically, White can play anywhere on the board except at the triangled point. So
                perhaps White will play at 2, and then Black might play at 3.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "e3e5f4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "triangle");
        goban.setMarkByPrettyCoord("e4", "1");
        this.delay(() => {
            goban.engine.editPlace(4, 5, JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoord("d4", "triangle");
            goban.setMarkByPrettyCoord("e4", "1");
            goban.setMarkByPrettyCoord("e2", "2");
        });
        this.delay(() => {
            goban.engine.editPlace(4, 1, JGOFNumericPlayerColor.BLACK);
            goban.setMarkByPrettyCoord("d4", "triangle");
            goban.setMarkByPrettyCoord("e4", "1");
            goban.setMarkByPrettyCoord("e2", "2");
            goban.setMarkByPrettyCoord("e6", "3");
        });
    }
}

class Page8 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                Since White played at 2 on the last turn, a play at A is now allowed. Now it is
                Black's turn to be caught by the rule of ko. Black can play anywhere except the
                triangled point.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e6",
                white: "e3e5f4e2d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("e4", "triangle");
        goban.setMarkByPrettyCoord("e2", "2");
        goban.setMarkByPrettyCoord("e6", "3");
        goban.setMarkByPrettyCoord("d4", "A");
    }
}

class Page9 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>So perhaps Black will play at 1 to prevent a cut by White.</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e6c3",
                white: "e3e5f4e2d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("e4", "triangle");
        goban.setMarkByPrettyCoord("c3", "1");
    }
}

class Page10 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                If White feels the ko is more important, it can be filled in with 2. In this case,
                Black actually gets a solid position by playing at 3. So each side got something.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e6c3c6",
                white: "e3e5f4e2d4e4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c3", "1");
        goban.setMarkByPrettyCoord("e4", "2");
        goban.setMarkByPrettyCoord("c6", "3");
    }
}

class Page11 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                Sometimes winning the ko can affect the life of a whole group. If Black can capture
                and then fill the ko at A, the group will make two safe eyes. If White wins, all the
                Black stones will be prisoners!
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7f7e6f5g6",
                white: "d6d7e5f4g5g3e3",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g4", "A");
    }
}

class Page12 extends Module4 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Sometimes a ko is meaningless and only affects the stone in atari. Don't worry about
                ko too much for right now, just start playing some games on the server and you will
                learn more as you go. When you are ready, come back and do some more lessons.
            </p>,
        ];
    }
    axolotlFace() {
        return true;
    }
    hidePlayButton() {
        return true;
    }
}

export const module4: Array<typeof Content> = [
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

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

class Module5 extends Content {
    constructor() {
        super();
    }
}

class Page1 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Here is an example of how things might happen in a real game. Let's look at these
                two stones first. They are not a group, because diagonal intersections are not
                connected to each other.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7g6",
                white: "",
            },
        };
    }
}

class Page2 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                With enough moves, both stones could be captured. The white stone at 1 places both
                black stones into atari at once, or double atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7g6",
                white: "e7f6g5g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "1");
    }
}

class Page3 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Black could add a stone at 2 to make a group with three liberties</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7g6f8",
                white: "e7f6g5g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "1");
        goban.setMarkByPrettyCoord("f8", "2");
    }
}

class Page4 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White can still capture the other stone at 3 though, because it is not connected to
                the black group.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8",
                white: "e7f6g5g7h6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "1");
        goban.setMarkByPrettyCoord("f8", "2");
        goban.setMarkByPrettyCoord("h6", "3");
    }
}

class Page5 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White might try to capture the black group by adding a stone at 1. Black might try
                playing at 2 to save the stones.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8",
                white: "e7f6g5g7h6g8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g8", "1");
        goban.setMarkByPrettyCoord("e8", "2");
    }
}

class Page6 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Now maybe White gets impatient and tries to surround Black's group with 3. Black
                responds with 4, which puts White's stone at A into atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7",
                white: "e7f6g5g7h6g8d8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g8", "1");
        goban.setMarkByPrettyCoord("e8", "2");
        goban.setMarkByPrettyCoord("d8", "3");
        goban.setMarkByPrettyCoord("d7", "4");
        goban.setMarkByPrettyCoord("e7", "A");
    }
}

class Page7 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White will lose the stone at A if black plays at B, so Black adds a stone there to
                form a new group.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7",
                white: "e7f6g5g7h6g8d8e6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("e7", "A");
        goban.setMarkByPrettyCoord("e6", "B");
    }
}

class Page8 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Now black has turned the tables on white! Playing at 1 puts white C into atari.</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8",
                white: "e7f6g5g7h6g8d8e6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c8", "1");
        goban.setMarkByPrettyCoord("d8", "C");
    }
}

class Page9 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White adds a stone at 2, but there is a problem. 2 is on the edge of the board,
                which means there is one liberty less!
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8",
                white: "e7f6g5g7h6g8d8e6d9",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c8", "1");
        goban.setMarkByPrettyCoord("d9", "2");
    }
}

class Page10 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                This means that a move by black at either A or B will put white into atari. Which
                one do you think is best?
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8",
                white: "e7f6g5g7h6g8d8e6d9",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c9", "A");
        goban.setMarkByPrettyCoord("e9", "B");
    }
}

class Page11 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Let's look at B first. This move looks good because on the next turn black could
                capture the two white stones at A.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8e9",
                white: "e7f6g5g7h6g8d8e6d9",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c9", "A");
    }
}

class Page12 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Unfortunately, it is not black's turn. While it is true that white is in atari,
                black is also now in atari, so white can capture at C and remove four black stones.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_player: "white",
            flip_animated_capture_color: true,
            initial_state: {
                //black: "d7c8",
                black: "f7f8e8d7c8e9",
                white: "e7f6g5g7h6g8d8e6d9",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f9", "C");
        //goban.setMarkByPrettyCoord("e9e8f8f7", "square");

        this.delay(() => {
            goban.placeByPrettyCoord("f9");
            goban.setMarkByPrettyCoord("f9", "C");
            goban.setMarkByPrettyCoord("e9e8f8f7", "square");
        }, 3000);
    }
}

class Page13 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Let's try going the other way this time. A black play at A also puts the two white
                stones in atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8c9",
                white: "e7f6g5g7h6g8d8e6d9",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c9", "A");
    }
}

class Page14 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Now even if white adds a stone at 2, which puts black into atari at D...</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "f7f8e8d7c8c9",
                white: "e7f6g5g7h6g8d8e6d9e9",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("c9", "1");
        goban.setMarkByPrettyCoord("e9", "2");
        goban.setMarkByPrettyCoord("f9", "D");
    }
}

class Page15 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>It is now black's turn, and playing at D captures all three white stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            flip_animated_capture_color: true,
            initial_state: {
                black: "f7f8e8d7c8c9",
                white: "e7f6g5g7h6g8d8e6d9e9",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f9", "D");
        this.delay(() => {
            goban.placeByPrettyCoord("f9");
            goban.setMarkByPrettyCoord("f9", "D");
        }, 3000);
    }
}

class Page16 extends Module5 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                In Go, the placement of a single stone can make the difference between whether you
                capture a large group or lose one of your own. That is part of the fun!
            </p>,
        ];
    }
    axolotlFace() {
        return true;
    }
}

export const module5: Array<typeof Content> = [
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
    Page13,
    Page14,
    Page15,
    Page16,
];

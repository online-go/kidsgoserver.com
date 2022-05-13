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

declare let swal;

class Module1 extends Content {
    constructor() {
        super();
    }
}

class Page1 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <span>In Go, we place stones on the lines, not in the squares!</span>,
            <span>Black goes first, followed by white.</span>,
            <span>
                Stones stay on the board once placed and don’t move (unless they are captured).
            </span>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "d4",
                white: "",
            },
        };
    }
}

class Page2 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                The spaces next to the stones are important, we call them Liberties. This stone has
                four liberties.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "d4",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("e4", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("d3", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("c4", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                There are no liberties off the edge of the board, so this stone only has two
                liberties.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "g7",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("f7", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("g6", "2"));
    }
}

class Page4 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>And this stone only has three</p>;
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "d7",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("c7", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("d6", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("e7", "3"));
    }
}

class Page5 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                Stones that touch each other are friends, they get to share their liberties and play
                as a team!
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.editPlaceByPrettyCoord("d4", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.editPlaceByPrettyCoord("e4", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.setMarkByPrettyCoord("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("e5", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("f4", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("e3", "4"));
        this.delay(() => goban.setMarkByPrettyCoord("d3", "5"));
        this.delay(() => goban.setMarkByPrettyCoord("c4", "6"));
    }
}

class Page6 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                If the other player surrounds 3 out of 4 liberties, we say the stone is in Atari,
                which means it can be captured on the next turn.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "D4",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.editPlaceByPrettyCoord("c4", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.editPlaceByPrettyCoord("d3", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.editPlaceByPrettyCoord("e4", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.setMarkByPrettyCoord("d5", "triangle"));
    }
}

class Page7 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>If we add a stone, then they become team players and get new liberties.</p>,
            <p>Now they have three liberties and are safe from being captured!</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "D4",
                white: "C4D3E4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.editPlaceByPrettyCoord("d5", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.setMarkByPrettyCoord("c5", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("d6", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("e5", "3"));
    }
}

class Page8 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                If black goes somewhere else though, then white can capture the stone and remove it
                from the board
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "D4",
                white: "C4D3E4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.placeByPrettyCoord("f5"));
        this.delay(() => goban.placeByPrettyCoord("d5"));
    }
}

class Puzzle1 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>Lets try some simple problems now. Try and capture the White stone.</p>;
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "C7D6",
                white: "D7",
            },
            //'move_tree': this.makePuzzleMoveTree(["E7"], [])
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("update", () => {
            if (goban.engine.board[0][3] === 0) {
                swal({
                    title: "Good job!",
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            }
        });
    }
}

class Puzzle2 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>Try and capture the White stone.</p>;
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "E5D4E3",
                white: "E4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("update", () => {
            if (goban.engine.board[3][4] === 0) {
                swal({
                    title: "You did it!",
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            }
        });
    }
}

class Puzzle3 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>Try and capture the White stones.</p>;
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "E5E2D4D3F4",
                white: "E4E3",
            },
            //'move_tree': this.makePuzzleMoveTree(["E7"], [])
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("update", () => {
            if (goban.engine.board[3][4] === 0) {
                console.log("SUCCESS");
                swal({
                    title: "Nice work!",
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            }
        });
    }
}

class Puzzle4 extends Module1 {
    text(): JSX.Element | Array<JSX.Element> {
        return <p>Try and capture the White stones.</p>;
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "D6E6D5F5C4D3D2E2F3",
                white: "D4E5E4E3",
            },
            //'move_tree': this.makePuzzleMoveTree(["E7"], [])
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("update", () => {
            if (goban.engine.board[3][4] === 0) {
                console.log("SUCCESS");
                swal({
                    title: "Very clever!",
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            }
        });
    }
}

export const module1: Array<typeof Content> = [
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,

    Puzzle1,
    Puzzle2,
    Puzzle3,
    Puzzle4,
];

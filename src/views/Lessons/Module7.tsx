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
import { Axol } from "./Axol";
import { openPopup } from "@kidsgo/components/PopupDialog";

const POPUP_TIMEOUT = 1500;

class Module7 extends Content {
    constructor(audioUrl: string, shouldPlayAudio?: boolean) {
        super();
        this.audioUrl = audioUrl;

        if (shouldPlayAudio !== undefined) {
            this.shouldPlayAudio = shouldPlayAudio;
        }
    }
}

class Page1 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Audio coming soon!</p>,
            <p>
                Understanding when the game is over can be confusing. The most important thing is to
                keep playing until you have clear borders.
            </p>,
            <p> This game is almost done, let's look a little closer.</p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c2c3c5c6c7d3d4d7e3e4e8e9f4f5f6",
                white: "d2e2e6e7f2f3f7f8g3g4g6g7h2h4h8",
            },
        };
    }
}

class Page2 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                First: finish the territories by playing to the edge. Here the Blue stone pushes
                into White's area, making it a little smaller and sealing the edge.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c2c3c5c6c7d3d4d7e3e4e8e9f4f5f6",
                white: "d2e2e6e7f2f3f7f8g3g4g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("d1");
            goban.setMarkByPrettyCoordinates("d1", "1");
        });
    }
}

class Page3 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White has a hole in the wall on the right side and fills it to close the territory.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c2c3c5c6c7d1d3d4d7e3e4e8e9f4f5f6",
                white: "d2e2e6e7f2f3f7f8g3g4g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoordinates("d1", "1");

        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("g5", JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("d1", "1");
            goban.setMarkByPrettyCoordinates("g5", "2");
        });
    }
}

class Page4 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Blue pushes further along the edge. White blocks and puts Blue into Atari. Blue
                connects so the stones won't be captured.
            </p>,
            <p>Connections along the edge like this are common in the endgame.</p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c2c3c5c6c7d1d3d4d7e3e4e8e9f4f5f6",
                white: "d2e2e6e7f2f3f7f8g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("e1");

            goban.setMarkByPrettyCoordinates("e1", "1");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("f1");

            goban.setMarkByPrettyCoordinates("e1", "1");
            goban.setMarkByPrettyCoordinates("f1", "2");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("c1");

            goban.setMarkByPrettyCoordinates("e1", "1");
            goban.setMarkByPrettyCoordinates("f1", "2");
            goban.setMarkByPrettyCoordinates("c1", "3");
        });
    }
}

class Page5 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>White could then connect to the top edge to finish enclosing territory.</p>,
            <p>Now is the game done? Are all the connections secure?</p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7e1e3e4e8e9f4f5f6",
                white: "d2e2e6e7f1f2f3f7f8g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("f9", JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("f9", "1");
        });
    }
}

class Page6 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                No, White 1 is dangerous. If Blue plays in the middle at 2, oops! Now White can cut
                at 3 and Blue is in trouble.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7e1e3e4e8e9f4f5f6",
                white: "d2e2e6e7f1f2f3f7f8g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("f9", JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("f9", "1");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("e5");
            goban.setMarkByPrettyCoordinates("f9", "1");
            goban.setMarkByPrettyCoordinates("e5", "2");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d8");
            goban.setMarkByPrettyCoordinates("f9", "1");
            goban.setMarkByPrettyCoordinates("e5", "2");
            goban.setMarkByPrettyCoordinates("d8", "3");
        });
    }
}

class Page7 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Adding a stone on the bottom line doesnt help as the group is still in atari, Blue
                just loses more stones.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7e1e3e4e8e5e9f4f5f6",
                white: "d2d8e2e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            // goban.editPlaceByPrettyCoordinates("d8", JGOFNumericPlayerColor.WHITE);
            goban.placeByPrettyCoordinates("d9");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("c9");
        });
    }
}

class Page8 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Instead, Blue can play this way. White captures two stones, and Blue seals the edge
                between the colors.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7e1e3e4e8e5e9f4f5f6",
                white: "d2d8e2e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("c8");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d9");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("c9");
        });
    }
}

class Page9 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Let's go back. When White played at 1, Blue needed to connect the stones at 2 to be
                safe.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7e1e3e4e8e9f4f5f6",
                white: "d2e2e6e7f1f2f3f7f8g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("f9", JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("f9", "1");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d8");
            goban.setMarkByPrettyCoordinates("f9", "1");
            goban.setMarkByPrettyCoordinates("d8", "2");
        });
    }
}

class Page10 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                The walls are now complete, but there are spaces between the two groups - marked
                with squares. We call these neutral points. Often (but not always) these points
                aren't very important.
            </p>,
            <p>
                They won't count as territory, but they are part of your area and need to be filled
                in to score the game.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7d8e1e3e4e8e9f4f5f6",
                white: "d2e2e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoordinates("d6", "square");
        goban.setMarkByPrettyCoordinates("d5", "square");
        goban.setMarkByPrettyCoordinates("e5", "square");
    }
}

class Page11 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Remember, you must either play a stone or pass a stone to your opponent as a
                prisoner, so playing on a neutral point saves you one point.
            </p>,
            <p>
                So go along the borders of each territory and fill in any gaps. Pass a stone to show
                you are done. White passes last. Score the game.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7d8e1e3e4e8e9f4f5f6",
                white: "d2e2e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("e5", JGOFNumericPlayerColor.WHITE);
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d5");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d6");
        });
    }
}

class Page12 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Once your walls are safe, if you play inside your own area instead of expanding to a
                neutral point, your opponent can take it. You've lost a point of territory.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d7d8e1e3e4e8e9f4f5f6",
                white: "d2e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("d5");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("g1");
            // goban.setMarkByPrettyCoordinates("g1", "triangle");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("d6");
        });
        this.delay(() => {
            goban.setMarkByPrettyCoordinates("g1", "triangle");
        });
    }
}

class Page13 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Inside a player's territory, the stones do not need to touch.</p>,
            <p>You don't want to play inside unless you need to defend or connect something.</p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
}

class Page14 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Blue has 22 points and White has 19 points.</p>];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        const s = goban.engine.computeScore(false);
        goban.showScores(s, true);
    }
}

class Page15 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>The end of the game could have looked like this.</p>,
            <p>
                The edges of all the territories are touching, but there are some stones trapped
                behind the walls. These are marked with triangles. They could be captured, or they
                could live.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6g8h7",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8b2b3",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoordinates("g8h7b2b3", "triangle");
    }
}

class Page16 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If each side tires to make a living group, and neither side tried to stop the other,
                these stones could live.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6g8h7",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8b2b3",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("j8");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("b4");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("b5");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("b1");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("h9");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("a4");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("a5");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("a2");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("g9");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("h6");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("j6");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("j5");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("j7");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("c4");
        });
    }
}

class Page17 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>If each side captures the trapped stones, the game might go like this.</p>,
            <p>
                So the principle remains the same: surround all areas that you can, capture any
                stones that you can, and seal all the edges.
            </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6g8h7",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8b2b3",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoordinates("b4");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("h6");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("a3");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("j7");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("a2");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("g9");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("b1");
        });
    }
}

class Page18 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                At this point, White could pass, Blue passes, and White must pass once more to keep
                the number of stones played equal.
            </p>,
            <p>
                The game ends here and can be scored. The score is Blue 18 and White 16, but Blue
                captured 3 prisoners and White captured 2, so it is 16-13.
            </p>,
            <p>
                The computer will score the game for you, but you have to pass in order to get
                there.
            </p>,
            // <p>
            //     You can go back and forth between the end of the game and the score by clicking on
            //     View Game or Show Score.
            // </p>,
        ];
    }

    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            width: 9,
            height: 9,
            initial_state: {
                black: "c1c2c3c5c6c7d1d3d4d5d7d8e1e3e4e8e9f4f5f6b1b4a2a3",
                white: "d2d6e2e5e6e7f1f2f3f7f8f9g3g4g5g6g7h2h4h8g9h6j7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        const s = goban.engine.computeScore(false);
        goban.showScores(s, true);
    }
}

class Page19 extends Module7 {
    constructor() {
        super("no_audio_here");
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Congratulations on making it through all 7 lessons! You now have the basics down,
                and as you play more, your understanding of the game will deepen.
            </p>,
            <p>
                The next section contains 100 problems in eight different categories, and they get
                harder as you work through them.
            </p>,
            <p>Solving these kinds of problems is fun!</p>,
        ];
    }
    axolotlFace() {
        return true;
    }
    hidePlayButton() {
        return true;
    }
}

export const module7: Array<typeof Content> = [
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
    Page17,
    Page18,
    Page19,
];

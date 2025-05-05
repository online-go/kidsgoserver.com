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

class Module4 extends Content {
    constructor(audioUrl: string) {
        super();
        this.audioUrl = audioUrl;
    }
}

class Page1 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708636014/audio-slices-less-pauses/slice64_less_pauses_revised_lppayu.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Here's a situation that sometimes comes up. Notice that the White stone at A is in
                atari?
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
        goban.setMarkByPrettyCoordinates("d4", "A");
    }
}

class Page2 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708636318/audio-slice-less-pauses-COMBINED/slice65_and_66_combined_j2mjda.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Since Blue is capturing a stone and getting a liberty, playing at B is allowed.</p>,
            <p>But now Blue is in atari...</p>,
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
        goban.setMarkByPrettyCoordinates("e4", "B");
    }
}

class Page3 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708636476/audio-slices-less-pauses/slice67_less_pauses_revised_hg7s10.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>So White could play at A again and capture Blue. But now White is in atari...</p>,
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
        goban.setMarkByPrettyCoordinates("d4", "A");
    }
}

class Page4 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708636656/audio-slice-less-pauses-COMBINED/slice68_69_and_70combined_ffqsh6.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>So Blue could capture, but then would be in atari again...</p>,
            <p>This could go on forever, so there is a special rule to cover it.</p>,
            <p>
                You can’t repeat the position. You can’t recreate the same exact pattern of stones
                on the board.
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
        goban.setMarkByPrettyCoordinates("e4", "B");
    }
}

class Page5 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708636813/audio-slices-less-pauses/slice71_less_pauses_revised_e95kry.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                So the first player to capture in a position like this starts what is called a "ko".
                On this board, Blue would start a ko by capturing at 1.
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
        goban.setMarkByPrettyCoordinates("e4", "1");
    }
}

class Page6 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472600/audio-slices-less-pauses/slice70_less_pauses_obbwtz.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                The ko rule prevents a player from immediately recapturing. That would repeat the
                board. But it only affects the first move after a capture.
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
        goban.setMarkByPrettyCoordinates("d4", "triangle");
        goban.setMarkByPrettyCoordinates("e4", "1");
    }
}

class Page7 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708637273/audio-slice-less-pauses-COMBINED/slice73_and_74_combined_mscsc1.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                So White can play anywhere on the board except at the triangled point. Perhaps White
                will play at 2, and then Blue might play at say, 3.
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
        goban.setMarkByPrettyCoordinates("d4", "triangle");
        goban.setMarkByPrettyCoordinates("e4", "1");
        this.delay(() => {
            goban.engine.editPlace(4, 5, JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("d4", "triangle");
            goban.setMarkByPrettyCoordinates("e4", "1");
            goban.setMarkByPrettyCoordinates("e2", "2");
        }, 6000);
        this.delay(() => {
            goban.engine.editPlace(4, 1, JGOFNumericPlayerColor.BLACK);
            goban.setMarkByPrettyCoordinates("d4", "triangle");
            goban.setMarkByPrettyCoordinates("e4", "1");
            goban.setMarkByPrettyCoordinates("e2", "2");
            goban.setMarkByPrettyCoordinates("e6", "3");
        }, 2500);
    }
}

class Page8 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472604/audio-slices-less-pauses/slice73_less_pauses_k2puq1.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Since the board has changed, a play at A is allowed. Now it’s Blue's turn to be
                caught by the rule of ko. Blue can play anywhere except the triangled point.
            </p>,
        ];
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
        goban.setMarkByPrettyCoordinates("e4", "triangle");
        goban.setMarkByPrettyCoordinates("e2", "2");
        goban.setMarkByPrettyCoordinates("e6", "3");
        goban.setMarkByPrettyCoordinates("d4", "A");
    }
}

class Page9 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472598/audio-slices-less-pauses/slice74_less_pauses_tsdqt4.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>So perhaps Blue will play at 1 to connect two stones and prevent a cut by White.</p>,
        ];
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
        goban.setMarkByPrettyCoordinates("e4", "triangle");
        goban.setMarkByPrettyCoordinates("c3", "1");
    }
}

class Page10 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472612/audio-slices-less-pauses/slice75_less_pauses_d1dylj.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If White thinks the ko is more important, it can be filled in with 2. In this case,
                Blue actually gets a good solid position by playing at 3. So each side got
                something.
            </p>,
        ];
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
        goban.setMarkByPrettyCoordinates("c3", "1");
        goban.setMarkByPrettyCoordinates("e4", "2");
        goban.setMarkByPrettyCoordinates("c6", "3");
    }
}

class Page11 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708637886/audio-slices-less-pauses/slice78_less_pauses_revised_tyedip.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Sometimes winning the ko can affect the life of a whole group. If Blue can capture
                and then fill the ko at A, the group will make two eyes. If White wins, all the Blue
                stones can be captured!
            </p>,
        ];
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
        goban.setMarkByPrettyCoordinates("g4", "A");
    }
}

class Page12 extends Module4 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708637983/audio-slices-less-pauses/slice79_less_pauses_revised_m0msdr.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Sometimes a ko is meaningless and only affects the stone in atari. Don't worry about
                ko too much for right now, just start playing some games and you'll learn more as
                you go. When you're ready, come back and do some more lessons.
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

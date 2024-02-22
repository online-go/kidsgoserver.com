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
    audioRef: React.RefObject<HTMLAudioElement>;
    audioUrl: string;

    constructor(audioUrl: string) {
        super();
        this.audioRef = React.createRef();
        this.audioUrl = audioUrl;
    }

    playAudio = async () => {
        const audio = this.audioRef.current;
        if (audio) {
            await audio.play();
        }
    };

    componentWillUnmount() {
        // Stop audio playback and cleanup when the component is about to unmount
        const audio = this.audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

class Page1 extends Module5 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472606/audio-slices-less-pauses/slice78_less_pauses_k9xkqa.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>Here's an example of how some things might play out in a real game.</p>,
            <p>
                Let's look at these two stones. They're not a team, because diagonal points are not
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
            },
        };
    }
}

class Page2 extends Module5 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472607/audio-slices-less-pauses/slice79_less_pauses_srqee7.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                With enough moves, both stones could be captured. The white stone at 1 places both
                Blue stones into atari at once, or double atari.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472601/audio-slices-less-pauses/slice80_less_pauses_v0jd9a.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>Blue could add a stone at 2 to make a group with three liberties</p>,
        ];
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
        // These 3 below triangles are not in the instructions, but I think would be helpful for visual purposes
        this.delay(() => goban.setMarkByPrettyCoord("e8", "triangle"));
        this.delay(() => goban.setMarkByPrettyCoord("f9", "triangle"));
        this.delay(() => goban.setMarkByPrettyCoord("g8", "triangle"));
    }
}

class Page4 extends Module5 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472600/audio-slices-less-pauses/slice81_less_pauses_wvf1ee.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                White can still capture the other stone at 3 though, because it's not connected to
                the Blue group.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472608/audio-slices-less-pauses/slice82_less_pauses_ikjoo1.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                So White might try to capture the Blue group by adding a stone at 1. Blue might try
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708639605/audio-slices-less-pauses/slice85_less_pauses_revised_dgu07k.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                Maybe White gets impatient and tries to surround Blue's group with 3. Blue responds
                with 4, which puts White's stone at A into atari.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708638936/audio-slice-less-pauses-COMBINED/slice86_and_87_combined_ct8ryr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                White will lose the stone at A if Blue plays at B, so White adds a stone there to
                get new liberties.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472602/audio-slices-less-pauses/slice86_less_pauses_srkqgo.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>Now Blue has turned the tables on white! Playing at 1 puts white C into atari.</p>,
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708639046/audio-slices-less-pauses/slice89_less_pauses_revised_llnh9k.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                White adds a stone at 2, but there's a problem. 2 is on the edge of the board, which
                means there is one liberty less!
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472610/audio-slices-less-pauses/slice88_less_pauses_f7u8uy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                This means that a move by Blue at either A or B will put two white stones into
                atari. Which one do you think is best?
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472603/audio-slices-less-pauses/slice89_less_pauses_ahaovx.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                Let's look at B first. This move looks good because on the next turn Blue could
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472620/audio-slices-less-pauses/slice90_less_pauses_tb5ayg.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                Unfortunately, it's not Blue's turn. While it is true that white is in atari, Blue
                is also now in atari, so white can capture first - at C - and remove four Blue
                stones.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708639218/audio-slices-less-pauses/slice93_less_pauses_revised_muwwqy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                Let's try going the other way this time. A Blue play at A also puts the two white
                stones into atari.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472612/audio-slices-less-pauses/slice92_less_pauses_vqjtar.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>Now even if white adds a stone at 2, which puts Blue into atari at D...</p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472617/audio-slices-less-pauses/slice93_less_pauses_sxisdv.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>It's now Blue's turn, and playing at D captures all three white stones.</p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708639374/audio-slices-less-pauses/slice96_less_pauses_revised_u8kay3.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <button key="playButton" onClick={this.playAudio}>
                Play Audio
            </button>,
            <audio
                key="audioElement"
                ref={this.audioRef}
                style={{ visibility: "hidden" }}
                autoPlay={true}
                src={this.audioUrl}
            ></audio>,
            <p>
                In Go, the placement of a single stone can make the difference between capturing a
                large group or losing one of your own. That's part of the fun!
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

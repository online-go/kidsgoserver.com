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

class Page1 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852232/kids-go-server-audio-slices/slice_20_reqwv4.wav",
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
            <span>
                Based on the last lesson you might think the goal of this game is to capture stones,
                but actually whoever surrounds the most territory at the end of the game wins.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852227/kids-go-server-audio-slices/slice_21_vwvl5j.wav",
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
                Territory is the empty space we surround. Here is one kind of territory using the
                edge of the board. There are four points of territory in the corner.
            </p>,
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
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoord("f7", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("g7", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("f6", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("g6", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852198/kids-go-server-audio-slices/slice_22_h86mpc.wav",
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
                Here is another kind of territory, made by surrounding space in the middle. How many
                points of territory does Blue have here?
            </p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852121/kids-go-server-audio-slices/slice_23_m0ael8.wav",
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
            <p>Four points is right.</p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852123/kids-go-server-audio-slices/slice_24_yz7ec2.wav",
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
            <p>How many points does Blue have here?</p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854699/kids-go-server-COMBINED-audio-slices/slice_audio16_obgny8.wav",
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
            <p>The answer is 9 points for Blue.</p>,
            // This wasn't an array originally, but we need this following paragraph added.
            <p>Remember you only need to build your fence up to the edge of the board. </p>,
        ];
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

// This is too long for the page I think, also a bit confusing,
// I never liked explaining the pass rule, especially to kids, just say if both players say pass one after another,
// the game ends and we score the game or something. Or something like "when you think the game is over, say "pass", if your opponent also thinks the game is over, they can say
// "pass" too, then we can score the game!
class Page7 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854861/kids-go-server-COMBINED-audio-slices/slice_audio17_ssdn57.wav",
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
                In Go, we play until the two colors are touching each other, and the empty space
                each blocks off and surrounds is their territory.{" "}
            </p>,
            <p>Can White play on Blue's side? Yes.</p>,
            <p>Can Blue play on White's side? Yes.</p>,
            <p>
                Each side is free to try if they think they can make a group that can’t be captured.
            </p>,
            <p>
                If you think the game is over, just pass a stone to your opponent. If your opponent
                plays a stone then you can either play or pass.
            </p>,
            <p>
                Two passed stones in a row end the game. However, since Blue played first, White
                must pass last.
            </p>,
            <p>Blue has territory on the left, and White has it on the right.</p>,
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852130/kids-go-server-audio-slices/slice_34_prpbdr.wav",
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
            <p>We can see Blue has 23 points.</p>,
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
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("a9a8a7a6a5a4a3a2a1b7b6b5b4b3b2b1c9c8c1c2c4d3d9", "circle");
    }
}

class Page9 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852131/kids-go-server-audio-slices/slice_35_wfol1w.wav",
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
            <p>And White has 24, so White is ahead by one.</p>,
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
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g9g8g7g5g2g1h9h8h7h6h5h4h3h2h1j9j8j7j6j5j4j3j2j1", "circle");
    }
}

class Page10 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854836/kids-go-server-COMBINED-audio-slices/slice_audio20_c9djke.wav",
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
            <p>But Blue also captured three stones which went into the prisoner bowl.</p>,
            <p>Those three stones that Blue captured are subtracted from White's territory.</p>,
            <p>Now the score is Blue 23 and White 21 so Blue wins by two.</p>,
        ];
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

// Original Page 11 was removed
class Page11 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852250/kids-go-server-audio-slices/slice_39_mxndol.wav",
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
                When we play face-to-face we put all captures back into the territory of the same
                color. So at the end of the game, the board will have all the stones played during
                the game and both will have played the same number of stones.
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

class Page12 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854836/kids-go-server-COMBINED-audio-slices/slice_audio22_mqye6w.wav",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            // Audio not matching, need to record "and then come back to read the rest of these lessons."
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

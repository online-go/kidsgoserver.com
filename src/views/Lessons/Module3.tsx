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
import { Axol } from "./Axol";

class Module3 extends Content {
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

class Page1 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708554656/audio-slice-less-pauses-COMBINED/slice45_and_48_combined_dgsntg.mp3",
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
                One of the few rules in Go is that any stone played must have at least one liberty
                after it's played.
            </p>,
            <p>
                Remember that taking a stone's last liberty will capture it. White cannot play at
                the triangled point because the stones wouldn't have any liberties.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "triangle");
    }
}

class Page2 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708554818/audio-slices-less-pauses/slice46_less_pauses_revised_npgupt.mp3",
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
                Now notice that this group has been completely closed in on the outside, although it
                does still have liberties inside.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4",
            },
        };
    }
}

class Page3 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472373/audio-slices-less-pauses/slice45_less_pauses_qcmti9.mp3",
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
                If it's Blue's turn, a play in the middle will create a group with two separate
                liberties inside. These are called eyes, and this group has two of them.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g7",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    // Added triangles here to this goban view
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7g6", "triangle");
    }
}

class Page4 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472580/audio-slices-less-pauses/slice47_less_pauses_oddmrp.mp3",
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
                White cannot play at either of the triangled points here, so Blue can never come
                into atari. A group like this can not be captured because it has two eyes.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g7",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7g6", "triangle");
    }
}

class Page5 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472377/audio-slices-less-pauses/slice48_less_pauses_l10z1c.mp3",
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
            <p>What happens if White gets to play in the middle first?</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        //goban.setMarkByPrettyCoord("f7g6", "triangle");
        goban.setMarkByPrettyCoord("g7", "1");
    }
}

class Page6 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472379/audio-slices-less-pauses/slice49_less_pauses_i2uwkz.mp3",
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
                If Blue tries to capture the stone by playing at 2, notice that all the blue stones
                are now in atari at A.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g6",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        //goban.setMarkByPrettyCoord("f7g6", "triangle");
        goban.setMarkByPrettyCoord("g7g6", "1");
        goban.setMarkByPrettyCoord("g6", "2");
        goban.setMarkByPrettyCoord("f7", "A");
    }
}

class Page7 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708555182/audio-slice-less-pauses-COMBINED/slice52_53_and_54_combined_idgmba.mp3",
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
            <p>It looks like White can't play at A because the team would have no liberties.</p>,
            <p>But playing at A captures six Blue stones first giving White three liberties.</p>,
            <p>Remember, any stone played must have liberties at the end of the turn.</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_player: "white",
            initial_state: {
                black: "e7e6f6f5g5g6",
                white: "d7d6e5f4g4d4g7",
            },
            flip_animated_capture_color: true,
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoord("f7");
        });
        this.delay(() => goban.setMarkByPrettyCoord("g6", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("f6", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("e7", "3"));
    }
}

class Page8 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472586/audio-slices-less-pauses/slice53_less_pauses_smoepq.mp3",
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
                So a Blue play at A is obviously not a good move. It takes one of Blue's liberties.
                And playing at B would also put Blue's group into atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "A");
        goban.setMarkByPrettyCoord("g6", "B");
    }
}

class Page9 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708555395/audio-slice-less-pauses-COMBINED/slice54_and_57_combined_fhlma2.mp3",
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
                So perhaps Blue decides not to play at either point. The group is not in atari, so
                what can White do anyway? Well, White can play at 1...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7g6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g6", "1");
    }
}

class Page10 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472590/audio-slices-less-pauses/slice56_less_pauses_myxeli.mp3",
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
                Now Blue is again in atari, and White could capture by playing at A. But wait, White
                is in atari too...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7g6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "A");
    }
}

class Page11 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472582/audio-slices-less-pauses/slice57_less_pauses_ksavic.mp3",
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
            <p>So Blue can capture two stones with 1. Surely the group is okay now.</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "free",
            flip_animated_capture_color: true,
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7g6",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "1");
        this.delay(() => {
            goban.placeByPrettyCoord("f7");
            goban.setMarkByPrettyCoord("f7", "1");
        });
    }
}

class Page12 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708555523/audio-slices-less-pauses/slice60_less_pauses_revised_wseie1.mp3",
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
                What happens if White plays at 2? It's true, White is also in atari, so Blue can
                capture again...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            flip_animated_capture_color: true,
            initial_player: "white",
            initial_state: {
                black: "e7e6f6f5g5f7",
                white: "d7d6e5f4g4d4",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "1");
        this.delay(() => {
            goban.placeByPrettyCoord("g7");
            goban.setMarkByPrettyCoord("f7", "1");
            goban.setMarkByPrettyCoord("g7", "2");
        });
        this.delay(() => {
            goban.placeByPrettyCoord("g6");
            goban.setMarkByPrettyCoord("f7", "1");
            goban.setMarkByPrettyCoord("g7", "2");
            goban.setMarkByPrettyCoord("g6", "3");
        });
    }
}

class Page13 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708555614/audio-slices-less-pauses/slice61_less_pauses_revised_ptlzux.mp3",
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
                But now the Blue group only has a single liberty, which means White can capture
                seven stones at once. Ouch!
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            flip_animated_capture_color: true,
            initial_player: "white",
            initial_state: {
                black: "e7e6f6f5g5f7g6",
                white: "d7d6e5f4g4d4",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.placeByPrettyCoord("g7");
        }, 3000);
    }
}

class Page14 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472596/audio-slices-less-pauses/slice60_less_pauses_vlwhff.mp3",
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
            // Dropbox says we don't have a 15th page for module 3, but that doesn't really make sense, I think having the animal mascot thingy for the 15th page, saying good job is nice
            <p>
                Looking again, we see that the placement of a single stone can make all the
                difference. Playing at A is the key point for both sides.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "A");
    }
}

class Page15 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472583/audio-slices-less-pauses/slice61_less_pauses_fh5hpq.mp3",
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
            <p>Good job learning about eyes so far, this is tricky stuff!</p>,
        ];
    }
    axolotlFace() {
        return true;
    }
    hidePlayButton() {
        return true;
    }
}

export const module3: Array<typeof Content> = [
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
];

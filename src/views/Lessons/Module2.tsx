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
class Module2 extends Content {
    constructor(audioUrl: string) {
        super();
        this.audioUrl = audioUrl;
    }
}

class Page1 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708550145/audio-slices-less-pauses/slice20_less_pauses_revised_wlyinf.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <span style={{ display: "block" }}>
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
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708550225/audio-slices-less-pauses/slice21_less_pauses_revised_vjtr4g.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
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
        this.delay(() => goban.setMarkByPrettyCoordinates("f7", "1"), 7250);
        this.delay(() => goban.setMarkByPrettyCoordinates("g7", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("f6", "3"));
        this.delay(() => goban.setMarkByPrettyCoordinates("g6", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708550312/audio-slices-less-pauses/slice22_less_pauses_revised_ksy8ir.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
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
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472337/audio-slices-less-pauses/slice23_less_pauses_sr0s2s.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Four points is right.</p>];
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
        this.delay(() => goban.setMarkByPrettyCoordinates("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e5", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d4", "3"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e4", "4"));
    }
}

class Page5 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472339/audio-slices-less-pauses/slice24_less_pauses_woik4b.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>How many points does Blue have here?</p>];
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
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708550675/audio-slice-less-pauses-COMBINED/slice25_and_26_combined_xjrc9k.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>The answer is 9 points for Blue.</p>,
            <p>Remember, you only need to build your fence up to the edge of the board. </p>,
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
        this.delay(() => goban.setMarkByPrettyCoordinates("a3", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("b3", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("a2", "3"));
        this.delay(() => goban.setMarkByPrettyCoordinates("c2", "4"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d2", "5"));
        this.delay(() => goban.setMarkByPrettyCoordinates("a1", "6"));
        this.delay(() => goban.setMarkByPrettyCoordinates("b1", "7"));
        this.delay(() => goban.setMarkByPrettyCoordinates("c1", "8"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d1", "9"));
    }
}

class Page7 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472343/audio-slices-less-pauses/slice27_less_pauses_mkkli5.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                In Go, we play until the two colors are touching each other, and the empty space
                each blocks off and surrounds is their territory.
            </p>,
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
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708552000/audio-slice-less-pauses-COMBINED/slice28_29_and_30_combined_go49dz.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Can White play on Blue's side? Yes.</p>,
            <p>Can Blue play on White's side? Yes.</p>,
            <p>
                Each side is free to try if they think they can make a group that can’t be captured.
            </p>,
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
        this.delay(() => goban.editPlaceByPrettyCoordinates("b5", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.editPlaceByPrettyCoordinates("b6", JGOFNumericPlayerColor.WHITE));
        this.delay(
            () => goban.editPlaceByPrettyCoordinates("h5", JGOFNumericPlayerColor.BLACK),
            3000,
        );
        this.delay(() => goban.editPlaceByPrettyCoordinates("h3", JGOFNumericPlayerColor.BLACK));
    }
}

// I never liked explaining the pass rule, especially to kids, just say if both players say pass one after another,
// the game ends and we score the game or something. Or something like "when you think the game is over, say "pass", if your opponent also thinks the game is over, they can say
// "pass" too, then we can score the game!
class Page9 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708552553/audio-slice-less-pauses-COMBINED/slice31_and_32_combined_jcmxoh.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If you think the game is over, just pass a stone to your opponent. If your opponent
                plays a stone then you can either play or pass.
            </p>,
            <p>
                Two passed stones in a row end the game. However, since Blue played first, White
                must pass last.
            </p>,
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

class Page10 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708552711/audio-slice-less-pauses-COMBINED/slice33_and_34_combined_bkl2un.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>Blue has territory on the left, and White has it on the right.</p>,
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
        goban.setMarkByPrettyCoordinates(
            "a9a8a7a6a5a4a3a2a1b7b6b5b4b3b2b1c9c8c1c2c4d3d9",
            "circle",
        );
    }
}

class Page11 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472354/audio-slices-less-pauses/slice35_less_pauses_pzy4sf.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>And White has 24, so White is ahead by one.</p>];
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
        goban.setMarkByPrettyCoordinates(
            "g9g8g7g5g2g1h9h8h7h6h5h4h3h2h1j9j8j7j6j5j4j3j2j1",
            "circle",
        );
    }
}

class Page12 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708553650/audio-slice-less-pauses-COMBINED/slice36_38_and_39_combined_kymjby.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
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
        goban.setMarkByPrettyCoordinates("g5g2g1h9h8h7h6h5h4h3h2h1j9j8j7j6j5j4j3j2j1", "circle");
        goban.setMarkByPrettyCoordinates("g9g8g7", "circle");
    }
}

class Page13 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472581/audio-slices-less-pauses/slice39_less_pauses_t7eggo.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
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

class Page14 extends Module2 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1746213981/lets_try_some_simple_problems_now_audio_snipped_5_2_2025_lbpyvj.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Let's try some simple problems now.</p>];
    }
    axolotlFace() {
        return true;
    }
    hidePlayButton() {
        return true;
    }
}

class Puzzle1 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "C1D1D2E1",
                white: "B1C2E2F1",
            },
            move_tree: this.makePuzzleMoveTree(["D3"], ["C3D3", "E3D3", "B2D3", "F2D3"]),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>Good job!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle2 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Capture the 2 white stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "B1C2D2D4D5D6",
                white: "C1D1E2E3E4E5",
            },
            move_tree: this.makePuzzleMoveTree(["E1"], []),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>You did it!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle3 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472331/audio-slices-less-pauses/slice17_less_pauses_znln8h.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Capture the 5 white stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "D2E2F3E4E5D6C5C3",
                white: "C2C4D4D5D3E3",
            },
            move_tree: this.makePuzzleMoveTree(["B4"], []),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>Nice work!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle4 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548659/audio-slices-less-pauses/slice19_less_pauses_revised_fykpjy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the 3 blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "A3B3B4",
                white: "A2B2C3C4A4",
            },
            move_tree: this.makePuzzleMoveTree(
                ["B5"],
                ["A5B5A4A6", "A5B5B6A4", "A5B5C5A4", "A5B5A6A4"],
            ),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>Very clever!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle5 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the 2 blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "B3C2C4D4E3E2",
                white: "B4C5D5D3E4F4F3F2",
            },
            move_tree: this.makePuzzleMoveTree(
                ["C3D2D1", "C3D2E1F1D1"],
                ["B5C3", "D2C3", "A4C3", "C3D2C1E1"],
            ),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>Good job!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle6 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Capture the 3 white stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "B2C2C3B4B5C6D6F6E5",
                white: "A2A3B3A6B6C4C5D5D2D3F3",
            },
            move_tree: this.makePuzzleMoveTree(
                ["D4", "A1B1D4"],
                ["E4D4", "A4A5", "A1B1C1D1", "A5A4"],
            ),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>You did it!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
    }
}

class Puzzle7 extends Module2 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548659/audio-slices-less-pauses/slice19_less_pauses_revised_fykpjy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the 7 blue stones, this one is very tricky!</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "B2C2C3D3D4E4F4",
                white: "B1C1D2E3G4F5E5D5C4B3A2",
            },
            move_tree: this.makePuzzleMoveTree(
                [
                    "F3E2B4A3C5",
                    "F3E2F2F1B4A3C5",
                    "F3E2B4A3A4A1D1",
                    "F3E2B4A3A4A1F2D1E1",
                    "F3E2B4A3A4A1C5",
                ],
                [
                    "E2F3",
                    "B4F3",
                    "C5F3",
                    "D1F3",
                    "A3F3",
                    "F3E2G3F2G5G2G4G6",
                    "F3E2G3F2G5G2G6G4",
                    "F3E2G3F2G5G2F6G4",
                    "F3E2G3F2G2G1",
                    "F3E2C5B4",
                ],
            ),
        };
    }
    onSetGoban(goban: Goban): void {
        goban.on("puzzle-correct-answer", () => {
            if (this.shouldPlayAudio) {
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
            }
            this.captureDelay(() => {
                openPopup({
                    text: <Axol>Very clever!</Axol>,
                    no_accept: true,
                    no_cancel: true,
                    timeout: POPUP_TIMEOUT,
                })
                    .then(() => {
                        this.gotoNext();
                    })
                    .catch(() => 0);
            });
        });
        goban.on("puzzle-wrong-answer", () => {
            new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })
                .then(() => {
                    return openPopup({
                        text: <Axol>Try again!</Axol>,
                        no_accept: true,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    });
                })
                .then(() => {
                    this.resetGoban?.();
                })
                .catch(() => 0);
        });
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
    Page13,
    Page14,

    Puzzle1,
    Puzzle2,
    Puzzle3,
    Puzzle4,
    Puzzle5,
    Puzzle6,
    Puzzle7,
];

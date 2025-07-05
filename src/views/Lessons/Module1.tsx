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

class Module1 extends Content {
    constructor(audioUrl: string, shouldPlayAudio?: boolean) {
        super();
        this.audioUrl = audioUrl;
        // Make shouldPlayAudio optional, as only the puzzles need it for conditionally checking if we should render the audio when a user answers the puzzle right
        if (shouldPlayAudio !== undefined) {
            this.shouldPlayAudio = shouldPlayAudio;
        }
    }
}

class Page1 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472624/audio-slice-less-pauses-COMBINED/slice1_and_2_combined_wxolf5.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>In Go we place stones on the lines, not in the squares!</p>,
            <p>
                The darker color, Blast Off Blue in this case, always goes first, followed by the
                lighter color, Whammo White here.
            </p>,
            <p>Use the next arrow in the bottom right to continue.</p>,
        ];
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
        this.delay(() => goban.editPlaceByPrettyCoordinates("d4", JGOFNumericPlayerColor.BLACK));
        this.delay(
            () => goban.editPlaceByPrettyCoordinates("e4", JGOFNumericPlayerColor.WHITE),
            10000,
        );
    }
}

class Page2 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472317/audio-slices-less-pauses/slice3_less_pauses_c9w9eo.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                The spaces next to the stones are important, we call them Liberties. This stone has
                four liberties where the lines cross.
            </p>,
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
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.setMarkByPrettyCoordinates("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e4", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d3", "3"));
        this.delay(() => goban.setMarkByPrettyCoordinates("c4", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472317/audio-slices-less-pauses/slice4_less_pauses_jiozem.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                There are no liberties off the edge of the board, so this stone only has two
                liberties.
            </p>,
        ];
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
        this.delay(() => goban.setMarkByPrettyCoordinates("f7", "1"), 3000);
        this.delay(() => goban.setMarkByPrettyCoordinates("g6", "2"));
    }
}

class Page4 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472318/audio-slices-less-pauses/slice5_less_pauses_pebkdl.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [<p>And this stone only has three.</p>];
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
        this.delay(() => goban.setMarkByPrettyCoordinates("c7", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d6", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e7", "3"));
    }
}

class Page5 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708473054/audio-slices-less-pauses/slice6_less_pauses_revised_zbk8aa.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Stones of the same color that touch each other are on the same team. So they share
                their liberties.
            </p>,
        ];
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
        this.delay(() => goban.editPlaceByPrettyCoordinates("d4", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.editPlaceByPrettyCoordinates("e4", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.setMarkByPrettyCoordinates("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e5", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("f4", "3"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e3", "4"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d3", "5"));
        this.delay(() => goban.setMarkByPrettyCoordinates("c4", "6"));
    }
}

class Page6 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472320/audio-slices-less-pauses/slice7_less_pauses_nmppvy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If the other player takes 3 out of 4 liberties, we say a stone is in Atari, which
                means it can be captured on the next turn.
            </p>,
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
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.editPlaceByPrettyCoordinates("c4", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.editPlaceByPrettyCoordinates("d3", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.editPlaceByPrettyCoordinates("e4", JGOFNumericPlayerColor.WHITE));
        this.delay(() => goban.setMarkByPrettyCoordinates("d5", "triangle"));
    }
}

class Page7 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708473412/audio-slice-less-pauses-COMBINED/slice8_and_9_combined_revised_fxjbn9.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>If we add a stone, then they form a team and get new liberties.</p>,
            <p>Now they have three liberties and are safe from immediate capture.</p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "d4",
                white: "c4d3e4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.editPlaceByPrettyCoordinates("d5", JGOFNumericPlayerColor.BLACK));
        this.delay(() => goban.setMarkByPrettyCoordinates("c5", "1"));
        this.delay(() => goban.setMarkByPrettyCoordinates("d6", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e5", "3"));
    }
}

class Page8 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472323/audio-slices-less-pauses/slice10_less_pauses_o5h9dp.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If Blue goes somewhere else though, then White can capture the stone and remove it
                from the board.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            flip_animated_capture_color: true,
            initial_state: {
                black: "d4",
                white: "c4d3e4",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.placeByPrettyCoordinates("f5"));
        this.delay(() => goban.placeByPrettyCoordinates("d5"));
    }
}

class Puzzle1 extends Module1 {
    private successAudio: HTMLAudioElement;

    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547807/audio-slice-less-pauses-COMBINED/slice11_and_12_combined_dzwlo9.mp3",
            shouldPlayAudio,
        );
        // Success audio for the popup audio!  Says "Good job!"
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Lets try some simple problems now. Try and capture the White stone.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "c7d6",
                white: "d7",
            },
            move_tree: this.makePuzzleMoveTree(["e7"], []),
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

class Puzzle2 extends Module1 {
    private successAudio: HTMLAudioElement;

    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472327/audio-slices-less-pauses/slice14_less_pauses_if00pt.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture the White stone.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "e5d4e3",
                white: "e4",
            },
            move_tree: this.makePuzzleMoveTree(["F4"], []),
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

class Puzzle3 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472329/audio-slices-less-pauses/slice16_less_pauses_muc2vl.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472331/audio-slices-less-pauses/slice17_less_pauses_znln8h.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture the White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "e5e2d4d3f4",
                white: "e4e3",
            },
            move_tree: this.makePuzzleMoveTree(["f3"], []),
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

class Puzzle4 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548582/audio-slices-less-pauses/slice18_less_pauses_revised_y2583y.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548659/audio-slices-less-pauses/slice19_less_pauses_revised_fykpjy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture these White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "d6e6d5f5c4d3d2e2f3",
                white: "d4e5e4e3",
            },
            move_tree: this.makePuzzleMoveTree(["f4"], []),
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

class Puzzle5 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472327/audio-slices-less-pauses/slice14_less_pauses_if00pt.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture the White stone.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "e6d5f5",
                white: "d4e5",
            },
            move_tree: this.makePuzzleMoveTree(["e4"], []),
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

class Puzzle6 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548582/audio-slices-less-pauses/slice18_less_pauses_revised_y2583y.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture these White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "b4b3b2c1d2d3e4f4f5e6d6",
                white: "e5d5d4c4c3c2",
            },
            move_tree: this.makePuzzleMoveTree(["c5"], []),
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

class Puzzle7 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548582/audio-slices-less-pauses/slice18_less_pauses_revised_y2583y.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472331/audio-slices-less-pauses/slice17_less_pauses_znln8h.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture these White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "d7d6d5e5f5g5",
                white: "e7e6f6g6g7",
            },
            move_tree: this.makePuzzleMoveTree(["f7"], []),
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

class Puzzle8 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor(shouldPlayAudio: boolean) {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548582/audio-slices-less-pauses/slice18_less_pauses_revised_y2583y.mp3",
            shouldPlayAudio,
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548659/audio-slices-less-pauses/slice19_less_pauses_revised_fykpjy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Try and capture these White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "c7c6c5b5a5",
                white: "a6b6b7",
            },
            move_tree: this.makePuzzleMoveTree(["a7"], []),
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
    Puzzle5,
    Puzzle6,
    Puzzle7,
    Puzzle8,
];

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
class Module3 extends Content {
    constructor(audioUrl: string) {
        super();
        this.audioUrl = audioUrl;
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
            <p>
                One of the few rules in Go is that any stone played must have at least one liberty
                after it's played.
            </p>,
            <p>
                Remember that taking a stone's last liberty will capture it. White cannot play at
                the triangled point because the stone wouldn't have any liberties.
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
        goban.setMarkByPrettyCoordinates("d4", "triangle");
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
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoordinates("f7g6", "triangle");
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
        goban.setMarkByPrettyCoordinates("f7g6", "triangle");
    }
}

class Page5 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472377/audio-slices-less-pauses/slice48_less_pauses_l10z1c.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [<p>What happens if White gets to play in the middle first?</p>];
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
        this.delay(
            () => goban.editPlaceByPrettyCoordinates("g7", JGOFNumericPlayerColor.WHITE),
            1500,
        );
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
            <p>
                If Blue tries to capture the stone by playing at 2, notice that all the Blue stones
                are now in atari at A.
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
        goban.setMarkByPrettyCoordinates("g6", "2");
        this.delay(() => {
            goban.placeByPrettyCoordinates("g6");
            goban.setMarkByPrettyCoordinates("g6", "2");
        }, 3000);
        this.delay(() => goban.setMarkByPrettyCoordinates("f7", "A"));
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
            goban.setMarkByPrettyCoordinates("f7", "A");
        });
        this.delay(() => goban.placeByPrettyCoordinates("f7"), 6000);
        this.delay(() => goban.setMarkByPrettyCoordinates("g6", "1"), 3000);
        this.delay(() => goban.setMarkByPrettyCoordinates("f6", "2"));
        this.delay(() => goban.setMarkByPrettyCoordinates("e7", "3"));
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
        goban.setMarkByPrettyCoordinates("f7", "A");
        goban.setMarkByPrettyCoordinates("g6", "B");
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
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => {
            goban.editPlaceByPrettyCoordinates("g6", JGOFNumericPlayerColor.WHITE);
            goban.setMarkByPrettyCoordinates("g6", "1");
        }, 9000);
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
        goban.setMarkByPrettyCoordinates("f7", "A");
    }
}

class Page11 extends Module3 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472582/audio-slices-less-pauses/slice57_less_pauses_ksavic.mp3",
        );
    }

    text(): JSX.Element | Array<JSX.Element> {
        return [<p>So Blue can capture two stones with 1. Surely the group is okay now.</p>];
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
        goban.setMarkByPrettyCoordinates("f7", "1");
        this.delay(() => {
            goban.placeByPrettyCoordinates("f7");
            goban.setMarkByPrettyCoordinates("f7", "1");
        }, 1750);
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
        goban.setMarkByPrettyCoordinates("f7", "1");
        this.delay(() => {
            goban.placeByPrettyCoordinates("g7");
            goban.setMarkByPrettyCoordinates("f7", "1");
            goban.setMarkByPrettyCoordinates("g7", "2");
        });
        this.delay(() => {
            goban.placeByPrettyCoordinates("g6");
            goban.setMarkByPrettyCoordinates("f7", "1");
            goban.setMarkByPrettyCoordinates("g7", "2");
            goban.setMarkByPrettyCoordinates("g6", "3");
        }, 5500);
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
            goban.placeByPrettyCoordinates("g7");
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
        goban.setMarkByPrettyCoordinates("g7", "A");
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
            <p>Good job learning about eyes so far, this is tricky stuff!</p>,

            <p>Let's have some simple life and death puzzles now.</p>,
        ];
    }
    axolotlFace() {
        return true;
    }
}

class Puzzle1 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Capture the White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "a5b5c5d5e5e6e7",
                white: "a6b6c6d6d7",
            },
            move_tree: this.makePuzzleMoveTree(["b7c7a7"], ["c7b7", "a7b7"]),
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

class Puzzle2 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the Blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "e1e2f1f3g2",
                white: "d1d2d3d4e3f4g4",
            },
            move_tree: this.makePuzzleMoveTree(["g3"], ["f2g3", "g1g3"]),
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

class Puzzle3 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472331/audio-slices-less-pauses/slice17_less_pauses_znln8h.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the Blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "c7c6c5c4d4e4e5d6e7",
                white: "b7b6b5b4c3d3e3f4f5f6f7",
            },
            move_tree: this.makePuzzleMoveTree(["e6"], ["d7e6", "d5e6"]),
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

class Puzzle4 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708548659/audio-slices-less-pauses/slice19_less_pauses_revised_fykpjy.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the Blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "a2b2c1d1d2e2d3d4c3",
                white: "a3b3b4c4c5d5e5e4e3f3f2f1e1b1",
            },
            move_tree: this.makePuzzleMoveTree(["a1"], ["c2a1"]),
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

class Puzzle5 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708547864/audio-slices-less-pauses/slice13_less_pauses_revised_tanua8.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Capture the White stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "c1d1e1f2f1g2g3g4g5f6e6d6c5b4b3b2",
                white: "c2c3c4d5e5e3f5f4f3f2e2d2",
            },
            move_tree: this.makePuzzleMoveTree(["d4d3e4"], ["d3d4", "e4d4"]),
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

class Puzzle6 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472328/audio-slices-less-pauses/slice15_less_pauses_w7g2jr.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the Blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "f1e2f3g2g4",
                white: "d1d2d3e3e4f4f5f6",
            },
            move_tree: this.makePuzzleMoveTree(["e1g5g3"], ["f2g5g3e1", "e1g5f2", "g3e1f2g5"]),
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

class Puzzle7 extends Module3 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super("no_audio_here");
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1708472331/audio-slices-less-pauses/slice17_less_pauses_znln8h.mp3",
        );
    }
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Save the Blue stones.</p>];
    }
    config(): PuzzleConfig {
        return {
            initial_state: {
                black: "e2e3f3g3f1",
                white: "d1d2d3d5e4f4g4",
            },
            move_tree: this.makePuzzleMoveTree(
                ["g2"],
                ["e1g2f2g1", "e1g2g1f2", "f2g2g1e1", "g1f2g2e1"],
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

    Puzzle1,
    Puzzle2,
    Puzzle3,
    Puzzle4,
    Puzzle5,
    Puzzle6,
    Puzzle7,
];

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
import { openPopup } from "PopupDialog";

const POPUP_TIMEOUT = 3000;

class Module1 extends Content {
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

class Page1 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854748/kids-go-server-COMBINED-audio-slices/slice_audio1_nkvkon.wav",
        );
        console.log("Page1 constructor");
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
                autoPlay={true} // This line auto plays the audio when we click the next button to navigate to the next page
                src={this.audioUrl}
            ></audio>,
            <span>In Go we place stones on the lines, not in the squares!</span>,
            <span>
                The darker color, Blast Off Blue in this case, always goes first, followed by the
                lighter color, Whammo White here.
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854682/kids-go-server-COMBINED-audio-slices/slice_audio2_pcjrth.wav",
        );
        console.log("page 2 constructor");
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
        this.delay(() => goban.setMarkByPrettyCoord("d5", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("e4", "2"));
        this.delay(() => goban.setMarkByPrettyCoord("d3", "3"));
        this.delay(() => goban.setMarkByPrettyCoord("c4", "4"));

        // todo: stone smiles at end
    }
}

class Page3 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854677/kids-go-server-COMBINED-audio-slices/slice_audio3_n7porg.wav",
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
        this.delay(() => goban.setMarkByPrettyCoord("f7", "1"));
        this.delay(() => goban.setMarkByPrettyCoord("g6", "2"));
    }
}

class Page4 extends Module1 {
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854678/kids-go-server-COMBINED-audio-slices/slice_audio4_xitqmt.wav",
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
            <p>And this stone only has three.</p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854684/kids-go-server-COMBINED-audio-slices/slice_audio5_l4jolv.wav",
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854745/kids-go-server-COMBINED-audio-slices/slice_audio6_hpjrch.wav",
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
                If the other player takes 3 out of 4 liberties, we say a stone is in Atari, which
                means it can be captured on the next turn.
            </p>,
        ];
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854750/kids-go-server-COMBINED-audio-slices/slice_audio7_cflubx.wav",
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
            <p>If we add a stone, then they form a team and get new liberties.</p>,
            <p>Now they have three liberties and are safe from immediate capture.</p>,
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
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707854685/kids-go-server-COMBINED-audio-slices/slice_audio8_d4znwa.wav",
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
                black: "D4",
                white: "C4D3E4",
            },
        } as PuzzleConfig;
    }
    onSetGoban(goban: Goban): void {
        this.delay(() => goban.placeByPrettyCoord("f5"));
        this.delay(() => goban.placeByPrettyCoord("d5"));
    }
}

class Puzzle1 extends Module1 {
    private successAudio: HTMLAudioElement;

    constructor() {
        // This is the manually sliced audio clip for the first puzzle
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707977976/kids-go-server-audio-slices/slice_first_puzzle_audio_wflxs8.wav",
        );
        // Success audio for the popup audio!  Says "Good job!"
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852115/kids-go-server-audio-slices/slice_13_q0v6nw.wav",
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
            <p>Lets try some simple problems now. Try and capture the White stone.</p>,
        ];
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
                // If we chain the success audio after the captureDelay, the "good job audio clip" happens after we go to the next puzzle
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
                this.captureDelay(() => {
                    openPopup({
                        text: <Axol>Good job!</Axol>,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    })
                        .then(() => {
                            this.gotoNext();
                        })
                        .catch(() => 0);
                });
            }
        });
    }
}

class Puzzle2 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852119/kids-go-server-audio-slices/slice_14_s6dmem.wav",
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852116/kids-go-server-audio-slices/slice_15_cidisp.wav",
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
            <p>Try and capture the White stone.</p>,
        ];
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
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
                this.captureDelay(() => {
                    openPopup({
                        text: <Axol>You did it!</Axol>,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    })
                        .then(() => {
                            this.gotoNext();
                        })
                        .catch(() => 0);
                });
            }
        });
    }
}

class Puzzle3 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852118/kids-go-server-audio-slices/slice_16_p8yhmr.wav",
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852117/kids-go-server-audio-slices/slice_17_z0n55r.wav",
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
            <p>Try and capture the White stones.</p>,
        ];
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
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
                this.captureDelay(() => {
                    openPopup({
                        text: <Axol>Nice work!</Axol>,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    })
                        .then(() => {
                            this.gotoNext();
                        })
                        .catch(() => 0);
                });
            }
        });
    }
}

class Puzzle4 extends Module1 {
    private successAudio: HTMLAudioElement;
    constructor() {
        super(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852119/kids-go-server-audio-slices/slice_18_emq25v.wav",
        );
        this.successAudio = new Audio(
            "https://res.cloudinary.com/dn8rdavoi/video/upload/v1707852119/kids-go-server-audio-slices/slice_19_ddyawc.wav",
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
            <p>Try and capture these White stones.</p>,
        ];
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
                this.successAudio
                    .play()
                    .catch((error) => console.error("Error playing success audio:", error));
                this.captureDelay(() => {
                    openPopup({
                        text: <Axol>Very clever!</Axol>,
                        no_cancel: true,
                        timeout: POPUP_TIMEOUT,
                    })
                        .then(() => {
                            this.gotoNext();
                        })
                        .catch(() => 0);
                });
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

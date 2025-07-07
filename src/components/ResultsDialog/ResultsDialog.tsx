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
import { KBShortcut } from "@/components/KBShortcut";
import { Goban } from "goban";
import { PlayerAvatar } from "@kidsgo/components/Avatar";
import { useUser } from "@/lib/hooks";
import { countPasses } from "@kidsgo/lib/countPasses";

interface ResultsDialogProps {
    goban?: Goban;
    onPlayAgain: () => void;
    onClose: () => void;
}

export function ResultsDialog(props: ResultsDialogProps): JSX.Element {
    const user = useUser();
    const captureWinPlayer = Number(localStorage.getItem("captureWinPlayer") || "0");
    const isCaptureWin = localStorage.getItem("captureWin") === "true";
    const isResignation = props.goban?.engine?.outcome === "Resignation";

    if (!props.goban) {
        return null;
    }

    // We usually use area scoring for aga, so the computeScore doesn't return
    // captures. But in this case the AGF wants us to report in territory scoring,
    // so we adjust.
    const score = props.goban.engine.computeScore(false);
    const score_prisoners = props.goban.engine.computeScore(true);
    const passes = countPasses(props.goban);
    score.black.prisoners = score_prisoners.black.prisoners + passes.black;
    score.white.prisoners = score_prisoners.white.prisoners + passes.white;

    const black_svg_url = ((props.goban as any)?.theme_black?.getSadStoneSvgUrl() || "").replace(
        "sad",
        "neutral",
    );
    const white_svg_url = ((props.goban as any)?.theme_white?.getSadStoneSvgUrl() || "").replace(
        "sad",
        "neutral",
    );
    let black_winner = "";
    let winner_svg_url;
    let white_winner = "";
    if ((props.goban?.engine?.winner as any) === (props.goban?.engine?.players.black.id as any)) {
        //black_winner = "Winner";
        black_winner = "Wins by " + props.goban?.engine?.outcome;
        winner_svg_url = black_svg_url;
    } else {
        //white_winner = "Winner";
        white_winner = "Wins by " + props.goban?.engine?.outcome;
        winner_svg_url = white_svg_url;
    }

    const swap = user.id === props.goban.engine.players.black.id;

    const left_winner = swap ? white_winner : black_winner;
    const right_winner = swap ? black_winner : white_winner;
    const left_svg = swap ? white_svg_url : black_svg_url;
    const right_svg = swap ? black_svg_url : white_svg_url;
    const left_id = swap
        ? props.goban?.engine?.players.white?.id
        : props.goban?.engine?.players.black?.id;
    const right_id = swap
        ? props.goban?.engine?.players.black?.id
        : props.goban?.engine?.players.white?.id;
    const left_score = swap ? score.white : score.black;
    const right_score = swap ? score.black : score.white;

    const winnerId = props.goban?.engine?.winner;
    const userWon = user.id === winnerId;

    // Show a different results dialog when a user resigns, which does not show the score.
    // Goban also has a isResignation flag that omits the goban score state after a user resigns
    if (isResignation) {
        return (
            <div className="ResultsDialog-container">
                <KBShortcut shortcut="esc" action={props.onClose} />
                <div className="ResultsDialog">
                    <div className="ResultsDialog-results">
                        <div className="black">
                            <div className="stone-avatar-container">
                                <PlayerAvatar user_id={left_id} />
                            </div>
                            <div className="result-text"></div>
                        </div>

                        <div className="result-center-message">
                            {isCaptureWin ? (
                                <div>
                                    {captureWinPlayer === user.id
                                        ? "You won by capturing them first!"
                                        : "They won by capturing you first!"}
                                </div>
                            ) : (
                                <div>
                                    {userWon
                                        ? "They resigned, you won!"
                                        : "You resigned, they won!"}
                                </div>
                            )}
                        </div>

                        <div className="white">
                            <div className="stone-avatar-container">
                                <PlayerAvatar user_id={right_id} />
                            </div>
                            <div className="result-text"></div>
                        </div>
                    </div>

                    <div className="ResultsDialog-buttons">
                        <button className="primary-button" onClick={props.onPlayAgain}>
                            Play again
                        </button>
                        <button className="primary-button" onClick={props.onClose}>
                            View game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ResultsDialog-container">
            <KBShortcut shortcut="esc" action={props.onClose} />
            <div className="ResultsDialog">
                <div className="ResultsDialog-results">
                    <div className="black">
                        <div className="stone-avatar-container">
                            <PlayerAvatar user_id={left_id} />
                        </div>
                        <Score score={left_score} other={right_score} svg_url={left_svg} />
                        <div className="result-text">{left_winner}</div>
                    </div>

                    <div className="result-center-message">
                        <div> {userWon ? "You won!" : "They won!"} </div>
                    </div>

                    <div className="white">
                        <div className="stone-avatar-container">
                            <PlayerAvatar user_id={right_id} />
                        </div>
                        <Score score={right_score} other={left_score} svg_url={right_svg} />
                        <div className="result-text">{right_winner}</div>
                    </div>
                </div>

                <div className="ResultsDialog-buttons">
                    <button className="primary-button" onClick={props.onPlayAgain}>
                        Play again
                    </button>
                    <button className="primary-button" onClick={props.onClose}>
                        View game
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ScoreObject {
    handicap: number;
    komi: number;
    prisoners: number;
    scoring_positions: string;
    stones: number;
    territory: number;
    total: number;
}

interface ScoreProps {
    score: ScoreObject;
    other: ScoreObject;
    svg_url: string;
}

export function Score({ score, other, svg_url }: ScoreProps) {
    //const total = score.komi + score.prisoners + score.territory;
    const total = score.komi - other.prisoners + score.territory;

    return (
        <div className="score">
            <div className="score-territory">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Territory:</span>{" "}
                <span className="value">{score.territory}</span>
            </div>
            <div className="score-komi">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Komi:</span> <span className="value">{score.komi}</span>
            </div>
            <div className="score-prisoners">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Captured:</span>{" "}
                <span className="value">- {other.prisoners}</span>
            </div>

            <div className="score-total">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Total:</span> <span className="value">{total}</span>
            </div>
        </div>
    );
}

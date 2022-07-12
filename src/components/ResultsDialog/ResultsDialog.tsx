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
import { KBShortcut } from "KBShortcut";
import { Goban } from "goban";
import { PlayerAvatar } from "Avatar";
import { countPasses } from "countPasses";

interface ResultsDialogProps {
    goban?: Goban;
    onPlayAgain: () => void;
    onClose: () => void;
}

export function ResultsDialog(props: ResultsDialogProps): JSX.Element {
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

    let black_svg_url = ((props.goban as any)?.theme_black?.getSadStoneSvgUrl() || "").replace(
        "sad",
        "neutral",
    );
    let white_svg_url = ((props.goban as any)?.theme_white?.getSadStoneSvgUrl() || "").replace(
        "sad",
        "neutral",
    );
    let black_winner = "";
    let white_winner = "";
    if ((props.goban?.engine?.winner as any) === (props.goban?.engine?.players.black.id as any)) {
        //black_svg_url = black_svg_url.replace("plain", "neutral");
        black_winner = "Winner";
    } else {
        //white_svg_url = black_svg_url.replace("plain", "neutral");
        white_winner = "Winner";
    }

    return (
        <div className="ResultsDialog-container">
            <KBShortcut shortcut="esc" action={props.onClose} />
            <div className="ResultsDialog">
                <div className="ResultsDialog-results">
                    <div className="black">
                        <div className="result-text">{black_winner}</div>
                        <div className="stone-avatar-container">
                            <PlayerAvatar user_id={props.goban?.engine?.players.black?.id} />
                        </div>
                        <Score score={score.black} svg_url={black_svg_url} />
                    </div>

                    <div className="white">
                        <div className="result-text">{white_winner}</div>
                        <div className="stone-avatar-container">
                            <PlayerAvatar user_id={props.goban?.engine?.players.white?.id} />
                        </div>
                        <Score score={score.white} svg_url={white_svg_url} />
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

interface ScoreProps {
    handicap: number;
    komi: number;
    prisoners: number;
    scoring_positions: string;
    stones: number;
    territory: number;
    total: number;
}

export function Score({ score, svg_url }: { score: ScoreProps; svg_url: string }) {
    const total = score.komi + score.prisoners + score.territory;

    return (
        <div className="score">
            <div className="score-territory">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Territory:</span>{" "}
                <span className="value">{score.territory}</span>
            </div>
            <div className="score-prisoners">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Captures:</span>{" "}
                <span className="value">{score.prisoners}</span>
            </div>
            <div className="score-komi">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Komi:</span> <span className="value">{score.komi}</span>
            </div>

            <div className="score-total">
                <img className="stone-svg" src={svg_url} />
                <span className="label">Total:</span> <span className="value">{total}</span>
            </div>
        </div>
    );
}

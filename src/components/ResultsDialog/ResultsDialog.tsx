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
import Lottie from "lottie-react";
import { KBShortcut } from "@/components/KBShortcut";
import { Goban } from "goban";
import { PlayerAvatar } from "@kidsgo/components/Avatar";
import { useUser } from "@/lib/hooks";
import { countPasses } from "@kidsgo/lib/countPasses";
import { useLottieAnimation, cdnBase } from "@kidsgo/lib/lottie-loader";

interface ResultsDialogProps {
    goban?: Goban;
    onPlayAgain: () => void;
    onClose: () => void;
}

export const RESULT_POPUP_FILES = {
    win: "PLAY_POP-UP_WIN_04_v02.json",
    lose: "PLAY_POP-UP_LOSE_04_v02_MAIN.json",
    resign: "PLAY_POP-UP_WIN_RESIGN_04_v02.json",
};

// The animated Win / Lose / They-resigned pop-up. The frame, title and the
// two button faces (Play Again / View Game) are drawn by the Lottie; the
// avatars, score details and click targets are DOM overlays placed at the
// composition's positions (see ResultsDialog.styl).
export function ResultsDialog(props: ResultsDialogProps): JSX.Element {
    const user = useUser();
    const captureWinPlayer = Number(localStorage.getItem("captureWinPlayer") || "0");
    const isCaptureWin = localStorage.getItem("captureWin") === "true";
    const isResignation = props.goban?.engine?.outcome === "Resignation";
    const winnerId = props.goban?.engine?.winner;
    const userWon = isCaptureWin ? captureWinPlayer === user.id : user.id === winnerId;

    const variant = !userWon ? "lose" : isResignation && !isCaptureWin ? "resign" : "win";
    const animation = useLottieAnimation(`${cdnBase()}/pages/play/${RESULT_POPUP_FILES[variant]}`);

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

    const swap = user.id === props.goban.engine.players.black.id;
    const left_id = swap
        ? props.goban?.engine?.players.white?.id
        : props.goban?.engine?.players.black?.id;
    const right_id = swap
        ? props.goban?.engine?.players.black?.id
        : props.goban?.engine?.players.white?.id;
    const left_score = swap ? score.white : score.black;
    const right_score = swap ? score.black : score.white;

    let note = "";
    if (isCaptureWin) {
        note = userWon ? "You won by capturing them first!" : "They won by capturing you first!";
    } else if (isResignation) {
        note = userWon ? "" : "You resigned";
    } else {
        note = "Wins by " + props.goban?.engine?.outcome;
    }

    return (
        // Clicking the dimmed backdrop (anywhere outside the pop-up's frame)
        // closes it, same as View Game.
        <div
            className="ResultsDialog-container"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    props.onClose();
                }
            }}
        >
            <KBShortcut shortcut="esc" action={props.onClose} />
            <div className={`ResultsDialog ${variant}`}>
                {animation && (
                    <Lottie
                        animationData={animation}
                        loop={false}
                        autoplay
                        className="ResultsDialog-animation"
                    />
                )}
                <div className="ResultsDialog-overlay">
                    <div className="ResultsDialog-frame" />
                    <div className="ResultsDialog-avatar left">
                        <PlayerAvatar user_id={left_id} />
                    </div>
                    <div className="ResultsDialog-avatar right">
                        <PlayerAvatar user_id={right_id} />
                    </div>
                    {!isResignation && (
                        <>
                            <Score className="left" score={left_score} other={right_score} />
                            <Score className="right" score={right_score} other={left_score} />
                        </>
                    )}
                    {note && <div className="ResultsDialog-note">{note}</div>}
                    <div
                        className="ResultsDialog-hotspot left primary"
                        onClick={props.onPlayAgain}
                    />
                    <div className="ResultsDialog-hotspot right" onClick={props.onClose} />
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
    className?: string;
}

export function Score({ score, other, className }: ScoreProps) {
    const total = score.komi - other.prisoners + score.territory;

    return (
        <div className={`ResultsDialog-score ${className ?? ""}`}>
            <div>
                <span className="label">Territory:</span>
                <span className="value">{score.territory}</span>
            </div>
            <div>
                <span className="label">Komi:</span>
                <span className="value">{score.komi}</span>
            </div>
            <div>
                <span className="label">Captured:</span>
                <span className="value">-{other.prisoners}</span>
            </div>
            <div className="total">
                <span className="label">Total:</span>
                <span className="value">{total}</span>
            </div>
        </div>
    );
}

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

// Remembers the last challenge sent from the matchmaking page so a finished
// bot game's "Play Again" can re-send it instead of going back to setup.

const LAST_CHALLENGE_KEY = "kidsgo-last-challenge";
const REMATCH_KEY = "kidsgo-rematch-requested";

interface StoredChallenge {
    opponent: string;
    challenge: object;
}

export function saveLastChallenge(opponent: string, challenge: object): void {
    try {
        localStorage.setItem(LAST_CHALLENGE_KEY, JSON.stringify({ opponent, challenge }));
    } catch {
        // Storage unavailable; Play Again just falls back to the setup screen.
    }
}

function lastChallenge(): StoredChallenge | null {
    try {
        return JSON.parse(localStorage.getItem(LAST_CHALLENGE_KEY) || "null");
    } catch {
        return null;
    }
}

// True when the stored challenge was against this opponent, so a rematch
// would recreate the game that just finished.
export function canRematch(opponent_id: number | string | undefined): boolean {
    const last = lastChallenge();
    return !!last && opponent_id != null && String(last.opponent) === String(opponent_id);
}

export function requestRematch(): void {
    sessionStorage.setItem(REMATCH_KEY, "1");
}

// Consumes a pending rematch request, returning the challenge to re-send.
export function takeRematchRequest(): StoredChallenge | null {
    if (sessionStorage.getItem(REMATCH_KEY) !== "1") {
        return null;
    }
    sessionStorage.removeItem(REMATCH_KEY);
    return lastChallenge();
}

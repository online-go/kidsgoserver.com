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
//import { Router, Route, Switch, Redirect } from "react-router-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as data from "@/lib/data";
import { _ } from "@/lib/translate";
//import { browserHistory } from "./kidsgoHistory";

import { LandingPage } from "./views/LandingPage";
import { LessonRouter } from "./views/Lessons";
import { PuzzlesRouter } from "./views/Lessons";
import { KidsGame } from "./views/KidsGame";
import { Matchmaking } from "./views/Matchmaking";
import { LearnToPlay } from "./views/LearnToPlay";
import { CharacterSelection } from "./views/CharacterSelection";
import { HelpPage } from "./views/HelpPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageNotFound } from "@kidsgo/components/PageNotFound/PageNotFound";
import * as sockets from "@/lib/sockets";

/*** Layout our main view and routes ***/
function Main(props): JSX.Element {
    const navigate = useNavigate();

    React.useEffect(() => {
        /*** Ensure we go to any games that are currently in progress ***/
        sockets.socket.on("active_game", (game: { id: number; phase: string }) => {
            if (game.phase !== "play") {
                // shouldn't happen
                return;
            }
            if (window.location.pathname.startsWith(`/game/${game.id}`)) {
                // if we're already on the game, don't do anything
                return;
            }

            const savedGameMode = localStorage.getItem("gameMode");

            let navigationUrl = `/game/${game.id}`;
            if (savedGameMode === "capture") {
                navigationUrl += "?mode=capture";
            }

            void navigate(navigationUrl);

            console.log("Need to go to game", game.id);
        });
    }, []);

    return <ErrorBoundary>{props.children}</ErrorBoundary>;
}

function Default(): JSX.Element {
    const user = data.get("config.user");

    return <LandingPage />;
}

export const routes = (
    <BrowserRouter>
        <Main>
            <Routes>
                <Route path="/game/:id" element={<KidsGame />} />
                <Route
                    path="/learn-to-play/8/problems/:section/:puzzleNumber"
                    element={<PuzzlesRouter />}
                />
                <Route path="/learn-to-play/:chapter/:page" element={<LessonRouter />} />
                <Route path="/learn-to-play/:chapter" element={<LessonRouter />} />
                <Route path="/learn-to-play" element={<LearnToPlay />} />
                <Route path="/character-selection" element={<CharacterSelection />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/play" element={<Matchmaking />} />
                <Route path="/" element={<Default />} />
                <Route path="/*" element={<PageNotFound />} />
            </Routes>
        </Main>
    </BrowserRouter>
);

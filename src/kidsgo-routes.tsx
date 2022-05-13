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

import * as data from "data";
import { _ } from "translate";
//import { browserHistory } from "./kidsgoHistory";

import { LandingPage } from "LandingPage";
import { LessonRouter } from "Lessons";
import { Game } from "Game";
import { LearnToPlay } from "LearnToPlay";
import { ErrorBoundary } from "ErrorBoundary";

/*** Layout our main view and routes ***/
function Main(props): JSX.Element {
    return <ErrorBoundary>{props.children}</ErrorBoundary>;
}
const PageNotFound = (props, state) => (
    <div style={{ display: "flex", flex: "1", alignItems: "center", justifyContent: "center" }}>
        {_("Page not found")}
    </div>
);

function Default(): JSX.Element {
    const user = data.get("config.user");

    return <LandingPage />;
}

export const routes = (
    <BrowserRouter>
        <Main>
            <Routes>
                <Route path="/game/:id" element={<Game />} />
                <Route path="/learn-to-play/:chapter/:page" element={<LessonRouter />} />
                <Route path="/learn-to-play/:chapter" element={<LessonRouter />} />
                <Route path="/learn-to-play" element={<LearnToPlay />} />
                <Route path="/" element={<Default />} />
                <Route path="/*" element={<PageNotFound />} />
            </Routes>
        </Main>
    </BrowserRouter>
);

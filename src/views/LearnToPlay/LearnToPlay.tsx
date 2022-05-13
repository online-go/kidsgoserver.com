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
import { useState } from "react";
import { Link } from "react-router-dom";
import { _, interpolate } from "translate";
import * as data from "data";
import * as preferences from "preferences";
import { errorAlerter, ignore } from "misc";

export function LearnToPlay(): JSX.Element {
    return (
        <div id="LearnToPlay">
            Learn to play
            <div>
                <Link to="/learn-to-play/1">Lesson 1</Link>
            </div>
            <div>
                <Link to="/learn-to-play/2">Lesson 2</Link>
            </div>
            <div>
                <Link to="/learn-to-play/3">Lesson 3</Link>
            </div>
            <div>
                <Link to="/learn-to-play/4">Lesson 4</Link>
            </div>
            <div>
                <Link to="/learn-to-play/5">Lesson 5</Link>
            </div>
            <div>
                <Link to="/learn-to-play/6">Lesson 6</Link>
            </div>
            <div>
                <Link to="/learn-to-play/7">Lesson 7</Link>
            </div>
            <div>
                <Link to="/learn-to-play/8">Lesson 8</Link>
            </div>
        </div>
    );
}

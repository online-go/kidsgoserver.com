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
import {Link} from "react-router-dom";
import {_, interpolate} from "translate";
import * as data from "data";
import * as preferences from "preferences";
import {errorAlerter, ignore} from "misc";


//export function Lesson({section, page}:{section: string, page: string}):JSX.Element {
export function Lesson(props: any):JSX.Element {
    const section = props.match?.params?.section;
    const page = props.match?.params?.page;

    return (
        <div id='Lesson'>
            Lesson {section} : {page}
        </div>
    );
}

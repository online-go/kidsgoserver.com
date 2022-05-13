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
import { Lesson } from "./Lesson";
//import { Content } from "./Content";
import { useParams } from "react-router-dom";
import { chapters } from "./chapters";

export function LessonRouter(): JSX.Element {
    const params = useParams();
    let chapter = parseInt(params.chapter || "1") - 1;
    let page = parseInt(params.page || "1") - 1;

    if (chapter < 0 || chapter >= chapters.length) {
        chapter = 0;
    }
    if (page < 0 || page >= chapters[chapter].length) {
        page = 0;
    }

    /*
    const [content, setContent] = React.useState<Content>(new chapters[chapter][page]);

    React.useEffect(() => {
        let c = new chapters[chapter][page];
        setContent(c);
        return () =>{
            c.destroy();
        }
    }, [chapter, page]);
    */

    return (
        <div>
            <Lesson chapter={chapter} page={page} />
        </div>
    );
}

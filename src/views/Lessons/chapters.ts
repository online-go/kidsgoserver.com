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

import { Content, LessonCompletePage } from "./Content";
import { module1 } from "./Module1";
import { module2 } from "./Module2";
import { module3 } from "./Module3";
import { module4 } from "./Module4";
import { module5 } from "./Module5";
import { module6 } from "./Module6";
import { module7 } from "./Module7";

// Every lesson ends on the "Lesson Complete" celebration. Lessons whose own
// closing page is already the celebration keep it; the rest get the shared
// celebration page added after their last page.
export const chapters: Array<Array<typeof Content>> = [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
].map((lesson) =>
    lesson[lesson.length - 1].prototype.lessonComplete() ? lesson : [...lesson, LessonCompletePage],
);

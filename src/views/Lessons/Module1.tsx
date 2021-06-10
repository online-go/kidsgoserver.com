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
import { Content } from './Content';
import { PuzzleConfig, Goban } from 'goban';


class Module1 extends Content {
    constructor() {
        super();
    }
}


class Page1 extends Module1 {
    text():string {
        return "In Go, we place stones on the lines, not in the squares!  Black goes first, followed by white.  Stones stay on the board once placed and don’t move (unless they are captured).";
    }
    config():PuzzleConfig {
        return {
            'initial_state': {
                'black': 'd4',
                'white': ''
            }
        };
    }
}

class Page2 extends Module1 {

    text():string {
        return "The spaces next to the stones are important, we call them Liberties. This stone has four liberties.";
    }
    config():PuzzleConfig {
        return {
            'initial_state': {
                'black': 'd4',
                'white': ''
            },
        };
    }

    onSetGoban(goban:Goban):void {
        this.animate(() => goban.setMarkByPrettyCoord("d5", "1"), 750);
        this.animate(() => goban.setMarkByPrettyCoord("e4", "2"), 1500);
        this.animate(() => goban.setMarkByPrettyCoord("d3", "3"), 2250);
        this.animate(() => goban.setMarkByPrettyCoord("c4", "4"), 3000);

        // todo: stone smiles at end
    }
}


export const module1:Array<typeof Content> = [
    Page1,
    Page2,

];

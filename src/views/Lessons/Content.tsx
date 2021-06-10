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
import { PuzzleConfig, Goban } from 'goban';
import { Timeout } from 'misc';


interface Animation {
    cancel: () => void;
}

export class Content {
    animations:{[id:string]: Timeout} = {};
    last_animation_id:number = 0;
    goban?:Goban;

    constructor() {
    }

    text():string {
        return "Natus asperiores vel est rerum nihil quia. Quae molestias mollitia minus. Saepe suscipit nulla magni aut qui. Eum aperiam dolorem porro aut.";
    }

    destroy():void {
        console.log("Destroying Content");
        for (let id in this.animations) {
            clearTimeout(this.animations[id]);
        }
        this.animations = {};
    }

    config():PuzzleConfig {
        return {
            'initial_state': {
                'black': 'a1b2',
                'white': ''
            }
        };
    }

    /* Calls cb every interval ms until the callback returns falsy. Manages
     * tearing down the animation when the Content is destroyed. */
    animate(cb: () => any, interval:number):Animation {
        let animation_id = ++this.last_animation_id;

        let loop = () => {
            let res = false;
            try {
                res = cb();
            } catch (e) {
                console.error(e);
            }

            if (res) {
                this.animations[animation_id] = setTimeout(loop, interval);
            } else {
                delete this.animations[animation_id];
            }
        };

        this.animations[animation_id] = setTimeout(loop, interval);

        return {
            cancel: () => {
                if (this.animations[animation_id]) {
                    clearTimeout(this.animations[animation_id]);
                    delete this.animations[animation_id];
                }
            }
        };
    }

    setGoban(goban:Goban) {
        this.goban = goban;
        this.onSetGoban(this.goban);
    }

    onSetGoban(goban:Goban):void {
    }
}

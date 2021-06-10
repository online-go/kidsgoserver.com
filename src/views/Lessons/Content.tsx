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
import { PuzzleConfig, Goban, GoMath } from 'goban';
import { Timeout, navigateTo } from 'misc';


interface Animation {
    cancel: () => void;
}

export class Content {
    animations:{[id:string]: Timeout} = {};
    delays:{[id:string]: Timeout} = {};
    last_animation_id:number = 0;
    goban?:Goban;
    current_delay:number = 0;
    next_path:string = "";

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
        for (let id in this.delays) {
            clearTimeout(this.delays[id]);
        }
        this.animations = {};
        this.delays = {};
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

    delay(cb: () => any, increment:number = 750):Animation {
        let animation_id = ++this.last_animation_id;
        let t = this.current_delay += increment;

        this.delays[animation_id] = setTimeout(() => {
            try {
                cb();
            } catch (e) {
                console.error(e);
            }

            delete this.delays[animation_id];
        }, t);

        return {
            cancel: () => {
                if (this.delays[animation_id]) {
                    clearTimeout(this.delays[animation_id]);
                    delete this.delays[animation_id];
                }
            }
        };
    }

    setGoban(goban:Goban) {
        if (this.goban) {
            throw new Error("Duplicate setGoban called");
        }
        this.goban = goban;
        this.onSetGoban(this.goban);
    }

    onSetGoban(goban:Goban):void {
    }

    makePuzzleMoveTree(_correct:Array<string>, _wrong:Array<string>, width:number = 7, height:number = 7) {
        let correct:Array<any> = [];
        let wrong:Array<any> = [];
        for (let s of _correct) {
            correct.push(GoMath.decodeMoves(s, width, height));
        }
        for (let s of _wrong) {
            wrong.push(GoMath.decodeMoves(s, width, height));
        }

        let ret = {
            x: -1,
            y: -1,
            branches: [],
        };

        function walk(cur, path, cb) {
            if (!path.length) {
                cb(cur);
                return;
            } else {
                for (let branch of cur.branches) {
                    if (branch.x === path[0].x && branch.y === path[0].y) {
                        path.shift();
                        walk(branch, path, cb);
                        return;
                    }
                }
                let new_branch = {
                    x: path[0].x,
                    y: path[0].y,
                    branches: [],
                };
                cur.branches.push(new_branch);
                path.shift();
                walk(new_branch, path, cb);
                return;
            }
        }

        for (let arr of correct) {
            walk(ret, arr, (node) => node.correct_answer = true);
        }

        for (let arr of wrong) {
            walk(ret, arr, (node) => node.wrong_answer = true);
        }

        return ret;
    }

    gotoNext():void {
        navigateTo(this.next_path);
    }
    setNext(path:string):void {
        this.next_path = path;
    }
}

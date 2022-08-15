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

import {
    GoTheme,
    GoThemes,
    GoMath,
    GobanCore,
    deviceCanvasScalingRatio,
    placeRenderedImageStone,
    preRenderImageStone,
} from "goban";

type StoneType = { stone: HTMLCanvasElement; shadow: HTMLCanvasElement };
type StoneTypeArray = Array<StoneType>;

declare const cdn_service;

function stoneCastsShadow(radius: number): boolean {
    return radius >= 10;
}

export function image_url(colorset: string, name: string) {
    /* Firefox doesn't support drawing inlined SVGs into canvases. One can
     * attach them to the dom just fine, but not draw them into a canvas for
     * whatever reason. So, for firefox we have to load the exact same SVG off
     * the network it seems. */
    const firefox = navigator.userAgent.toLocaleLowerCase().indexOf("firefox") > -1;
    const suffix = firefox ? "png" : "svg";

    return `${cdn_service}/1.0/stones/${colorset}/${name}.${suffix}`;
}

export function image_urls(colorset: string) {
    return [
        image_url(colorset, "plain"),
        image_url(colorset, "neutral"),
        image_url(colorset, "happy"),
        image_url(colorset, "sad"),
        image_url(colorset, "scared"),
        image_url(colorset, "shifty1"),
        image_url(colorset, "shifty2"),
        image_url(colorset, "surprised"),
        image_url(colorset, "threat"),
    ];
}

let last_game_id = 0;
let last_goban_liberties: Array<Array<number>>;
let last_goban_liberties_hash = null;
/** y,x is 0 if the location is not currently "scared". If it is
 * scared, this is the timestamp of when it became scared, so that
 * we can then devolve into shifty-eyes after a certain amount of time.
 */
let scared_map: Array<Array<number>>;

function getCachedLiberties(goban: GobanCore): Array<Array<number>> {
    const hash = JSON.stringify(goban.engine.board);
    if (last_goban_liberties_hash === hash && last_goban_liberties) {
        return last_goban_liberties;
    }

    last_goban_liberties_hash = hash;

    last_goban_liberties = goban.engine.computeLibertyMap();
    return last_goban_liberties;
}

function reset_game_when_changed(goban: GobanCore) {
    if (
        last_game_id !== goban.game_id ||
        !scared_map ||
        scared_map.length !== goban.height ||
        scared_map[0].length !== goban.width
    ) {
        last_goban_liberties_hash = null;
        scared_map = GoMath.makeMatrix(goban.width, goban.height, 0);
        last_game_id = +goban.game_id;
    }
}

export function initialize_kidsgo_themes() {
    abstract class Common extends GoTheme {
        public abstract getSadStoneSvgUrl(): string;
        stoneCastsShadow(radius: number): boolean {
            return stoneCastsShadow(radius * deviceCanvasScalingRatio());
        }

        placeBlackStone(
            ctx: CanvasRenderingContext2D,
            shadow_ctx: CanvasRenderingContext2D | null,
            stone: StoneType,
            cx: number,
            cy: number,
            radius: number,
        ): void {
            placeRenderedImageStone(ctx, shadow_ctx, stone, cx, cy, radius);
        }

        placeWhiteStone(
            ctx: CanvasRenderingContext2D,
            shadow_ctx: CanvasRenderingContext2D | null,
            stone: StoneType,
            cx: number,
            cy: number,
            radius: number,
        ): void {
            placeRenderedImageStone(ctx, shadow_ctx, stone, cx, cy, radius);
        }

        getStone(x: number, y: number, stones: StoneTypeArray, goban: GobanCore): StoneType {
            const hash = this.getStoneHash(x, y, stones, goban);

            switch (hash) {
                case "plain":
                    return stones[0];
                case "neutral":
                    return stones[1];
                case "happy":
                    return stones[2];
                case "sad":
                    return stones[3];
                case "scared":
                    return stones[4];
                case "shifty1":
                    return stones[5];
                case "shifty2":
                    return stones[6];
                case "surprised":
                    return stones[7];
                case "threat":
                    return stones[8];
            }

            return stones[0];
        }
        getStoneHash(x: number, y: number, stones: StoneTypeArray, goban: GobanCore): string {
            reset_game_when_changed(goban);
            if (goban.engine.board[y][x] === 0) {
                return "plain";
            }

            const liberties = getCachedLiberties(goban);
            const rng = (x + 1) * 53 * ((y + 1) * 97);

            if (liberties[y][x] === 1) {
                if (scared_map[y][x] === 0) {
                    scared_map[y][x] = Date.now();
                }

                if (Date.now() - scared_map[y][x] < 1000) {
                    return "neutral";
                }
                if (Date.now() - scared_map[y][x] < 3000) {
                    return "scared";
                } else {
                    const t = (rng + Math.round(Date.now() / 1500)) % 2;

                    switch (t) {
                        case 0:
                            return "shifty1";
                        case 1:
                            return "shifty2";
                    }
                }
            } else {
                scared_map[y][x] = 0;
            }

            let threat = false;

            goban.engine.foreachNeighbor({ x, y }, (nx, ny) => {
                if (liberties[ny][nx] === 1) {
                    threat = true;
                }
            });

            if (threat) {
                return "threat";
            }

            return "neutral";
        }
    }

    class DarkBlue extends Common {
        sort() {
            return 30;
        }
        get theme_name(): string {
            return "DarkBlue";
        }

        preRenderBlack(
            radius: number,
            _seed: number,
            deferredRenderCallback: () => void,
        ): StoneTypeArray {
            console.log("Pre-rendering dark blue");
            return preRenderImageStone(radius, image_urls("dark_blue"), deferredRenderCallback);
        }
        getBlackTextColor(_color: string): string {
            return "#ffffff";
        }
        getSadStoneSvgUrl(): string {
            return image_url("dark_blue", "sad");
        }
    }

    GoThemes["black"]["DarkBlue"] = DarkBlue;

    class Pink extends Common {
        sort() {
            return 30;
        }
        get theme_name(): string {
            return "Pink";
        }

        preRenderBlack(
            radius: number,
            _seed: number,
            deferredRenderCallback: () => void,
        ): StoneTypeArray {
            return preRenderImageStone(radius, image_urls("pink"), deferredRenderCallback);
        }
        getWhiteTextColor(_color: string): string {
            //return "#ffffff";
            return "#BC32A1";
        }
        getBlackTextColor(_color: string): string {
            //return "#ffffff";
            return "#CAE6F3";
        }
        getSadStoneSvgUrl(): string {
            return image_url("pink", "sad");
        }
    }

    GoThemes["black"]["Pink"] = Pink;

    class LightBlue extends Common {
        sort() {
            return 30;
        }
        get theme_name(): string {
            return "LightBlue";
        }

        preRenderWhite(
            radius: number,
            _seed: number,
            deferredRenderCallback: () => void,
        ): StoneTypeArray {
            return preRenderImageStone(radius, image_urls("light_blue"), deferredRenderCallback);
        }
        getWhiteTextColor(_color: string): string {
            return "#BC32A1";
        }
        getBlackTextColor(_color: string): string {
            return "#CAE6F3";
        }
        getSadStoneSvgUrl(): string {
            return image_url("light_blue", "sad");
        }
    }

    GoThemes["white"]["LightBlue"] = LightBlue;

    class White extends Common {
        sort() {
            return 30;
        }
        get theme_name(): string {
            return "White";
        }

        preRenderWhite(
            radius: number,
            _seed: number,
            deferredRenderCallback: () => void,
        ): StoneTypeArray {
            return preRenderImageStone(radius, image_urls("white"), deferredRenderCallback);
        }
        getBlackTextColor(_color: string): string {
            return "#000000";
        }
        getSadStoneSvgUrl(): string {
            return image_url("white", "sad");
        }
    }

    GoThemes["white"]["White"] = White;
}

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

import { Goban, JGOFIntersection } from "goban";

function getScreenCoordinatesOfStone(
    x: number,
    y: number,
    goban: Goban,
    color: "black" | "white",
): { x: number; y: number } {
    if (x === -1 || y === -1) {
        const elt = document.getElementById(`Bowl-${color}`);
        const rect = elt.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 5 };
    }

    const rect = (goban as any).board.getBoundingClientRect();
    const ss = (goban as any).square_size;
    return {
        x: (x + (goban.draw_left_labels ? 1 : 0)) * ss + rect.left,
        y: (y + (goban.draw_top_labels ? 1 : 0)) * ss + rect.top,
    };
}

window["getScreenCoordinatesOfStone"] = getScreenCoordinatesOfStone;

export function animateCaptures(
    removed_stones: Array<JGOFIntersection>,
    goban: Goban,
    color: "black" | "white",
): void {
    const ss = (goban as any).square_size;

    removed_stones.forEach((stone) => {
        const { x, y } = stone;
        const { x: screen_x, y: screen_y } = getScreenCoordinatesOfStone(x, y, goban, color);
        const stone_element = document.createElement("img") as HTMLImageElement;
        stone_element.className = "AnimatedStoneCapture";
        stone_element.style.left = screen_x + "px";
        stone_element.style.top = screen_y + "px";
        stone_element.style.width = ss + "px";
        stone_element.style.height = ss + "px";
        if (x === -1) {
            stone_element.src = (
                color === "black" ? (goban as any).theme_black : (goban as any).theme_white
            ).getNeutralStoneSvgUrl();
        } else {
            stone_element.src = (
                color === "black" ? (goban as any).theme_black : (goban as any).theme_white
            ).getSadStoneSvgUrl();
        }
        document.body.appendChild(stone_element);

        const other_color = color === "black" ? "white" : "black";
        const target = document
            .getElementById(`captures-${other_color}`)
            ?.getBoundingClientRect() || {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        const src = {
            x: screen_x,
            y: screen_y,
            width: ss,
            height: ss,
        };
        const dst = {
            x: (target?.left ?? 0) + target?.width / 2,
            y: (target?.top ?? 0) + target?.height / 2,
            width: 32,
            height: 32,
        };
        const duration = 3000;
        const start = performance.now();

        const frame = () => {
            if (performance.now() - start > duration) {
                stone_element.remove();
                return;
            }

            let a = (performance.now() - start) / duration;
            //a = a * a; // ease in
            a = a * a * a; // ease in
            const yoffset = Math.sin(a * Math.PI) * ss * 5;
            const srcy = src.y - yoffset;

            stone_element.style.left = src.x + (dst.x - src.x) * a + "px";
            stone_element.style.top = srcy + (dst.y - srcy) * a + "px";

            stone_element.style.width = src.width + (dst.width - src.width) * a + "px";
            stone_element.style.height = src.height + (dst.height - src.height) * a + "px";

            requestAnimationFrame(frame);
        };

        setTimeout(() => {
            frame();
        }, 250);
    });
}

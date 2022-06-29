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
import { Goban } from "goban";

interface CapturesProps {
    color: "black" | "white";
    goban: Goban;
}

function xrandpercent(i: number): number {
    return (Math.abs(Math.sin(i * 71.01) * 500461564) % 60) + 10;
}

function yrandpercent(i: number): number {
    return Math.abs((Math.sin(i * 53.7) * 1023467329) % 20) + 25;
}

export function Captures({ color, goban }: CapturesProps): JSX.Element {
    //const [r, refresh] = React.useState(0);
    const [numCaptures, setNumCaptures] = React.useState(goban?.engine[color + "_prisoners"] || 0);

    React.useEffect(() => {
        if (goban) {
            setNumCaptures(goban?.engine[color + "_prisoners"] || 0);
            const doDelayedRefresh = () => {
                console.log("Delayed refresh");
                setTimeout(() => {
                    setNumCaptures(goban.engine[color + "_prisoners"]);
                }, 3000);
            };
            const doImmediateRefresh = () => {
                setNumCaptures(goban.engine[color + "_prisoners"]);
            };

            goban.on("captured-stones", doDelayedRefresh);
            goban.on("load", doImmediateRefresh);
            return () => {
                goban.off("captured-stones", doDelayedRefresh);
                goban.off("load", doImmediateRefresh);
            };
        }
    }, [goban, color]);

    // other color stones
    const svg_url = (
        color === "black" ? (goban as any)?.theme_white : (goban as any)?.theme_black
    )?.getSadStoneSvgUrl();

    const stones = [];
    if (goban) {
        //for (let i = 0; i < goban.engine[color + "_prisoners"]; i++) {
        for (let i = 0; i < numCaptures; i++) {
            stones.push({
                left: xrandpercent(i) + "%",
                top: yrandpercent(i) + "%",
            });
        }
    }

    return (
        <div className="Captures">
            <div className="Captures-svg" id={`captures-${color}`}>
                {stones.map((stone, i) => (
                    <img key={i} className={`Captures-stone`} src={svg_url} style={stone} />
                ))}
            </div>
        </div>
    );
}

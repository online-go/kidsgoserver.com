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

interface BowlProps {
    bouncing: boolean;
    color: "black" | "white";
    goban: Goban;
    label: string;
}

export function Bowl({ bouncing, color, goban, label }: BowlProps): JSX.Element {
    const svg_url = (color === "black" ? (goban as any)?.theme_black : (goban as any)?.theme_white)
        ?.getSadStoneSvgUrl()
        .replace("sad", "neutral");

    return (
        <div className={"Bowl" + (bouncing ? " bouncing" : "")}>
            <div className="spacer" />
            <div className="Bowl-svg-background">
                {[0, 1, 2, 3, 4].map((i) => (
                    <img key={i} className={`Bowl-stone s${i}`} src={svg_url} />
                ))}
                <div id={`Bowl-${color}`} className="Bowl-svg-foreground ${color}" />
                <div className="label">{label}</div>
            </div>
            <div className="spacer" />
        </div>
    );
}

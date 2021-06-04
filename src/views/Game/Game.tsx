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
import * as data from "data";
import * as preferences from "preferences";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { _, interpolate } from "translate";
import { errorAlerter, ignore } from "misc";
import { Goban, GoMath, GobanConfig } from "goban";


let objIdMap = new WeakMap();
let objectCount = 0;
function objectId(obj) {
  if (!objIdMap.has(obj)) {
      objIdMap.set(obj, ++objectCount);
  }
  return objIdMap.get(obj);
}


export function Game(props: any):JSX.Element {
    const id:number = parseInt(props.match?.params?.id);
    let container = useRef<HTMLDivElement>(null);
    let goban_ref = useRef<Goban>(null);
    let goban_opts_ref = useRef<any>({});
    let [_hup, hup]: [number, (x:number) => void] = useState<number>(Math.random());

    useEffect(() => {
        console.log("Constructing game ", id);

        let opts:GobanConfig = {
            "board_div": container.current || undefined,
            "interactive": true,
            "mode": "puzzle",
            "player_id": 0,
            "server_socket": null,
            "square_size": 20
        };

        goban_opts_ref.current = opts;
        goban_ref.current = new Goban(opts);
        let goban:Goban = goban_ref.current;
        goban.setMode("puzzle");

        let onUpdate = () => {
            let mvs = GoMath.decodeMoves(
                goban.engine.cur_move.getMoveStringToThisPoint(),
                goban.width,
                goban.height);
            let move_string = mvs.map((p) => GoMath.prettyCoords(p.x, p.y, goban.height)).join(",");
            console.log("Move string: ", move_string);
            //this.setState({ move_string });
        };

        goban.on("update", onUpdate);
        window["global_goban"] = goban;

        return () => {
            goban.destroy();
            goban_ref.current = null;
            goban_opts_ref.current = null;
            console.log(`Game ${id} teardown`);
            hup(Math.random());
            setTimeout(() => {
                console.log("Redrawing");
                goban.redraw(true);
            }, 1);
        };
    }, [id, container]);

    return (
        <div id='Game'>
            <div className={"center-col"}>
                <div className='Goban'>
                    <div ref={container}></div>
                </div>
            </div>
            <div>
                <Link to='/game/0'>game 0</Link>
                <Link to='/game/1'>game 1</Link>
                <Link to='/game/2'>game 2</Link>
                <Link to='/game/3'>game 3</Link>
            </div>
        </div>
    );
}

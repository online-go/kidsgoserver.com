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

import * as data from "data";
import { sprite_packs } from "sfx_sprites";
import { Howl, Howler } from "howler";

export let kidsgo_sfx: Howl;
Howler.autoUnlock = true;

export function init_kidsgo_sfx() {
    const sprite_pack = {
        pack_id: "kidsgo",
        language: "zz",
        country: "un",
        name: "KidsgoEffects",
        filename_prefix: "kidsgo.v7",
        definitions: {
            silence: [0, 50],
            rocket: [1000.0, 2278.625],
        },
    };
    const release_base: string = window["cdn_service"];

    window["kidsgo_sfx"] = kidsgo_sfx = new Howl({
        src:
            (window as any).safari !== undefined // As of safari 14.1, their webm implementation cannot play our webm audio files correctly.
                ? [`${release_base}/sound/${sprite_pack.filename_prefix}.mp3`]
                : [
                      `${release_base}/sound/${sprite_pack.filename_prefix}.webm`,
                      `${release_base}/sound/${sprite_pack.filename_prefix}.mp3`,
                  ],
        autoplay: false,
        sprite: sprite_pack.definitions as any,
    });
}

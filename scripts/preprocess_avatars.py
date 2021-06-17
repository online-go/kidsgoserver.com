#!/usr/bin/env python3

from glob import glob
import re
import os
import shutil

SOURCE_DIRECTORY = 'art/20210601/01_CharacterAvatars'
DEST_DIRECTORY = 'assets/avatars'
RELEASE = '0.1'

race_source_map = {
    'aquatic': 'KidsGoSever_CHAR_DES_Delivery_AQUATIC_SPECIES_003',
    'bird': 'KidsGoSever_CHAR_DES_Delivery_BIRD_SPECIES_002',
    'fuzzball': 'KidsGoSever_CHAR_DES_Delivery_FUZZBALL_SPECIES_004',
    'wisdom': 'KidsGoSever_CHAR_DES_Delivery_WISDOM_SPECIES_003',
}

HEADER = '''/*
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

'''



with open('src/components/Avatar/avatar_list.ts', 'w') as ts:
    with open('src/components/Avatar/avatar_list.styl', 'w') as styl:
        ts.write(HEADER)
        styl.write(HEADER)

        ts.write("import * as React from 'react';\n"); # fixes not a module thing
        ts.write('export let avatar_list = [\n');

        for race, subdir in race_source_map.items():
            os.makedirs('%s/%s' % (DEST_DIRECTORY, race), exist_ok = True);
            ct = 0
            for filename in glob('%s/%s/*.svg' % (SOURCE_DIRECTORY, subdir)):
                m = re.match('.*-([0-9]+).svg$', filename)

                with open(filename, 'r') as svg:
                    if re.match('.*Milk', svg.read()):
                        print("Skipping %s, looks like a bad export" % filename)
                        continue

                if m:
                    num = int(m.group(1))
                    print('%s: %d %s' % (race, num, filename))
                    shutil.copyfile(filename, '%s/%s/%d.svg' % (DEST_DIRECTORY, race, num))
                    ct += 1

                    ts.write('    {race: "%s", id: %d},\n' % (race, num));
                    styl.write('.avatar-%s-%d { background-image: url("/%s/avatars/%s/%d.svg"); }\n' % (race, num, RELEASE, race, num));
                else:
                    print("Error: couldn't parse identifying number from %s" % filename);
            print('Prepared %d variants for %s' % (ct, race))

        ts.write('];\n')


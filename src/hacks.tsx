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

import * as f101 from 'batcher';
import * as f102 from 'bots';
import * as f103 from 'cached';
import * as f104 from 'configure-goban';
import * as f105 from 'data';
import * as f106 from 'debug';
import * as f107 from 'device';
import * as f108 from 'ITC';
import * as f109 from 'localize-time';
import * as f110 from 'messages';
import * as f111 from 'misc';
import * as f113 from 'online_status';
import * as f114 from 'player_cache';
import * as f115 from 'popover';
import * as f116 from 'popover';
import * as f117 from 'preferences';
import * as f118 from 'profanity_filter';
import * as f119 from 'pubsub';
import * as f120 from 'rank_utils';
import * as f121 from 'requests';
import * as f122 from 'sfx_sprites';
import * as f123 from 'sfx';
import * as f124 from 'sockets';
import * as f125 from 'tabcomplete';
import * as f127 from 'toast';
import * as f128 from 'tooltip';
import * as f129 from 'translate';
import * as f130 from 'translate';
import * as f131 from 'TypedEventEmitter';
import * as f132 from 'types';


import * as c01 from 'Clock';
import * as c02 from 'Errcode';
import * as c03 from 'ErrcodeModal';
import * as c04 from 'ErrorBoundary';
import * as c05 from 'Flag';
import * as c06 from 'GameList';
import * as c07 from 'GobanLineSummary';
import * as c08 from 'GobanThemePicker';
import * as c09 from 'KBShortcut';
import * as c10 from 'LanguagePicker';
import * as c11 from 'Loading';
import * as c13 from 'Markdown';
import * as c14 from 'material';
import * as c15 from 'MiniGoban';
import * as c16 from 'misc-ui';
import * as c17 from 'Modal';
import * as c18 from 'PaginatedTable';
import * as c19 from 'PersistentElement';
import * as c20 from 'Player';
import * as c21 from 'PlayerAutocomplete';
import * as c22 from 'PlayerIcon';
import * as c23 from 'PlayerNotesModal';
import * as c24 from 'Resizable';
import * as c25 from 'StarRating';
import * as c27 from 'TabCompleteInput';
import * as c28 from 'Throbber';
import * as c29 from 'Toggle';
import * as c30 from 'TypedEventEmitterPureComponent';
import * as c31 from 'UIPush';
import * as c32 from 'BlockPlayer';
import * as c33 from 'FriendList';



export function hacks() {
    console.log("this exists for some import stuff we have to do as we transition to a new clean project, gotta import all remaining files at some point");
}

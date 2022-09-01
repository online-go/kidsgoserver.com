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

/// <reference path="../online-go.com/src/models/challenges.d.ts" />
/// <reference path="../online-go.com/src/models/games.d.ts" />
/// <reference path="../online-go.com/src/models/overview.d.ts" />
/// <reference path="../online-go.com/src/models/puzzles.d.ts" />
/// <reference path="../online-go.com/src/models/tournaments.d.ts" />
/// <reference path="../online-go.com/src/models/user.d.ts" />
import * as _hacks from "./hacks";
import * as Sentry from "@sentry/browser";
import * as data from "data";
import * as preferences from "preferences";
import * as requests from "requests";
import { configure_goban } from "configure-goban";
import { initialize_kidsgo_themes } from "goban_themes";
import {
    GoMath,
    init_score_estimator,
    set_remote_scorer,
    ScoreEstimateRequest,
    ScoreEstimateResponse,
} from "goban";
import { sfx } from "sfx";
import { init_kidsgo_sfx } from "kidsgo-sfx";
import { post } from "requests";
import { ai_host } from "sockets";

(window as any)["requests"] = requests;

declare let kidsgo_current_language;
declare let kidsgo_version;

let sentry_env = "production";

if (
    /online-(go|baduk|weiqi|covay|igo).(com|net)$/.test(document.location.host) &&
    !/dev/.test(document.location.host)
) {
    sentry_env = "production";
    if (/beta/.test(document.location.host)) {
        sentry_env = "beta";
    }
} else {
    sentry_env = "development";
}

try {
    Sentry.init({
        dsn: "https://55abcdda52904d7cb3456070c0f6acc1@o589780.ingest.sentry.io/5797436",
        release: kidsgo_version || "dev",
        tracesSampleRate: 1,
        whitelistUrls: ["kidsgoserver.com", "beta.kidsgoserver.com", "dev.beta.kidsgoserver.com"],
        environment: sentry_env,
        integrations: [
            new Sentry.Integrations.GlobalHandlers({
                onerror: true,
                onunhandledrejection: false,
            }),
            new Sentry.Integrations.Breadcrumbs({
                console: false,
            }),
        ],
    });

    Sentry.setTag("version", kidsgo_version || "dev");
    Sentry.setExtra("language", kidsgo_current_language || "unknown");
    Sentry.setExtra("version", kidsgo_version || "dev");
} catch (e) {
    console.error(e);
}

try {
    window.onunhandledrejection = (e) => {
        console.error(e);
        console.error(e.reason);
        console.error(e.stack);
    };
} catch (e) {
    console.log(e);
}

// Disable the desktop notifications preemptiely so we don't get the OGS
// desktop notification toast prompt
preferences.set("desktop-notifications", false);

try {
    // default_theme is set in index.html based on looking at the OS theme
    data.setDefault("theme", window["default_theme"]);
} catch (e) {
    data.setDefault("theme", "light");
}
data.setDefault("config", {
    user: {
        anonymous: true,
        id: 0,
        username: "Guest",
        ranking: -100,
        country: "un",
        pro: 0,
    },
});
data.setDefault("config.user", {
    anonymous: true,
    id: 0,
    username: "Guest",
    ranking: -100,
    country: "un",
    pro: 0,
});

data.setDefault("config.cdn", window["cdn_service"]);
data.setDefault(
    "config.cdn_host",
    window["cdn_service"].replace("https://", "").replace("http://", "").replace("//", ""),
);
data.setDefault("config.cdn_release", window["cdn_service"] + "/" + window["kidsgo_release"]);
data.setDefault("config.release", window["kidsgo_release"]);

initialize_kidsgo_themes(); // has to be after config.cdn_release is set
configure_goban();
init_kidsgo_sfx();
sfx.setVolume("master", 0.7);
sfx.sync();

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { routes } from "./kidsgo-routes";

//import {Promise} from "es6-promise";
import { errorAlerter, uuid } from "misc";
import * as sockets from "sockets";
import { _ } from "translate";
import * as player_cache from "player_cache";
import { toast } from "toast";
import cached from "cached";

import "debug";

/*** Initialize moment in our current language ***/

/*** Load our config ***/
data.watch(cached.config, (config) => {
    /* We do a pass where we set everything, and then we 'set' everything
     * again to do the emits that we are expecting. Otherwise triggers
     * that are depending on other parts of the config will fire without
     * having up to date information (in particular user / auth stuff) */
    for (const key in config) {
        data.setWithoutEmit(`config.${key}` as any, config[key] as never);
    }
    for (const key in config) {
        data.set(`config.${key}` as any, config[key] as never);
    }
});

let last_username: string | null = null;
data.watch("config.user", (user) => {
    try {
        Sentry.setUser({
            id: user.id,
            username: user.username,
        });
    } catch (e) {
        console.error(e);
    }

    player_cache.update(user);
    data.set("user", user);
    window["user"] = user;

    if (last_username && last_username !== user.username) {
        last_username = user.username;
        //forceReactUpdate();
    }
    last_username = user.username;
});

/***
 * Setup a device UUID so we can logout other *devices* and not all other
 * tabs with our new logout-other-devices button
 */
data.set("device.uuid", data.get("device.uuid", uuid()));

/***
 * Test if local storage is disabled for some reason (Either because the user
 * turned it off, the browser doesn't support it, or because the user is using
 * Safari in private browsing mode which implicitly disables the feature.)
 */
try {
    localStorage.setItem("localstorage-test", "true");
} catch (e) {
    toast(
        <div>
            {_(
                "It looks like localStorage is disabled on your browser. Unfortunately you won't be able to sign in without enabling it first.",
            )}
        </div>,
    );
}

/** Connect to the chat service */
let auth_connect_fn = () => {
    return;
};
data.watch("config.user", (user) => {
    if (!user.anonymous) {
        auth_connect_fn = (): void => {
            sockets.socket.send("authenticate", {
                auth: data.get("config.chat_auth"),
                player_id: user.id,
                username: user.username,
                jwt: data.get("config.user_jwt"),
                useragent: navigator.userAgent,
                language: kidsgo_current_language,
                language_version: "",
                client_version: kidsgo_version,
            });
            sockets.socket.send("chat/connect", {
                auth: data.get("config.chat_auth"),
                player_id: user.id,
                ranking: user.ranking,
                username: user.username,
                ui_class: user.ui_class,
            });
        };
    } else if (user.id < 0) {
        auth_connect_fn = (): void => {
            sockets.socket.send("chat/connect", {
                player_id: user.id,
                ranking: user.ranking,
                username: user.username,
                ui_class: user.ui_class,
            });
        };
    }
    if (sockets.socket.connected) {
        auth_connect_fn();
    }
});
sockets.socket.on("connect", () => {
    auth_connect_fn();
});

/*** Setup remote score estimation */
set_remote_scorer(remote_score_estimator);
function remote_score_estimator(req: ScoreEstimateRequest): Promise<ScoreEstimateResponse> {
    return new Promise<ScoreEstimateResponse>((resolve, reject) => {
        req.jwt = data.get("config.user_jwt");
        resolve(post(`${ai_host}/api/score`, req));
    });
}
init_score_estimator()
    .then((tf) => {
        // console.log('SE Initialized');
    })
    .catch((err) => console.error(err));

/*** Generic error handling from the server ***/
sockets.socket.on("ERROR", console.error);

/* Initialization done, render!! */
const svg_loader = document.getElementById("loading-svg-container");
svg_loader.parentNode.removeChild(svg_loader);

const react_root = ReactDOM.createRoot(document.getElementById("main-content"));

//react_root.render(<React.StrictMode>{routes}</React.StrictMode>);
react_root.render(routes);

window["data"] = data;
window["preferences"] = preferences;
window["player_cache"] = player_cache;
window["GoMath"] = GoMath;

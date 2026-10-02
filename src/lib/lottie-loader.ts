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

// Where the release's static assets are served from (mirrors data "config.cdn_release").
export function cdnBase(): string {
    return window["cdn_service"] + "/" + window["kidsgo_release"];
}

const animationCache = new Map<string, object>();

// Shared so preload_animation and useLottieAnimation don't each fetch the same
// path before the first lands in animationCache.
const pendingAnimations = new Map<string, Promise<object>>();
export function loadAnimation(path: string): Promise<object> {
    const cached = animationCache.get(path);
    if (cached) {
        return Promise.resolve(cached);
    }
    let pending = pendingAnimations.get(path);
    if (!pending) {
        pending = fetch(path, { credentials: "omit" })
            .then((r) => r.json())
            .then((data: object) => {
                animationCache.set(path, data);
                return data;
            })
            .finally(() => pendingAnimations.delete(path));
        pendingAnimations.set(path, pending);
    }
    return pending;
}

// Warm the cache ahead of the component that needs the animation.
export function preload_animation(path: string) {
    loadAnimation(path).catch(() => {
        // The consuming component will retry and log.
    });
}

export function useLottieAnimation(path: string): object | null {
    const [animation, setAnimation] = React.useState<object | null>(
        animationCache.get(path) ?? null,
    );
    React.useEffect(() => {
        let cancelled = false;
        loadAnimation(path)
            .then((data) => {
                if (!cancelled) {
                    setAnimation(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error(err);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [path]);
    return animation;
}

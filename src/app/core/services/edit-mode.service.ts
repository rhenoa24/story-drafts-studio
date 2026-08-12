import { Injectable, isDevMode } from '@angular/core';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '']);

/**
 * Story Drafts Studio has no backend: Edit Mode only makes sense while
 * running locally. Once published to GitHub Pages, only Reading Mode should
 * be reachable.
 *
 * Detection is intentionally simple and matches the project's local-first
 * philosophy: if the app is being served from localhost (`ng serve`, or a
 * local static preview), Edit Mode is available. Anywhere else - including
 * a GitHub Pages domain - it's disabled. `isDevMode()` is also honored as a
 * fallback so a production build served locally for testing still behaves
 * as expected.
 */
@Injectable({ providedIn: 'root' })
export class EditModeService {
    readonly isEditModeEnabled: boolean = this.detect();

    private detect(): boolean {
        if (isDevMode()) return true;
        if (typeof window === 'undefined') return false;
        return LOCAL_HOSTNAMES.has(window.location.hostname);
    }
}
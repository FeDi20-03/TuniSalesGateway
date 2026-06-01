import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'ts-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<ThemeMode>('light');
  readonly theme$: Observable<ThemeMode> = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.initFromStorageOrSystem();
    this.listenToSystemPreference();
  }

  getCurrentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  setTheme(theme: ThemeMode): void {
    this.apply(theme, /* persist */ true);
  }

  toggle(): void {
    this.setTheme(this.getCurrentTheme() === 'dark' ? 'light' : 'dark');
  }

  private initFromStorageOrSystem(): void {
    const stored = this.readStored();
    if (stored) {
      this.apply(stored, /* persist */ false);
      return;
    }
    const prefersDark = this.matchMedia('(prefers-color-scheme: dark)')?.matches;
    this.apply(prefersDark ? 'dark' : 'light', /* persist */ false);
  }

  private listenToSystemPreference(): void {
    const mq = this.matchMedia('(prefers-color-scheme: dark)');
    if (!mq) {
      return;
    }
    const handler = (event: MediaQueryListEvent): void => {
      // Only follow the OS if the user has not explicitly chosen a theme.
      if (!this.readStored()) {
        this.apply(event.matches ? 'dark' : 'light', /* persist */ false);
      }
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
    } else if (typeof (mq as any).addListener === 'function') {
      (mq as any).addListener(handler);
    }
  }

  private apply(theme: ThemeMode, persist: boolean): void {
    this.document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // localStorage may be unavailable (private mode, SSR) — ignore.
      }
    }
    this.themeSubject.next(theme);
  }

  private readStored(): ThemeMode | null {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  private matchMedia(query: string): MediaQueryList | null {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return null;
    }
    return window.matchMedia(query);
  }
}

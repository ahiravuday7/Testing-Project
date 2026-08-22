import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface UserSession {
  email: string;
  name: string;
  signedInAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

const SESSION_KEY = 'testingProject.session';
const DEMO_USER = {
  email: 'admin@example.com',
  password: 'Password123!',
  name: 'Admin User',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<UserSession | null>(this.readSession());
  readonly currentUser = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);

  constructor(private readonly router: Router) {}

  login(credentials: LoginCredentials): boolean {
    const email = credentials.email.trim().toLowerCase();

    if (email !== DEMO_USER.email || credentials.password !== DEMO_USER.password) {
      return false;
    }

    const session: UserSession = {
      email,
      name: DEMO_USER.name,
      signedInAt: new Date().toISOString(),
    };

    this.session.set(session);
    const storage = credentials.remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  logout(): void {
    this.session.set(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    void this.router.navigate(['/login']);
  }

  private readSession(): UserSession | null {
    const rawSession = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as UserSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}

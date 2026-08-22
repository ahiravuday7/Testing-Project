import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  template: '',
})
class EmptyRouteComponent {}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', component: EmptyRouteComponent }])],
    });

    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('authenticates the demo user and persists remembered sessions', () => {
    const result = authService.login({
      email: 'admin@example.com',
      password: 'Password123!',
      remember: true,
    });

    expect(result).toBe(true);
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.currentUser()?.email).toBe('admin@example.com');
    expect(localStorage.getItem('testingProject.session')).toContain('admin@example.com');
  });

  it('rejects invalid credentials', () => {
    const result = authService.login({
      email: 'admin@example.com',
      password: 'wrong-password',
      remember: true,
    });

    expect(result).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('clears stored sessions on logout', () => {
    authService.login({
      email: 'admin@example.com',
      password: 'Password123!',
      remember: false,
    });

    authService.logout();

    expect(authService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('testingProject.session')).toBeNull();
    expect(sessionStorage.getItem('testingProject.session')).toBeNull();
  });
});

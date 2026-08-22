import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('redirects anonymous users to login', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    const router = TestBed.inject(Router);

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('allows authenticated users through', () => {
    const authService = TestBed.inject(AuthService);
    authService.login({
      email: 'admin@example.com',
      password: 'Password123!',
      remember: true,
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });
});

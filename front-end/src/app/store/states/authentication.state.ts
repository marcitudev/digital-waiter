import { AuthUserState } from './auth-user.state';

export interface AuthenticationState {
  accessToken: string | null;
  refreshToken: string | null;
  authUser: AuthUserState | null;
}

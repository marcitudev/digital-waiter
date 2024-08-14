import { Authentication } from '../../interfaces/authentication.interface';

export interface AuthenticationState {
  accessToken: string | null;
  refreshToken: string | null;
}

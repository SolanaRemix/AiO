export type OAuthProviderName = 'google' | 'github' | 'microsoft' | 'enterprise-sso';

export type OAuthIdentity = {
  provider: OAuthProviderName;
  providerAccountId: string;
  email: string;
  name?: string;
  avatar?: string;
  accessToken: string;
  refreshToken?: string;
};

export interface OAuthProvider {
  readonly name: OAuthProviderName;
  validateAuthorizationCode(input: {
    code: string;
    providerAccountId: string;
    email: string;
    name?: string;
    avatar?: string;
  }): OAuthIdentity;
}

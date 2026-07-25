import { createHash } from 'node:crypto';
import {
  type OAuthIdentity,
  type OAuthProvider,
} from './oauth-provider.interface';

class StaticOAuthProvider implements OAuthProvider {
  constructor(readonly name: OAuthIdentity['provider']) {}

  validateAuthorizationCode(input: {
    code: string;
    providerAccountId: string;
    email: string;
    name?: string;
    avatar?: string;
  }): OAuthIdentity {
    const tokenSeed = `${this.name}:${input.providerAccountId}:${input.code}`;
    return {
      provider: this.name,
      providerAccountId: input.providerAccountId,
      email: input.email,
      name: input.name,
      avatar: input.avatar,
      accessToken: createHash('sha256').update(tokenSeed).digest('hex'),
      refreshToken: createHash('sha256')
        .update(`${tokenSeed}:refresh`)
        .digest('hex'),
    };
  }
}

const providers: OAuthProvider[] = [
  new StaticOAuthProvider('google'),
  new StaticOAuthProvider('github'),
  new StaticOAuthProvider('microsoft'),
  new StaticOAuthProvider('enterprise-sso'),
];

export function getOAuthProvider(
  name: OAuthIdentity['provider'],
): OAuthProvider {
  const provider = providers.find((entry) => entry.name === name);
  if (provider == null) {
    throw new Error(`Unsupported OAuth provider: ${name}`);
  }
  return provider;
}

export function listOAuthProviders(): OAuthIdentity['provider'][] {
  return providers.map((entry) => entry.name);
}

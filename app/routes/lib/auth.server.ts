export type OidcResponse = {
    error?: string;
    error_description?: string;
  
    access_token: string;
    expires_in: number;
    id_token: string;
    scope: string;
    token_type: string;
    refresh_token: string;
  };

export const LoginUrl = `${process.env.AUTHING_SSO_URL}/login?app_id=${process.env.AUTHING_APP_ID}`;

export const LogoutUrl = `${process.env.AUTHING_SSO_URL}/logout?redirectUri=${encodeURIComponent(
    process.env.HOMEPAGE || 'https://knowledge-online.vercel.app/'
  )}`;

  export async function code2Token(code: string){
    const body = {
        client_id: process.env.AUTHING_APP_ID,
        client_secret: process.env.AUTHING_APP_SECRET,
        grant_type: 'authorization_code',
        code
      };
    
      const formBody = [];
      // eslint-disable-next-line
      for (const property in body) {
        const encodedKey = encodeURIComponent(property);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const encodedValue = encodeURIComponent(body[property]);
        formBody.push(`${encodedKey}=${encodedValue}`);
      }
      const res = await fetch(`${process.env.AUTHING_APP_DOMAIN}/oidc/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody.join('&')
      });
    
      const oidcToken = (await res.json()) as OidcResponse;
      return oidcToken;
  }


  export async function refreshToken(token: OidcResponse) {
    const body = {
        client_id: process.env.AUTHING_APP_ID,
        client_secret: process.env.AUTHING_APP_SECRET,
        grant_type: 'authorization_code',
        refresh_token: token.refresh_token
      };
    
      const formBody = [];
      // eslint-disable-next-line
      for (const property in body) {
        const encodedKey = encodeURIComponent(property);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const encodedValue = encodeURIComponent(body[property]);
        formBody.push(`${encodedKey}=${encodedValue}`);
      }
      const res = await fetch(`${process.env.AUTHING_APP_DOMAIN}/oidc/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody.join('&')
      });
    
      const oidcToken = (await res.json()) as OidcResponse;
      return oidcToken;

  }
import { type LoaderFunction, json, redirect } from '@remix-run/node';
import { getSession, commitSession } from '~/services/session.server';
import { LoginUrl, code2Token } from './lib/auth.server';


export const loader : LoaderFunction = async ({ request }) => {

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (code === null) {
    return redirect('/login');
  }

  const oidcToken = await code2Token(code);
 
  if (oidcToken.error) {
    console.error(oidcToken);
    return redirect(LoginUrl);
  }
  // 以上获取 oidc token 为核心部分
  
  // 下面根据业务需要去操作其他
/*   const resInfo = await fetch(
    `${process.env.AUTHING_APP_DOMAIN}/oidc/me?access_token=${oidcToken.access_token}`
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await resInfo.json();
  return json(user); */

const resInfo = await fetch(
  `${process.env.AUTHING_APP_DOMAIN}/oidc/me?access_token=${oidcToken.access_token}`
); 
const user = await resInfo.json();
const session = await getSession(request.headers.get('Cookie'));
session.set('oidc', oidcToken);
session.set('user', user);
return redirect('/', {
  headers: { 'Set-Cookie': await commitSession (session) }
});

};
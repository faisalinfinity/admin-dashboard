import { GetServerSidePropsContext } from 'next';
import cookie from 'cookie';

export function requireAuth(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx;
  const cookies = cookie.parse(req.headers.cookie || '');
  
  if (cookies.token !== 'valid') {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
}

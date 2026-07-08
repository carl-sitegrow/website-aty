import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = context.url;
  const pathname = url.pathname;

  if (pathname === '/sitemap' || pathname === '/sitemap/') {
    return context.redirect('/sitemap.xml', 301);
  }

  if (pathname === '/sitemap.html' || pathname === '/sitemap.html/') {
    return context.redirect('/plan-du-site/', 301);
  }

  if (pathname.startsWith('/en')) {
    const rest = pathname.replace(/^\/en\/?/, '') || '';
    const target = rest ? `/${rest}`.replace(/\/+/g, '/') : '/';
    const withTrailing = target === '/' ? '/' : target.endsWith('/') ? target : `${target}/`;
    return context.redirect(withTrailing, 301);
  }

  if (pathname.startsWith('/fr')) {
    const rest = pathname.replace(/^\/fr\/?/, '') || '';
    const target = rest ? `/${rest}`.replace(/\/+/g, '/') : '/';
    const withTrailing = target === '/' ? '/' : target.endsWith('/') ? target : `${target}/`;
    return context.redirect(withTrailing, 301);
  }

  // Endpoints *.xml / *.txt : laisser Astro les servir directement.
  if (pathname.startsWith('/api/') || pathname.startsWith('/_')) {
    return next();
  }

  if (pathname === '/' || pathname.endsWith('/') || pathname.includes('.')) {
    return next();
  }

  const redirectUrl = new URL(url);
  redirectUrl.pathname = `${pathname}/`;

  return new Response(null, {
    status: 301,
    headers: { Location: redirectUrl.toString() },
  });
};

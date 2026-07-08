import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname;

  if (pathname === '/sitemap' || pathname === '/sitemap/') {
    return context.redirect('/sitemap.xml', 301);
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

  return next();
};

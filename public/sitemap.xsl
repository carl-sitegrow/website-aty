<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="fr-CA">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap XML – Nom du site</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
        <style>
          :root{--blue:#274c77;--blue-700:#1a365d;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-500:#6b7280;--gray-900:#111827}
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:Inter,system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900);padding:2rem 1rem}
          .wrap{max-width:960px;margin:0 auto}
          a{color:var(--blue);text-decoration:none}
          a:hover{text-decoration:underline}
          h1{font-size:1.5rem;font-weight:700;color:var(--blue-700);margin:0 0 .25rem}
          .sub{color:var(--gray-500);font-size:.875rem;margin-bottom:1.5rem}
          .count{font-size:.8125rem;color:var(--gray-500);margin-bottom:.75rem}
          table{width:100%;border-collapse:collapse;font-size:.875rem;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
          th{background:var(--gray-100);font-weight:600;color:var(--blue-700);text-align:left;padding:.625rem .75rem;border-bottom:2px solid var(--gray-200)}
          td{padding:.5rem .75rem;border-bottom:1px solid var(--gray-200);vertical-align:top}
          tr:last-child td{border-bottom:none}
          tr:hover td{background:var(--gray-50)}
          .url{word-break:break-all}
          .meta{color:var(--gray-500);font-size:.8125rem;white-space:nowrap}
          .badge{display:inline-block;padding:.125rem .375rem;border-radius:4px;font-size:.6875rem;font-weight:600;background:var(--gray-100);color:var(--gray-500)}
          .badge-img{background:#fef3c7;color:#92400e}
          .badge-alt{background:#dbeafe;color:#1e40af}
          @media(max-width:640px){th:nth-child(3),td:nth-child(3),th:nth-child(4),td:nth-child(4){display:none}}
        </style>
      </head>
      <body>
        <div class="wrap">
          <a href="/">← Accueil</a>
          <h1>Sitemap XML</h1>
          <p class="sub">Fichier XML destiné aux moteurs de recherche. <a href="/plan-du-site/">Voir le plan du site</a>.</p>
          <p class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Modifié</th>
                <th>Priorité</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="meta"><xsl:value-of select="position()"/></td>
                  <td>
                    <a class="url" href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                    <xsl:if test="xhtml:link[@rel='alternate']">
                      <xsl:text> </xsl:text><span class="badge badge-alt">hreflang</span>
                    </xsl:if>
                    <xsl:if test="image:image">
                      <xsl:text> </xsl:text><span class="badge badge-img">image</span>
                    </xsl:if>
                  </td>
                  <td class="meta"><xsl:value-of select="substring(s:lastmod,1,10)"/></td>
                  <td class="meta"><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

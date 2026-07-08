/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly SITE?: string;
  readonly CONTACT_EMAIL?: string;
  readonly DATABASE_URL?: string;
  readonly PUBLIC_FORMSPREE_ID?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

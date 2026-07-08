/**
 * Rehype plugin qui ajoute des `id` aux titres (h1–h6) en utilisant
 * le même algorithme que src/utils/headings.ts (slugify) pour que
 * le sommaire et les ancres correspondent.
 * Parcourt tout l'arbre récursivement pour trouver tous les titres.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getText(node) {
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(getText).join('');
  return '';
}

function visit(node, slugs, fn) {
  if (!node) return;
  fn(node, slugs);
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      visit(child, slugs, fn);
    }
  }
}

export default function rehypeHeadingSlug() {
  const slugs = new Set();
  return (tree) => {
    visit(tree, slugs, (node) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (node.properties && node.properties.id) return;
        const text = getText(node);
        let id = slugify(text);
        if (!id) id = 'heading';
        let unique = id;
        let n = 0;
        while (slugs.has(unique)) {
          n++;
          unique = `${id}-${n}`;
        }
        slugs.add(unique);
        node.properties = node.properties || {};
        node.properties.id = unique;
      }
    });
  };
}

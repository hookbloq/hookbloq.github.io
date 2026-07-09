/**
 * Convierte un texto en slug URL-safe.
 * Replica Str::slug() de Laravel: lowercase, sin acentos, espacios -> guiones.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Genera un slug unico consultando la BD.
 * Si el slug base ya existe, anade sufijo -1, -2, etc.
 * Replica la logica de ArticleController::store() de Laravel.
 *
 * @param title - Titulo del articulo
 * @param excludeId - ID del articulo a excluir (para updates)
 */
export async function generateUniqueSlug(
  title: string,
  excludeId?: number
): Promise<string> {
  const baseSlug = slugify(title);
  if (!baseSlug) {
    return `articulo-${Date.now()}`;
  }

  const { supabase } = await import('./supabase');

  let slug = baseSlug;
  let count = 1;

  while (true) {
    let query = supabase.from('articles').select('id').eq('slug', slug);
    if (excludeId !== undefined) {
      query = query.neq('id', excludeId);
    }
    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
}

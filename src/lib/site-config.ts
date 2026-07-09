import { supabase, type SiteConfigMap } from './supabase';

// Defaults del seeder Laravel (usados si la BD no responde o esta vacia)
export const DEFAULT_CONFIGS: SiteConfigMap = {
  whatsapp: '+57 3217269649',
  email: 'hookbloq@gmail.com',
  instagram: 'https://instagram.com/hookbloq',
  footer_text:
    'Agencia de automatizacion con IA. Bots inteligentes para negocios en Colombia y Venezuela.',
  hero_title: 'Automatiza tu negocio con IA',
  hero_subtitle:
    'Creamos agentes de inteligencia artificial que trabajan 24/7 para tu empresa. Atiende clientes, agenda citas y mas.',
};

// Claves validas (para validacion en admin)
export const CONFIG_KEYS = [
  'whatsapp',
  'email',
  'instagram',
  'footer_text',
  'hero_title',
  'hero_subtitle',
] as const;

export type ConfigKey = (typeof CONFIG_KEYS)[number];

/**
 * Carga todas las site_configs de la BD y las mergea con los defaults.
 * Usado en el front publico y en el admin.
 */
export async function loadSiteConfigs(): Promise<SiteConfigMap> {
  const { data, error } = await supabase.from('site_configs').select('key, value');

  if (error) {
    console.warn('[site-config] Error cargando configs, usando defaults:', error.message);
    return { ...DEFAULT_CONFIGS };
  }

  const configs: SiteConfigMap = { ...DEFAULT_CONFIGS };
  for (const row of data ?? []) {
    if (row.key && row.value !== null) {
      configs[row.key] = row.value;
    }
  }
  return configs;
}

/**
 * Obtiene una unica config (con fallback a default).
 */
export async function getConfig(key: string): Promise<string> {
  const configs = await loadSiteConfigs();
  return configs[key] ?? DEFAULT_CONFIGS[key] ?? '';
}

/**
 * Limpia un numero de whatsapp para usar en wa.me/<numero>
 * Replica: preg_replace('/[^0-9]/', '', $whatsapp)
 */
export function cleanWhatsAppNumber(whatsapp: string): string {
  return whatsapp.replace(/[^0-9]/g, '');
}

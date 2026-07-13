/**
 * Shared helpers for Tahbeer-like "ten qiraahs" tenants (tahbeer, qiraat).
 * Prefer template checks over tenant.id hardcoding.
 */

import type { TemplateType } from '@/types/tenant.types';

const TEN_QIRAAHS_TEMPLATES: ReadonlySet<TemplateType> = new Set(['tahbeer', 'qiraat']);

export function isTenQiraahsTemplate(template: TemplateType | string | undefined): boolean {
  return template != null && TEN_QIRAAHS_TEMPLATES.has(template as TemplateType);
}

/** Green mushaf cards (mint band) — qiraat; Tahbeer uses brown default. */
export function usesGreenMushafCards(template: TemplateType | string | undefined): boolean {
  return template === 'qiraat';
}

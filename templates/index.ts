/**
 * Template Registry
 * 
 * Maps template types to their corresponding components
 */

import { TemplateType } from '@/types/tenant.types';
import { DefaultTemplate } from './DefaultTemplate';
import { MagazineTemplate } from './MagazineTemplate';

export const TemplateRegistry = {
  default: DefaultTemplate,
  magazine: MagazineTemplate,
  minimal: DefaultTemplate, // Use default for minimal until implemented
} as const;

export function getTemplate(templateType: TemplateType) {
  return TemplateRegistry[templateType] || TemplateRegistry.default;
}


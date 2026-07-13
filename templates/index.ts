/**
 * Template Registry
 * 
 * Maps template types to their corresponding components
 */

import { TemplateType } from '@/types/tenant.types';
import { DefaultTemplate } from './DefaultTemplate';
import { MagazineTemplate } from './MagazineTemplate';
import { SaudiCenterTemplate } from './SaudiCenterTemplate';
import { TahbeerTemplate } from './TahbeerTemplate';
import { QiraatTemplate } from './QiraatTemplate';

export const TemplateRegistry = {
  default: DefaultTemplate,
  magazine: MagazineTemplate,
  minimal: DefaultTemplate, // Use default for minimal until implemented
  'saudi-center': SaudiCenterTemplate,
  tahbeer: TahbeerTemplate,
  qiraat: QiraatTemplate,
} as const;

export function getTemplate(templateType: TemplateType) {
  return TemplateRegistry[templateType] || TemplateRegistry.default;
}


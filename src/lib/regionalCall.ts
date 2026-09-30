import type { MouseEvent } from 'react';
import { telHref } from '@whatnumber/shared';
import { REGIONAL_AREA_CODES, regionalCallCopy, regionalTelHref, requiresRegionalDialing } from '../../apps/mobile/utils/regionalDialing';

export function callHref(number: string): string {
  return requiresRegionalDialing(number) ? '#choose-region' : telHref(number);
}

export function handleRegionalCall(event: MouseEvent, number: string, locale: string) {
  event.stopPropagation();
  if (!requiresRegionalDialing(number)) return;
  event.preventDefault();
  const copy = regionalCallCopy(locale);
  const areas = REGIONAL_AREA_CODES.map((area) => `${area.labels[copy.index]}: ${area.code}`).join('\n');
  const code = window.prompt(`${copy.title}\n${copy.instruction}\n\n${areas}`);
  if (code === null) return;
  const href = regionalTelHref(number, code.trim());
  if (href) window.location.href = href;
  else window.alert(copy.invalid);
}

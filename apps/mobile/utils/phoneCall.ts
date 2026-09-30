import { Linking } from 'react-native';
import { telHref } from '@whatnumber/shared';
import { requiresRegionalDialing } from './regionalDialing';

let regionalCallHandler: ((number: string) => void) | null = null;

export function registerRegionalCallHandler(handler: (number: string) => void) {
  regionalCallHandler = handler;
  return () => { if (regionalCallHandler === handler) regionalCallHandler = null; };
}

export function callPhoneNumber(number: string): void {
  if (requiresRegionalDialing(number)) {
    regionalCallHandler?.(number);
    return;
  }
  void Linking.openURL(telHref(number)).catch(() => {});
}

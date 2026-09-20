import type { NumberItem } from '@whatnumber/shared';
import i18n from '../i18n';
import { absoluteUrl, numberPath } from './seo';

export function getShareUrl(numberId?: string): string {
  if (numberId) {
    return absoluteUrl(numberPath(numberId));
  }
  return absoluteUrl('/');
}

export function formatShareMessage(item: NumberItem): string {
  const t = i18n.t.bind(i18n);
  const url = getShareUrl(item.id);
  let text = `${t('share.brandTag')} ${item.title}\n${item.desc}\n${t('share.phoneLabel')}: ${item.num}`;
  if (item.tip) text += `\n\n${t('detail.tipPrefix')} ${item.tip}`;
  return `${text}\n${url}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

export async function copySiteLink(): Promise<boolean> {
  return copyText(getShareUrl());
}

export async function copyNumberShare(item: NumberItem): Promise<boolean> {
  return copyText(formatShareMessage(item));
}

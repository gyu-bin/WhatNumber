import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const koPath = path.join(__dirname, '../locales/ko/web.json');
const ko = JSON.parse(fs.readFileSync(koPath, 'utf8'));

const localeDir = (loc) => path.join(__dirname, `../locales/${loc}/web.json`);

const en = structuredClone(ko);
Object.assign(en.brand, {
  name: 'WhatNumber?',
  subtitle: 'Public numbers you will actually need',
});
Object.assign(en.common, { copyOk: 'Copied', copyFail: 'Could not copy', language: 'Language' });
Object.assign(en.nav, {
  home: 'Number list',
  guides: 'Guides by situation',
  about: 'About',
  privacy: 'Privacy policy',
  siteMenu: 'Site menu',
});
Object.assign(en.header, {
  homeA11y: 'WhatNumber? home',
  copyLinkA11y: 'Copy web address',
  link: 'Link',
  copySiteOk: 'Web address copied',
});
Object.assign(en.footer, {
  disclaimer: 'Numbers are updated periodically · Confirm details with each agency',
  favoritesNote: 'Favorites are stored only on this device and browser',
});
Object.assign(en.theme, {
  toDark: 'Switch to dark mode',
  toLight: 'Switch to light mode',
  dark: 'Dark mode',
  light: 'Light mode',
});
en.home.srTitle =
  'WhatNumber? — Public hotlines by emergency, traffic, housing, and legal situation';
en.home.faq = [
  {
    question: 'Who do I call if I cannot pay for the ER?',
    answer:
      'Call 129 (Emergency Medical Support Center) for guidance on national advance payment for treatment.',
  },
  {
    question: 'Free towing after an expressway accident?',
    answer: 'Call 1588-2504 (public tow truck) or 1588-2100 (emergency towing) first.',
  },
  {
    question: 'Espionage or counterintelligence reporting numbers?',
    answer: 'You can report to 111 (NIS) and 113 (police counterintelligence).',
  },
];
Object.assign(en.intro, {
  heading: 'Why WhatNumber?',
  paragraph1:
    'Ever needed 129 for ER costs, 1588-2504 for a public tow after a highway crash, or 1566-9009 before signing a jeonse lease—but did not know them? WhatNumber is a free guide that organizes public hotlines you will actually use, by situation.',
  paragraph1Strong: 'public hotlines you will actually use',
  paragraph2BeforeLink:
    'Each entry explains when to call and in what order. In a hurry, tap the number on a card to dial; to read ahead, see our',
  paragraph2Link: 'situation guides',
  paragraph2AfterLink: '.',
});
en.popular.heading = 'Frequently searched public numbers';
Object.assign(en.search, {
  placeholder: 'Search number, situation (accident, move), or category',
  a11y: 'Search numbers',
  clearA11y: 'Clear search',
});
en.situationBar.label = 'What situation are you in?';
Object.assign(en.situations, {
  emergency: 'Medical emergency',
  car: 'Car trouble',
  crime: 'Scam / crime',
  home: 'Home / housing',
  abroad: "I'm abroad",
  legal: 'Legal / finance',
});
Object.assign(en.situationLabels, {
  emergency: 'Medical emergency',
  car: 'Car breakdown / accident',
  crime: 'Scam / crime victim',
  home: 'Home-related issue',
  abroad: "I'm abroad",
  legal: 'Legal / finance',
});
Object.assign(en.situationTips, {
  emergency:
    '💡 ERs must not refuse emergency care for lack of money. Call 129 first. For mental health: 109 · 1393.',
  car: '💡 If injured: 119 → report 112 → on expressways 1588-2504 (public tow). Insurance: 1566-8000.',
  crime: '💡 Voice phishing 1398 · cybercrime 118 · espionage 111 (NIS) · 113 (police). Emergency: 112.',
  home: '💡 National civil complaints 110 · local 0XX-120. Power outage 123 · gas 1670-1004 · address change 1588-1300.',
  abroad: '💡 Overseas emergency: 02-3210-0404 (+82). Customs / direct import: 125.',
  legal: '💡 Free legal advice 132. Debt counseling 1600-5500, inclusive finance 1397.',
});
Object.assign(en.categories, {
  all: 'All',
  favorites: 'Favorites',
  '긴급/안전': 'Emergency · Safety',
  '교통/차량': 'Traffic · Vehicles',
  '주거/생활': 'Housing · Daily life',
  '법률/금융': 'Legal · Finance',
  '가족/복지': 'Family · Welfare',
  '고용/노동': 'Jobs · Labor',
  '민원/행정': 'Civic · Admin',
  '통신/디지털': 'Telecom · Digital',
  filterA11y: 'Categories',
  favoritesA11y: 'Favorites {{count}}',
});
Object.assign(en.favorites, {
  barPrefix: 'My favorites',
  barCount: '{{count}}',
  viewAll: 'View all',
  header: 'My favorites · {{count}}',
  emptyTitle: 'No favorites yet',
  emptyHint: 'Tap ☆ on cards you use often',
  add: 'Add favorite',
  remove: 'Remove favorite',
  addStar: '☆ Favorite',
  removeStar: '★ Favorite',
});
en.list.empty = 'No matching numbers';
Object.assign(en.card, {
  viewA11y: 'View info for {{title}} {{num}}',
  callA11y: 'Call {{num}}',
});
Object.assign(en.detail, {
  close: 'Close',
  closeA11y: 'Close',
  call: 'Call {{num}}',
  permalink: 'Open detail page',
  copyLink: 'Copy link',
  copyNumber: 'Copy number only',
  copyLinkOk: 'Detail link copied',
  copyNumberOk: 'Phone number copied',
  learnMore: 'Learn more',
  situationsHeading: 'Use in these situations',
  tipHeading: 'Tip',
  findMoreHeading: 'Find other numbers',
  findMoreLink: 'WhatNumber? home',
  findMoreBodyAfter:
    ' to search more public numbers by situation or category.',
});
Object.assign(en.numberPage, {
  notFoundTitle: 'Number not found',
  pageTitle: 'Number info',
  notFound: 'We could not find that number.',
  backToNumbers: '← Back to list',
  breadcrumbHome: 'Home',
});
Object.assign(en.request, {
  triggerLabel: 'Missing a number?',
  triggerSub: 'Send a request',
  title: 'Request a number',
  desc: 'We will review it. Send delivers it right away.',
  nameLabel: 'Name',
  phoneLabel: 'Phone number',
  descriptionLabel: 'Description · when to use',
  noteLabel: 'Other',
  optional: 'Optional',
  namePlaceholder: 'e.g. counterintelligence report, jeonse scam counseling',
  phonePlaceholder: 'e.g. 113, 1588-0000',
  descriptionPlaceholder: 'When would someone need this number?',
  notePlaceholder: 'Source, reference link, etc.',
  errorEmpty: 'Enter at least a name, phone number, or description.',
  errorNetwork: 'Network error. Check your connection.',
  errorSend: 'Could not send. Please try again shortly.',
  success: 'Sent. We will take a look!',
  send: 'Send',
  sending: 'Sending…',
  cancel: 'Cancel',
});
Object.assign(en.share, { brandTag: '[WhatNumber?]', phoneLabel: 'Phone' });

// Guides — full EN
const enGuides = {
  pageTitle: 'Guides by situation',
  listTitle: 'Situation response guides',
  listLead:
    'For emergencies, traffic accidents, jeonse, voice phishing, and other common situations, we explain which numbers to call and in what order. Each guide links to related numbers at the bottom.',
  listSeoDescription:
    'Guides on which numbers to call and in what order for emergencies, accidents, housing, voice phishing, and more.',
  backToList: '← Guide list',
  backToNumbers: '← Back to number list',
  notFoundTitle: 'Guide not found',
  notFoundPageTitle: 'Guide',
  notFound: 'We could not find that guide.',
  relatedNumbers: 'Related numbers',
  breadcrumbGuides: 'Guides by situation',
  items: {
    emergency: {
      title: 'Who to call first in an emergency',
      summary:
        'The difference between 119, 112, 129, and 1339—and the order to call when you are sick or in danger.',
      sections: [
        {
          heading: 'Decide if life is at risk',
          paragraphs: [
            'If someone is unconscious, struggling to breathe, or bleeding heavily, call 119 immediately. Fire, gas leaks, or smoke also mean 119. Give your location first (road name address, building, floor) so ambulances and fire trucks arrive faster.',
            'If a crime is in progress or someone is being chased, call 112 first. You can also report by text when you cannot make noise.',
          ],
        },
        {
          heading: 'If the ER refuses care because of cost',
          paragraphs: [
            'Emergency patients have the right to care regardless of ability to pay. Being turned away with only “we cannot treat you without money” is often improper.',
            'Call 129 (Emergency Medical Support Center) for guidance on state advance payment. Stay at the ER after calling so your condition does not worsen.',
          ],
        },
        {
          heading: 'Finding open hospitals and pharmacies at night or on holidays',
          paragraphs: [
            '1339 (Ministry of Health & Welfare call center) lists emergency, night, and holiday clinics and pharmacies nationwide. Useful when you need care now—not just a cold—but for ongoing pain, high fever, or dizziness and you do not know what is open.',
          ],
        },
        {
          heading: 'When it feels too heavy to cope alone',
          paragraphs: [
            '109 (suicide prevention hotline) is anonymous 24/7. Even outside crisis, you can talk about anxiety, depression, or family conflict. Sharing with a professional often eases the load.',
          ],
        },
      ],
    },
    'car-accident': {
      title: 'Traffic accidents and car breakdowns: call order',
      summary:
        'Expressway crashes, shoulder breakdowns, insurance, and public vs private tow—practical steps in one guide.',
      sections: [
        {
          heading: 'First 10 minutes after a crash',
          paragraphs: [
            'If anyone is injured, call 119 first. If conscious and able to move, pull to a safe place (shoulder) and use hazard lights and a warning triangle.',
            'Then report the accident to 112. If drunk driving, hit-and-run, or signal violations are possible, police confirmation helps later with insurance and settlement.',
          ],
          bullets: [
            '119 — injury, unconsciousness, bleeding',
            '112 — accident report, scene confirmation',
            '1588-2504 — expressway public tow (free)',
            '1566-8000 — auto insurance emergency',
          ],
        },
        {
          heading: 'On expressways, prefer public tow',
          paragraphs: [
            'Private tow trucks may arrive first after a breakdown or crash. Always confirm fees before use. The public tow (1588-2504) can move your vehicle free within designated sections—helpful when costs add stress.',
            'If stopped on the shoulder, remember expressway emergency towing (1588-2100) for free help to a safe area in some cases.',
          ],
        },
        {
          heading: 'Uninsured or hit-and-run opponent',
          paragraphs: [
            'If the other driver is uninsured or you have no plate number, call 1544-0119 (uninsured motorist injury support) for compensation guidance. Gather scene photos, witness contacts, and dashcam footage quickly.',
          ],
        },
      ],
    },
    housing: {
      title: 'Jeonse, moving, noise, and housing issues',
      summary:
        'Jeonse fraud prevention, bulk address change after a move, noise mediation, gas leaks—numbers explained by situation.',
      sections: [
        {
          heading: 'Before signing a jeonse contract',
          paragraphs: [
            'Jeonse deposit is often a household’s largest asset. 1566-9009 (HUG jeonse fraud support) explains registry checks and safe contract steps before you sign.',
            '“Urgent sale” or “special studio” deals only, or meeting only a landlord’s agent, can be scam patterns. Get public counseling before transferring the deposit.',
          ],
        },
        {
          heading: 'Change address in one go after moving',
          paragraphs: [
            '1588-1300 (bulk address change) updates banks, cards, insurance, carriers, and more in one request—fewer missed mail and documents at your old address.',
          ],
        },
        {
          heading: 'Floor noise and gas leaks',
          paragraphs: [
            'For repeated floor noise, 1661-2642 (noise mediation) offers professional mediation—often faster than endless arguments.',
            'If you smell gas, do not touch switches; open windows and call 1670-1004 (city gas emergency). They respond 24/7.',
          ],
        },
      ],
    },
    'legal-finance': {
      title: 'Voice phishing, consumer disputes, free legal help',
      summary:
        'Financial fraud, refund denials, medical cost refunds, and free legal counseling—numbers that actually connect.',
      sections: [
        {
          heading: 'If you suspect voice phishing',
          paragraphs: [
            'Calls posing as prosecutors, police, or FSS, claims your account is tied to crime, or requests remote-control apps are classic patterns. Hang up and call 1398 (voice phishing report)—even while still on the suspicious call.',
            '1332 (FSS complaints) also helps with illegal loans, investment pitches, and financial product harm.',
          ],
        },
        {
          heading: 'Refunds and contract disputes',
          paragraphs: [
            'If an online shop, academy, or carrier refuses a refund, apply for mediation at 1544-0990 (Consumer Agency). Having contracts, payment records, and chat screenshots ready smooths the process.',
          ],
        },
        {
          heading: 'Free legal advice and medical refunds',
          paragraphs: [
            '132 (Korean Legal Aid) offers free lawyer consultation on traffic accidents, damages, lease disputes, and more. Worth one call before litigation.',
            '1577-1000 (HIRA) explains refunds when annual out-of-pocket costs exceed the cap. Ask if the hospital never mentioned a refund you may qualify for.',
          ],
        },
      ],
    },
    'civil-admin': {
      title: 'Civil complaints: 110 and regional 120',
      summary:
        'How national 110 and city/province 120 lines work—and which complaints go where.',
      sections: [
        {
          heading: '110 vs 0XX-120',
          paragraphs: [
            '110 (Government call center) connects central, local, and public agency complaints nationwide. When unsure where to call, start with 110.',
            'If you know your region, the local center (e.g. Seoul 02-120, Gyeonggi 031-120) is often faster for daily issues—trash, road damage, parks.',
          ],
        },
        {
          heading: 'Resident registration and family relations certificates',
          paragraphs: [
            '1588-2188 (Gov24 call center) guides issuance of resident and family certificates and digital certificates. Many tasks no longer require a visit to the community office.',
          ],
        },
      ],
    },
    'family-welfare': {
      title: 'Family, welfare, youth, and women’s emergency support',
      summary:
        'School violence, domestic violence, illegal filming, youth counseling, and support numbers for families.',
      sections: [
        {
          heading: 'School violence and domestic violence',
          paragraphs: [
            '117 (school violence) accepts text reports. If a child says they are bullied, do not rely on the school alone—know the public reporting path.',
            '1366 (women’s emergency hotline) offers 24/7 counseling and protection linkage for domestic violence, sexual violence, and stalking.',
          ],
        },
        {
          heading: 'Illegal filming and digital sex crimes',
          paragraphs: [
            '1899-0088 (digital sex crime victim support) helps remove distributed content, explains investigation steps, and links counseling. Prepare screenshots, URLs, and how you found the material.',
          ],
        },
      ],
    },
  },
};
en.guides = enGuides;

Object.assign(en.about, {
  pageTitle: 'About',
  seoDescription:
    'WhatNumber? is a free web service that organizes public hotlines you need in urgent and daily situations.',
  backToNumbers: '← Back to number list',
  eyebrow: 'WhatNumber?',
  title: 'Numbers you did not know you needed',
  lead: 'WhatNumber? is a free web service that lists public hotlines Koreans actually need in urgent and daily life, organized by situation.',
  problemHeading: 'What problem does it solve?',
  problemP1Before:
    'Many know 119 and 112, but numbers like 129 for ER costs, 1588-2504 for public tow after a highway crash, or 1566-9009 before jeonse—',
  problemP1Strong: 'numbers that help immediately when you know them',
  problemP1After:
    '— rarely show up in a quick search. In a rush there is no time to Google; hopping across government sites is hard.',
  problemP2:
    'WhatNumber? gathers these in one place with situation filters, search, and favorites so you can find and dial quickly on mobile.',
  selectionHeading: 'How are numbers chosen?',
  selectionP1:
    'We prioritize public agency and call-center numbers with real-world demand—emergency, traffic, housing, legal, family, employment, civil affairs. Each entry adds when to call, based on official agency guidance.',
  selectionP2:
    'Numbers and rules change. For major decisions (jeonse, legal action), always confirm with the official agency.',
  contentHeading: 'Content and guides',
  contentP1Before: 'Beyond a flat list, our',
  contentP1Link: 'situation guides',
  contentP1After:
    ' cover accident steps, voice phishing, ER costs, and more. Each number detail explains concrete situations for that hotline.',
  opsHeading: 'Operation and contact',
  opsP1Before:
    'WhatNumber? is an individually operated information service. Ads (AdSense · AdMob) may appear on web and app. See our',
  opsP1Link: 'Privacy policy',
  opsP1After: ' for data practices.',
  updated: 'Last updated: September 2026',
});

en.privacy = {
  pageTitle: 'Privacy policy',
  seoDescription: 'How WhatNumber? handles personal data and retention.',
  backToNumbers: '← Back to number list',
  title: 'Privacy policy',
  lead:
    'WhatNumber? (“the Service”) values your privacy and complies with applicable law. This policy applies from June 10, 2026.',
  sections: {
    collect: {
      heading: '1. Information we collect',
      intro:
        'The Service (web and mobile app) works without sign-up. We do not long-term store on servers personally identifying information such as name, email, or phone number.',
      items: [
        {
          title: 'Favorites',
          body: 'Selected number IDs are stored only on your device. Web uses browser localStorage; the mobile app uses AsyncStorage. They are not sent to our server.',
        },
        {
          title: 'Theme',
          body: 'Light/dark mode choice is stored in local device storage.',
        },
        {
          title: 'Nearby ERs (mobile)',
          body: 'Location is requested only when you start a nearby ER search. Approximate coordinates are sent to our server solely to query public APIs such as NEMC. We do not store location history or collect location in the background.',
        },
        {
          title: 'Maps (mobile)',
          body: 'ER maps use Naver Map SDK. Naver Cloud Platform map services may handle network requests for map tiles and display.',
        },
        {
          title: 'Number requests and feedback',
          body: 'What you submit on web/app passes through our server to operator email via Resend, processed only as needed for the request—not stored in a member database.',
        },
        {
          title: 'Usage analytics (web)',
          body: 'Vercel Analytics may collect anonymized visit stats (country, device type, referrer, etc.).',
        },
        {
          title: 'App updates (mobile)',
          body: 'Expo EAS Update may download JavaScript bundles for improvements. No personally identifying information is collected in that process.',
        },
      ],
    },
    ads: {
      heading: '2. Advertising (Google AdSense · AdMob)',
      body: 'The web may show ads via Google AdSense; the mobile app via Google AdMob. Mobile banners request non-personalized ads without ATT tracking. On the web, Google and partners may use cookies and ad IDs for interest-based ads and measurement. Mobile ads may appear as bottom banners; Android may use the AD_ID permission.',
      links: [
        {
          before: 'Turn off personalized ads in Google ad settings:',
          label: 'google.com/settings/ads',
          href: 'https://www.google.com/settings/ads',
        },
        {
          before: 'Google ads and data policy:',
          label: 'policies.google.com/technologies/ads',
          href: 'https://policies.google.com/technologies/ads',
        },
      ],
    },
    cookies: {
      heading: '3. Cookies',
      body: 'The web and third parties (e.g. Google) may use cookies and similar technologies for features, analytics, and ads. You can refuse or delete cookies in browser settings, but some features may be limited.',
    },
    retention: {
      heading: '4. Retention and deletion',
      body: 'Favorites and theme on device remain until you clear app/browser data or reset them. Operators cannot access that data. ER lookup coordinates are not kept on the server after the request.',
    },
    rights: {
      heading: '5. Your rights',
      body: 'Clear favorites and theme in the Service or by deleting device/browser data anytime. For AdSense, Analytics, and AdMob, see Google policy pages. Revoke location permission in device settings anytime.',
    },
    changes: {
      heading: '6. Policy changes',
      body: 'We will post changes on this page and may add in-service notice for important updates.',
      updated: 'Effective: June 10, 2026 · Revised: September 15, 2026',
    },
  },
};

// zh — Simplified Chinese
const zh = structuredClone(en);
Object.assign(zh.brand, { name: '几号呀', subtitle: '真正用得上时的公共号码合集' });
Object.assign(zh.common, { copyOk: '已复制', copyFail: '复制失败', language: '语言' });
Object.assign(zh.nav, {
  home: '号码列表',
  guides: '情境指南',
  about: '服务介绍',
  privacy: '隐私政策',
  siteMenu: '网站菜单',
});
Object.assign(zh.header, {
  homeA11y: '几号呀首页',
  copyLinkA11y: '复制网址',
  link: '链接',
  copySiteOk: '网址已复制',
});
Object.assign(zh.footer, {
  disclaimer: '号码会定期更新 · 准确信息请以各机构为准',
  favoritesNote: '收藏仅保存在本设备与浏览器中',
});
Object.assign(zh.theme, {
  toDark: '切换到深色模式',
  toLight: '切换到浅色模式',
  dark: '深色模式',
  light: '浅色模式',
});
zh.home.srTitle = '几号呀 — 按紧急、交通、住房、法律情境整理的韩国公共电话';
zh.home.faq = [
  {
    question: '付不起急诊费时该打哪个电话？',
    answer: '拨打129（急诊医疗支援中心）可了解国家先行垫付治疗费的流程。',
  },
  {
    question: '高速公路事故后免费拖车？',
    answer: '请先联系1588-2504（高速公路公共拖车）或1588-2100（紧急拖车）。',
  },
  {
    question: '间谍·反间谍举报号码？',
    answer: '可拨打111（国情院）、113（警方反间谍举报）。',
  },
];
Object.assign(zh.intro, {
  heading: '为什么选择几号呀？',
  paragraph1:
    '是否曾因不知道129（急诊费）、1588-2504（高速公共拖车）、1566-9009（全租前咨询）而错过帮助？几号呀按情境整理真正会用到的韩国公共电话，免费查阅。',
  paragraph1Strong: '真正会用到的公共电话',
  paragraph2BeforeLink:
    '每条说明何时拨打、按什么顺序联系。紧急时点卡片号码即可拨号；想提前了解请看',
  paragraph2Link: '情境指南',
  paragraph2AfterLink: '。',
});
zh.popular.heading = '常查的公共电话';
Object.assign(zh.search, {
  placeholder: '搜索号码、情境（事故·搬家）或分类',
  a11y: '搜索号码',
  clearA11y: '清除搜索',
});
zh.situationBar.label = '您现在是什么情况？';
Object.assign(zh.situations, {
  emergency: '突然生病',
  car: '车辆故障',
  crime: '诈骗·犯罪',
  home: '住房·生活',
  abroad: '人在海外',
  legal: '法律·金融',
});
Object.assign(zh.situationLabels, {
  emergency: '突然生病',
  car: '车辆故障·事故',
  crime: '诈骗·犯罪受害',
  home: '住房相关问题',
  abroad: '人在海外',
  legal: '法律·金融',
});
Object.assign(zh.situationTips, {
  emergency: '💡 急诊因费用拒诊可打129。心理求助：109·1393。',
  car: '💡 有人受伤：119→112→高速1588-2504（公共拖车）。保险1566-8000。',
  crime: '💡 语音钓鱼1398·网络118·间谍111·113。紧急112。',
  home: '💡 全国民愿110·当地0XX-120。停电123·燃气1670-1004·地址1588-1300。',
  abroad: '💡 海外险情+82-2-3210-0404。通关125。',
  legal: '💡 免费法律咨询132。债务1600-5500，普惠金融1397。',
});
Object.assign(zh.categories, {
  all: '全部',
  favorites: '收藏',
  '긴급/안전': '紧急·安全',
  '교통/차량': '交通·车辆',
  '주거/생활': '住房·生活',
  '법률/금융': '法律·金融',
  '가족/복지': '家庭·福利',
  '고용/노동': '就业·劳动',
  '민원/행정': '民愿·行政',
  '통신/디지털': '通信·数字',
  filterA11y: '分类',
  favoritesA11y: '收藏 {{count}} 个',
});
Object.assign(zh.favorites, {
  barPrefix: '我的收藏',
  barCount: '{{count}}个',
  viewAll: '查看全部',
  header: '我的收藏 · {{count}}个',
  emptyTitle: '还没有收藏',
  emptyHint: '在常用号码卡片上点 ☆ 即可收藏',
  add: '添加收藏',
  remove: '取消收藏',
  addStar: '☆ 收藏',
  removeStar: '★ 收藏',
});
zh.list.empty = '没有匹配的号码';
Object.assign(zh.card, {
  viewA11y: '查看 {{title}} {{num}} 说明',
  callA11y: '拨打 {{num}}',
});
Object.assign(zh.detail, {
  close: '关闭',
  closeA11y: '关闭',
  call: '拨打 {{num}}',
  permalink: '打开详情页',
  copyLink: '复制链接',
  copyNumber: '仅复制号码',
  copyLinkOk: '详情链接已复制',
  copyNumberOk: '电话号码已复制',
  learnMore: '了解更多',
  situationsHeading: '适用情境',
  tipHeading: '小贴士',
  findMoreHeading: '查找其他号码',
  findMoreLink: '几号呀首页',
  findMoreBodyAfter: '可按情境与分类搜索更多公共电话。',
});
Object.assign(zh.numberPage, {
  notFoundTitle: '未找到号码',
  pageTitle: '号码说明',
  notFound: '找不到您请求的号码。',
  backToNumbers: '← 返回号码列表',
  breadcrumbHome: '首页',
});
Object.assign(zh.request, {
  triggerLabel: '缺少某个号码？',
  triggerSub: '提交添加请求',
  title: '添加号码请求',
  desc: '我们会审核。点击发送即提交。',
  nameLabel: '号码名称',
  phoneLabel: '电话号码',
  descriptionLabel: '说明 · 何时使用',
  noteLabel: '其他',
  optional: '选填',
  namePlaceholder: '例：反间谍举报、全租诈骗咨询',
  phonePlaceholder: '例：113、1588-0000',
  descriptionPlaceholder: '什么情况下需要此号码',
  notePlaceholder: '来源、参考链接等',
  errorEmpty: '请至少填写名称、电话或说明中的一项。',
  errorNetwork: '网络错误，请检查连接。',
  errorSend: '发送失败，请稍后再试。',
  success: '已发送，我们会查看！',
  send: '发送',
  sending: '发送中…',
  cancel: '取消',
});
Object.assign(zh.share, { brandTag: '[几号呀]', phoneLabel: '电话' });

zh.guides = {
  pageTitle: '情境指南',
  listTitle: '情境应对指南',
  listLead:
    '针对紧急、交通事故、全租、语音钓鱼等常见情况，说明应拨打哪些号码及顺序。各指南底部可跳转相关号码。',
  listSeoDescription: '紧急、事故、住房、语音钓鱼等情境下应联系哪些号码及顺序的指南。',
  backToList: '← 指南列表',
  backToNumbers: '← 返回号码列表',
  notFoundTitle: '未找到指南',
  notFoundPageTitle: '指南',
  notFound: '找不到您请求的指南。',
  relatedNumbers: '相关号码',
  breadcrumbGuides: '情境指南',
  items: {
    emergency: {
      title: '紧急·安全情况下该先打给谁',
      summary: '生病或遇险时容易混淆的119、112、129、1339的区别与联系顺序。',
      sections: [
        {
          heading: '先判断是否有生命危险',
          paragraphs: [
            '意识不清、呼吸困难或大量出血请立即打119。火灾、燃气泄漏、有烟也是119。报案时先说当前位置（道路名地址、楼名、楼层），救护车和消防车能更快到达。',
            '若正在发生犯罪或有人被追赶，优先打112。也可短信报警，在不能出声时仍能求助。',
          ],
        },
        {
          heading: '急诊因费用被拒诊时',
          paragraphs: [
            '急诊患者有权不论能否支付而获得急诊医疗。仅以“没钱不能治”打发离开往往不当。',
            '此时可打129（急诊医疗支援中心）了解国家先行垫付流程。通话后仍应留在急诊室，避免病情恶化。',
          ],
        },
        {
          heading: '深夜·假日找开门的医院·药店',
          paragraphs: [
            '1339（福祉部呼叫中心）提供全国急诊、夜间、假日医疗机构和药店信息。不仅是感冒，而是持续疼痛、高烧、头晕等必须就医却不知哪里开门时尤其有用。',
          ],
        },
        {
          heading: '心理难以承受、独自硬撑时',
          paragraphs: [
            '109（自杀预防咨询）24小时匿名。非危机时也可谈焦虑、抑郁、家庭矛盾。与专业人士倾诉往往能减轻负担。',
          ],
        },
      ],
    },
    'car-accident': {
      title: '交通事故·车辆故障时的联系顺序',
      summary: '高速事故、路肩故障、保险、公共拖车与私人拖车差异的实用指南。',
      sections: [
        {
          heading: '事故发生后10分钟内',
          paragraphs: [
            '有人受伤先打119。若意识清醒可移动，尽量把车移到安全处（路肩），打开双闪并放置三角牌。',
            '再向112报告事故。若怀疑酒驾、逃逸、闯红灯等，警方现场确认对后续保险与和解很有帮助。',
          ],
          bullets: [
            '119 — 受伤·意识下降·出血',
            '112 — 事故受理·现场确认',
            '1588-2504 — 高速公共拖车（免费）',
            '1566-8000 — 汽车保险紧急出动的',
          ],
        },
        {
          heading: '在高速上优先公共拖车',
          paragraphs: [
            '故障或事故后私人拖车可能先到。使用前务必确认费用。公共拖车（1588-2504）在指定路段可免费移动车辆，混乱时可减少不必要支出。',
            '若完全停在路肩，也可记高速紧急拖车1588-2100，部分情况可免费拖到安全地带。',
          ],
        },
        {
          heading: '对方无保险或逃逸',
          paragraphs: [
            '对方未投保或不知车牌时，可打1544-0119（无保险车辆伤害支援）了解赔偿流程。尽快收集现场照片、目击者联系方式、行车记录仪。',
          ],
        },
      ],
    },
    housing: {
      title: '全租·搬家·层间噪音等住房问题',
      summary: '全租诈骗预防、搬家后地址批量变更、噪音调解、燃气泄漏等常用号码说明。',
      sections: [
        {
          heading: '签全租合同前务必确认',
          paragraphs: [
            '全租保证金往往是家庭最大资产。1566-9009（HUG全租诈骗支援中心）说明签约前查登记簿、建筑台账及安全签约流程。',
            '只强调“急售”“特价单间”，或只让见房东代理人，可能是诈骗模式。汇款前务必咨询公共机构。',
          ],
        },
        {
          heading: '搬家后一次性变更地址',
          paragraphs: [
            '1588-1300（地址批量变更）可一次变更银行、卡、保险、运营商等多家机构地址，减少邮件、公文仍寄旧址的失误。',
          ],
        },
        {
          heading: '层间噪音·燃气泄漏',
          paragraphs: [
            '层间噪音反复可打1661-2642（层间噪音调解）申请专业调解，往往比情绪争执更快解决。',
            '闻到燃气勿动电器开关，开窗并立即打1670-1004（城市燃气紧急）。24小时出动。',
          ],
        },
      ],
    },
    'legal-finance': {
      title: '语音钓鱼·消费纠纷·免费法律咨询',
      summary: '金融诈骗、拒退款的、医疗费退还、免费法律咨询等实际可用的号码。',
      sections: [
        {
          heading: '怀疑语音钓鱼时',
          paragraphs: [
            '冒充检察·警察·金监院的电话、“账户涉罪”、要求安装远程控制应用是典型套路。怀疑请挂断并立即打1398（语音钓鱼举报），通话中也可举报。',
            '1332（金监院民愿）也可咨询非法贷款、投资诱导、金融产品受害。',
          ],
        },
        {
          heading: '退款·合同纠纷',
          paragraphs: [
            '网店、学院、运营商拒退款时，可通过1544-0990（消费者院纠纷调解）申请调解。备好合同、付款记录、聊天截图更顺利。',
          ],
        },
        {
          heading: '免费法律咨询与医疗费退还',
          paragraphs: [
            '132（大韩法律救助公团）对交通事故、损害赔偿、租赁纠纷等提供免费律师咨询。诉讼前至少打一次值得。',
            '1577-1000（健康保险审查评价院）说明自付上限超额退还。若一年医疗费超标准而医院未告知，可咨询。',
          ],
        },
      ],
    },
    'civil-admin': {
      title: '民愿·行政：110与各地120',
      summary: '全国110与首尔·京畿等市道呼叫中心体系，以及各类民愿该问哪里。',
      sections: [
        {
          heading: '110与0XX-120的区别',
          paragraphs: [
            '110（政府民愿咨询中心）在全国连接中央、地方、公共机构民愿。不知打给谁时先拨110。',
            '若已确定居住地区，当地市道中心（如首尔02-120、京畿031-120）对生活类民愿—垃圾、道路、公园—往往更快。',
          ],
        },
        {
          heading: '居民登记·家庭关系证明',
          paragraphs: [
            '1588-2188（政府24呼叫中心）指导居民登记抄本、家庭关系证明签发及电子证明使用。许多业务已可在线办理无需去社区中心。',
          ],
        },
      ],
    },
    'family-welfare': {
      title: '家庭·福利·青少年·女性紧急支援',
      summary: '校园暴力、家庭暴力、非法拍摄受害、青少年咨询等家庭所需支援号码。',
      sections: [
        {
          heading: '校园暴力·家庭暴力',
          paragraphs: [
            '117（校园暴力举报）可短信举报。孩子说被欺负时不要只交给学校，应了解公共举报途径。',
            '1366（女性紧急电话）对家庭暴力、性暴力、跟踪等提供24小时咨询与保护衔接。',
          ],
        },
        {
          heading: '非法拍摄·数字性犯罪受害',
          paragraphs: [
            '1899-0088（数字性犯罪受害者支援）协助删除传播内容、说明调查程序、衔接心理咨询。整理好截图、URL、发现经过可加快应对。',
          ],
        },
      ],
    },
  },
};

Object.assign(zh.about, {
  pageTitle: '服务介绍',
  seoDescription: '几号呀按情境整理韩国紧急与生活所需的公共电话，免费网页服务。',
  backToNumbers: '← 返回号码列表',
  eyebrow: '几号呀',
  title: '把不知道就没法用的号码收在一起',
  lead: '几号呀是在韩国按情境整理紧急·生活实际所需公共电话的免费网页服务。',
  problemHeading: '解决什么问题？',
  problemP1Before:
    '119、112很多人知道，但急诊费129、高速公共拖车1588-2504、全租前1566-9009这类',
  problemP1Strong: '知道就能立刻帮上忙的号码',
  problemP1After: '搜索往往不好找。紧急时没时间谷歌，辗转各政府网站也很难。',
  problemP2: '几号呀把这些号码集中在一处，用情境筛选、搜索、收藏，在手机上快速查找并一键拨号。',
  selectionHeading: '号码如何筛选？',
  selectionP1:
    '优先收录紧急、交通、住房、法律、家庭、就业、民愿等实际咨询多的公共机构与呼叫中心号码，并依据官方说明补充何时拨打。',
  selectionP2: '号码与制度可能变化。重要决定（全租、法律措施）请务必再向官方确认。',
  contentHeading: '内容与指南',
  contentP1Before: '不仅是号码列表，',
  contentP1Link: '情境指南',
  contentP1After: '整理交通事故步骤、语音钓鱼、急诊费用等。各号码详情也说明具体使用情境。',
  opsHeading: '运营·联系',
  opsP1Before: '几号呀为个人运营的信息服务。网页·应用可能展示广告（AdSense·AdMob）。数据处理见',
  opsP1Link: '隐私政策',
  opsP1After: '。',
  updated: '最后更新：2026年9月',
});

zh.privacy = {
  pageTitle: '隐私政策',
  seoDescription: '几号呀服务的个人信息处理与数据保存说明。',
  backToNumbers: '← 返回号码列表',
  title: '隐私政策',
  lead: '几号呀（以下简称“服务”）重视用户隐私并遵守相关法律。本政策自2026年6月10日起施行。',
  sections: {
    collect: {
      heading: '1. 收集的信息',
      intro:
        '服务（网页·移动应用）无需注册即可使用，不在服务器长期保存姓名、邮箱、电话等可直接识别个人的信息。',
      items: [
        { title: '收藏', body: '所选号码ID仅保存在用户设备。网页用浏览器localStorage，移动应用用AsyncStorage，不会传到服务器。' },
        { title: '主题设置', body: '浅色/深色模式选择保存在设备本地。' },
        {
          title: '附近急诊室（移动）',
          body: '仅在开始查找附近急诊室时请求位置权限。为查询附近急诊室会将大致坐标发到服务器，仅用于查询国立中央医疗院(NEMC)等公共API。应用不保存位置历史，不在后台收集位置。',
        },
        {
          title: '地图显示（移动）',
          body: '急诊地图使用Naver Map SDK。地图瓦片与显示可能由Naver Cloud Platform处理网络请求。',
        },
        {
          title: '号码添加请求·应用意见',
          body: '用户在应用/网页输入的内容经服务器通过Resend邮件服务发给运营者邮箱，仅在处理请求所需范围内临时处理，不存入会员数据库。',
        },
        { title: '访问·使用统计（网页）', body: 'Vercel Analytics可能收集匿名页面访问统计（国家、设备类型、来源路径等）。' },
        {
          title: '应用更新（移动）',
          body: '可通过Expo EAS Update下载功能与界面改进用JavaScript包。此过程不收集可识别个人的信息。',
        },
      ],
    },
    ads: {
      heading: '2. 广告（Google AdSense · AdMob）',
      body: '网页可通过Google AdSense、移动应用通过Google AdMob展示广告。移动横幅在无ATT个性化跟踪下请求非个性化广告。网页上Google及合作伙伴可能用Cookie、广告ID展示兴趣广告并衡量效果。移动广告可能以底部横幅显示；Android可能使用AD_ID权限。',
      links: [
        { before: '可在Google广告设置中关闭个性化广告：', label: 'google.com/settings/ads', href: 'https://www.google.com/settings/ads' },
        { before: 'Google广告与数据处理政策：', label: 'policies.google.com/technologies/ads', href: 'https://policies.google.com/technologies/ads' },
      ],
    },
    cookies: {
      heading: '3. Cookie',
      body: '网页与第三方（如Google）可能为功能、统计、广告使用Cookie及类似技术。可在浏览器设置中拒绝或删除Cookie，但部分功能可能受限。',
    },
    retention: {
      heading: '4. 信息的保存·销毁',
      body: '设备上的收藏·主题设置保留至用户删除应用/浏览器数据或自行重置。运营者无法访问该数据。急诊查询用坐标在请求处理后不在服务器保留。',
    },
    rights: {
      heading: '5. 用户权利',
      body: '可随时在服务内取消收藏或删除设备/浏览器数据清除收藏与主题。AdSense·Analytics·AdMob相关问题请参考Google政策页面。位置权限可随时在设备设置中撤回。',
    },
    changes: {
      heading: '6. 政策变更',
      body: '本政策变更时将发布在本页，重要变更可能增加服务内通知。',
      updated: '施行日：2026年6月10日 · 修订：2026年9月15日',
    },
  },
};

// ja
const ja = structuredClone(en);
Object.assign(ja.brand, { name: '何番？', subtitle: '本当に使う公的数字のまとめ' });
Object.assign(ja.common, { copyOk: 'コピーしました', copyFail: 'コピーに失敗しました', language: '言語' });
Object.assign(ja.nav, {
  home: '番号一覧',
  guides: '状況別ガイド',
  about: 'サービス紹介',
  privacy: 'プライバシーポリシー',
  siteMenu: 'サイトメニュー',
});
Object.assign(ja.header, {
  homeA11y: '何番？ホーム',
  copyLinkA11y: 'URLをコピー',
  link: 'リンク',
  copySiteOk: 'URLをコピーしました',
});
Object.assign(ja.footer, {
  disclaimer: '番号は定期的に更新されます · 正確な情報は各機関でご確認ください',
  favoritesNote: 'お気に入りはこの端末・ブラウザにのみ保存されます',
});
Object.assign(ja.theme, {
  toDark: 'ダークモードに切り替え',
  toLight: 'ライトモードに切り替え',
  dark: 'ダークモード',
  light: 'ライトモード',
});
ja.home.srTitle = '何番？ — 緊急・交通・住居・法律の状況別公的数字案内';
ja.home.faq = [
  {
    question: '救急室の費用が払えないときは？',
    answer: '129（救急医療支援センター）に連絡すると、国が先に治療費を支援する手続きを案内してもらえます。',
  },
  {
    question: '高速道路の事故で無料レッカーは？',
    answer: 'まず1588-2504（高速公共レッカー）または1588-2100（緊急レッカー）に連絡してください。',
  },
  {
    question: 'スパイ・防諜の通報番号は？',
    answer: '111（国情院）、113（警察防諜通報）に通報できます。',
  },
];
Object.assign(ja.intro, {
  heading: 'なぜ何番？なのか',
  paragraph1:
    '救急室の費用で129を、高速事故後の公共レッカー1588-2504を、全貸契約前の1566-9009を知らなかったことはありませんか？何番？は、実際に使う韓国の公的数字を状況別に整理した無料案内です。',
  paragraph1Strong: '実際に使う公的数字',
  paragraph2BeforeLink:
    '各番号について、いつ電話し、どの順番で連絡するかを説明しています。急ぐときはカードの番号をタップして発信、事前に読みたい場合は',
  paragraph2Link: '状況別ガイド',
  paragraph2AfterLink: 'をご覧ください。',
});
ja.popular.heading = 'よく探される公的数字';
Object.assign(ja.search, {
  placeholder: '番号、状況（事故・引越し）、カテゴリを検索',
  a11y: '番号を検索',
  clearA11y: '検索をクリア',
});
ja.situationBar.label = '今どんな状況ですか？';
Object.assign(ja.situations, {
  emergency: '急に体調が悪い',
  car: '車のトラブル',
  crime: '詐欺・犯罪',
  home: '住まい・生活',
  abroad: '海外にいる',
  legal: '法律・金融',
});
Object.assign(ja.situationLabels, {
  emergency: '急に体調が悪い',
  car: '車の故障・事故',
  crime: '詐欺・犯罪被害',
  home: '住まいの問題',
  abroad: '海外にいる',
  legal: '法律・金融',
});
Object.assign(ja.situationTips, {
  emergency: '💡 救急室が費用不足で拒否したら129へ。心の相談109·1393。',
  car: '💡 負傷時119→112→高速は1588-2504（公共レッカー）。保険1566-8000。',
  crime: '💡 ボイスフィッシング1398·サイバー118·スパイ111·113。緊急112。',
  home: '💡 全国民願110·地域0XX-120。停電123·ガス1670-1004·住所1588-1300。',
  abroad: '💡 海外の危機+82-2-3210-0404。通関125。',
  legal: '💡 無料法律相談132。債務1600-5500、金融1397。',
});
Object.assign(ja.categories, {
  all: 'すべて',
  favorites: 'お気に入り',
  '긴급/안전': '緊急·安全',
  '교통/차량': '交通·車両',
  '주거/생활': '住居·生活',
  '법률/금융': '法律·金融',
  '가족/복지': '家族·福祉',
  '고용/노동': '雇用·労働',
  '민원/행정': '民願·行政',
  '통신/디지털': '通信·デジタル',
  filterA11y: 'カテゴリ',
  favoritesA11y: 'お気に入り {{count}}件',
});
Object.assign(ja.favorites, {
  barPrefix: 'お気に入り',
  barCount: '{{count}}件',
  viewAll: 'まとめて見る',
  header: 'お気に入り · {{count}}件',
  emptyTitle: 'お気に入りはまだありません',
  emptyHint: 'よく使う番号カードの ☆ をタップ',
  add: 'お気に入りに追加',
  remove: 'お気に入り解除',
  addStar: '☆ お気に入り',
  removeStar: '★ お気に入り',
});
ja.list.empty = '該当する番号がありません';
Object.assign(ja.card, {
  viewA11y: '{{title}} {{num}} の案内を見る',
  callA11y: '{{num}} に電話',
});
Object.assign(ja.detail, {
  close: '閉じる',
  closeA11y: '閉じる',
  call: '{{num}} に電話',
  permalink: '詳細ページを開く',
  copyLink: 'リンクをコピー',
  copyNumber: '番号のみコピー',
  copyLinkOk: '詳細リンクをコピーしました',
  copyNumberOk: '電話番号をコピーしました',
  learnMore: '詳しく見る',
  situationsHeading: 'こんな状況で',
  tipHeading: 'ヒント',
  findMoreHeading: '他の番号を探す',
  findMoreLink: '何番？ホーム',
  findMoreBodyAfter: 'で状況別・カテゴリ別にさらに検索できます。',
});
Object.assign(ja.numberPage, {
  notFoundTitle: '番号が見つかりません',
  pageTitle: '番号案内',
  notFound: 'お探しの番号は見つかりませんでした。',
  backToNumbers: '← 番号一覧へ',
  breadcrumbHome: 'ホーム',
});
Object.assign(ja.request, {
  triggerLabel: '番号が足りない？',
  triggerSub: '追加をリクエスト',
  title: '番号追加リクエスト',
  desc: '確認後反映します。送信でそのまま届きます。',
  nameLabel: '番号の名称',
  phoneLabel: '電話番号',
  descriptionLabel: '説明 · いつ使うか',
  noteLabel: 'その他',
  optional: '任意',
  namePlaceholder: '例：防諜通報、全貸詐欺相談',
  phonePlaceholder: '例：113、1588-0000',
  descriptionPlaceholder: 'どんな状況で必要か',
  notePlaceholder: '出典、参考リンクなど',
  errorEmpty: '名称、電話番号、説明のいずれかを入力してください。',
  errorNetwork: 'ネットワークエラーです。接続を確認してください。',
  errorSend: '送信に失敗しました。しばらくして再試行してください。',
  success: '送信しました。確認します！',
  send: '送信',
  sending: '送信中…',
  cancel: 'キャンセル',
});
Object.assign(ja.share, { brandTag: '[何番？]', phoneLabel: '電話' });

ja.guides = {
  pageTitle: '状況別ガイド',
  listTitle: '状況別対応ガイド',
  listLead:
    '緊急、交通事故、全貸、ボイスフィッシングなど、よくある状況ごとにどの番号をどの順で連絡するかを整理しました。各ガイド下部から関連番号へ移動できます。',
  listSeoDescription: '緊急・事故・住居・ボイスフィッシングなど、連絡する番号と順序のガイドです。',
  backToList: '← ガイド一覧',
  backToNumbers: '← 番号一覧へ',
  notFoundTitle: 'ガイドが見つかりません',
  notFoundPageTitle: 'ガイド',
  notFound: 'お探しのガイドは見つかりませんでした。',
  relatedNumbers: '関連番号',
  breadcrumbGuides: '状況別ガイド',
  items: {
    emergency: {
      title: '緊急·安全で電話する順番',
      summary: '急病や危険時に混同しやすい119、112、129、1339の違いと連絡順序。',
      sections: [
        {
          heading: 'まず生命の危険があるか判断',
          paragraphs: [
            '意識がない、呼吸が苦しい、大量出血があればすぐ119。火災·ガス漏れ·煙も119。現在地（道路名住所、建物名、階）を先に伝えると到着が早まります。',
            '犯罪が進行中、追われている場合は112を優先。文字通報も可能で、声を出せない状況でも助けを得られます。',
          ],
        },
        {
          heading: '救急室が費用で拒否したとき',
          paragraphs: [
            '救急患者は支払能力に関係なく救急医療を受ける権利があります。「お金がなければ治せない」だけで帰されるのは不当な場合が多いです。',
            '129（救急医療支援センター）に連絡すると国による先行支払い手続きを案内してもらえます。電話後も救急室に留まり状態悪化を防いでください。',
          ],
        },
        {
          heading: '深夜·休日に開いている病院·薬局',
          paragraphs: [
            '1339（福祉部コールセンター）は全国の救急·夜間·休日医療機関と薬局を案内。風邪以外で、痛み·高熱·めまいなど今すぐ病院が必要でどこが開いているか分からないときに有用です。',
          ],
        },
        {
          heading: '心が重く一人で耐えられないとき',
          paragraphs: [
            '109（自殺防止相談）は24時間匿名。危機でなくても不安·うつ·家族問題を相談できます。専門家に話すだけで負担が減ることも多いです。',
          ],
        },
      ],
    },
    'car-accident': {
      title: '交通事故·車両故障時の連絡順',
      summary: '高速事故、路肩故障、保険、公共レッカーと民間レッカーの違いをまとめた実践ガイド。',
      sections: [
        {
          heading: '事故直後10分以内に',
          paragraphs: [
            '負傷者がいればまず119。意識があり動けるなら安全な場所（路肩）へ移動し、ハザードと三角表示。',
            '次に112へ事故を通報。飲酒·ひき逃げ·信号違反の疑いがあれば警察の事実確認が後の保険·和解に役立ちます。',
          ],
          bullets: [
            '119 — 負傷·意識低下·出血',
            '112 — 事故受理·現場確認',
            '1588-2504 — 高速公共レッカー（無料）',
            '1566-8000 — 自動車保険緊急出動',
          ],
        },
        {
          heading: '高速では民間より公共レッカー',
          paragraphs: [
            '故障·事故後、民間レッカーが先に来ることがあります。利用前に必ず料金確認。公共レッカー（1588-2504）は指定区間まで無料で移動でき、混乱時の不要な費用を減らせます。',
            '路肩で完全停止したら高速緊急レッカー1588-2100も覚えておき。安全地帯まで無料支援がある場合があります。',
          ],
        },
        {
          heading: '相手が無保険·逃走',
          paragraphs: [
            '相手が未加入またはナンバー不明なら1544-0119（無保険車両傷害支援）で補償手続きを案内。現場写真·目撃者·ドラレコは早めに確保。',
          ],
        },
      ],
    },
    housing: {
      title: '全貸·引越し·階間騒音など住居問題',
      summary: '全貸詐欺防止、引越し後の住所一括変更、騒音調停、ガス漏れなどの番号を状況別に説明。',
      sections: [
        {
          heading: '全貸契約前に必ず確認',
          paragraphs: [
            '全貸保証金は家庭最大の資産のことが多いです。1566-9009（HUG全貸詐欺支援）は契約前の登記·建物台帳確認と安全な契約手順を案内。',
            '「急売」「特価ワンルーム」だけ強調、家主代理人だけ会わせるのは詐欺パターンの可能性。送金前に必ず公的相談を。',
          ],
        },
        {
          heading: '引越し後に住所を一括変更',
          paragraphs: [
            '1588-1300（住所一括変更）で銀行·カード·保険·通信など複数機関の住所を一度に変更。旧住所への郵便物ミスを減らせます。',
          ],
        },
        {
          heading: '階間騒音·ガス漏れ',
          paragraphs: [
            '繰り返す階間騒音は1661-2642（階間騒音調停）で専門調停を。感情的な口論より公的手続きの方が早いことも。',
            'ガス臭はスイッチに触れず窓を開け1670-1004（都市ガス緊急）へ即通報。24時間出動。',
          ],
        },
      ],
    },
    'legal-finance': {
      title: 'ボイスフィッシング·消費者紛争·無料法律相談',
      summary: '金融詐欺、返金拒否、医療費返還、無料法律相談など実際に繋がる番号。',
      sections: [
        {
          heading: 'ボイスフィッシングが疑われるとき',
          paragraphs: [
            '検察·警察·金監院を装う電話、「口座が犯罪に関与」、リモートアプリインストール要求は典型パターン。疑ったら切って1398（ボイスフィッシング通報）へ。通話中でも通報可能。',
            '1332（金監院民願）は違法貸付·投資勧誘·金融商品被害にも。',
          ],
        },
        {
          heading: '返金·契約紛争',
          paragraphs: [
            'ネットショップ·塾·通信の返金拒否は1544-0990（消費者院紛争調停）で調停申請。契約書·決済·チャットキャプチャを用意するとスムーズ。',
          ],
        },
        {
          heading: '無料法律相談と医療費返還',
          paragraphs: [
            '132（大韓法律救助公団）は交通事故·損害賠償·賃貸紛争などを弁護士が無料相談。訴訟前に一度は。',
            '1577-1000（健康保険審査評価院）は自己負担上限超過分の返還案内。1年の治療費が基準超で病院から案内がなければ問い合わせを。',
          ],
        },
      ],
    },
    'civil-admin': {
      title: '民願·行政コールセンター110と地域120',
      summary: '全国110とソウル·京畿などの市道センター体系、どの民願をどこに聞くか。',
      sections: [
        {
          heading: '110と0XX-120の違い',
          paragraphs: [
            '110（政府民願案内コールセンター）は全国どこでも中央·地方·公共機関の民願を接続。どこに電話すればよいか分からないときはまず110。',
            '居住地域が決まっていれば該当市道（例：ソウル02-120、京畿031-120）が生活密着型—ゴミ·道路·公園—で速いことが多い。',
          ],
        },
        {
          heading: '住民登録·家族関係証明',
          paragraphs: [
            '1588-2188（政府24コールセンター）は住民票·家族関係証明の発行と電子証明の利用方法を案内。オンラインで済む業務が増えました。',
          ],
        },
      ],
    },
    'family-welfare': {
      title: '家族·福祉·青少年·女性の緊急支援',
      summary: 'いじめ、家庭内暴力、非法撮影被害、青少年相談など家族向け支援番号。',
      sections: [
        {
          heading: 'いじめ·家庭内暴力',
          paragraphs: [
            '117（いじめ通報）は文字通報可。子がいじめられたと言ったら学校だけに任せず公的通報手続きも。',
            '1366（女性緊急電話）は家庭内暴力·性暴力·ストーカー等24時間相談·保護連携。',
          ],
        },
        {
          heading: '非法撮影·デジタル性犯罪被害',
          paragraphs: [
            '1899-0088（デジタル性犯罪被害者支援）は拡散動画削除、捜査手続き案内、心理相談連携。スクショ·URL·発見経緯を整理すると対応が早い。',
          ],
        },
      ],
    },
  },
};

Object.assign(ja.about, {
  pageTitle: 'サービス紹介',
  seoDescription: '何番？は緊急·生活場面で必要な韓国の公的数字を状況別に整理した無料Webサービスです。',
  backToNumbers: '← 番号一覧へ',
  eyebrow: '何番？',
  title: '知らなくて使えなかった番号を集めました',
  lead: '何番？は韓国で緊急·生活に実際必要な公的数字を状況別に提供する無料Webサービスです。',
  problemHeading: 'どんな課題を解決しますか？',
  problemP1Before:
    '119と112は知っていても、救急費用129、高速公共レッカー1588-2504、全貸前1566-9009のような',
  problemP1Strong: '知っていればすぐ助かる番号',
  problemP1After: 'は検索しても出にくい。急ぐときGoogleする時間もなく、政府サイトを回るのも大変です。',
  problemP2: '何番？はこれらを一か所に集め、状況フィルター·検索·お気に入りで素早く見つけワンタップ発信できるようにしました。',
  selectionHeading: '番号はどう選びますか？',
  selectionP1:
    '緊急·交通·住居·法律·家族·雇用·民願など実際の問い合わせが多い公共機関·コールセンターを優先し、公式案内に基づきいつ電話するかを補足します。',
  selectionP2: '番号·制度は変わることがあります。重要な決定（全貸、法的措置）は必ず公式案内で再確認を。',
  contentHeading: 'コンテンツとガイド',
  contentP1Before: '単なる一覧を超え、',
  contentP1Link: '状況別ガイド',
  contentP1After: 'で交通事故の手順、ボイスフィッシング、救急室費用などを整理。各番号詳細でも具体的な使用場面を説明します。',
  opsHeading: '運営·お問い合わせ',
  opsP1Before: '何番？は個人運営の情報サービスです。Web·アプリに広告（AdSense·AdMob）が表示される場合があります。データ処理は',
  opsP1Link: 'プライバシーポリシー',
  opsP1After: 'をご覧ください。',
  updated: '最終更新：2026年9月',
});

ja.privacy = {
  pageTitle: 'プライバシーポリシー',
  seoDescription: '何番？の個人情報の取り扱いとデータ保管について。',
  backToNumbers: '← 番号一覧へ',
  title: 'プライバシーポリシー',
  lead: '何番？（以下「サービス」）は利用者の個人情報を大切にし、関連法令を遵守します。本ポリシーは2026年6月10日から適用されます。',
  sections: {
    collect: {
      heading: '1. 収集する情報',
      intro:
        'サービス（Web·モバイルアプリ）は会員登録なしで利用でき、氏名·メール·電話など個人を直接特定する情報をサーバーに長期保存しません。',
      items: [
        { title: 'お気に入り', body: '選択した番号IDは利用者端末のみに保存。WebはlocalStorage、モバイルはAsyncStorage。サーバーへ送信されません。' },
        { title: 'テーマ設定', body: 'ライト/ダークモードの選択を端末ローカルに保存。' },
        {
          title: '近くの救急室（モバイル）',
          body: '救急室検索を開始したときのみ位置権限を要求。近くの救急室照会のため概算座標をサーバーへ送り、NEMC等の公共API照会にのみ使用。位置履歴は保存せず、バックグラウンド収集もしません。',
        },
        { title: '地図表示（モバイル）', body: '救急室地図はNaver Map SDKを使用。地図タイル·表示のためNaver Cloud Platformがネットワーク要求を処理する場合があります。' },
        {
          title: '番号追加リクエスト·アプリ意見',
          body: '入力内容はサーバー経由でResendにより運営者メールへ。リクエスト処理に必要な範囲で一時処理し、会員DBには保存しません。',
        },
        { title: 'アクセス·利用統計（Web）', body: 'Vercel Analyticsにより匿名化された訪問統計（国、端末種別、参照元等）が収集される場合があります。' },
        { title: 'アプリ更新（モバイル）', body: 'Expo EAS UpdateでJSバンドルを取得する場合があります。個人を特定する情報は収集しません。' },
      ],
    },
    ads: {
      heading: '2. 広告（Google AdSense · AdMob）',
      body: 'WebはAdSense、モバイルアプリはAdMobで広告を掲載する場合があります。モバイルバナーはATTなしで非パーソナライズ広告を要求。WebではGoogle等がCookie·広告IDで興味ベース広告と測定を行う場合があります。モバイル広告は画面下部バナー、AndroidではAD_ID権限が使われる場合があります。',
      links: [
        { before: 'Google広告設定でパーソナライズをオフに：', label: 'google.com/settings/ads', href: 'https://www.google.com/settings/ads' },
        { before: 'Googleの広告·データ処理：', label: 'policies.google.com/technologies/ads', href: 'https://policies.google.com/technologies/ads' },
      ],
    },
    cookies: {
      heading: '3. Cookie',
      body: 'Webと第三者（Google等）は機能·統計·広告のためCookie等を使用する場合があります。ブラウザ設定で拒否·削除できますが、一部機能が制限されることがあります。',
    },
    retention: {
      heading: '4. 情報の保管·破棄',
      body: '端末のお気に入り·テーマは利用者がデータ削除または初期化するまで残ります。運営者はアクセスしません。救急室照会用座標は処理後サーバーに保管しません。',
    },
    rights: {
      heading: '5. 利用者の権利',
      body: 'お気に入り·テーマはサービス内解除または端末/ブラウザデータ削除でいつでも消せます。AdSense·Analytics·AdMobはGoogleポリシーを参照。位置権限は端末設定でいつでも撤回できます。',
    },
    changes: {
      heading: '6. ポリシー変更',
      body: '変更時は本ページに掲載し、重要な変更はサービス内告知を追加する場合があります。',
      updated: '施行日：2026年6月10日 · 改定：2026年9月15日',
    },
  },
};

function assertSameKeys(a, b, path = '') {
  if (typeof a !== typeof b) throw new Error(`type mismatch at ${path}`);
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) throw new Error(`array length at ${path}`);
    a.forEach((v, i) => assertSameKeys(v, b[i], `${path}[${i}]`));
    return;
  }
  if (a && typeof a === 'object') {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    if (ak.join() !== bk.join()) throw new Error(`keys mismatch at ${path}: ${ak} vs ${bk}`);
    for (const k of ak) assertSameKeys(a[k], b[k], path ? `${path}.${k}` : k);
  }
}

for (const [loc, data] of [
  ['en', en],
  ['zh', zh],
  ['ja', ja],
]) {
  assertSameKeys(ko, data);
  fs.writeFileSync(localeDir(loc), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`wrote ${loc}`);
}

console.log('all keys match ko');

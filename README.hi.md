# cron-ui

पाँच-भागीय cron अभिव्यक्तियों (मिनट, घंटा, महीने का दिन, महीना, सप्ताह का दिन — सेकंड नहीं) के लिए डेमो ऐप और UI लाइब्रेरी।

**डेमो:** https://azarov-serge.github.io/cron-ui/  
**संस्करण:** `1.1.1` (ऐप हेडर में लोगो के बगल में)

**भाषाएँ:** [English](README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · हिन्दी (यह फ़ाइल)

## घटक

| घटक | पथ |
| ---- | --- |
| `Header` | `src/shared/components/Header/` — लोगो, संस्करण, भाषा मेनू (RU / EN / ZH / HI), थीम |
| `CronExpressionField` | `src/features/cron/components/CronEditor/components/CronFields/` — cron अभिव्यक्ति और कॉपी |
| `CronDescriptionField` | `src/features/cron/components/CronEditor/components/CronFields/` — मानव-पठनीय विवरण |
| `CronEditor` | `src/features/cron/components/CronEditor/` |
| `CronChecker` | `src/features/cron/components/CronChecker/` |
| `CronPage` | `src/features/cron/pages/CronPage.tsx` |
| `TimePicker` | `src/shared/components/TimePicker/` |
| `DateTimePicker` | `src/shared/components/DateTimePicker/` — तारीख + समय (`OneTimeSection`) |

## परियोजना संरचना

```text
src/
├── App.tsx
├── features/cron/
│   ├── components/
│   │   ├── CronEditor/       # CronEditor, CronFields/, सेक्शन
│   │   └── CronChecker/
│   ├── hooks/
│   ├── pages/CronPage.tsx
│   └── utils/
└── shared/
    ├── components/Header/, TimePicker/, DateTimePicker/
    ├── constants/layout.ts   # LAYOUT_MAX_WIDTH_PX = 1280
    ├── i18n/                 # ru, en, zh, hi
    └── providers/            # AppThemeProvider, LocaleProvider
```

पथ उपनाम: `@features/*`, `@shared/*`.

## शुरुआत

```bash
npm install
npm run dev      # https://localhost:5173/ (स्व-हस्ताक्षरित HTTPS)
npm run build
npm run preview  # स्थानीय production बिल्ड परीक्षण
```

## तैनाती

GitHub Actions (`.github/workflows/deploy.yml`) `main` पर push होने पर डिप्लॉय करता है।  
`vite.config.ts`: production के लिए `base: '/cron-ui/'`, dev के लिए `'/'`.

**GitHub Pages (एक बार):** Settings → Pages → Source → **GitHub Actions**.

## संस्करण

| स्रोत | उद्देश्य |
| ----- | -------- |
| `package.json` → `version` | ऐप का एकमात्र संस्करण |
| `CHANGELOG.md` | वैकल्पिक रिलीज़ नोट्स |

## निर्भरताएँ

- `@admiral-ds/react-ui`, `@admiral-ds/icons` — UI
- `@ant-design/icons` — `CronPage` संपादन आइकन
- `cronstrue` — अनुसूची विवरण (Hindi कस्टम बिल्डर सहित)
- `styled-components`

## CronPage (डेमो)

तीन टैब, URL के साथ सिंक (`?cron=0+9+*+*+1`, `?tab=checker`):

| टैब | URL | सामग्री |
| --- | --- | ------- |
| Cron कंस्ट्रक्टर | _(डिफ़ॉल्ट)_ | इनलाइन `CronEditor` (नीचे cron और विवरण) |
| संपादक पैरामीटर | `editorParams` | `CronOptions` पैनल |
| Cron जाँच | `checker` | `CronChecker`, **cron बदलें** → कंस्ट्रक्टर पर ले जाता है |

- `CronEditor` में बदलाव `onChange` से तुरंत URL में जाते हैं।
- जाँच टैब पर **cron बदलें** मान्य अभिव्यक्ति को कंस्ट्रक्टर पर ले जाता है।
- **कॉपी करें** — मोबाइल पर स्थानीयकृत लेबल वाला `TextButton`।
- भाषा (`cron-ui-locale`) और थीम (`cron-ui-theme`) `localStorage` में सहेजी जाती है; पहली विज़िट पर समर्थित होने पर ब्राउज़र भाषा।

## CronEditor

प्रॉप्स: `cron`, `onChange`, `options` (`CronOptions`)।

हर बदलाव पर `onChange` चलता है (सहेजें बटन नहीं)।

`CronOptions` दृश्य अनुभाग, `minuteStep`, `weeklyWeekNumbers` और `requires` सत्यापन नियंत्रित करते हैं। विकल्प केवल UI के लिए हैं, बैकएंड पर नहीं भेजे जाते।

आउटपुट: `cron.toExpression()` — API के लिए पाँच-भागीय स्ट्रिंग।

### बैकएंड अनुबंध

| फ़ील्ड | प्रकार | नोट्स |
| ------ | ------ | ----- |
| `minute` | `string` | 0–59, `*`, `*/N` |
| `hour` | `string` | 0–23, `*`, `*/N` |
| `day_of_month` | `string \| null` | 1–31 या `null` → `*` |
| `month_of_year` | `string \| null` | 1–12 या `null` → `*` |
| `day_of_week` | `string \| null` | 0–6, सूचियाँ, `दिन#सप्ताह` या `null` → `*` |

पार्स: `Cron.fromString(expression)`। संपादक में अमान्य इनपुट → `0 9 * * *`; `CronChecker` में पार्स त्रुटि।

अनुशंसित API आकार:

```ts
type ScheduleEntity = {
  id: string;
  name: string;
  enabled: boolean;
  cron_expression: string; // cron.toExpression()
};
```

`CronPage` URL में केवल `cron` सहेजता है — `name`, `enabled` या `CronOptions` नहीं।

### CronOptions (डिफ़ॉल्ट)

| विकल्प | डिफ़ॉल्ट | प्रभाव |
| ------ | -------- | ------ |
| `scheduleTypes` | `recurring`, `one-time` | एक मान — अनुसूची प्रकार ब्लॉक छुपा |
| `occursFrequencies` | `daily`, `weekly`, `monthly` | एक मान — आवृत्ति चयन छुपा |
| `dailyFrequencies` | `once`, `every` | एक मान — दैनिक आवृत्ति रेडियो छुपे |
| `minuteStep` | `1` | समय फ़ील्ड और «हर N मिनट» के लिए कदम |
| `weeklyWeekNumbers` | `false` | साप्ताहिक मोड में महीने के सप्ताह (1–5) |
| `showYearNotice` | `false` | one-time में «वर्ष cron में नहीं» चेतावनी |
| `requires` | `[]` | आवश्यक: `weeklyWeekDays`, `weeklyWeekNumbers`. अनिवार्य होने पर सेक्शन लेबल पर लाल `*` (Admiral); वैकल्पिक — बिना तारे के। |

अनुमत `minuteStep`: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`।

### UI → cron उदाहरण

| सेटिंग | अभिव्यक्ति |
| ------- | ---------- |
| रोज़ाना 09:00 | `0 9 * * *` |
| साप्ताहिक सोम 09:00 | `0 9 * * 1` |
| साप्ताहिक सोम, 1ला सप्ताह | `0 9 * * 1#1` |
| मासिक 15 तारीख | `0 9 15 * *` |
| हर 10 मिनट | `*/10 * * * *` |
| हर 2 घंटे | `0 */2 * * *` |
| एक बार 25 मार्च 14:30 | `30 14 25 3 *` |

सप्ताह का दिन: 0 = रवि, 1 = सोम, …, 6 = शनि।

## CronChecker

cron अभिव्यक्ति चिपकाएँ → फ़ील्ड विवरण, मानव विवरण, संपादक व्याख्या, सत्यापन त्रुटियाँ।

## एकीकरण उदाहरण

```tsx
import {
  CronEditor,
  type CronOptions,
} from '@features/cron/components/CronEditor';
import { Cron } from '@features/cron/components/CronEditor/models/cron';

<CronEditor
  value={task.cron}
  options={{
    scheduleTypes: ['recurring'],
    occursFrequencies: ['daily', 'weekly'],
    dailyFrequencies: ['once'],
    minuteStep: 5,
  }}
  onChange={saveCron}
/>;
```

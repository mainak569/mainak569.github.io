# mainak.me — Ubuntu-themed Portfolio

Personal portfolio of **Mainak Das** ([@mainak569](https://github.com/mainak569)), built as a web simulation of Ubuntu with Next.js and Tailwind CSS.

🌐 **Live:** [mainak.me](https://mainak.me)

Based on the open-source [Ubuntu portfolio](https://github.com/vivek9patel/vivek9patel.github.io) by Vivek Patel (MIT).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Where things live

| What | File |
| --- | --- |
| About / Education / Experience / Projects / Skills content | `components/apps/mainak.js` |
| Contacts app | `components/apps/contacts.js` |
| Email Me form | `components/apps/gedit.js` |
| Calculator | `components/apps/calc.js` |
| Desktop & dock apps | `apps.config.js` |
| Terminal commands & folders | `components/apps/terminal.js` |
| Resume PDF | `public/files/Mainak-Das-Resume.pdf` |
| Profile photo | `public/images/logos/mainak.webp` |
| SEO tags | `components/SEO/Meta.js` |

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages via `.github/workflows/deploy.yml`. The custom domain is set by `public/CNAME`.

### Contact form

The **Email Me** app posts to [FormSubmit](https://formsubmit.co) — no backend or API keys. The very first message sends an activation email to `mainak.lnmiit@gmail.com`; click **Activate Form** once and every later message is delivered straight to the inbox.

### Optional: analytics

Add a `NEXT_PUBLIC_TRACKING_ID` repository secret (Google Analytics 4) to enable page-view tracking.

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
| Desktop & dock apps | `apps.config.js` |
| Terminal commands & folders | `components/apps/terminal.js` |
| Resume PDF | `public/files/Mainak-Das-Resume.pdf` |
| Avatar | `public/images/logos/avatar.svg` |
| SEO tags | `components/SEO/Meta.js` |

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages via `.github/workflows/deploy.yml`. The custom domain is set by `public/CNAME`.

### Optional: contact form & analytics

Without configuration, the **Contact Me** app opens the visitor's mail client. To send messages directly, create an [EmailJS](https://www.emailjs.com/) service and add these repository secrets (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_USER_ID`, `NEXT_PUBLIC_SERVICE_ID`, `NEXT_PUBLIC_TEMPLATE_ID` — EmailJS
- `NEXT_PUBLIC_TRACKING_ID` — Google Analytics 4 (optional)

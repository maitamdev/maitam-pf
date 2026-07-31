# MaiTamDev Space Portfolio

A space-themed developer portfolio for Mai Tran Thien Tam (`@maitamdev`), a
final-year Software Engineering student at Hung Vuong University.

## About

MaiTamDev builds web apps, mobile products, AI-powered tools and practical
open-source projects. From January 2025 to February 2026, he worked as a
FullStack Developer at Valley Campus using Odoo.

## Selected work

- [SafeReturn / FindBack](https://github.com/maitamdev/safe-return)
- [Sora POS V2](https://github.com/maitamdev/SORA-POS-V2)
- [DHV Guiding Light](https://github.com/maitamdev/DHV-GUIDING-LIGHT)
- [UML Gen](https://github.com/maitamdev/uml-gen)
- [SCS GO](https://github.com/maitamdev/s-c-th-ng-minh)

## Portfolio experience

- Interactive four-world Career Universe with guided travel and deep links
- English and Vietnamese content with a saved language preference
- Recruiter Mode for a fast, information-first profile
- Mission case studies for every selected project
- Project Control Room with swipe/keyboard views and architecture diagrams
- Dedicated shareable `/projects/:slug` pages with project social metadata
- Career flight timeline and GitHub Live Station with offline fallback
- Hold-to-warp black-hole interaction and distinct planetary environments
- Multi-state spatial audio, adaptive graphics and mobile world navigation
- Interactive terminal, Konami Developer Lab and discoverable Easter eggs
- Real texture preload sequence and detailed device-local analytics
- Adaptive graphics quality, reduced-motion support and optional ambient sound
- Keyboard command palette with navigation and experience controls
- Device-local, privacy-friendly interaction counters
- Cached GitHub signal API with a reliable offline fallback
- Search metadata, sitemap, robots, manifest and structured project data
- Dedicated loading, error and uncharted-route experiences

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact

- Portfolio source: [github.com/maitamdev/maitam-pf](https://github.com/maitamdev/maitam-pf)
- GitHub: [github.com/maitamdev](https://github.com/maitamdev)
- LinkedIn: [Mai Tam](https://www.linkedin.com/in/maitam-dev-403220399)
- Email: [maitamit062005@gmail.com](mailto:maitamit062005@gmail.com)
- Phone: [+84 877 724 374](tel:+84877724374)
- Location: HCM, Vietnam

## Credits

The visual foundation is based on the open-source
[Space Portfolio](https://github.com/sanidhyy/space-portfolio) by Sanidhya
Kumar Verma and remains available under the MIT License.
# M.A.I // Orbit Guide

The portfolio includes a rigged VRM anime guide rendered with Three.js. M.A.I
supports bilingual chat, speech synthesis, browser speech recognition, guided
portfolio actions and a Groq-powered server route with a verified demo fallback.

The assistant runs in demo mode without credentials. To enable Groq, copy
`.env.example` to `.env.local` and set:

```bash
GROQ_API_KEY=your_key
# Optional model override. Defaults to openai/gpt-oss-20b.
GROQ_MODEL=openai/gpt-oss-20b
# Optional: raises the server-side GitHub API allowance.
GITHUB_TOKEN=your_fine_grained_read_only_token
# Optional: canonical production URL used by metadata and sitemap.
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

For Vercel, add the same server-side variable in Project Settings →
Environment Variables. Never expose the key through a `NEXT_PUBLIC_` variable.

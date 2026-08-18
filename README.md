# Baladi

Baladi (بلدي) is a future community issue-reporting platform intended to help people report local problems to municipalities, universities, and other responsible institutions in Palestine.

> **Foundation phase only:** This repository currently contains the project structure and placeholder screens for a future application. It does not yet provide real reporting, authentication, dashboards, databases, administrative actions, or other production functionality.

## Technology stack

- Next.js 16 with the App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint 9 with the Next.js configuration
- Vercel AI SDK with Google Gemini
- Server Components by default

## Routes

| Route | Foundation purpose |
| --- | --- |
| `/` | Home placeholder |
| `/cities` | Cities placeholder |
| `/cities/[cityId]` | Individual city placeholder, for example `/cities/ramallah` |
| `/places` | Municipalities, universities, and institutions placeholder |
| `/places/[placeId]` | Individual place placeholder, for example `/places/ramallah-municipality` |
| `/issues` | Public issues placeholder |
| `/issues/[issueId]` | Individual issue placeholder, for example `/issues/example-issue` |
| `/report` | Future report-submission placeholder |
| `/dashboard` | Future user dashboard placeholder |
| `/admin` | Future organization-manager dashboard placeholder |
| `/about` | About page for the project concept and foundation scope |
| `/health` | Health information page |
| `/api/health` | Health-check Route Handler returning JSON |

Dynamic segments such as `[cityId]`, `[placeId]`, and `[issueId]` are identifiers supplied in the URL; they do not represent a database or real records in this foundation phase.

## Run locally

Requirements: a current Node.js LTS release and npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Run lint checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after a successful build:

```bash
npm start
```

## Environment variables

The tracked `.env.example` file contains safe placeholders only:

```dotenv
NEXT_PUBLIC_APP_NAME=Baladi
NEXT_PUBLIC_APP_URL=
GOOGLE_GENERATIVE_AI_API_KEY=
```

For local development, copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_APP_URL` to the appropriate application URL (for example, `http://localhost:3000`), and set `GOOGLE_GENERATIVE_AI_API_KEY` to a Gemini API key created in Google AI Studio. The Gemini key is read only by the server-side `/api/chat` Route Handler; never rename it with a `NEXT_PUBLIC_` prefix. Private environment files are ignored by Git; do not commit real secrets.

## Deploying to Vercel

The project is deployed on Vercel:

https://baladi-eight.vercel.app

1. Commit and push the repository to GitHub.
2. In Vercel, choose **Add New Project** and import the GitHub repository.
3. Leave the **Root Directory** as the repository root (`./`).
4. Keep the detected Next.js framework preset and default npm build settings.
5. Add `GOOGLE_GENERATIVE_AI_API_KEY` in the Vercel project's **Settings > Environment Variables** for each environment that should support Baladi AI.
6. Click **Deploy**. Redeploy an existing deployment after adding or changing the key so the new environment value is available to the application.

## Future planned functionality

Later development phases may add:

- Authentication and user accounts
- Persistent data storage
- Issue submission for infrastructure, maintenance, cleanliness, safety, accessibility, water, electricity, and technology problems
- Image uploads and map-based location selection
- Search and filtering
- Resident and student dashboards
- Municipality, university, and institution administration workflows
- Issue status updates and notifications

These items are plans only and are not implemented in the current foundation.

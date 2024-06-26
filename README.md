# Psychological support system
## Getting Started

First, install the project dependencies:

```bash
bun install
```

Next, generate the Prisma client:

```bash
bun run postinstall
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:80](http://localhost:80) with your browser to see the result.

## Building and running in Production

To build the application for production, run:

```bash
bun run build
```

You can start the application with:

```bash
bun run start
```

## Deploying to Vercel
To prepare the application for deployment to Vercel, run the following command to log in and set up the workspace:

```bash
bun i -g vercel
vercel
```

### To deploy the application to Vercel run one of the following commands:

```bash
bun run deploy  # for preview deployment
bun run deploy:prod  # for production deployment
bun run deploy:offline  # for offline deployment (app will be built locally)
bun run deploy:prod:offline  # for offline production deployment (app will be built locally)
```

### Troubleshooting deployment to Vercel:
- Do not forget to stop local development server before deploying the application using offline options, as it will cause ambiguous errors.
- Use linux or WSL to deploy the application using offline options, as it will cause ambiguous errors on other platforms.

> Manual deployment is not recommended, as gitlab CI/CD is set up to automatically deploy the application to Vercel on every push to main (production) or any other branch (preview).

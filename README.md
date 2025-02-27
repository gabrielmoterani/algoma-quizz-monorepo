# Disinformation Kiosk Management System

A Turborepo-powered monorepo for managing interactive kiosks that evaluate students' understanding of false information and disinformation.

## Project Overview

This project consists of two main applications:
- An interactive kiosk quiz system built with Electron
- A web-based management interface built with Next.js

### Apps and Packages

- `kiosk`: an [Electron](https://www.electronjs.org/) app for interactive quizzes
- `web`: a [Next.js](https://nextjs.org/) app for kiosk management and data analysis
- `@repo/ui`: a shared React component library used by both applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

Run the following command to create your own instance:

```sh
npx create-turbo@latest
```

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

## Technical Stack

This project utilizes:
- Electron for the kiosk interface
- Next.js for the management web application
- Turborepo for monorepo management
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

To enable Remote Caching:

```
cd my-turborepo
npx turbo login
npx turbo link
```

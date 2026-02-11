# SimpleClaw

A consumer wrapper for OpenClaw. This MVP allows users to sign up, configure their assistant, and provision an instance.

## Features

- **Glassmorphism UI:** Apple-style dashboard.
- **Config Generator:** User-friendly setup for `openclaw.json`.
- **Mock Provisioning:** Simulates backend provisioning process.

## Getting Started

1.  Clone the repo:
    ```bash
    git clone https://github.com/Voltaic-Studio/simple-claw.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Testing

Run unit tests with Vitest:

```bash
npm run test
```

## Structure

- `src/app/page.tsx`: Main dashboard component.
- `src/utils/configGenerator.ts`: Utility to generate OpenClaw config.
- `src/app/api/provision`: Mock API route for provisioning.
- `BLOCKERS.md`: List of current blockers and TODOs.

## Deployment

Deploy on Vercel. Ensure environment variables for Supabase are set (when ready).

# Birthday Reminder

A simple React + Vite application for tracking birthdays, calculating ages, and preparing celebration details.

## Features

- Add and store birthday entries locally using `localStorage`
- Calculate age, next birthday countdown, and zodiac signs automatically
- Save contact phone numbers for quick WhatsApp greetings
- Import and export birthday data as JSON backup files
- Onboarding modal with confetti animation
- Responsive UI with glassmorphism styling

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local development URL shown by Vite in your browser.

## Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Deployment

This project uses Vite's `base` configuration to support deployment environments.

- For Vercel deployment, the app is configured to use `base: '/'`
- For GitHub Pages deployment, the app can use `base: '/birthday-reminder/'`

If you deploy to Vercel, make sure the production build assets are served from the root path.

## Notes

- If `localStorage` contains invalid data, the app resets the stored birthdays safely
- Future commits should be made with a Git user/email associated with your GitHub account for proper attribution

## Stack

- React 19
- Vite 8
- `canvas-confetti`

## License

This project is open source and available to use under the terms of your choice.

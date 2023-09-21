# istex-dl

[Istex-DL](https://dl.istex.fr) is a web application dedicated to Istex sub-corpus extraction. It allows to download several [Istex](https://istex.fr) documents easily in an archive (zip or tar.gz) using a web interface.

## Disclaimer

**This version does not reflect what is currently running in production at [dl.istex.fr](https://dl.istex.fr)! We are currently rebuilding the application entirely, if you want to see the code running in production, checkout the `master` branch.**

## Prerequisites

- Development: [Node.js >= 16.14](https://nodejs.org)
- Production: [docker](https://www.docker.com)

## Development

```
npm install
npm run dev
```

Then the development server is listening on [localhost:3000](http://localhost:3000).

## Production

```
docker compose up -d
```

Then the production server is listening on [localhost:3000](http://localhost:3000).

[![tests](https://github.com/istex/istex-dl/actions/workflows/tests.yml/badge.svg)](https://github.com/istex/istex-dl/actions/workflows/tests.yml)

# istex-dl

[Istex-DL](https://dl.istex.fr) is a web application dedicated to Istex sub-corpus extraction. It allows to download several [Istex](https://istex.fr) documents easily in an archive (zip or tar.gz) using a web interface.

## Disclaimer

**The version does not reflect what is currently running in production at [dl.istex.fr](https://dl.istex.fr)! We are currently rebuilding the application entirely, if you want to see the code running in production, checkout the [`master` branch](https://github.com/istex/istex-dl/tree/master).**

## Prerequisites

- Development: [Node.js >= 16.8](https://nodejs.org)
- Production: [docker](https://www.docker.com)

## Development

```
npm install
npm run dev
```

Then the development server is listening on [localhost:3000](http://localhost:3000).

## Production

```
npm run docker:build
npm run docker:run
```

Then the production server is listening on [localhost:3000](http://localhost:3000).

**Known limitation**: The `docker-compose.yml` file uses the `npm_package_version` environment variable, which means the docker daemon needs to run in an environment where `npm` is available, which is not ideal.

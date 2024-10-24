# istex-search

[Istex Search](https://search.istex.fr) is a web application dedicated to Istex browsing and sub-corpus extraction. It allows to download several [Istex](https://istex.fr) documents easily in an archive (zip or tar.gz) using a web interface.

## Prerequisites

- Development: [Node.js >= 20.11](https://nodejs.org)
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

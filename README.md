# istex-dl

[![Tableau Trello de suivi](https://user-images.githubusercontent.com/328244/29981270-6381ed6c-8f4d-11e7-9b35-6f77b7df853f.png)](https://trello.com/b/DIEeZLDw/istex-dl-suivi-t%C3%A9l%C3%A9chargez-un-corpus-istex) [![Docker Pulls](https://img.shields.io/docker/pulls/istex/istex-dl.svg)](https://registry.hub.docker.com/u/istex/istex-dl/)

[Istex-dl](https://dl.istex.fr) is a web application dedicated to ISTEX
sub-corpus extraction. It makes possible to download several
[ISTEX](https://www.istex.fr) documents easily in a ZIP file using a web
interface.

## Prerequisites

- For debug mode: nodejs >= 8
- For production mode: docker & docker-compose or [ezmaster](https://github.com/inist-cnrs/ezmaster)

## Run in debug mode

```bash
git clone git@github.com:istex/istex-dl.git && cd istex-dl
npm install
cd www/ && npm install
cd .. && npm start
```

Then istex-dl is listening at this URL: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Run in production mode

Istex-dl is ezmaterized so you just have to deploy the latest [istex-dl docker image](https://hub.docker.com/r/istex/istex-dl/builds/) with [ezmaster](https://github.com/Inist-CNRS/ezmaster).

Or if you do not use ezmaste,  you can deploy istex-dl thanks to the [docker-compose.yml](https://github.com/istex/istex-dl/blob/master/docker-compose.yml) dedicated to production this way:

```bash
curl https://raw.githubusercontent.com/istex/istex-dl/master/docker-compose.yml > docker-compose.istex-dl.yml
docker-compose -f docker-compose.istex-dl.yml up -d
```

Then istex-dl is listening at this URL: [http://127.0.0.1:45445](http://127.0.0.1:45445) (replace `127.0.0.1` by your server hostname)

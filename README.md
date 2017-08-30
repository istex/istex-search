# istex-dl

[Istex-dl](https://dl.istex.fr) is a web application dedicated to ISTEX sub-corpus extraction. It makes possible to download [ISTEX](https://www.istex.fr) documents easiely using a web interface.  

## Prerequisites

- For debug mode: nodejs >= 8
- For production mode: docker & docker-compose or ezmaster

## Run in debug mode

```bash
git clone git@github.com:istex/istex-dl.git && cd istex-dl
npm install
cd www/ && npm install
cd .. && npm start
```

Then istex-dl is listening at this URL: http://127.0.0.1:8080

## Run in production mode

Istex-dl is ezmaterized so you just have to deploy the latest [istex-dl docker image](https://hub.docker.com/r/istex/istex-dl/builds/) with [ezmaster](https://github.com/Inist-CNRS/ezmaster).

Or if you do not use ezmaste,  you can deploy istex-dl thanks to the [docker-compose.yml](https://github.com/istex/istex-dl/blob/master/docker-compose.yml) dedicated to production this way:

```bash
curl https://raw.githubusercontent.com/istex/istex-dl/master/docker-compose.yml > docker-compose.istex-dl.yml
docker-compose -f docker-compose.istex-dl.yml up -d
```

Then istex-dl is listening at this URL: http://127.0.0.1:45445 (replace `127.0.0.1` by your server hostname)

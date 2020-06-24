# Fotrino

[![GitHub](https://img.shields.io/github/license/michaelmolino/fotrino-frontend?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0.en.html)

Fotrino is a photo gallery, social sharing site, and photo management tool.

This project is actively being developed and is not yet ready for use. Until I reach version 1.0, **updates might break existing installs** (eg. I won't provide DB migrations).

**Privacy Warning** The [URLs to access your photos](https://docs.aws.amazon.com/AmazonS3/latest/dev/ShareObjectPreSignedURL.html) are valid for 24 hours and will work even if you are logged out. Someone with access to your browser history/cache could access your photos.

## [Demo Site](https://www.fotrino.com/)

[![Chromium HSTS preload](https://img.shields.io/hsts/preload/fotrino.com?style=for-the-badge)](https://hstspreload.org/?domain=fotrino.com)
[![SSL Labs SSL Server Test](https://img.shields.io/badge/SSL%20LABS-A%2B-brightgreen?style=for-the-badge)](https://www.ssllabs.com/ssltest/analyze.html?d=fotrino.com)
[![Mozilla HTTP Observatory Grade](https://img.shields.io/mozilla-observatory/grade/fotrino.com?publish&style=for-the-badge)](https://observatory.mozilla.org/analyze/fotrino.com)
[![Uptime Robot status](https://img.shields.io/uptimerobot/status/m784831310-cc936a200e25a76f2cb55b9d?style=for-the-badge)](https://stats.uptimerobot.com/wn3MlHLvwG)

Feel free to use this live demo as a playground where you can upload photos.  It is always the most up to date version of the code.  Note that I regularly delete the DB and photos so don't use it to actually store important photos!

## Architecture

![fotrino architecture](https://docs.google.com/drawings/d/e/2PACX-1vSGRI9GP1OKkTt1A0YWXzWCZVZ5ZhtwJ7JMlOvahc-qVFVe9IGzvGr6aiKd4aj5_dNCXZlY3RFW_A95/pub?w=800)

## [Frontend](https://github.com/michaelmolino/fotrino-frontend)
[![Sonar Violations (short format)](https://img.shields.io/sonar/violations/michaelmolino_fotrino-frontend?label=sonar%20violations&server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/dashboard?id=michaelmolino_fotrino-frontend)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/michaelmolino/fotrino-frontend?style=for-the-badge)](https://libraries.io/github/michaelmolino/fotrino-frontend)
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/michaelmolino/fotrino-frontend?style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-frontend)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/michaelmolino/fotrino-frontend/latest?label=Docker%20Image%20Size&style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-frontend)

## [Backend](https://github.com/michaelmolino/fotrino-backend)
[![Sonar Violations (short format)](https://img.shields.io/sonar/violations/michaelmolino_fotrino-backend?label=sonar%20violations&server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/dashboard?id=michaelmolino_fotrino-backend)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/michaelmolino/fotrino-backend?style=for-the-badge)](https://libraries.io/github/michaelmolino/fotrino-backend)
#### Core
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/michaelmolino/fotrino-backend?style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-backend)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/michaelmolino/fotrino-backend/latest?label=Docker%20Image%20Size&style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-backend)
#### Worker
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/michaelmolino/fotrino-worker?style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-worker)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/michaelmolino/fotrino-worker/latest?label=Docker%20Image%20Size&style=for-the-badge)](https://hub.docker.com/repository/docker/michaelmolino/fotrino-worker)

## [Self Hosting](https://github.com/michaelmolino/fotrino-selfhost)

#### Intro

Note: You'll need [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed. You'll also need `sudo` to modify your hosts file.

**THIS IS SUPER INSECURE AND, AMONGST OTHER PROBLEMS, USES COMPLETELY MOCKED AUTHENTICATION.**

This quickstart will get a hacked together, non-production version of Fotrino running locally (hopefully!). I do plan on providing cleaner and easier self-hosting options in the future.

#### Just do this stuff once!

```bash
# Check out the code
# You don't need any other repos
git clone https://github.com/michaelmolino/fotrino-selfhost.git
cd fotrino-selfhost
# Generate a self signed certificate
# You can just press enter for all the questions
openssl req -new -newkey rsa:2048 -sha256 -days 3650 -nodes -x509 -keyout ./ssl/private.key -out ./ssl/public.crt -config ssl.conf
# Add some entries to your hosts file
echo "127.0.0.1   fotrino" | sudo tee -a /etc/hosts
echo "127.0.0.1   mock-oauth-server" | sudo tee -a /etc/hosts
echo "127.0.0.1   minio" | sudo tee -a /etc/hosts
```

#### Start Fotrino

```bash
# Start dependencies
docker-compose run --rm dependencies
# Start the service
docker-compose up -d fotrino-worker fotrino-backend fotrino-frontend nginx
```

**Now visit [https://fotrino:4443](https://fotrino:4443).**

#### Stop Fotrino

```bash
# Stop everything
docker-compose down
```

#### Troubleshooting

Your browser should complain that Fotrino cannot be trusted.  You should visit each of these domains and accept the certificate.
- https://mock-oauth-server:4444 (a 404 is OK)
- https://minio:9000
- https://fotrino:4443

If you can't accept the certificate, try [this](https://medium.com/@dblazeski/chrome-bypass-net-err-cert-invalid-for-development-daefae43eb12).

#### Cleaning Up

If you'd like to trash all of your photos and DB you can just delete the `./minio` and `./postgres` folders.  They will be recreated the next time you start the services.

#### Updating

Updates are likely to **break your existing install**.  You should delete `./minio` and `./postgres` to avoid problems.
```bash
# Pull the latest self-host to make sure you have the latest docker-compose.yml and settings
git pull
# Update the docker images
docker-compose pull
```

#### Dependencies

Additionally, Fotrino needs a webserver, an S3 compatible bucket and an identity provider to run.  [Nginx](https://nginx.org/), [Minio](https://min.io/), and a [mock oauth server](https://github.com/michaelmolino/mock-oauth-server) are used in this example setup.  If you need to expose your instance you'll need a real identity provider.  [Ory Hydra](https://www.ory.sh/hydra/docs/) is supported, as well as Facebook, Github, Gmail, and Reddit.

# Block-Game

This is a clone of a board game with a similar name.

**MVP Is Live!** Check it out [Here](https://tdurtschi.github.io/block-game/)

## Run in Dev Mode

_Prerequisites: NodeJS_

Before running the app, install dependencies:

```bash
npm install
```

Dev mode spins up the app (frontend & server) and opens cypress in watch mode.

```bash
npm run dev
```

To start the frontend in watch mode without cypress or the server, use `npm run watch` instead of `npm run dev`.

## Build

Build the frontend:
```bash
npm run build-frontend
```

Static site output will be in `dist/` directory.

## Deploy

_Prerequisites: NodeJS, Docker, remote ftp directory to copy files to, deployment/deploy.env file_

```bash
npm run deploy
```

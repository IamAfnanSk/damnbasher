# Damnbasher

### This code powers the containers

Damnbasher is responsible for handling all file I/O and CLI I/O of the Damnground app

## Features

- CRUD Files via SocketIO
- File manager for damnground
- CLI handler for damnground web terminal
- Great ability to scale

## Tech

Damnbasher uses these tech to power itself:

- Chokidar - For file watching ability
- node.js - I/O for the backend
- NodePTY - Psuedo terminal to interact via web

## Installation

Install the dependencies and devDependencies and start the server.

```sh
cd damnbasher
npm i
node run dev
```

For production environments...

```sh
npm run build
```

## Docker

Damnbasher is spuer easy to deploy in a Docker container.

```sh
cd damnbasher
docker build -t <youruser>/html:<version | tag>.
```

This will create the damnbasher html image and pull in the necessary dependencies.

Run

```sh
docker run -d -p 1337:1337 -d -<youruser>/damnbasher:<version | tag>
```

## Author

# Afnan Shaikh

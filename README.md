# Gossip-Graph Architecture for Hybrid Peer-to-Peer MMORPGs

## Installing

```bash
$ cd souls-adrift
$ npm install
```

## Running the server

```bash
$ cd souls-adrift
$ node -r esm ./src/game-server/app.js
```

## Opening the game client

```bash
$ cd souls-adrift
$ npm dev
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

## Running the simulation

```bash
$ cd souls-adrift
$ python ./run_simulation.py [num_clients] [num_seconds]
```

## Opening the performance analysis

```bash
$ cd souls-adrift/evaluation
$ jupyter notebook
```
const express = require('express')
const cors = require('cors')
const fs = require("fs");
const ws = require('ws')
const wrtc = require('wrtc')
const Peer = require('simple-peer')
const validator = require("email-validator");
const sanitize = require("sanitize")

const { gossipGraph, gameEngine } = require('../game-engine/GameAssembly');
const { deepCopy } = require('../game-client/util/Util');
const { goTo } = require('../game-engine/GameActions');
const { deserialise } = require('../gossip-graph/MessageSerialiser');

// Kick-off server's game engine
const id = process.argv[2]
console.log('Kicking off client ' + id)
gossipGraph.init(id, ws.WebSocket, Peer, wrtc)

// Client logic
function runAI() {
    if (gameEngine.isLoaded()) {
        const player = gameEngine.get(id)
        const moves = player.location().moves().filter(([m, allowed]) => allowed)
        const destination = moves[Math.floor(Math.random() * moves.length)][0]
        goTo(destination.id)
    }
    setTimeout(runAI, 500 + Math.floor(Math.random() * 1000))
}

// start the client logic
runAI()

// periodically log metrics
setInterval(() => {
    if (!gameEngine.isLoaded()) return;
    fs.writeFile('./metrics/' + id + '.json', JSON.stringify(gossipGraph.getMetrics(), null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Failed to dump metrics: ', err)
        }
    })
}, 1000)

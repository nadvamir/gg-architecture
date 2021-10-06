const express = require('express')
const cors = require('cors')
const fs = require("fs");
const ws = require('ws')
const wrtc = require('wrtc')
const Peer = require('simple-peer')

const { gossipGraph, gameEngine } = require('../game-engine/GameAssembly');
const { deepCopy } = require('../game-client/util/Util');

const app = express()
const port = 3001

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!' + gameEngine.state.last_id)
})

app.get('/login', (req, res) => {
    res.send({ uid: 3000001 })
})

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let peers = {}
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
    socket.on('message', message => {
        const payload = JSON.parse(message.toString())
        console.log('Server received: ', message.length, message.toString())
        switch (payload.action) {
            case 'register': 
                socket.send(JSON.stringify({action: 'game_state', state: gameEngine.getState()}))
                socket.send(JSON.stringify({action: 'list_of_peers', peers: Object.keys(peers)}))
                peers[payload.uid] = socket
                break
            case 'signal':
                if (payload.peer in peers) {
                    peers[payload.peer].send(JSON.stringify({action: 'signal', uid: payload.uid, sdp: payload.sdp}))
                }
                break
        }
    })

    socket.on('close', () => {
        console.log('A client has disconnected')
        for (const [p, s] of Object.entries(peers)) {
            if (s == socket) {
                console.log('Removing the socket')
                delete peers[p]
                console.log('New peers: ', peers)
                break
            }
        }
    })
})

wsServer.on('close', socket => {

})

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})

// load the game state if exists
const gameStatePath = './state.json'
let state;
if (fs.existsSync(gameStatePath)) {
    state = require(gameStatePath)
}
else {
    // load an initial game map
    state = require('../game-engine/data/InitialGameState.json')
}
gameEngine.loadGameState(state)

// setup a periodic game store
//TODO

// Kick-off server's game engine
gossipGraph.init(0, ws.WebSocket, Peer, wrtc)
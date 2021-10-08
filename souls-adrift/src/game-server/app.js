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

// load the game state if exists
const GAME_STATE_PATH = './state.json'
let initialState = {};
if (fs.existsSync(GAME_STATE_PATH)) {
    initialState = JSON.parse(fs.readFileSync(GAME_STATE_PATH))
}
else {
    // load an initial game map
    initialState = require('../game-engine/data/InitialGameState.json')
    const generator = require('./arenaGenerator.js')
    generator.generateArena(initialState)
}

// setup a periodic game store
setInterval(() => {
    if (!gameEngine.isLoaded()) return;
    fs.writeFile(GAME_STATE_PATH, JSON.stringify(gameEngine.getState(), null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Failed to back up game state: ', err)
        }
    })
}, 1000)

// periodically log metrics
setInterval(() => {
    if (!gameEngine.isLoaded()) return;
    fs.writeFile('./metrics/server.json', JSON.stringify(gossipGraph.getMetrics(), null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Failed to dump metrics: ', err)
        }
    })
}, 1000)

// -------- app --------
const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(sanitize.middleware)

app.get('/', (req, res) => {
    res.send('Hello World!' + gameEngine.state.last_id)
})

app.post('/login', (req, res) => {
    //FIXME: the entire login flow
    const pid = gameEngine.authorisePlayer(req.body.email, req.body.password)
    if (!!pid) {
        res.send({ uid: pid })
    }
    else {
        res.send({ error: 'Email and password do not match' })
    }
})

app.post('/register', (req, res) => {
    const p = req.body
    if (!validator.validate(p.email)) {
        res.send({ success: false, error: 'Please enter a valid email'})
        return
    }
    if (gameEngine.emailExists(p.email)) {
        res.send({ success: false, error: 'This email is already taken'})
        return
    }
    if (gameEngine.usernameExists(p.username)) {
        res.send({ success: false, error: 'This username is already taken'})
        return
    }
    if (p.username.length < 1) {
        res.send({ success: false, error: 'This username is too short'})
        return
    }
    gameEngine.createPlayer(p.email, p.password, p.username)
    res.send({ success: true })
})

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let peers = {}
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
    socket.on('message', message => {
        const payload = JSON.parse(message.toString())
        switch (payload.action) {
            case 'register':
                let state = deepCopy(gameEngine.isLoaded() ? gameEngine.getState() : initialState)
                // FIXME: great security, actually authorise the connection in the future
                if (payload.uid != 0) {
                    // remove passwords
                    for (let [_, e] of Object.entries(state)) {
                        if (!!e.password) delete e['password']
                    }
                }
                socket.send(JSON.stringify({ action: 'game_state', state: state }))
                socket.send(JSON.stringify({ action: 'list_of_peers', peers: Object.keys(peers) }))
                gossipGraph.markLastMessage(payload.uid, state.last_message)
                peers[payload.uid] = socket
                break
            case 'signal':
                if (payload.peer in peers) {
                    peers[payload.peer].send(JSON.stringify({ action: 'signal', uid: payload.uid, sdp: payload.sdp }))
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
                break
            }
        }
    })
})

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})

// Kick-off server's game engine
gossipGraph.init(0, ws.WebSocket, Peer, wrtc)

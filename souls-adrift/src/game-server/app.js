const express = require('express')
const cors = require('cors')
const ws = require('ws')
const wrtc = require('wrtc')
const Peer = require('simple-peer')

const { gossipGraph, gameEngine } = require('../game-engine/GameAssembly')

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
})

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})

gossipGraph.init(0, ws.WebSocket, Peer, wrtc)



// var peer1 = new Peer({ initiator: true })
// var peer2 = new Peer()

// peer1.on('signal', data => {
//   // when peer1 has signaling data, give it to peer2 somehow
//   peer2.signal(data)
// })

// peer2.on('signal', data => {
//   // when peer2 has signaling data, give it to peer1 somehow
//   peer1.signal(data)
// })

// peer1.on('connect', () => {
//   // wait for 'connect' event before using the data channel
//   peer1.send('hey peer2, how is it going?')
// })

// peer2.on('data', data => {
//   // got a data channel message
//   console.log('got a message from peer1: ' + data)
// })
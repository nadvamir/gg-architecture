import { deepCopy } from "../game-client/util/Util"

function generateArena(state) {
    // generate an arena of 900 locations, 30x30
    const baseLocation = {
        'src': 'l.void',
        'name': 'Arena',
        'desc': '900 identical locations',
        'moves': [],
        'actors': {}
    }
    const N = 30
    const id = (i, j) => 1000 + i * N + j
    for (let i = 0; i < N; ++i) {
        for (let j = 0; j < N; ++j) {
            const loc = deepCopy(baseLocation)
            loc.name += ' ' + i + 'x' + j
            if (i > 0) loc.moves.push(id(i - 1, j))
            if (j + 1 < N) loc.moves.push(id(i, j + 1))
            if (i + 1 < N) loc.moves.push(id(i + 1, j))
            if (j > 0) loc.moves.push(id(i, j - 1))
            state[id(i, j)] = loc
        }
    }
    state[2].moves = [1, id(0, 0)]
    // link with the main map
    state[id(0, 0)].moves.push(2)

    // now insert 30 rats
    for (let i = 0; i < N; ++i) {
        const ratId = 1100000 + i
        const rat = {
            "name": "Rat",
            "src": "n.x.rat",
            "location": id(i, 1),
            "spawn_point": id(i, 1)
        }
        state[ratId] = rat
        state[id(i, 1)].actors = { [ratId]: 1 }
    }

    // now insert 100 players
    for (let i = 0; i < 100; ++i) {
        const playerId = 1200000  + i
        const player = {
            "name": "Tester " + i,
            "email": i + "@a.ua",
            "password": "ypeBEsobvcr6wjGzmiPcTaeG7/gUfE5yuYB3ha/uSLs=",
            "src": "p.player",
            "stats": {
                "hp": 20,
                "lvl": 1,
                "exp": 20,
                "skill_points": 0
            },
            "skills": {
                "strength": 3,
                "constitution": 2,
                "dexterity": 3,
                "sabre": 0
            },
            "equipment": [],
            "inventory": {},
            "quest": {},
            "location": id(Math.floor(Math.random() * N), Math.floor(Math.random() * N)),
            "battle": 0
        }
        state[playerId] = player
        state[player.location].actors[playerId] = 1
    }
}

exports.generateArena = generateArena
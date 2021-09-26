const NpcDefinitions = {
    'n.t.sailor.jerry': {
        'name': 'Sailor Jerry',
        'type': 'npc.talk',
        'stats': {
            'hp': 40,
            'lvl': 5,
            'exp_worth': 30,
            'base_dmg': 2,
            'base_armor': 0
        },
        'skills': {
            'strength': 5,
            'constitution': 4,
            'dexterity': 2,
            'sabre': 0
        },
        // list of equipped ids
        'equipment': [2000001, 2000002],
        // id -> count
        'inventory': {
            2000001: 1,
            2000002: 1,
            2000005: 100,
            2000006: 3
        },
        'trade': {
            // what's he willing to sell, ids
            'for_sale': [2000006],
            'buy': 0.8,
            'sell': 1.2,
            // classes of items he's interested in
            'to_buy': ['weapon', 'helmet', 'gloves', 'boots']
        },
        'location': 1,
        'battle': 0
    },
    'n.x.rat': {
        'name': 'Rat',
        'type': 'npc.aggro',
        'stats': {
            'hp': 10,
            'lvl': 1,
            'exp_worth': 10,
            'base_dmg': 2,
            'dmg_spread': 3,
            'base_armor': 0
        },
        'skills': {
            'strength': 1,
            'constitution': 2,
            'dexterity': 1,
            'sabre': 0
        },
        // list of equipped ids
        'equipment': [],
        // id -> count
        'inventory': {},
        'location': 1,
        'battle': 0
    },
    'n.c.mouse': {
        'name': 'Mouse',
        'type': 'npc.chill',
        'stats': {
            'hp': 7,
            'lvl': 1,
            'exp_worth': 10,
            'base_dmg': 2,
            'base_armor': 0
        },
        'skills': {
            'strength': 1,
            'constitution': 1,
            'dexterity': 1,
            'sabre': 0
        },
        // list of equipped ids
        'equipment': [],
        // id -> count
        'inventory': {},
        'location': 1,
        'battle': 0
    }
}

export { NpcDefinitions }
const NpcDefinitions = {
    'n.t.sailor.jerry': {
        'name': 'Sailor Jerry',
        'desc': 'A man of unspecified age.',
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
            'buy': 0.8,
            'sell': 1.2,
            // classes of items he's interested in
            'to_buy': ['weapon', 'helmet', 'gloves', 'boots'],
            'for_sale': ['weapon', 'helmet', 'gloves', 'boots']
        },
        'location': 1,
        'battle': 0,
        'dialogue': {
            '__init__': {t: "Hey, what brings you here?", r: [
                {l: "no_work", t: "I'm looking for work", c: [["npc_has_item", 2000007, 1]]},
                {l: "work", t: "I'm looking for work", c: [["npc_has_no_item", 2000007, 1]]},
                {l: "give_key", t: "I believe you've lost something", c: [["player_has_item", 2000007, 1], ["npc_has_no_item", 2000007, 1]], a: [["give_item", 2000007, 1], ["gain_item", 2000005, 10]]},
                {l: "__end__", t: "Just passing by"}
            ]},
            'work': {t: "I believe I've lost my key somewhere around here, could you find it?", r: [
                {l: "give_key", t: "This key?", c: [["player_has_item", 2000007, 1], ["npc_has_no_item", 2000007, 1]], a: [["give_item", 2000007, 1], ["gain_item", 2000005, 10]]},
                {l: "__end__", t: "I'll keep an eye on it."}
            ]},
            'no_work': {t: "Sorry, nothing much to do around.", r: [
                {l: "__end__", t: "Ok."}
            ]},
            'give_key': {t: "Thank you so much! Here's 10 coins as a reward.", r: [
                {l: "__end__", t: "Take care."}
            ]}
        }
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
    'n.a.mouse': {
        'name': 'Mouse',
        'type': 'npc.chill',
        'stats': {
            'hp': 10,
            'lvl': 1,
            'exp_worth': 5,
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
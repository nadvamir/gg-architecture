const LocationDefinitions = {
    'l.safe_town.forlorn_quay': {
        'id': 1,
        'name': 'Forlorn Quay',
        'desc': 'The wind blows freely over the empty quay. Rotten fishing nets lie here and there.',
        'moves': [2, 3, 4, 7],
        'gated_moves': {
            // id -> required item
            5: 2000007
        },
        'actors': {}
    },
    'l.safe_town.main_street': {
        'id': 2,
        'name': 'Main Street',
        'desc': 'Nothing special.',
        'moves': [1],
        'actors': {}
    },
    'l.safe_town.near_sunken_boat': {
        'id': 3,
        'name': 'Near Sunken Boat',
        'desc': 'The boat is still visible on the bottom of the sea.',
        'moves': [1],
        'actors': { 2000007: 1 }
    },
    'l.safe_town.fourth_wall_library': {
        'id': 4,
        'name': 'Fourth Wall Libarary',
        'desc': 'This is where to find all the game info.',
        'moves': [1],
        'actors': {}
    },
    'l.safe_town.old_house': {
        'id': 5,
        'name': 'Old house',
        'desc': 'The ceiling is about to fall.',
        'moves': [1],
        'actors': { 2000001: 1 }
    },
    'l.void': {
        'id': 6,
        'name': 'Void',
        'desc': 'How would you describe it?',
        'moves': [],
        'actors': {}
    },
    'l.safe_town.dead_poet_tavern': {
        'id': 7,
        'name': 'Dead Poet tavern',
        'desc': 'Little light flows through small, skin-covered windows.',
        'moves': [1, 8],
        'actors': {}
    },
    'l.dpt_cellar_near.cellar': {
        'id': 8,
        'name': 'Cellar',
        'desc': 'Caskets of ale are lined next to the walls.',
        'moves': [7, 9],
        'actors': {1000003: 1}
    },
    'l.dpt_cellar_far.cellar_further': {
        'id': 9,
        'name': 'Far side of the cellar',
        'desc': 'Heaps of rubbish are covering the ground. There is a hole in the wall.',
        'moves': [8, 10],
        'actors': {1000002: 1}
    },
    'l.dpt_cellar_far.hole_in_the_wall': {
        'id': 10,
        'name': 'Hole in the wall',
        'desc': "It is so dark it's hard to see.",
        'moves': [9],
        'actors': {1000004: 1}
    },
}

export { LocationDefinitions }
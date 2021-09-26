const LocationDefinitions = {
    'l.town.forlorn.quay': {
        'name': 'Forlorn Quay',
        'desc': 'The wind blows freely over the empty quay. Rotten fishing nets lie here and there.',
        'moves': [2, 3, 4],
        'gated_moves': {
            // id -> required item
            5: 2000007
        },
        'actors': []
    },
    'l.town.main.street': {
        'name': 'Main Street',
        'desc': 'Nothing special.',
        'moves': [1],
        'actors': []
    },
    'l.town.near.sunken.boat': {
        'name': 'Near Sunken Boat',
        'desc': 'The boat is still visible on the bottom of the sea.',
        'moves': [1],
        'actors': []
    },
    'l.town.fourth.wall.library': {
        'name': 'Fourth Wall Libarary',
        'desc': 'This is where to find all the game info.',
        'moves': [1],
        'actors': []
    },
    'l.town.old.house': {
        'name': 'Old house',
        'desc': 'The ceiling is about to fall.',
        'moves': [1],
        'actors': []
    }
}

export { LocationDefinitions }
function capitalise(word) {
    return word[0].toUpperCase() + word.slice(1)
}

function empty(obj) {
    for (let k in obj) return false
    return true
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export { capitalise, empty, deepCopy }
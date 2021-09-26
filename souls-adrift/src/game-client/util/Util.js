function capitalise(word) {
    return word[0].toUpperCase() + word.slice(1)
}

function empty(obj) {
    for (let k in obj) return false
    return true
}

export { capitalise, empty }
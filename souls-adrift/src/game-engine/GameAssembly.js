import { GameEngine } from './GameEngine.js'
import { GossipGraph } from '../gossip-graph/GossipGraph.js'

const gossipGraph = new GossipGraph(42, 10, 100)
const gameEngine = new GameEngine(gossipGraph)

export { gossipGraph, gameEngine }
import { GameEngine } from './GameEngine.js'
import { GossipGraph } from '../gossip-graph/GossipGraph.js'

const gossipGraph = new GossipGraph()
const gameEngine = new GameEngine(gossipGraph)

export { gossipGraph, gameEngine }
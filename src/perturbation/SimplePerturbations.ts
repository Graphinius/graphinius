/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $DS from '../utils/structUtils';
import { Logger } from '../utils/logger';

let logger : Logger = new Logger();

/**
 * EITHER generate new edges via specified degree span
 * OR via probability of edge creation from a specified
 * set of nodes to all others
 */
export interface NodeDegreeConfiguration {
	und_degree?: 		 	number;
	dir_degree?:		 	number;
	min_und_degree?: 	number;
	max_und_degree?: 	number;
	min_dir_degree?: 	number;
	max_dir_degree?: 	number;
	probability_dir?: number;
	probability_und?: number;
}


export interface ISimplePerturber {	
	// CREATE RANDOM EDGES PER NODE
	createRandomEdgesProb( probability: number, directed?: boolean, setOfNodes?: { [key: string] : $N.IBaseNode} ) : void;
	createRandomEdgesSpan( min: number, max: number, directed?: boolean, setOfNodes?: { [key: string] : $N.IBaseNode} ) : void;

	// RANDOMLY DELETE NODES AND EDGES
	randomlyDeleteNodesPercentage( percentage: number ) : void;
	randomlyDeleteUndEdgesPercentage( percentage: number ) : void;
	randomlyDeleteDirEdgesPercentage( percentage: number ) : void;
	randomlyDeleteNodesAmount( amount: number ) : void;
	randomlyDeleteUndEdgesAmount( amount: number ) : void;
	randomlyDeleteDirEdgesAmount( amount: number ) : void;
	
	// RANDOMLY ADD NODES AND EDGES
	randomlyAddNodesPercentage( percentage: number, config?: NodeDegreeConfiguration ) : void;
	randomlyAddUndEdgesPercentage( percentage: number ) : void;
	randomlyAddDirEdgesPercentage( percentage: number ) : void;
	randomlyAddNodesAmount( amount: number, config?: NodeDegreeConfiguration ) : void;
	randomlyAddEdgesAmount( amount: number, config?: $E.EdgeConstructorOptions ) : void;
}


class SimplePerturber implements ISimplePerturber {

  constructor(private _graph: $G.IGraph) {

  }


	/**
	 *
	 * @param percentage
	 */
	randomlyDeleteNodesPercentage( percentage: number ) : void {
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage/100);
		this.randomlyDeleteNodesAmount( nr_nodes_to_delete );
	}


	/**
	 *
	 * @param percentage
	 */
	randomlyDeleteUndEdgesPercentage( percentage: number ) : void {
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage/100);
		this.randomlyDeleteUndEdgesAmount( nr_edges_to_delete );
	}


	/**
	 *
	 * @param percentage
	 */
	randomlyDeleteDirEdgesPercentage( percentage: number ) : void {
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage/100);
		this.randomlyDeleteDirEdgesAmount( nr_edges_to_delete );
	}


	/**
	 * 
	 */
	randomlyDeleteNodesAmount( amount: number ) : void {
		if ( amount < 0 ) {
			throw 'Cowardly refusing to remove a negative amount of nodes';
		}
		if ( this._graph.nrNodes() === 0 ) {
			return;
		}
		
		for ( let nodeID = 0, randomNodes = this._graph.pickRandomProperties(this._graph.getNodes(), amount); nodeID < randomNodes.length; nodeID++ ) {
			this._graph.deleteNode( this._graph.getNodes()[randomNodes[nodeID]] );
		}
	}


	/**
	 * 
	 */
	randomlyDeleteUndEdgesAmount( amount: number ) : void {
		if ( amount < 0 ) {
			throw 'Cowardly refusing to remove a negative amount of edges';
		}
		if ( this._graph.nrUndEdges() === 0 ) {
			return;
		}

		for ( let edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getUndEdges(), amount); edgeID < randomEdges.length; edgeID++ ) {
			this._graph.deleteEdge( this._graph.getUndEdges()[randomEdges[edgeID]] );
		}
	}


	/**
	 * 
	 */
	randomlyDeleteDirEdgesAmount( amount: number ) : void {
		if ( amount < 0 ) {
			throw 'Cowardly refusing to remove a negative amount of edges';
		}
		if ( this._graph.nrDirEdges() === 0 ) {
			return;
		}

		for ( let edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getDirEdges(), amount); edgeID < randomEdges.length; edgeID++ ) {
			this._graph.deleteEdge( this._graph.getDirEdges()[randomEdges[edgeID]] );
		}
	}


	/**
	 *  
	 */
	randomlyAddUndEdgesPercentage( percentage: number ) : void {
		let nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage/100);		
		this.randomlyAddEdgesAmount( nr_und_edges_to_add, {directed: false} );
	}


	/**
	 * 
	 */
	randomlyAddDirEdgesPercentage( percentage: number ) : void {
		let nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage/100);
		this.randomlyAddEdgesAmount( nr_dir_edges_to_add, {directed: true} );
	}
	
	
	/**
	 * 
	 * DEFAULT edge direction: UNDIRECTED
	 */
	randomlyAddEdgesAmount( amount: number, config?: $E.EdgeConstructorOptions ) : void {
		if ( amount <= 0 ) {
			throw new Error('Cowardly refusing to add a non-positive amount of edges')
		}

		let node_a : $N.IBaseNode,
				node_b : $N.IBaseNode,
				nodes	 : {[key: string] : $N.IBaseNode};
		
		let direction = ( config && config.directed ) ? config.directed : false,
				dir = direction ? "_d" : "_u";

		// logger.log("DIRECTION of new edges to create: " + direction ? "directed" : "undirected");

		while ( amount ) {
			node_a = this._graph.getRandomNode();
			while ( ( node_b = this._graph.getRandomNode() ) === node_a ) {}

			let edge_id = `${node_a.getID()}_${node_b.getID()}${dir}`;
			if ( node_a.hasEdgeID( edge_id ) ) {
				// TODO: Check if the whole duplication prevention is really necessary!
				// logger.log("Duplicate edge creation, continuing...");
				continue;
			}
			else {
				/**
				 * Enable random weights for edges ??
				 */
				this._graph.addEdgeByID(edge_id, node_a, node_b, {directed: direction});
				--amount;
			}
		}

		// logger.log(`Created ${amount} ${direction ? "directed" : "undirected"} edges...`);
	}


	/**
	 * 
	 */
	randomlyAddNodesPercentage( percentage: number, config?: NodeDegreeConfiguration ) : void {
		let nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage/100);
		this.randomlyAddNodesAmount( nr_nodes_to_add, config );
	}


	/**
	 * 
	 * If the degree configuration is invalid
	 * (negative or infinite degree amount / percentage)
	 * the nodes will have been created nevertheless
	 */
	randomlyAddNodesAmount( amount: number, config?: NodeDegreeConfiguration ) : void {
		if ( amount < 0 ) {
			throw 'Cowardly refusing to add a negative amount of nodes';
		}
		let new_nodes : { [key: string] : $N.IBaseNode } = {};
		
		while ( amount-- ) {
			/**
			 * @todo check if this procedure is 'random enough'
			 */
			let new_node_id = (Math.random()+1).toString(36).substr(2, 32) + (Math.random()+1).toString(36).substr(2, 32);
			new_nodes[new_node_id] = this._graph.addNodeByID( new_node_id );
		}
		
		if ( config == null ) {
			return;
		}
		else {
			this.createEdgesByConfig( config, new_nodes );
		}
	}
	
	
	/**
	 * Go through the degree_configuration provided and create edges
	 * as requested by config
	 */
	private createEdgesByConfig( config: NodeDegreeConfiguration, new_nodes: {[key: string] : $N.IBaseNode} ) {
		let degree,
				min_degree,
				max_degree,
				deg_probability;
		
		if ( config.und_degree != null || 
				 config.dir_degree != null ||
				 config.min_und_degree != null && config.max_und_degree != null ||
				 config.min_dir_degree != null && config.max_dir_degree != null )		
		{
			// Ignore min / max undirected degree if specific amount is given
			if ( ( degree = config.und_degree ) != null ) {			
				this.createRandomEdgesSpan(degree, degree, false, new_nodes);
			}
			else if ( ( min_degree = config.min_und_degree) != null 
						&& ( max_degree = config.max_und_degree ) != null ) {
				this.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
			}
			// Ignore min / max directed degree if specific amount is given
			if ( degree = config.dir_degree ) {			
				this.createRandomEdgesSpan(degree, degree, true, new_nodes);
			}
			else if ( ( min_degree = config.min_dir_degree) != null 
						&& ( max_degree = config.max_dir_degree ) != null ) {
				this.createRandomEdgesSpan(min_degree, max_degree, true, new_nodes);
			}
		}
		else {
			if ( config.probability_dir != null ) {
				this.createRandomEdgesProb( config.probability_dir, true, new_nodes );
			}
			if ( config.probability_und != null ) {
				this.createRandomEdgesProb( config.probability_und, false, new_nodes );
			}
		}
	}


	/**
	 * Simple edge generator:
	 * Go through all node combinations, and
	 * add an (un)directed edge with 
	 * @param probability and
	 * @direction true or false
	 * CAUTION: this algorithm takes quadratic runtime in #nodes
	 */
	createRandomEdgesProb( probability: number, directed?: boolean,
												 new_nodes?: { [key: string] : $N.IBaseNode} ) : void {
		if (0 > probability || 1 < probability) {
			throw new Error("Probability out of range.");
		}
		directed = directed || false;
		new_nodes = new_nodes || this._graph.getNodes();
		let all_nodes = this._graph.getNodes(),
				node_a, 
				node_b,
				edge_id,
				dir = directed ? '_d' : '_u';
		for (node_a in new_nodes) {
			for (node_b in all_nodes) {
				if (node_a !== node_b && Math.random() <= probability) {
					edge_id = all_nodes[node_a].getID() + "_" + all_nodes[node_b].getID() + dir;
					// Check if edge already exists
					if (this._graph.getNodes()[node_a].hasEdgeID(edge_id)) {
						continue;
					}
					this._graph.addEdgeByID(edge_id, all_nodes[node_a], all_nodes[node_b], {directed: directed});
				}
			}
		}
	}
	

	/**
	 * Simple edge generator:
	 * Go through all nodes, and
	 * add [min, max] (un)directed edges to 
	 * a randomly chosen node
	 * CAUTION: this algorithm could take quadratic runtime in #nodes
	 * but should be much faster
	 */
	createRandomEdgesSpan( min: number, max: number, directed?: boolean,
												 setOfNodes?: { [key: string] : $N.IBaseNode} ) : void {
		if (min < 0) {
			throw new Error('Minimum degree cannot be negative.');
		}
		if (max >= this._graph.nrNodes()) {
			throw new Error('Maximum degree exceeds number of reachable nodes.');
		}
		if (min > max) {
			throw new Error('Minimum degree cannot exceed maximum degree.');
		}
		directed = directed || false;
		// Do we need to set them integers before the calculations?
		var min = min | 0,
				max = max | 0,
				new_nodes = setOfNodes || this._graph.getNodes(),
				all_nodes = this._graph.getNodes(),
				idx_a,
				node_a,
				node_b,
				edge_id,
				// we want edges to all possible nodes
				// TODO: enhance with types / filters later on
				node_keys = Object.keys(all_nodes),
				keys_len = node_keys.length,
				rand_idx,
				rand_deg,
				dir = directed ? '_d' : '_u';

		for (idx_a in new_nodes) {
			node_a = new_nodes[idx_a];
			rand_idx = 0;
			rand_deg = (Math.random()*(max-min)+min)|0;
			while (rand_deg) {
				rand_idx = (keys_len*Math.random())|0; // should never reach keys_len...
				node_b = all_nodes[node_keys[rand_idx]];
				if (node_a !== node_b) {
					edge_id = node_a.getID() + "_" + node_b.getID() + dir;
					// Check if edge already exists
					if (node_a.hasEdgeID(edge_id)) {
						continue;
					}
					this._graph.addEdgeByID(edge_id, node_a, node_b, {directed: directed});
					--rand_deg;
				}
			}
		}
	}


}

export {
  SimplePerturber
}
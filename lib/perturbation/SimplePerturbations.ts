import * as $N from '@/core/base/BaseNode';
import * as $E from '@/core/base/BaseEdge';
import * as $G from '@/core/base/BaseGraph';

import * as uuid from 'uuid';
const v4 = uuid.v4;


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
	// CREATE EDGES PER NODE
	createEdgesProb(probability: number, directed?: boolean, setOfNodes?: { [key: string] : $N.IBaseNode} ) : void;
	createEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: { [key: string] : $N.IBaseNode} ) : void;

	// ADD NODES
	addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration ) : void;
	addNodesAmount(amount: number, config?: NodeDegreeConfiguration ) : void;

	// ADD EDGES
	addUndEdgesPercentage(percentage: number ) : void;
	addDirEdgesPercentage(percentage: number ) : void;
	addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig ) : void;

	// DELETE NODES AND EDGES
	deleteNodesPercentage(percentage: number ) : void;
	deleteUndEdgesPercentage(percentage: number ) : void;
	deleteDirEdgesPercentage(percentage: number ) : void;
	deleteNodesAmount(amount: number ) : void;
	deleteUndEdgesAmount(amount: number ) : void;
	deleteDirEdgesAmount(amount: number ) : void;
}


class SimplePerturber implements ISimplePerturber {

  constructor(private _graph: $G.IGraph) {}

	/**
	 *
	 * @param percentage
	 */
	deleteNodesPercentage(percentage: number ) : void {
		if ( percentage < 0 ) {
			throw new Error('Cowardly refusing to remove a negative amount of nodes');
		}
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage/100);
		this.deleteNodesAmount( nr_nodes_to_delete );
	}


	/**
	 *
	 * @param percentage
	 */
	deleteUndEdgesPercentage(percentage: number ) : void {
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage/100);
		this.deleteUndEdgesAmount( nr_edges_to_delete );
	}


	/**
	 *
	 * @param percentage
	 */
	deleteDirEdgesPercentage(percentage: number ) : void {
		if ( percentage > 100 ) {
			percentage = 100;
		}
		let nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage/100);
		this.deleteDirEdgesAmount( nr_edges_to_delete );
	}


	/**
	 * 
	 */
	deleteNodesAmount(amount: number ) : void {
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
	deleteUndEdgesAmount(amount: number ) : void {
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
	deleteDirEdgesAmount(amount: number ) : void {
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
	addUndEdgesPercentage(percentage: number ) : void {
		let nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage/100);		
		this.addEdgesAmount( nr_und_edges_to_add, {directed: false} );
	}


	/**
	 * 
	 */
	addDirEdgesPercentage(percentage: number ) : void {
		let nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage/100);
		this.addEdgesAmount( nr_dir_edges_to_add, {directed: true} );
	}
	
	
	/**
	 * 
	 * DEFAULT edge direction: UNDIRECTED
	 */
	addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig ) : void {
		if ( amount <= 0 ) {
			throw new Error('Cowardly refusing to add a non-positive amount of edges')
		}

		let node_a : $N.IBaseNode,
				node_b : $N.IBaseNode,
				nodes	 : {[key: string] : $N.IBaseNode};
		
		let direction = ( config && config.directed ) ? config.directed : false,
				dir = direction ? "_d" : "_u";

		// logger.log("DIRECTION of new edges to create: " + direction ? "directed" : "undirected");

		while ( amount > 0 ) {
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
	addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration ) : void {
		if ( percentage < 0 ) {
			throw 'Cowardly refusing to add a negative amount of nodes';
		}
		let nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage/100);
		this.addNodesAmount( nr_nodes_to_add, config );
	}


	/**
	 * If the degree configuration is invalid
	 * (negative or infinite degree amount / percentage)
	 * the nodes will have been created nevertheless
	 *
	 * @todo is this `perturbation` since it is not `random` ?
	 */
	addNodesAmount(amount: number, config?: NodeDegreeConfiguration ) : void {
		if ( amount < 0 ) {
			throw 'Cowardly refusing to add a negative amount of nodes';
		}
		let new_nodes : { [key: string] : $N.IBaseNode } = {};
		
		while ( --amount >= 0 ) {
			let new_node_id = v4();
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
				this.createEdgesSpan(degree, degree, false, new_nodes);
			}
			else if ( ( min_degree = config.min_und_degree) != null 
						&& ( max_degree = config.max_und_degree ) != null ) {
				this.createEdgesSpan(min_degree, max_degree, false, new_nodes);
			}
			// Ignore min / max directed degree if specific amount is given
			if ( degree = config.dir_degree ) {			
				this.createEdgesSpan(degree, degree, true, new_nodes);
			}
			else if ( ( min_degree = config.min_dir_degree) != null 
						&& ( max_degree = config.max_dir_degree ) != null ) {
				this.createEdgesSpan(min_degree, max_degree, true, new_nodes);
			}
		}
		else {
			if ( config.probability_dir != null ) {
				this.createEdgesProb( config.probability_dir, true, new_nodes );
			}
			if ( config.probability_und != null ) {
				this.createEdgesProb( config.probability_und, false, new_nodes );
			}
		}
	}


	/**
	 * Simple edge generator:
	 * Go through all node combinations, and
	 * add an (un)directed edge with 
	 * @param probability and
	 * @param directed true or false
	 * @param new_nodes set of nodes that were added
	 * CAUTION: this algorithm takes quadratic runtime in #nodes
	 */
	createEdgesProb(probability: number, directed?: boolean,
									new_nodes?: { [key: string] : $N.IBaseNode} ) : void {
		if (0 > probability || 1 < probability) {
			throw new Error("Probability out of range.");
		}
		directed = directed || false;
		new_nodes = new_nodes || this._graph.getNodes();
		let
			all_nodes = this._graph.getNodes(),
				node_a, 
				node_b,
				edge_id,
				dir = directed ? '_d' : '_u';

		for (node_a in new_nodes) {
			for (node_b in all_nodes) {
				if (node_a !== node_b && Math.random() <= probability) {
					edge_id = all_nodes[node_a].getID() + "_" + all_nodes[node_b].getID() + dir;
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
	createEdgesSpan(min: number, max: number, directed?: boolean,
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
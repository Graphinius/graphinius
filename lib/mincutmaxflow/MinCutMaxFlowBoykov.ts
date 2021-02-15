import * as $N from '@/core/base/BaseNode';
import * as $E from '@/core/base/BaseEdge';
import * as $G from '@/core/base/BaseGraph';
import { Logger } from '@/utils/Logger';
// const logger = new Logger();


export interface MCMFConfig {
	directed: boolean; // do we
}


export interface MCMFResult {
  edges : Array<$E.IBaseEdge>;
	edgeIDs: Array<string>;
  cost  : number;
}


export interface IMCMFBoykov {
  calculateCycle() : MCMFResult;
	convertToDirectedGraph(graph : $G.IGraph) : $G.IGraph;
  prepareMCMFStandardConfig() : MCMFConfig;
}


export interface MCMFState {
	residGraph	: $G.IGraph;
  activeNodes : {[key:string] : $N.IBaseNode};
  orphans     : {[key:string] : $N.IBaseNode};
  treeS       : {[key:string] : $N.IBaseNode};
  treeT       : {[key:string] : $N.IBaseNode};
	parents			: {[key:string] : $N.IBaseNode};
  path        : Array<$N.IBaseNode>;
	tree 				: {[key:string] : string};
}


class MCMFBoykov implements IMCMFBoykov {

  private _config : MCMFConfig;
  private _state  : MCMFState = {
		residGraph 	: null,
    activeNodes : {},
    orphans     : {},
    treeS       : {},
    treeT       : {},
		parents			: {},
    path        : [],
		tree 				: {}
		// undGraph 		: null
  };

  constructor( private _graph 	 : $G.IGraph,
						   private _source	 : $N.IBaseNode,
               private _sink     : $N.IBaseNode,
						   config?           : MCMFConfig )
  {
     this._config = config || this.prepareMCMFStandardConfig();

		 if (this._config.directed) {
		     this.renameEdges(_graph);
		 }

		 this._state.residGraph = this._graph;
		 if (!this._config.directed) {
		    // convert the undirected graph to a directed one
				this._state.residGraph = this.convertToDirectedGraph(this._state.residGraph);
				// update source and sink
				this._source = this._state.residGraph.getNodeById(this._source.getID());
				this._sink = this._state.residGraph.getNodeById(this._sink.getID());

		 }
  }


  calculateCycle() {
		const result: MCMFResult = {
			edges: [],
			edgeIDs: [],
			cost: 0
		};

		// init
		this._state.treeS[this._source.getID()] = this._source;
		this._state.tree[this._source.getID()] = "S";
		this._state.treeT[this._sink.getID()] = this._sink;
		this._state.tree[this._sink.getID()] = "T";
		this._state.activeNodes[this._source.getID()] = this._source;
		this._state.activeNodes[this._sink.getID()] = this._sink;

		let nrCycles = 0;

		while(true) {
			// logger.log("grow");
			this.grow();

			if (!this._state.path.length) {
			    break;
			}
			// logger.log("augment");
			this.augmentation();
			// logger.log("adopt");
			this.adoption();
			++nrCycles;
			// logger.log(nrCycles);
		}

		// compute the cut edges and the total cost of the cut
		// let tree_ids = Object.keys(this._state.tree);
		// let tree_length = tree_ids.length;
		// let size_S = 0;
		// for (let i = 0; i < tree_length; i++) {
		//     if (this._state.tree[tree_ids[i]] == "S") {
		//         ++size_S;
		//     }
		// }

		/**
		 * computing result
		 */
		const smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
		const smallTree_size: number = Object.keys(smallTree).length;
		const smallTree_ids: Array<string> = Object.keys(smallTree);
		for (let i = 0; i < smallTree_size; i++) {
		    // let node_id: string = smallTree[Object.keys(smallTree)[i]].getID();
			const node_id: string = smallTree_ids[i];
			const node: $N.IBaseNode = this._graph.getNodeById(node_id);

			// if undirected
				if (!this._config.directed) {
					const undEdges: { [keys: string]: $E.IBaseEdge } = node.undEdges();
					const undEdges_size: number = Object.keys(undEdges).length;
					const undEdges_ids: Array<string> = Object.keys(undEdges);
					for (let i = 0; i < undEdges_size; i++) {
						    // let edge: $E.IBaseEdge = undEdges[Object.keys(undEdges)[i]];
								let edge: $E.IBaseEdge = undEdges[undEdges_ids[i]];
								let neighbor: $N.IBaseNode = (edge.getNodes().a.getID() == node.getID()) ? edge.getNodes().b : edge.getNodes().a;
								// if (this.tree(neighbor) != this.tree(node)) {
								if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
								    // we found a an edge which is part of the Cut
										result.edges.push(edge);
										result.edgeIDs.push(edge.getID());
										result.cost += edge.getWeight();
								}
						}
				}
				else {
					/*TODO refactor! object.keys is fucking slow... see above!
					*/
					/* if directed
						*/
					const outEdges_ids: Array<string> = Object.keys(node.outEdges());
					const outEdges_length: number = outEdges_ids.length;
					const inEdges_ids: Array<string> = Object.keys(node.inEdges());
					const inEdges_length: number = inEdges_ids.length;

					// check outEdges
					for (let i = 0; i < outEdges_length; i++) {
					    // let edge: $E.IBaseEdge = outEdges[Object.keys(outEdges)[i]];
							let edge: $E.IBaseEdge = this._graph.getEdgeById(outEdges_ids[i]);
							let neighbor: $N.IBaseNode = edge.getNodes().b;
							// if (this.tree(neighbor) != this.tree(node)) {
							if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
							    // we found a an edge which is part of the Cut
									result.edges.push(edge);
									result.edgeIDs.push(edge.getID());
									result.cost += edge.getWeight();
							}
					}
					// check inEdges
					for (let i = 0; i < inEdges_length; i++) {
					    // let edge: $E.IBaseEdge = inEdges[Object.keys(inEdges)[i]];
							let edge: $E.IBaseEdge = this._graph.getEdgeById(inEdges_ids[i]);
							let neighbor: $N.IBaseNode = edge.getNodes().a;
							if (this.tree(neighbor) != this.tree(node)) {
							    // we found a an edge which is part of the Cut
									result.edges.push(edge);
									result.edgeIDs.push(edge.getID());
									result.cost += edge.getWeight();
							}
					}
				}
		}
		//logger.log(result.edges);
		// logger.log("Cost => " +result.cost);
		// logger.log("# cycles => " + nrCycles);
		// logger.log(result.edges);

    return result;
  }

	renameEdges(graph: $G.IGraph) {
		const edges = graph.getDirEdges();
		const edges_ids: Array<string> = Object.keys(edges);
		const edges_length = edges_ids.length;
		for (let i = 0; i < edges_length; i++) {
			const edge: $E.IBaseEdge = edges[edges_ids[i]];
			const weight: number = edge.getWeight();
			graph.deleteEdge(edge);

			const node_a: $N.IBaseNode = edge.getNodes().a;
			const node_b: $N.IBaseNode = edge.getNodes().b;
			const options = {directed: true, weighted: true, weight: weight};
			const new_edge = graph.addEdgeByID(node_a.getID() + "_" + node_b.getID(), node_a, node_b, options);
		}
	}

	convertToDirectedGraph(uGraph: $G.IGraph) : $G.IGraph {
		const dGraph: $G.IGraph = new $G.BaseGraph(uGraph.label + "_directed");

		// copy all nodes
		const nodes: { [keys: string]: $N.IBaseNode } = uGraph.getNodes();
		const nodes_ids: Array<string> = Object.keys(nodes);
		const nodes_length: number = nodes_ids.length;
		// logger.log("#nodes: " + Object.keys(nodes).length);
		for (let i = 0; i < nodes_length; i++) {
		    // let node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
			const node: $N.IBaseNode = nodes[nodes_ids[i]];
			dGraph.addNodeByID(node.getID());
		}

		// create one in and one out edge for each undirected edge
		const edges: { [keys: string]: $E.IBaseEdge } = uGraph.getUndEdges();
		const edges_ids: Array<string> = Object.keys(edges);
		const edges_length: number = edges_ids.length;
		for (let i = 0; i < edges_length; i++) {
		    // let und_edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
			const und_edge: $E.IBaseEdge = edges[edges_ids[i]];

			const node_a_id: string = und_edge.getNodes().a.getID();
			const node_b_id: string = und_edge.getNodes().b.getID();

			const options: $E.BaseEdgeConfig = {directed: true, weighted: true, weight: und_edge.getWeight()};

			dGraph.addEdgeByID(node_a_id + "_" + node_b_id, dGraph.getNodeById(node_a_id), dGraph.getNodeById(node_b_id), options);
				dGraph.addEdgeByID(node_b_id + "_" + node_a_id, dGraph.getNodeById(node_b_id), dGraph.getNodeById(node_a_id), options);

		}
		// logger.log(dGraph);
		return dGraph;
	}

	tree(node: $N.IBaseNode) {
		let tree: string = "";
		if (node.getID() in this._state.treeS) {
		    tree = "S";
				return tree;
		}
		if (node.getID() in this._state.treeT) {
		    tree = "T";
				return tree;
		}
		return tree;
	}

	getPathToRoot(node: $N.IBaseNode) {
		const path_root: Array<$N.IBaseNode> = [];

		let node_id = node.getID();
		path_root.push(this._graph.getNodeById(node_id));

		const sink_id: string = this._sink.getID();
		const source_id: string = this._source.getID();
		while ((node_id != sink_id) && (node_id != source_id)) {
			if (this._state.parents[node_id] == null) { // this happens when the root of this path is a free node
					return path_root;
			}
			node_id = this._state.parents[node_id].getID();
			path_root.push(this._graph.getNodeById(node_id));
		}

		return path_root;
	}

	getBottleneckCapacity() {
		let min_capacity: number = 0;
		// set first edge weight
		min_capacity = this._state.residGraph.getEdgeById(this._state.path[0].getID() + "_" + this._state.path[1].getID()).getWeight();

		const path_length = this._state.path.length - 1;
		for (let i = 0; i < path_length; i++) {
			const node_a: $N.IBaseNode = this._state.path[i];
			const node_b = this._state.path[i + 1];

			// let edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
			const edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());

			if (edge.getWeight() < min_capacity) {
			    min_capacity = edge.getWeight();
			}
		}
		return min_capacity;
	}

	grow() {
		// as long as there are active nodes
		let nr_active_nodes: number = Object.keys(this._state.activeNodes).length;
		const active_nodes_ids: Array<string> = Object.keys(this._state.activeNodes);

		while (nr_active_nodes) {
			// take an active node
			// let activeNode: $N.IBaseNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
			const activeNode: $N.IBaseNode = this._state.activeNodes[active_nodes_ids[0]];
			// let edges: {[k: string] : $E.IBaseEdge} = (this.tree(activeNode) == "S") ? activeNode.outEdges() : activeNode.inEdges();
			const edges: { [k: string]: $E.IBaseEdge } = (this._state.tree[activeNode.getID()] == "S") ? activeNode.outEdges() : activeNode.inEdges();
			const edges_ids: Array<string> = Object.keys(edges);
			const edges_length: number = edges_ids.length;
			// for all neighbors
			for (let i = 0; i < edges_length; i++) {
					// let edge: $E.IBaseEdge = edges[(Object.keys(edges)[i])];
				const edge: $E.IBaseEdge = edges[edges_ids[i]];
				const neighborNode: $N.IBaseNode = (this._state.tree[activeNode.getID()] == "S") ? edge.getNodes().b : edge.getNodes().a;

				if (edge.getWeight() <= 0) {
						continue;
					}
					if (!(this._state.tree[neighborNode.getID()])) {
						// add neighbor to corresponding tree
						if (this._state.tree[activeNode.getID()] == "S") {
						    this._state.treeS[neighborNode.getID()] = neighborNode;
								this._state.tree[neighborNode.getID()] = "S";
						}
						else {
							this._state.treeT[neighborNode.getID()] = neighborNode;
							this._state.tree[neighborNode.getID()] = "T";
						}
						// set active node as parent to neighbor node
						this._state.parents[neighborNode.getID()] = activeNode;
						// add neighbor to active node set
						this._state.activeNodes[neighborNode.getID()] = neighborNode;
						active_nodes_ids.push(neighborNode.getID());
						++nr_active_nodes;
					}
					else if(this._state.tree[neighborNode.getID()] != this._state.tree[activeNode.getID()]) {
						// constructing path
						let complete_path: Array<$N.IBaseNode>;

						let nPath: Array<$N.IBaseNode> = this.getPathToRoot(neighborNode);
						let aPath: Array<$N.IBaseNode> = this.getPathToRoot(activeNode);

						const root_node_npath: $N.IBaseNode = nPath[nPath.length - 1];
						if (this._state.tree[root_node_npath.getID()] == "S") {
						    nPath = nPath.reverse();
								complete_path = nPath.concat(aPath);
						}
						else {
							aPath = aPath.reverse();
							complete_path = aPath.concat(nPath);
						}

						this._state.path = complete_path;
						// return; this._state.path;
						return;
					}
			}
			delete this._state.activeNodes[activeNode.getID()];
			active_nodes_ids.shift();
			--nr_active_nodes;
		}
		this._state.path = [];
		return; //empty path
	}


	augmentation() {
		const min_capacity = this.getBottleneckCapacity();
		for (let i = 0; i < this._state.path.length - 1; i++) {
			const node_a = this._state.path[i], node_b = this._state.path[i + 1];
			// let edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
			let edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
			// let reverse_edge = this._state.residGraph.getEdgeByNodeIDs(node_b.getID(), node_a.getID());
			const reverse_edge = this._state.residGraph.getEdgeById(node_b.getID() + "_" + node_a.getID());

			// update the residual capacity in the graph
				this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
				this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
				// for all saturated edges
				edge = this._state.residGraph.getEdgeById(edge.getID());
				if (!edge.getWeight()) {
				    if (this._state.tree[node_a.getID()] == this._state.tree[node_b.getID()]) {
				        if (this._state.tree[node_b.getID()] == "S") {
				            delete this._state.parents[node_b.getID()];
										this._state.orphans[node_b.getID()] = node_b;
				        }
								if (this._state.tree[node_a.getID()] == "T") {
				            delete this._state.parents[node_a.getID()];
										this._state.orphans[node_a.getID()] = node_a;
				        }
				    }
				}
		}
	}

	adoption() {
		const orphans_ids = Object.keys(this._state.orphans);
		let orphans_size = orphans_ids.length;
		while (orphans_size) {
		    // let orphan: $N.IBaseNode = this._state.orphans[Object.keys(this._state.orphans)[0]];
			const orphan: $N.IBaseNode = this._state.orphans[orphans_ids[0]];
			delete this._state.orphans[orphan.getID()];
				orphans_ids.shift();
				--orphans_size;
				// try to find a new valid parent for the orphan
			const edges: { [k: string]: $E.IBaseEdge } = (this._state.tree[orphan.getID()] == "S") ? orphan.inEdges() : orphan.outEdges();
			const edge_ids: Array<string> = Object.keys(edges);
			const edge_length: number = edge_ids.length;

			let found = false;
			for (let i = 0; i < edge_length; i++) {
						// let edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
						let edge: $E.IBaseEdge = edges[edge_ids[i]];
				    let neighbor: $N.IBaseNode = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;

						// check for same tree and weight > 0
						if ((this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) && edge.getWeight()) {
							const neighbor_root_path: Array<$N.IBaseNode> = this.getPathToRoot(neighbor);
							const neighbor_root: $N.IBaseNode = neighbor_root_path[neighbor_root_path.length - 1];
							// check for root either source or sink
								if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
									// we found a valid parent
									this._state.parents[orphan.getID()] = neighbor;
									found = true;
									break;
								}
						}
				}
				if (found) {
				    continue;
				}

				// let edge_ids: Array<string> = Object.keys(edges);
				// let edge_length: number = edge_ids.length;
				// we could not find a valid parent
				for (let i = 0; i < edge_length; i++) {
					// let edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
					let edge: $E.IBaseEdge = edges[edge_ids[i]];
					let neighbor: $N.IBaseNode = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
					if (this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) {
						// set neighbor active
						if (edge.getWeight()) {
						    this._state.activeNodes[neighbor.getID()] = neighbor;
						}
						if (this._state.parents[neighbor.getID()] == null) {
						    continue;
						}
						// set neighbor to orphan if his parent is the current orphan
						if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
								this._state.orphans[neighbor.getID()] = neighbor;
								orphans_ids.push(neighbor.getID());
								++orphans_size;
								delete this._state.parents[neighbor.getID()];
						}
					}
				}

				// remove from current tree and from activeNodes
			const orphan_tree = this._state.tree[orphan.getID()];
			if (orphan_tree == "S") {
				    delete this._state.treeS[orphan.getID()];
						delete this._state.tree[orphan.getID()];
				}
				else if(orphan_tree == "T") {
					delete this._state.treeT[orphan.getID()];
					delete this._state.tree[orphan.getID()];
				}
				delete this._state.activeNodes[orphan.getID()];

		}
	}

  prepareMCMFStandardConfig() : MCMFConfig {
    return {
      directed: true
    }
  }

}


export {
  MCMFBoykov
};

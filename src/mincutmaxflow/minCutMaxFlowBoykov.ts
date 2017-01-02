/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';


export interface MCMFConfig {
	directed: boolean; // do we
}


export interface MCMFResult {
  edges : Array<$E.IBaseEdge>;
  cost  : number;
}


export interface IMCMFBoykov {
  calculateCycle() : MCMFResult;

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
}



/**
 *
 */
class MCMFBoykov implements IMCMFBoykov {

  private _config : MCMFConfig;
  private _state  : MCMFState = {
		residGraph 	: null,
    activeNodes : {},
    orphans     : {},
    treeS       : {},
    treeT       : {},
		parents			: {},
    path        : []
  };

  constructor( private _graph 	 : $G.IGraph,
						   private _source	 : $N.IBaseNode,
               private _sink     : $N.IBaseNode,
						   config?           : MCMFConfig )
  {
     this._config = config || this.prepareMCMFStandardConfig();
		 this._state.residGraph = _graph;
  }


  calculateCycle() {
    var result: MCMFResult = {
      edges: [],
      cost: 0
    }

		// init
		this._state.treeS[this._source.getID()] = this._source;
		this._state.treeT[this._sink.getID()] = this._sink;
		this._state.activeNodes[this._source.getID()] = this._source;
		this._state.activeNodes[this._sink.getID()] = this._sink;

var count = 0;
		// start
		while(true) {
			var path = this.grow();

			if (!path.length) {
				console.log("DONE");
			    break;
			}
			//this.printState();
			this.augmentation();
			this.adoption();
			++count;
		}

		this.printState(1);
		console.log("# cycles => " + count);
		// this.grow();

    return result;
  }

	printState(print_path: number) {
		var treeS = [];
		for (let i = 0; i < Object.keys(this._state.treeS).length; i++) {
		    treeS.push(Object.keys(this._state.treeS)[i]);
		}
		var treeT = [];
		for (let i = 0; i < Object.keys(this._state.treeT).length; i++) {
		    treeT.push(Object.keys(this._state.treeT)[i]);
		}
		var activeNodes = [];
		for (let i = 0; i < Object.keys(this._state.activeNodes).length; i++) {
		    activeNodes.push(Object.keys(this._state.activeNodes)[i]);
		}
		var orphans = [];
		for (let i = 0; i < Object.keys(this._state.orphans).length; i++) {
		    orphans.push(Object.keys(this._state.orphans)[i]);
		}
		console.log("==========");
		console.log("S => " + treeS);
		console.log("T => " + treeT);
		console.log("A => " + activeNodes);
		console.log("O => " + orphans);
		var p_b = (this._state.parents["B"] == null) ? "/" : this._state.parents["B"].getID();
		var p_c = (this._state.parents["C"] == null) ? "/" : this._state.parents["C"].getID();
		var p_d = (this._state.parents["D"] == null) ? "/" : this._state.parents["D"].getID();
		var p_e = (this._state.parents["E"] == null) ? "/" : this._state.parents["E"].getID();
		console.log("P_B => " + p_b);
		console.log("P_C => " + p_c);
		console.log("P_D => " + p_d);
		console.log("P_E => " + p_e);
		if (print_path) {
			var path = [];
			for (let i = 0; i < this._state.path.length; i++) {
			    path.push(this._state.path[i].getID());
			}
		    console.log("Path => " + path);
		}
		console.log("==========");
	}

	tree(node: $N.IBaseNode) {
		var tree: string = "";
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
		var path: Array<$N.IBaseNode> = [];

		var node_id = node.getID();
		path.push(this._graph.getNodeById(node_id));

		while ((node_id != this._sink.getID()) && (node_id != this._source.getID())) {
			node_id = this._state.parents[node_id].getID();
			path.push(this._graph.getNodeById(node_id));
		}

		return path;
	}

	getBottleneckCapacity(path: Array<$N.IBaseNode>) {
		var min_capacity: number = 0;

		for (let i = 0; i < path.length - 1; i++) {
			var node_a: $N.IBaseNode = path[i];
			var node_b = path[i+1];

		  var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
		console.log(edge.getWeight());
			if (!i) {
			    min_capacity = edge.getWeight();
					continue;
			}

			if (edge.getWeight() < min_capacity) {
			    min_capacity = edge.getWeight();
			}
		}
		return min_capacity;
	}

	grow() {
		// as long as there are active nodes
		console.log("///// GROW /////");
		while (Object.keys(this._state.activeNodes).length) {
			this.printState(0);
			// take an active node
			var activeNode: $N.IBaseNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
			console.log("processing => " + activeNode.getID());
			// get all his neighbors
			var edges: {[k: string] : $E.IBaseEdge} = (this.tree(activeNode) == "S") ? activeNode.outEdges() : activeNode.inEdges();
			// for all neighbors
			for (let i = 0; i < Object.keys(edges).length; i++) {
			    // var neighborNode: $N.IBaseNode = neighbors[i].node;

					var edge: $E.IBaseEdge = edges[(Object.keys(edges)[i])];
					var neighborNode: $N.IBaseNode = (this.tree(activeNode) == "S") ? edge.getNodes().b : edge.getNodes().a;

					// var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(activeNode.getID(), neighborNode.getID());
					if (edge.getWeight() <= 0) {
						continue;
					}
					if (this.tree(neighborNode) == "") {
						// add neighbor to corresponding tree
						(this.tree(activeNode) == "S") ? this._state.treeS[neighborNode.getID()] = neighborNode : this._state.treeT[neighborNode.getID()] = neighborNode;
						// set active node as parent to neighbor node
						this._state.parents[neighborNode.getID()] = activeNode;
						// add neighbor to active node set
						this._state.activeNodes[neighborNode.getID()] = neighborNode;
					}
					else if(this.tree(neighborNode) != this.tree(activeNode)) {
						// constructing path
						var path: Array<$N.IBaseNode>;

						var nPath: Array<$N.IBaseNode> = this.getPathToRoot(neighborNode);
						var aPath: Array<$N.IBaseNode> = this.getPathToRoot(activeNode);

						var root_node_npath: $N.IBaseNode = nPath[nPath.length-1];
						if (this.tree(root_node_npath) == "S") {
						    nPath = nPath.reverse();
								path = nPath.concat(aPath);
						}
						else {
							aPath = aPath.reverse();
							path = aPath.concat(nPath);
						}

						this._state.path = path;
						return this._state.path;
					}
			}
			delete this._state.activeNodes[activeNode.getID()];
		//	break;
		}
		return []; //empty path
	}


	augmentation() {
		console.log("///// AUGMENT /////");
		var min_capacity = this.getBottleneckCapacity(this._state.path);
		console.log(min_capacity);
		for (let i = 0; i < this._state.path.length - 1; i++) {
		    var node_a = this._state.path[i], node_b = this._state.path[i+1];
				var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
				var reverse_edge = this._state.residGraph.getEdgeByNodeIDs(node_b.getID(), node_a.getID());
				// update the residual capacity in the graph
				// TODO: this shit aint workin on undirected graphs?? think about it..
				this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
				this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
				// for all saturated edges
				edge = this._state.residGraph.getEdgeById(edge.getID());
				if (!edge.getWeight()) {
					console.log("found saturated edge");
				    if (this.tree(node_a) == this.tree(node_b)) {
				        if (this.tree(node_b) == "S") {
				            delete this._state.parents[node_b.getID()];
										this._state.orphans[node_b.getID()] = node_b;
				        }
								if (this.tree(node_a) == "T") {
				            delete this._state.parents[node_a.getID()];
										this._state.orphans[node_a.getID()] = node_a;
				        }
				    }
				}
		}
		this.printState(1);
	}

	adoption() {
		console.log("///// ADOPT /////");
		while (Object.keys(this._state.orphans).length) {
			this.printState(0);
		    var orphan: $N.IBaseNode = this._state.orphans[Object.keys(this._state.orphans)[0]];
				delete this._state.orphans[orphan.getID()];

				// try to find a new valid parent for the orphan
				var edges: {[k: string] : $E.IBaseEdge} = (this.tree(orphan) == "S") ? orphan.inEdges() : orphan.outEdges();
				// var neighbors: Array<$N.NeighborEntry> = orphan.reachNodes();
				console.log(Object.keys(edges).length);
				for (let i = 0; i < Object.keys(edges).length; i++) {
						var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
				    var neighbor: $N.IBaseNode = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
						console.log(neighbor.getID());
						// var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
						if ((this.tree(orphan) == this.tree(neighbor)) && edge.getWeight()) {
						    var neighbor_root_path: Array<$N.IBaseNode> = this.getPathToRoot(neighbor);
								var neighbor_root: $N.IBaseNode = neighbor_root_path[neighbor_root_path.length -1];
								if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
									// we found a valid parent
									this._state.parents[orphan.getID()] = orphan;
									return;
								}
						}
				}

				// we could not find a valid parent
				for (let i = 0; i < Object.keys(edges).length; i++) {
					var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
					var neighbor: $N.IBaseNode = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
					if (this.tree(orphan) == this.tree(neighbor)) {
						// var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
						if (edge.getWeight()) {
						    this._state.activeNodes[neighbor.getID()] = neighbor;
						}
						// var parent: $N.IBaseNode = this._state.parents[neighbor.getID()];
						if (this._state.parents[neighbor.getID()] == null) {
						    continue;
						}
						if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
								this._state.orphans[neighbor.getID()] = neighbor;
								delete this._state.parents[neighbor.getID()];
						}
					}
				}

				// remove from current tree and from activeNodes
				var orphan_tree = this.tree(orphan);
				if (orphan_tree == "S") {
				    delete this._state.treeS[orphan.getID()];
				}
				else if(orphan_tree == "T") {
					delete this._state.treeT[orphan.getID()];
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

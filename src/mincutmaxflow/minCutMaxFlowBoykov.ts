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
  path        : Array<$N.IBaseNode>
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


    return result;
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
		var path: Array<$N.IBaseNode>;
		path.push(node);
		while (this._state.parents[node.getID()]) {
			node = this._state.parents[node.getID()];
			path.push(this._state.parents[node.getID()]);
		}
		return path;
	}

	getBottleneckCapacity(path: Array<$N.IBaseNode>) {
		var min_capacity: number = 0;

		for (let i = 0; i < path.length - 1; i++) {
			var node_a = path[i], node_b = path[i+1];
		  var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
			if (edge.getWeight() < min_capacity) {
			    min_capacity = edge.getWeight();
			}
		}
		return min_capacity;
	}

	grow() {
		// as long as there are active nodes
		while (Object.keys(this._state.activeNodes).length) {
			// take an active node
			var activeNode: $N.IBaseNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
			// get all his neighbors
			var neighbors: Array<$N.NeighborEntry> = activeNode.reachNodes();
			// for all neighbors
			for (let i = 0; i < neighbors.length; i++) {
			    var neighborNode: $N.IBaseNode = neighbors[i].node;
					var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(activeNode.getID(), neighborNode.getID());
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
		}
		return []; //empty path
	}


	augmentation() {
		var min_capacity = this.getBottleneckCapacity(this._state.path);
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
	}

	adoption() {
		while (Object.keys(this._state.orphans).length) {
		    var orphan: $N.IBaseNode = this._state.orphans[Object.keys(this._state.orphans)[0]];
				delete this._state.orphans[orphan.getID()];

				// try to find a new valid parent for the orphan
				var neighbors: Array<$N.NeighborEntry> = orphan.reachNodes();
				for (let i = 0; i < neighbors.length; i++) {
				    var neighbor: $N.IBaseNode = neighbors[i].node;
						var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
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
				for (let i = 0; i < neighbors.length; i++) {
					var neighbor: $N.IBaseNode = neighbors[i].node;
					if (this.tree(orphan) == this.tree(neighbor)) {
						var edge: $E.IBaseEdge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
						if (edge.getWeight()) {
						    this._state.activeNodes[neighbor.getID()] = neighbor;
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

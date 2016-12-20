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



  prepareMCMFStandardConfig() : MCMFConfig {
    return {
      directed: true
    }
  }

}


export {
  MCMFBoykov
};

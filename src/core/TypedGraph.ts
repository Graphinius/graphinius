import { BaseNode, IBaseNode } from './BaseNode';
import { BaseGraph, GraphMode, IGraph } from './BaseGraph';

export const GENERIC_TYPE = "generic";

export type NodeTypes = {[key: string] : boolean};
export type TypedNodes = {[key: string] : Map<string, IBaseNode>};



export class TypedGraph extends BaseGraph {

	// protected _nodeTypes 	: NodeTypes = {
	// 	"generic": true
	// };
	protected _typedNodes : TypedNodes = {
		"generic" : new Map()
	};


	constructor(public _label) {
		super(_label);
	}


	getRegisteredTypes() : string[] {
		return Object.keys(this._typedNodes);
	}


	getNumberOfTypedNodes(type: string) : number | null {
		return this._typedNodes[type] ? this._typedNodes[type].size : null;
	}


	addNode(node: IBaseNode) : boolean {
		if ( this.hasNodeID( node.getID() ) ) {
			throw new Error("Won't add node with duplicate ID.");
		}

		const id = node.getID(),
					label = node.getLabel();

		this._nodes[id] = node;
		this._nr_nodes += 1;

		/**
		 *  Untyped nodes will be treated as `generic` type
		 *
		 *  @todo make sure node IDs don't match labels
		 *  			if you don't want that behavior
		 */
		if ( id === label ) {
			this._typedNodes[GENERIC_TYPE].set(id, node);
		}
		else {
			if ( !this._typedNodes[label] ) {
				this._typedNodes[label] = new Map();
			}
			this._typedNodes[label].set(id, node);
		}
		return true;
	}

}


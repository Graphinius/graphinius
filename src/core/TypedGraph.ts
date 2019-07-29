import { IBaseNode } from './BaseNode';
import { IBaseEdge } from './BaseEdge';
import { BaseGraph, GraphMode, IGraph } from './BaseGraph';

export const GENERIC_TYPE = "GENERIC";

export type TypedNodes = Map<string, Map<string, IBaseNode>>;
export type TypedEdges = Map<string, Map<string, IBaseEdge>>;


/**
 * @description in the typedGraph setting, we use the label as type
 * @todo introduce extra type property
 * @description coding standard: following Neo4j / Cypher standard,
 * node types should be in capital letters & edge types expressive
 * two-pieces separated by underscore (except 'GENERIC')
 * @todo enforce uppercase?
 * @description we could couple edge type & direction in order to
 * make the system more stringent, but this would result in a more
 * complex setup with the possibility of too many Errors thrown.
 * @solution for now, leave the type / direction combination to the
 * programmer & just assume internal consistency
 * @todo how to handle traversal when direction given goes against
 * 			 direction information in the edge object ?
 * @todo just don't specify direction in traversal / expand and only
 * 			 follow the direction specified in edge !?
 * @todo in the last case, how to handle undirected edges ?
 * @todo allow 'GENERIC' edge types ?
 */
export class TypedGraph extends BaseGraph {

	/**
	 * We don't need an extra array of registered types, since an
	 * acceptable recommendation graph will only contain a few single
	 * up to a few dozen different types, which are quickly obtained
	 * via Object.keys()
	 */
	protected _typedNodes : TypedNodes = new Map();
	protected _typedEdges : TypedEdges = new Map();


	constructor(public _label) {
		super(_label);
		this._typedNodes.set(GENERIC_TYPE, new Map());
		this._typedEdges.set(GENERIC_TYPE, new Map());
	}


	nodeTypes() : string[] {
		return Array.from(this._typedNodes.keys());
	}


	edgeTypes() : string[] {
		return Array.from(this._typedEdges.keys());
	}


	nrTypedNodes(type: string) : number | null {
		type = type.toUpperCase();
		return this._typedNodes.get(type) ? this._typedNodes.get(type).size : null;
	}


	nrTypedEdges(type: string) : number | null {
		type = type.toUpperCase();
		return this._typedEdges.get(type) ? this._typedEdges.get(type).size : null;
	}


	addNode(node: IBaseNode) : boolean {
		if ( !super.addNode(node) ) {
			return false;
		}

		const id = node.getID(),
					label = node.getLabel().toUpperCase();

		/**
		 *  Untyped nodes will be treated as `generic` type
		 *
		 *  @todo make sure node IDs don't match labels
		 *  			if you don't want that behavior
		 */
		if ( id === label ) {
			this._typedNodes.get(GENERIC_TYPE).set(id, node);
		}
		else {
			if ( !this._typedNodes.get(label) ) {
				this._typedNodes.set(label, new Map());
			}
			this._typedNodes.get(label).set(id, node);
		}
		return true;
	}


	deleteNode(node: IBaseNode): void {
		super.deleteNode(node);

		/**
		 *  Here we already know that the node was added before
		 *  and must therefore be in one of our typed sets
		 *  If not, something strange is happening and we throw an Error
		 */
		const id = node.getID(),
					label = node.getLabel() === id ? GENERIC_TYPE : node.getLabel().toUpperCase();

		const removeNode = this._typedNodes.get(label).get(id);
		if ( !removeNode ) {
			throw Error('Successfully removed node is nowhere to be found in _typedNodes... Nosebleed...')
		}
		this._typedNodes.get(label).delete(id);
		if ( this.nrTypedNodes(label) === 0 ) {
			this._typedNodes.delete(label);
		}
	}


	addEdge(edge: IBaseEdge) : boolean {
		if ( !super.addEdge(edge) ) {
			return false;
		}

		const id = edge.getID(),
			label = edge.getLabel().toUpperCase();

		/**
		 *  Same procedure as every node...
		 */
		if ( id === label ) {
			this._typedEdges.get(GENERIC_TYPE).set(id, edge);
		}
		else {
			if ( !this._typedEdges.get(label) ) {
				this._typedEdges.set(label, new Map());
			}
			this._typedEdges.get(label).set(id, edge);
		}
		return true;
	}


	deleteEdge(edge: IBaseEdge): void {
		super.deleteEdge(edge);

		const id = edge.getID(),
			label = edge.getLabel() === id ? GENERIC_TYPE : edge.getLabel().toUpperCase();

		const removeEdge = this._typedEdges.get(label).get(id);
		if ( !removeEdge ) {
			throw Error('Successfully removed node is nowhere to be found in _typedNodes... Nosebleed...')
		}
		this._typedEdges.get(label).delete(id);
		if ( this.nrTypedEdges(label) === 0 ) {
			this._typedEdges.delete(label);
		}
	}


}

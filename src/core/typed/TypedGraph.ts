import {ITypedNode, TypedNode} from './TypedNode';
import {ITypedEdge, TypedEdge, TypedEdgeConfig} from "./TypedEdge";
import {BaseEdge, IBaseEdge} from "../base/BaseEdge";
import {BaseGraph, GraphMode, GraphStats} from '../base/BaseGraph';
import {GENERIC_TYPES} from "../../config/run_config";

import {Logger} from '../../utils/Logger';
import {BaseNode} from "../base/BaseNode";

const logger = new Logger();


export type TypedNodes = Map<string, Map<string, ITypedNode>>;
export type TypedEdges = Map<string, Map<string, ITypedEdge>>;

export interface TypedGraphStats extends GraphStats {
	// node_types: string[];
	// edge_types: string[];
	typed_nodes: { [key: string]: number };
	typed_edges: { [key: string]: number };
}

/**
 * @description TypedGraph only takes TypedNodes & TypedEdges
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
 *       direction information in the edge object ?
 * @todo just don't specify direction in traversal / expand and only
 *       follow the direction specified in edge !?
 * @todo in the last case, how to handle undirected edges ?
 * @todo allow 'GENERIC' edge types ? => yes!
 */
export class TypedGraph extends BaseGraph {
	protected _type: string;

	/**
	 * We don't need an extra array of registered types, since an
	 * acceptable recommendation graph will only contain a few single
	 * up to a few dozen different types, which are quickly obtained
	 * via Object.keys()
	 */
	protected _typedNodes: TypedNodes = new Map();
	protected _typedEdges: TypedEdges = new Map();


	constructor(public _label: string) {
		super(_label);
		this._type = GENERIC_TYPES.Graph;
		this._typedNodes.set(GENERIC_TYPES.Node, new Map());
		this._typedEdges.set(GENERIC_TYPES.Edge, new Map());
	}


	get type(): string {
		return this._type;
	}


	nodeTypes(): string[] {
		return Array.from(this._typedNodes.keys());
	}


	edgeTypes(): string[] {
		return Array.from(this._typedEdges.keys());
	}


	nrTypedNodes(type: string): number | null {
		type = type.toUpperCase();
		return this._typedNodes.get(type) ? this._typedNodes.get(type).size : null;
	}


	nrTypedEdges(type: string): number | null {
		type = type.toUpperCase();
		return this._typedEdges.get(type) ? this._typedEdges.get(type).size : null;
	}


	/**
	 * @todo copied from super ??
	 * @param id
	 * @param opts
	 */
	addNodeByID(id: string, opts?: {}): ITypedNode {
		if (this.hasNodeID(id)) {
			throw new Error("Won't add node with duplicate ID.");
		}
		let node = new TypedNode(id, opts);
		return this.addNode(node) ? node : null;
	}


	addNode(node: ITypedNode): ITypedNode {
		if (!super.addNode(node)) {
			return null;
		}
		// logger.log(JSON.stringify(node));

		const id = node.getID(),
			type = node.type ? node.type.toUpperCase() : null;

		/**
		 *  Untyped nodes will be treated as `generic` type
		 */
		if (!type) {
			// logger.log(`Received node type: ${type}`);

			this._typedNodes.get(GENERIC_TYPES.Node).set(id, node);
		} else {
			if (!this._typedNodes.get(type)) {
				this._typedNodes.set(type, new Map());
			}
			this._typedNodes.get(type).set(id, node);
		}
		return node;
	}


	deleteNode(node: ITypedNode): void {
		const id = node.getID(),
			type = node.type ? node.type.toUpperCase() : GENERIC_TYPES.Node;

		if (!this._typedNodes.get(type)) {
			throw Error('Node type does not exist on this TypedGraph.');
		}
		const removeNode = this._typedNodes.get(type).get(id);
		if (!removeNode) {
			throw Error('This particular node is nowhere to be found in its typed set.')
		}
		this._typedNodes.get(type).delete(id);
		if (this.nrTypedNodes(type) === 0) {
			this._typedNodes.delete(type);
		}

		super.deleteNode(node);
	}


	addEdgeByID(id: string, a: ITypedNode, b: ITypedNode, opts?: TypedEdgeConfig): ITypedEdge {
		let edge = new TypedEdge(id, a, b, opts || {});
		return this.addEdge(edge);
	}


	addEdge(edge: ITypedEdge | IBaseEdge): ITypedEdge {
		if (!super.addEdge(edge)) {
			return null;
		}

		const id = edge.getID();
		let type = GENERIC_TYPES.Edge;
		if (BaseEdge.isTyped(edge) && edge.type) {
			type = edge.type.toUpperCase();
		}

		// logger.log('Got edge label: ' + edge.label);
		// logger.log('Got edge type: ' + type);

		/**
		 *  Same procedure as every node...
		 */
		if (id === type) {
			this._typedEdges.get(GENERIC_TYPES.Edge).set(id, edge as ITypedEdge);
		} else {
			if (!this._typedEdges.get(type)) {
				this._typedEdges.set(type, new Map());
			}
			this._typedEdges.get(type).set(id, edge as ITypedEdge);
		}
		return edge as ITypedEdge;
	}


	deleteEdge(edge: ITypedEdge | IBaseEdge): void {
		const id = edge.getID();
		let type = GENERIC_TYPES.Edge;
		if (BaseEdge.isTyped(edge) && edge.type) {
			type = edge.type.toUpperCase();
		}

		if (!this._typedEdges.get(type)) {
			throw Error('Edge type does not exist on this TypedGraph.');
		}
		const removeEdge = this._typedEdges.get(type).get(id);
		if (!removeEdge) {
			throw Error('This particular edge is nowhere to be found in its typed set.')
		}
		this._typedEdges.get(type).delete(id);
		if (this.nrTypedEdges(type) === 0) {
			this._typedEdges.delete(type);
		}

		super.deleteEdge(edge);
	}


	getStats(): TypedGraphStats {
		let typed_nodes = {},
			typed_edges = {};
		this._typedNodes.forEach((k, v) => typed_nodes[v] = k.size);
		this._typedEdges.forEach((k, v) => typed_edges[v] = k.size);
		return {
			...super.getStats(),
			// node_types: this.nodeTypes(),
			// edge_types: this.edgeTypes(),
			typed_nodes,
			typed_edges
		};
	}

}

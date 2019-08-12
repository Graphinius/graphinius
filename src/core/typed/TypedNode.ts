import {IBaseNode, BaseNode, BaseNodeConfig} from '../base/BaseNode';
import {ITypedEdge, TypedEdge} from "./TypedEdge";

import {Logger} from '../../utils/Logger';
const logger = new Logger();

const GENERIC_TYPE = 'GENERIC';


export type NeighborEntries = Set<string>;

export interface TypedAdjListsEntry {
	ins?: NeighborEntries;
	outs?: NeighborEntries;
	conns?: NeighborEntries;
}

export type TypedAdjLists = { [type: string]: TypedAdjListsEntry };


export interface ITypedNode extends IBaseNode {
	readonly type: string;

	uniqueNID(e: ITypedEdge): string;

	addEdge(edge: ITypedEdge): ITypedEdge;

	removeEdge(edge: ITypedEdge): void;

	removeEdgeByID(id: string): void;

	/**
	 * Typed neighbor methods
	 * @param type string identifying the edge type
	 * @todo find better method Names?
	 *   -> restructure also BaseNode names for clarity
	 */
	ins(type: string): NeighborEntries;

	outs(type: string): NeighborEntries;

	conns(type: string): NeighborEntries;
}


export interface TypedNodeConfig extends BaseNodeConfig {
	type?: string;
}


class TypedNode extends BaseNode implements ITypedNode {
	protected _type: string;
	protected _typedAdjSets: TypedAdjLists;

	constructor(protected _id: string, config: TypedNodeConfig = {}) {
		super(_id, config);
		this._type = config.type || GENERIC_TYPE;
		this._typedAdjSets = {
			[GENERIC_TYPE]: {
				ins: new Set<string>(),
				outs: new Set<string>(),
				conns: new Set<string>()
			}
		}
	}

	get type(): string {
		return this._type;
	}


	addEdge(edge: ITypedEdge): ITypedEdge {
		if (!super.addEdge(edge)) {
			return null;
		}
		const type = edge.type || GENERIC_TYPE;
		const dir = edge.isDirected();
		const uid = this.uniqueNID(edge);

		if ( !this._typedAdjSets[type] ) {
			this._typedAdjSets[type] = {}
		}
		if ( !dir ) {
			if ( !this._typedAdjSets[type].conns ) {
				this._typedAdjSets[type].conns = new Set<string>();
			}
			this._typedAdjSets[type].conns.add(uid);
		}
		else if ( edge.getNodes().a === this ) {
			if ( !this._typedAdjSets[type].outs ) {
				this._typedAdjSets[type].outs = new Set<string>();
			}
			this._typedAdjSets[type].outs.add(uid);
		}
		else {
			if ( !this._typedAdjSets[type].ins ) {
				this._typedAdjSets[type].ins = new Set<string>();
			}
			this._typedAdjSets[type].ins.add(uid);
		}

		// logger.log(this._typedAdjSets);
		return edge;
	}

	removeEdge(edge: ITypedEdge): void {

		return super.removeEdge(edge);
	}

	removeEdgeByID(id: string): void {

	}

	ins(type: string): NeighborEntries {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].ins : undefined;
	}

	outs(type: string): NeighborEntries {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].outs : undefined;
	}

	conns(type: string): NeighborEntries {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].conns : undefined;
	}


	/**
	 * Unique ID for Neighbor (traversal)
	 * @param e ITypedEdge
	 * @returns unique neighbor entry ID
	 */
	uniqueNID(e: ITypedEdge): string {
		const conn = e.getNodes();
		const other = conn.a === this ? conn.b : conn.a;
		return `${other.id}#${e.id}#${e.isWeighted() ? 'w' : 'u'}`;
	}
}


export {
	TypedNode
}
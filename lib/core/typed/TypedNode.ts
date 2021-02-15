import {IBaseNode, BaseNode, BaseNodeConfig} from '../base/BaseNode';
import {ITypedEdge, TypedEdge} from "./TypedEdge";
import {GENERIC_TYPES} from "@/config/run_config";


export interface TypedNeighborEntry {
	n: ITypedNode;
	e: string; // edge entry
	w: number; // weight
}

export interface TypedAdjListsEntry {
	ins?: Set<string>;
	outs?: Set<string>;
	conns?: Set<string>;
}

export type TypedAdjSets = { [type: string]: TypedAdjListsEntry };


export interface TypedEdgesStatsEntry {
	ins: number;
	outs: number;
	conns: number;
}

export interface TypedNodeStats {
	typed_edges: { [key: string]: TypedEdgesStatsEntry };
}


export interface ITypedNode extends IBaseNode {
	readonly type: string;

	readonly stats: TypedNodeStats;

	uniqueNID(e: ITypedEdge): string;

	addEdge(edge: ITypedEdge): ITypedEdge;

	removeEdge(edge: ITypedEdge): void;

	// removeEdgeByID(id: string): void;

	/**
	 * Typed neighbor methods
	 * @param type string identifying the edge type
	 * @todo also restructure BaseNode names for clarity?
	 */
	ins(type: string): Set<string>;

	outs(type: string): Set<string>;

	unds(type: string): Set<string>;
}


export interface TypedNodeConfig extends BaseNodeConfig {
	type?: string;
}


class TypedNode extends BaseNode implements ITypedNode {
	protected _type: string;
	protected _typedAdjSets: TypedAdjSets;

	constructor(protected _id: string, config: TypedNodeConfig = {}) {
		super(_id, config);
		this._type = config.type || GENERIC_TYPES.Node;
		this._typedAdjSets = {
			[GENERIC_TYPES.Edge]: {
				ins: new Set<string>(),
				outs: new Set<string>(),
				conns: new Set<string>()
			}
		}
	}


	get type(): string {
		return this._type;
	}


	get stats(): TypedNodeStats {
		const result: TypedNodeStats = {
			typed_edges: {}
		};
		for ( let type of Object.keys(this._typedAdjSets) ) {
			result.typed_edges[type] = {ins: 0, outs: 0, conns: 0};
			result.typed_edges[type].ins = this._typedAdjSets[type].ins ? this._typedAdjSets[type].ins.size : 0;
			result.typed_edges[type].outs = this._typedAdjSets[type].outs ? this._typedAdjSets[type].outs.size : 0;
			result.typed_edges[type].conns = this._typedAdjSets[type].conns ? this._typedAdjSets[type].conns.size : 0;
		}
		return result;
	}


	addEdge(edge: ITypedEdge): ITypedEdge {
		if (!super.addEdge(edge)) {
			return null;
		}
		const type = edge.type || GENERIC_TYPES.Edge;
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


	/**
	 * @description we assume
	 * 							- type is present if super removes edge without throwing
	 * @param edge
	 */
	removeEdge(edge: ITypedEdge): void {
		// Throws when something happens...
		super.removeEdge(edge);

		const type = edge.type || GENERIC_TYPES.Edge;
		const dir = edge.isDirected();
		const uid = this.uniqueNID(edge);

		if ( !dir ) {
			this._typedAdjSets[type].conns.delete(uid);
		}
		else if ( edge.getNodes().a === this ) {
			this._typedAdjSets[type].outs.delete(uid);
		}
		else {
			this._typedAdjSets[type].ins.delete(uid);
		}
		if ( type !== GENERIC_TYPES.Edge && this.noEdgesOfTypeLeft(type) ) {
			delete this._typedAdjSets[type];
		}
	}


	// removeEdgeByID(id: string): void {
	// 	super.removeEdgeByID(id);
	// }


	ins(type: string): Set<string> {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].ins : undefined;
	}


	outs(type: string): Set<string> {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].outs : undefined;
	}


	unds(type: string): Set<string> {
		return this._typedAdjSets[type] ? this._typedAdjSets[type].conns : undefined;
	}


	all(type:string): Set<string> {
		const result = new Set<any>(); // spread operator has a problem with Set<string>...
		if ( this._typedAdjSets[type] ) {
			this._typedAdjSets[type].ins && result.add([...this._typedAdjSets[type].ins]);
			this._typedAdjSets[type].outs && result.add([...this._typedAdjSets[type].outs]);
			this._typedAdjSets[type].conns && result.add([...this._typedAdjSets[type].conns]);
		}
		return result;
	}


	/**
	 * Unique ID for Neighbor (traversal)
	 * @param e ITypedEdge
	 * @description {node} `other / target` node
	 * @returns unique neighbor entry ID
	 */
	uniqueNID(e: ITypedEdge): string {
		const {a, b} = e.getNodes();
		const node = a === this ? b : a;
		let string = `${node.id}#${e.id}#`;
		string += e.isWeighted() ? 'w#' + e.getWeight() : 'u';
		return string;
	}


	static nIDFromUID(uid: string) {
		return uid.split('#')[0];
	}


	private noEdgesOfTypeLeft(type: string): boolean {
		return (!this._typedAdjSets[type].ins || !this._typedAdjSets[type].ins.size)
			&& (!this._typedAdjSets[type].outs || !this._typedAdjSets[type].outs.size)
			&& (!this._typedAdjSets[type].conns || !this._typedAdjSets[type].conns.size);
	}

}


export {
	TypedNode
}

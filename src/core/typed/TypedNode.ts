import {IBaseNode, BaseNode, BaseNodeConfig} from '../base/BaseNode';
import {ITypedEdge, TypedEdge} from "./TypedEdge";

import { Logger } from '../../utils/Logger';
const logger = new Logger();


export type NeighborEntries = Set<string>;

/**
 * @todo use?
 */
export interface typedAdjListEntry {
	type	: string;
	in		: NeighborEntries;
	out		: NeighborEntries;
	und		: NeighborEntries;
}

export interface ITypedNode extends IBaseNode {
	readonly type: string;
	readonly typed: true;

	uniqueNID(e: ITypedEdge) : string;
}


export interface TypedNodeConfig extends BaseNodeConfig {
	type?: string;
}


class TypedNode extends BaseNode implements ITypedNode {
	protected _type : string;

	constructor(protected _id: string, config: TypedNodeConfig = {}) {
		super(_id, config);
		this._type = config.type;
	}

	get type() : string {
		return this._type;
	}

	get typed() : true {
		return true;
	}

	/**
	 * Unique ID for Neighbor (traversal)
	 * @param e ITypedEdge
	 * @returns unique neighbor entry ID
	 */
	uniqueNID(e: ITypedEdge) : string {
		const conn = e.getNodes();
		const other = conn.a === this ? conn.b : conn.a;
		return `${other.id}#${e.id}#${e.isWeighted()?'w':'u'}`;
	}
}


export {
	TypedNode
}
import {IBaseNode, BaseNode, BaseNodeConfig} from './BaseNode';

import { Logger } from '../utils/Logger';
const logger = new Logger();

/**
 * @describe a `typed adjacency list` will allow us to
 * reduce the `expansion` step in a recommender pipeline
 * to a O(1) lookup operation...
 *
 * @todo split UNdirected edges up into in & out ??
 *
 * @todo check for type of node IDs we use ??
 *       -> that would mean we tell
 */
const typedAdjList = {
	FRIENDS_WITH: {
		und: new Set([0, 3]),
		// in: [0, 3],
		// out: [0, 3]
	},
	MEMBER_OF: {
		out: new Set([1, 4])
	},
	LIKED_BY: {
		in: new Set([2, 5])
	}
};


export interface ITypedNode extends IBaseNode {
	readonly type: string;
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

	get type() {
		return this._type;
	}

}


export {
	TypedNode
}
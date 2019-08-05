import { IBaseEdge, BaseEdge, BaseEdgeConfig } from '../base/BaseEdge';

import { Logger } from '../../utils/Logger';
import * as $N from "../base/BaseNode";
const logger = new Logger();


export interface ITypedEdge extends IBaseEdge {
	readonly type: string;

	isTyped(): boolean;
}


export interface TypedEdgeConfig extends BaseEdgeConfig {
	type?: string;
}


class TypedEdge extends BaseEdge implements ITypedEdge {
	protected _type : string;

	constructor(protected _id: string,
							protected _node_a: $N.IBaseNode,
							protected _node_b: $N.IBaseNode,
							config: TypedEdgeConfig = {}) {
		super(_id, _node_a, _node_b, config);
		this._type = config.type;
	}


	get type() {
		return this._type;
	}


	isTyped() : true {
		return true;
	}

}


export {
	TypedEdge
}
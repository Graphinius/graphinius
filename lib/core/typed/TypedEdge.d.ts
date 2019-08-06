import { IBaseEdge, BaseEdge, BaseEdgeConfig } from '../base/BaseEdge';
import * as $N from "../base/BaseNode";
export interface ITypedEdge extends IBaseEdge {
    readonly type: string;
    isTyped(): boolean;
}
export interface TypedEdgeConfig extends BaseEdgeConfig {
    type?: string;
}
declare class TypedEdge extends BaseEdge implements ITypedEdge {
    protected _id: string;
    protected _node_a: $N.IBaseNode;
    protected _node_b: $N.IBaseNode;
    protected _type: string;
    constructor(_id: string, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, config?: TypedEdgeConfig);
    readonly type: string;
    isTyped(): true;
}
export { TypedEdge };

import { IBaseNode, BaseNode, BaseNodeConfig } from '../base/BaseNode';
export interface ITypedNode extends IBaseNode {
    readonly type: string;
}
export interface TypedNodeConfig extends BaseNodeConfig {
    type?: string;
}
declare class TypedNode extends BaseNode implements ITypedNode {
    protected _id: string;
    protected _type: string;
    constructor(_id: string, config?: TypedNodeConfig);
    readonly type: string;
}
export { TypedNode };

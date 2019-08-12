import { IBaseEdge } from '../../core/base/BaseEdge';
import { ITypedEdge } from '../../core/typed/TypedEdge';
import { IBaseNode } from '../../core/base/BaseNode';
import { IGraph } from '../../core/base/BaseGraph';
import { TypedGraph } from '../../core/typed/TypedGraph';
export interface PotentialEdgeInfo {
    a: IBaseNode;
    b: IBaseNode;
    label?: string;
    dir: boolean;
    weighted: boolean;
    weight?: number;
    typed: boolean;
    type?: string;
}
declare class EdgeDupeChecker {
    private _graph;
    constructor(_graph: IGraph | TypedGraph);
    isDupe(e: PotentialEdgeInfo): boolean;
    static typeWeightDupe(e: PotentialEdgeInfo, oe: IBaseEdge): boolean;
    static checkTypeWeightEquality(e: PotentialEdgeInfo, oe: IBaseEdge): boolean;
    potentialEndpoints(e: PotentialEdgeInfo): Set<IBaseEdge | ITypedEdge>;
}
export { EdgeDupeChecker };

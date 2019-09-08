import { ITypedEdge } from '../core/typed/TypedEdge';
import { TypedGraph } from '../core/typed/TypedGraph';
import * as $I from '../similarities/interfaces';
interface SubSetConfig extends $I.SortCutFuncs {
    rtype: string;
    knn?: number;
    cutoff?: number;
}
declare class TheAugments {
    private _g;
    constructor(_g: TypedGraph);
    addSubsetRelationship(algo: Function, sets: $I.SetOfSets, cfg: SubSetConfig): Set<ITypedEdge>;
}
export { TheAugments };

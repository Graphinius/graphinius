import * as $N from '../core/base/BaseNode';
import * as $E from '../core/base/BaseEdge';
import * as $G from '../core/base/BaseGraph';
export interface NodeDegreeConfiguration {
    und_degree?: number;
    dir_degree?: number;
    min_und_degree?: number;
    max_und_degree?: number;
    min_dir_degree?: number;
    max_dir_degree?: number;
    probability_dir?: number;
    probability_und?: number;
}
export interface ISimplePerturber {
    createEdgesProb(probability: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    createEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
    addNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
    addUndEdgesPercentage(percentage: number): void;
    addDirEdgesPercentage(percentage: number): void;
    addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig): void;
    deleteNodesPercentage(percentage: number): void;
    deleteUndEdgesPercentage(percentage: number): void;
    deleteDirEdgesPercentage(percentage: number): void;
    deleteNodesAmount(amount: number): void;
    deleteUndEdgesAmount(amount: number): void;
    deleteDirEdgesAmount(amount: number): void;
}
declare class SimplePerturber implements ISimplePerturber {
    private _graph;
    constructor(_graph: $G.IGraph);
    deleteNodesPercentage(percentage: number): void;
    deleteUndEdgesPercentage(percentage: number): void;
    deleteDirEdgesPercentage(percentage: number): void;
    deleteNodesAmount(amount: number): void;
    deleteUndEdgesAmount(amount: number): void;
    deleteDirEdgesAmount(amount: number): void;
    addUndEdgesPercentage(percentage: number): void;
    addDirEdgesPercentage(percentage: number): void;
    addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig): void;
    addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
    addNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
    private createEdgesByConfig;
    createEdgesProb(probability: number, directed?: boolean, new_nodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    createEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
}
export { SimplePerturber };

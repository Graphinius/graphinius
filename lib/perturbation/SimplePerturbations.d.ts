import * as $N from '../core/BaseNode';
import * as $E from '../core/BaseEdge';
import * as $G from '../core/BaseGraph';
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
    createRandomEdgesProb(probability: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    createRandomEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    randomlyDeleteNodesPercentage(percentage: number): void;
    randomlyDeleteUndEdgesPercentage(percentage: number): void;
    randomlyDeleteDirEdgesPercentage(percentage: number): void;
    randomlyDeleteNodesAmount(amount: number): void;
    randomlyDeleteUndEdgesAmount(amount: number): void;
    randomlyDeleteDirEdgesAmount(amount: number): void;
    randomlyAddNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
    randomlyAddUndEdgesPercentage(percentage: number): void;
    randomlyAddDirEdgesPercentage(percentage: number): void;
    randomlyAddNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
    randomlyAddEdgesAmount(amount: number, config?: $E.EdgeConstructorOptions): void;
}
declare class SimplePerturber implements ISimplePerturber {
    private _graph;
    constructor(_graph: $G.IGraph);
    randomlyDeleteNodesPercentage(percentage: number): void;
    randomlyDeleteUndEdgesPercentage(percentage: number): void;
    randomlyDeleteDirEdgesPercentage(percentage: number): void;
    randomlyDeleteNodesAmount(amount: number): void;
    randomlyDeleteUndEdgesAmount(amount: number): void;
    randomlyDeleteDirEdgesAmount(amount: number): void;
    randomlyAddUndEdgesPercentage(percentage: number): void;
    randomlyAddDirEdgesPercentage(percentage: number): void;
    randomlyAddEdgesAmount(amount: number, config?: $E.EdgeConstructorOptions): void;
    randomlyAddNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
    randomlyAddNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
    private createEdgesByConfig;
    createRandomEdgesProb(probability: number, directed?: boolean, new_nodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    createRandomEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
}
export { SimplePerturber };

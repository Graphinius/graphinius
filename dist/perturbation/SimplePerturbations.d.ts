/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
/**
 * EITHER generate new edges via specified degree span
 * OR via probability of edge creation from a specified
 * set of nodes to all others
 */
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
    /**
     *
     * @param percentage
     */
    randomlyDeleteNodesPercentage(percentage: number): void;
    /**
     *
     * @param percentage
     */
    randomlyDeleteUndEdgesPercentage(percentage: number): void;
    /**
     *
     * @param percentage
     */
    randomlyDeleteDirEdgesPercentage(percentage: number): void;
    /**
     *
     */
    randomlyDeleteNodesAmount(amount: number): void;
    /**
     *
     */
    randomlyDeleteUndEdgesAmount(amount: number): void;
    /**
     *
     */
    randomlyDeleteDirEdgesAmount(amount: number): void;
    /**
     *
     */
    randomlyAddUndEdgesPercentage(percentage: number): void;
    /**
     *
     */
    randomlyAddDirEdgesPercentage(percentage: number): void;
    /**
     *
     * DEFAULT edge direction: UNDIRECTED
     */
    randomlyAddEdgesAmount(amount: number, config?: $E.EdgeConstructorOptions): void;
    /**
     *
     */
    randomlyAddNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
    /**
     *
     * If the degree configuration is invalid
     * (negative or infinite degree amount / percentage)
     * the nodes will have been created nevertheless
     */
    randomlyAddNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
    /**
     * Go through the degree_configuration provided and create edges
     * as requested by config
     */
    private createEdgesByConfig(config, new_nodes);
    /**
     * Simple edge generator:
     * Go through all node combinations, and
     * add an (un)directed edge with
     * @param probability and
     * @direction true or false
     * CAUTION: this algorithm takes quadratic runtime in #nodes
     */
    createRandomEdgesProb(probability: number, directed?: boolean, new_nodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
    /**
     * Simple edge generator:
     * Go through all nodes, and
     * add [min, max] (un)directed edges to
     * a randomly chosen node
     * CAUTION: this algorithm could take quadratic runtime in #nodes
     * but should be much faster
     */
    createRandomEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
        [key: string]: $N.IBaseNode;
    }): void;
}
export { SimplePerturber };

/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $MC from '../mincutmaxflow/minCutMaxFlowBoykov';
export declare type EnergyFunctionTerm = (arg1: string, arg2: string) => number;
export interface EMEConfig {
    directed: boolean;
    labeled: boolean;
    interactionTerm: EnergyFunctionTerm;
    dataTerm: EnergyFunctionTerm;
}
export interface EMEResult {
    graph: $G.IGraph;
}
export interface IEMEBoykov {
    calculateCycle(): EMEResult;
    constructGraph(): $G.IGraph;
    deepCopyGraph(graph: $G.IGraph): $G.IGraph;
    initGraph(graph: $G.IGraph): $G.IGraph;
    prepareEMEStandardConfig(): EMEConfig;
}
export interface EMEState {
    expansionGraph: $G.IGraph;
    labeledGraph: $G.IGraph;
    activeLabel: string;
    energy: number;
}
/**
 *
 */
declare class EMEBoykov implements IEMEBoykov {
    private _graph;
    private _labels;
    private _config;
    private _state;
    private _interactionTerm;
    private _dataTerm;
    constructor(_graph: $G.IGraph, _labels: Array<string>, config?: EMEConfig);
    calculateCycle(): EMEResult;
    constructGraph(): $G.IGraph;
    labelGraph(mincut: $MC.MCMFResult, source: $N.IBaseNode): $G.IGraph;
    deepCopyGraph(graph: $G.IGraph): $G.IGraph;
    initGraph(graph: $G.IGraph): $G.IGraph;
    prepareEMEStandardConfig(): EMEConfig;
}
export { EMEBoykov };

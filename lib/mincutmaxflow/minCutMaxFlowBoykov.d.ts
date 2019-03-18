import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
export interface MCMFConfig {
    directed: boolean;
}
export interface MCMFResult {
    edges: Array<$E.IBaseEdge>;
    edgeIDs: Array<string>;
    cost: number;
}
export interface IMCMFBoykov {
    calculateCycle(): MCMFResult;
    convertToDirectedGraph(graph: $G.IGraph): $G.IGraph;
    prepareMCMFStandardConfig(): MCMFConfig;
}
export interface MCMFState {
    residGraph: $G.IGraph;
    activeNodes: {
        [key: string]: $N.IBaseNode;
    };
    orphans: {
        [key: string]: $N.IBaseNode;
    };
    treeS: {
        [key: string]: $N.IBaseNode;
    };
    treeT: {
        [key: string]: $N.IBaseNode;
    };
    parents: {
        [key: string]: $N.IBaseNode;
    };
    path: Array<$N.IBaseNode>;
    tree: {
        [key: string]: string;
    };
}
declare class MCMFBoykov implements IMCMFBoykov {
    private _graph;
    private _source;
    private _sink;
    private _config;
    private _state;
    constructor(_graph: $G.IGraph, _source: $N.IBaseNode, _sink: $N.IBaseNode, config?: MCMFConfig);
    calculateCycle(): MCMFResult;
    renameEdges(graph: $G.IGraph): void;
    convertToDirectedGraph(uGraph: $G.IGraph): $G.IGraph;
    tree(node: $N.IBaseNode): string;
    getPathToRoot(node: $N.IBaseNode): $N.IBaseNode[];
    getBottleneckCapacity(): number;
    grow(): void;
    augmentation(): void;
    adoption(): void;
    prepareMCMFStandardConfig(): MCMFConfig;
}
export { MCMFBoykov };

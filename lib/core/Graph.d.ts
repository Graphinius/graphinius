import * as $N from './Nodes';
import * as $E from './Edges';
export declare enum GraphMode {
    INIT = 0,
    DIRECTED = 1,
    UNDIRECTED = 2,
    MIXED = 3
}
export interface GraphStats {
    mode: GraphMode;
    nr_nodes: number;
    nr_und_edges: number;
    nr_dir_edges: number;
    density_dir: number;
    density_und: number;
}
export declare type MinAdjacencyListDict = {
    [id: string]: MinAdjacencyListDictEntry;
};
export declare type MinAdjacencyListDictEntry = {
    [id: string]: number;
};
export declare type MinAdjacencyListArray = Array<Array<number>>;
export declare type NextArray = Array<Array<Array<number>>>;
export interface IGraph {
    _label: string;
    getMode(): GraphMode;
    getStats(): GraphStats;
    addNodeByID(id: string, opts?: {}): $N.IBaseNode;
    addNode(node: $N.IBaseNode): boolean;
    hasNodeID(id: string): boolean;
    getNodeById(id: string): $N.IBaseNode;
    getNodes(): {
        [key: string]: $N.IBaseNode;
    };
    nrNodes(): number;
    getRandomNode(): $N.IBaseNode;
    deleteNode(node: any): void;
    getNodeIterator(): any;
    addEdgeByID(label: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: {}): $E.IBaseEdge;
    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
    hasEdgeID(id: string): boolean;
    getEdgeById(id: string): $E.IBaseEdge;
    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
    getDirEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getDirEdgesArray(): Array<$E.IBaseEdge>;
    getUndEdgesArray(): Array<$E.IBaseEdge>;
    nrDirEdges(): number;
    nrUndEdges(): number;
    deleteEdge(edge: $E.IBaseEdge): void;
    getRandomDirEdge(): $E.IBaseEdge;
    getRandomUndEdge(): $E.IBaseEdge;
    hasNegativeEdge(): boolean;
    hasNegativeCycles(node?: $N.IBaseNode): boolean;
    toDirectedGraph(copy?: any): IGraph;
    toUndirectedGraph(): IGraph;
    pickRandomProperty(propList: any): any;
    pickRandomProperties(propList: any, amount: any): Array<string>;
    deleteInEdgesOf(node: $N.IBaseNode): void;
    deleteOutEdgesOf(node: $N.IBaseNode): void;
    deleteDirEdgesOf(node: $N.IBaseNode): void;
    deleteUndEdgesOf(node: $N.IBaseNode): void;
    deleteAllEdgesOf(node: $N.IBaseNode): void;
    clearAllDirEdges(): void;
    clearAllUndEdges(): void;
    clearAllEdges(): void;
    cloneStructure(): IGraph;
    cloneSubGraphStructure(start: $N.IBaseNode, cutoff: Number): IGraph;
    adjListDict(incoming?: boolean, include_self?: any, self_dist?: number): MinAdjacencyListDict;
    adjListArray(incoming?: boolean): MinAdjacencyListArray;
    nextArray(incoming?: boolean): NextArray;
    reweighIfHasNegativeEdge(clone: boolean): IGraph;
}
declare class BaseGraph implements IGraph {
    _label: any;
    private _nr_nodes;
    private _nr_dir_edges;
    private _nr_und_edges;
    protected _mode: GraphMode;
    protected _nodes: {
        [key: string]: $N.IBaseNode;
    };
    protected _dir_edges: {
        [key: string]: $E.IBaseEdge;
    };
    protected _und_edges: {
        [key: string]: $E.IBaseEdge;
    };
    constructor(_label: any);
    getNodeIterator(): Iterator<$N.IBaseNode>;
    reweighIfHasNegativeEdge(clone?: boolean): IGraph;
    toDirectedGraph(copy?: boolean): IGraph;
    toUndirectedGraph(): IGraph;
    hasNegativeEdge(): boolean;
    hasNegativeCycles(node?: $N.IBaseNode): boolean;
    nextArray(incoming?: boolean): NextArray;
    adjListArray(incoming?: boolean): MinAdjacencyListArray;
    adjListDict(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
    getMode(): GraphMode;
    getStats(): GraphStats;
    nrNodes(): number;
    nrDirEdges(): number;
    nrUndEdges(): number;
    addNodeByID(id: string, opts?: {}): $N.IBaseNode;
    addNode(node: $N.IBaseNode): boolean;
    hasNodeID(id: string): boolean;
    getNodeById(id: string): $N.IBaseNode;
    getNodes(): {
        [key: string]: $N.IBaseNode;
    };
    getRandomNode(): $N.IBaseNode;
    deleteNode(node: any): void;
    hasEdgeID(id: string): boolean;
    getEdgeById(id: string): $E.IBaseEdge;
    private checkExistanceOfEdgeNodes;
    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
    getDirEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getDirEdgesArray(): Array<$E.IBaseEdge>;
    getUndEdgesArray(): Array<$E.IBaseEdge>;
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
    addEdgeByID(id: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: $E.EdgeConstructorOptions): $E.IBaseEdge;
    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
    deleteEdge(edge: $E.IBaseEdge): void;
    deleteInEdgesOf(node: $N.IBaseNode): void;
    deleteOutEdgesOf(node: $N.IBaseNode): void;
    deleteDirEdgesOf(node: $N.IBaseNode): void;
    deleteUndEdgesOf(node: $N.IBaseNode): void;
    deleteAllEdgesOf(node: $N.IBaseNode): void;
    clearAllDirEdges(): void;
    clearAllUndEdges(): void;
    clearAllEdges(): void;
    getRandomDirEdge(): $E.IBaseEdge;
    getRandomUndEdge(): $E.IBaseEdge;
    cloneStructure(): IGraph;
    cloneSubGraphStructure(root: $N.IBaseNode, cutoff: Number): IGraph;
    protected checkConnectedNodeOrThrow(node: $N.IBaseNode): void;
    protected updateGraphMode(): void;
    pickRandomProperty(propList: any): any;
    pickRandomProperties(propList: any, amount: any): Array<string>;
}
export { BaseGraph };

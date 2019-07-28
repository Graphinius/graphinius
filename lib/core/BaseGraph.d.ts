import { IBaseNode } from './BaseNode';
import { EdgeConstructorOptions, IBaseEdge } from './BaseEdge';
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
    addNodeByID(id: string, opts?: {}): IBaseNode;
    addNode(node: IBaseNode): boolean;
    hasNodeID(id: string): boolean;
    getNodeById(id: string): IBaseNode;
    getNodes(): {
        [key: string]: IBaseNode;
    };
    nrNodes(): number;
    getRandomNode(): IBaseNode;
    deleteNode(node: any): void;
    addEdgeByID(label: string, node_a: IBaseNode, node_b: IBaseNode, opts?: {}): IBaseEdge;
    addEdge(edge: IBaseEdge): IBaseEdge;
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): IBaseEdge;
    hasEdgeID(id: string): boolean;
    getEdgeById(id: string): IBaseEdge;
    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
    getDirEdges(): {
        [key: string]: IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: IBaseEdge;
    };
    getDirEdgesArray(): Array<IBaseEdge>;
    getUndEdgesArray(): Array<IBaseEdge>;
    nrDirEdges(): number;
    nrUndEdges(): number;
    deleteEdge(edge: IBaseEdge): void;
    getRandomDirEdge(): IBaseEdge;
    getRandomUndEdge(): IBaseEdge;
    hasNegativeEdge(): boolean;
    hasNegativeCycles(node?: IBaseNode): boolean;
    toDirectedGraph(copy?: any): IGraph;
    toUndirectedGraph(): IGraph;
    pickRandomProperty(propList: any): any;
    pickRandomProperties(propList: any, amount: any): Array<string>;
    deleteInEdgesOf(node: IBaseNode): void;
    deleteOutEdgesOf(node: IBaseNode): void;
    deleteDirEdgesOf(node: IBaseNode): void;
    deleteUndEdgesOf(node: IBaseNode): void;
    deleteAllEdgesOf(node: IBaseNode): void;
    clearAllDirEdges(): void;
    clearAllUndEdges(): void;
    clearAllEdges(): void;
    cloneStructure(): IGraph;
    cloneSubGraphStructure(start: IBaseNode, cutoff: Number): IGraph;
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
        [key: string]: IBaseNode;
    };
    protected _dir_edges: {
        [key: string]: IBaseEdge;
    };
    protected _und_edges: {
        [key: string]: IBaseEdge;
    };
    constructor(_label: any);
    reweighIfHasNegativeEdge(clone?: boolean): IGraph;
    toDirectedGraph(copy?: boolean): IGraph;
    toUndirectedGraph(): IGraph;
    hasNegativeEdge(): boolean;
    hasNegativeCycles(node?: IBaseNode): boolean;
    nextArray(incoming?: boolean): NextArray;
    adjListArray(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListArray;
    adjListDict(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
    getMode(): GraphMode;
    getStats(): GraphStats;
    nrNodes(): number;
    nrDirEdges(): number;
    nrUndEdges(): number;
    addNodeByID(id: string, opts?: {}): IBaseNode;
    addNode(node: IBaseNode): boolean;
    hasNodeID(id: string): boolean;
    getNodeById(id: string): IBaseNode;
    getNodes(): {
        [key: string]: IBaseNode;
    };
    getRandomNode(): IBaseNode;
    deleteNode(node: any): void;
    hasEdgeID(id: string): boolean;
    getEdgeById(id: string): IBaseEdge;
    private checkExistanceOfEdgeNodes;
    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
    getDirEdges(): {
        [key: string]: IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: IBaseEdge;
    };
    getDirEdgesArray(): Array<IBaseEdge>;
    getUndEdgesArray(): Array<IBaseEdge>;
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): IBaseEdge;
    addEdgeByID(id: string, node_a: IBaseNode, node_b: IBaseNode, opts?: EdgeConstructorOptions): IBaseEdge;
    addEdge(edge: IBaseEdge): IBaseEdge;
    deleteEdge(edge: IBaseEdge): void;
    deleteInEdgesOf(node: IBaseNode): void;
    deleteOutEdgesOf(node: IBaseNode): void;
    deleteDirEdgesOf(node: IBaseNode): void;
    deleteUndEdgesOf(node: IBaseNode): void;
    deleteAllEdgesOf(node: IBaseNode): void;
    clearAllDirEdges(): void;
    clearAllUndEdges(): void;
    clearAllEdges(): void;
    getRandomDirEdge(): IBaseEdge;
    getRandomUndEdge(): IBaseEdge;
    cloneStructure(): IGraph;
    cloneSubGraphStructure(root: IBaseNode, cutoff: Number): IGraph;
    protected checkConnectedNodeOrThrow(node: IBaseNode): void;
    protected updateGraphMode(): void;
    pickRandomProperty(propList: any): any;
    pickRandomProperties(propList: any, amount: any): Array<string>;
}
export { BaseGraph };

// import http = require('http');

declare module GraphiniusJS {

  export namespace core {
    
    /**
     * EDGES
     */
    export namespace Edges {
      
      export interface IConnectedNodes {
        a: Nodes.IBaseNode;
        b: Nodes.IBaseNode;
      }
      
      export interface EdgeConstructorOptions {
        directed?		: boolean;
        weighted?		: boolean;
        weight?			: number;
        label?			: string;
      }
    
      export interface IBaseEdge {
        getID() : string;
        getLabel() : string;
        setLabel(label : string) : void;
        isDirected()						: boolean;
        isWeighted()						: boolean;
        getWeight()							: number;
        setWeight(w:number) 		: void;
        getNodes()	: IConnectedNodes;
      }
      
      export class BaseEdge implements IBaseEdge {
        protected _directed		: boolean;
        protected _weighted 	: boolean;
        protected _weight			: number;
        protected _label			: string;

        constructor (_id: string, _node_a:Nodes.IBaseNode, _node_b:Nodes.IBaseNode,
                    options?: EdgeConstructorOptions);

        getID() : string;
        getLabel() : string;
        setLabel(label : string) : void;
        isDirected () : boolean;
        isWeighted () : boolean;
        getWeight() : number;
        setWeight(w:number) : void;
        getNodes() : IConnectedNodes;
      }
      
    }

    /**
     * NODES
     */
    export namespace Nodes {
      
      export interface NeighborEntry {
        node: IBaseNode;
        edge: Edges.IBaseEdge;
        best?: number;
      }
      
      export interface IBaseNode {
        getID(): string;
        getLabel(): string;
        setLabel(label: string): void;
        getFeatures(): {
            [k: string]: any;
        };
        getFeature(key: string): any;
        setFeatures(features: {
            [k: string]: any;
        }): void;
        setFeature(key: string, value: any): void;
        deleteFeature(key: string): any;
        clearFeatures(): void;
        inDegree(): number;
        outDegree(): number;
        degree(): number;
        addEdge(edge: Edges.IBaseEdge): void;
        hasEdge(edge: Edges.IBaseEdge): boolean;
        hasEdgeID(id: string): boolean;
        getEdge(id: string): Edges.IBaseEdge;
        inEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        outEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        undEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        dirEdges(): {};
        allEdges(): {};
        removeEdge(edge: Edges.IBaseEdge): void;
        removeEdgeID(id: string): void;
        clearOutEdges(): void;
        clearInEdges(): void;
        clearUndEdges(): void;
        clearEdges(): void;
        prevNodes(): Array<NeighborEntry>;
        nextNodes(): Array<NeighborEntry>;
        connNodes(): Array<NeighborEntry>;
        reachNodes(identityFunc?: Function): Array<NeighborEntry>;
      }

      export class BaseNode implements IBaseNode {
        protected _id: any;
        private _in_degree;
        private _out_degree;
        private _und_degree;
        protected _features: {
            [k: string]: any;
        };
        protected _in_edges: {
            [k: string]: Edges.IBaseEdge;
        };
        protected _out_edges: {
            [k: string]: Edges.IBaseEdge;
        };
        protected _und_edges: {
            [k: string]: Edges.IBaseEdge;
        };
        protected _label: string;
        constructor(_id: any, features?: {
            [k: string]: any;
        });
        getID(): string;
        getLabel(): string;
        setLabel(label: string): void;
        getFeatures(): {
            [k: string]: any;
        };
        getFeature(key: string): any;
        setFeatures(features: {
            [k: string]: any;
        }): void;
        setFeature(key: string, value: any): void;
        deleteFeature(key: string): any;
        clearFeatures(): void;
        inDegree(): number;
        outDegree(): number;
        degree(): number;
        addEdge(edge: Edges.IBaseEdge): void;
        hasEdge(edge: Edges.IBaseEdge): boolean;
        hasEdgeID(id: string): boolean;
        getEdge(id: string): Edges.IBaseEdge;
        inEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        outEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        undEdges(): {
            [k: string]: Edges.IBaseEdge;
        };
        dirEdges(): {};
        allEdges(): {};
        removeEdge(edge: Edges.IBaseEdge): void;
        removeEdgeID(id: string): void;
        clearOutEdges(): void;
        clearInEdges(): void;
        clearUndEdges(): void;
        clearEdges(): void;
        prevNodes(): Array<NeighborEntry>;
        nextNodes(): Array<NeighborEntry>;
        connNodes(): Array<NeighborEntry>;
        reachNodes(identityFunc?: Function): Array<NeighborEntry>;
      }
    }
    
    /**
     * GRAPH
     */
    export namespace Graph {
      
      export enum GraphMode {
        INIT = 0,
        DIRECTED = 1,
        UNDIRECTED = 2,
        MIXED = 3,
      }
      export interface DegreeDistribution {
        in: Uint16Array;
        out: Uint16Array;
        dir: Uint16Array;
        und: Uint16Array;
        all: Uint16Array;
      }
      export interface GraphStats {
        mode: GraphMode;
        nr_nodes: number;
        nr_und_edges: number;
        nr_dir_edges: number;
      }
      export interface IGraph {
        _label: string;
        getMode(): GraphMode;
        getStats(): GraphStats;
        degreeDistribution(): DegreeDistribution;
        addNode(id: string, opts?: {}): Nodes.IBaseNode;
        hasNodeID(id: string): boolean;
        hasNodeLabel(label: string): boolean;
        getNodeById(id: string): Nodes.IBaseNode;
        getNodeByLabel(label: string): Nodes.IBaseNode;
        getNodes(): {
            [key: string]: Nodes.IBaseNode;
        };
        nrNodes(): number;
        getRandomNode(): Nodes.IBaseNode;
        deleteNode(node: any): void;
        addEdge(label: string, node_a: Nodes.IBaseNode, node_b: Nodes.IBaseNode, opts?: {}): Edges.IBaseEdge;
        addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): Edges.IBaseEdge;
        hasEdgeID(id: string): boolean;
        hasEdgeLabel(label: string): boolean;
        getEdgeById(id: string): Edges.IBaseEdge;
        getEdgeByLabel(label: string): Edges.IBaseEdge;
        getDirEdges(): {
            [key: string]: Edges.IBaseEdge;
        };
        getUndEdges(): {
            [key: string]: Edges.IBaseEdge;
        };
        nrDirEdges(): number;
        nrUndEdges(): number;
        deleteEdge(edge: Edges.IBaseEdge): void;
        getRandomDirEdge(): Edges.IBaseEdge;
        getRandomUndEdge(): Edges.IBaseEdge;
        deleteInEdgesOf(node: Nodes.IBaseNode): void;
        deleteOutEdgesOf(node: Nodes.IBaseNode): void;
        deleteDirEdgesOf(node: Nodes.IBaseNode): void;
        deleteUndEdgesOf(node: Nodes.IBaseNode): void;
        deleteAllEdgesOf(node: Nodes.IBaseNode): void;
        clearAllDirEdges(): void;
        clearAllUndEdges(): void;
        clearAllEdges(): void;
        createRandomEdgesProb(probability: number, directed?: boolean): void;
        createRandomEdgesSpan(min: number, max: number, directed?: boolean): void;
      }
      
      export class BaseGraph implements IGraph {
        _label: any;
        private _nr_nodes;
        private _nr_dir_edges;
        private _nr_und_edges;
        protected _mode: GraphMode;
        protected _nodes: {
            [key: string]: Nodes.IBaseNode;
        };
        protected _dir_edges: {
            [key: string]: Edges.IBaseEdge;
        };
        protected _und_edges: {
            [key: string]: Edges.IBaseEdge;
        };
        constructor(_label: any);
        getMode(): GraphMode;
        getStats(): GraphStats;
        degreeDistribution(): DegreeDistribution;
        nrNodes(): number;
        nrDirEdges(): number;
        nrUndEdges(): number;
        addNode(id: string, opts?: {}): Nodes.IBaseNode;
        hasNodeID(id: string): boolean;
        hasNodeLabel(label: string): boolean;
        getNodeById(id: string): Nodes.IBaseNode;
        getNodeByLabel(label: string): Nodes.IBaseNode;
        getNodes(): {
            [key: string]: Nodes.IBaseNode;
        };
        getRandomNode(): Nodes.IBaseNode;
        deleteNode(node: any): void;
        hasEdgeID(id: string): boolean;
        hasEdgeLabel(label: string): boolean;
        getEdgeById(id: string): Edges.IBaseEdge;
        getEdgeByLabel(label: string): Edges.IBaseEdge;
        getDirEdges(): {
            [key: string]: Edges.IBaseEdge;
        };
        getUndEdges(): {
            [key: string]: Edges.IBaseEdge;
        };
        addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): Edges.IBaseEdge;
        addEdge(id: string, node_a: Nodes.IBaseNode, node_b: Nodes.IBaseNode, opts?: Edges.EdgeConstructorOptions): Edges.IBaseEdge;
        deleteEdge(edge: Edges.IBaseEdge): void;
        deleteInEdgesOf(node: Nodes.IBaseNode): void;
        deleteOutEdgesOf(node: Nodes.IBaseNode): void;
        deleteDirEdgesOf(node: Nodes.IBaseNode): void;
        deleteUndEdgesOf(node: Nodes.IBaseNode): void;
        deleteAllEdgesOf(node: Nodes.IBaseNode): void;
        clearAllDirEdges(): void;
        clearAllUndEdges(): void;
        clearAllEdges(): void;
        createRandomEdgesProb(probability: number, directed?: boolean): void;
        createRandomEdgesSpan(min: number, max: number, directed?: boolean): void;
        getRandomDirEdge(): Edges.IBaseEdge;
        getRandomUndEdge(): Edges.IBaseEdge;
        protected checkConnectedNodeOrThrow(node: Nodes.IBaseNode): void;
        protected updateGraphMode(): void;
        private pickRandomProperty(obj);        
      }
    }    
  }
  
  /**
   * SEARCH
   */
  export namespace search {
    
    /**
     * BFS
     */
     export interface BFS_Config {
        result: {
            [id: string]: BFS_ResultEntry;
        };
        callbacks: BFS_Callbacks;
        dir_mode: core.Graph.GraphMode;
        messages?: {};
        filters?: any;
    }
    export interface BFS_ResultEntry {
        distance: number;
        parent: core.Nodes.IBaseNode;
        counter: number;
    }
    export interface BFS_Callbacks {
        init_bfs?: Array<Function>;
        node_unmarked?: Array<Function>;
        node_marked?: Array<Function>;
        sort_nodes?: Function;
    }
    export interface BFS_Scope {
        marked: {
            [id: string]: boolean;
        };
        nodes: {
            [id: string]: core.Nodes.IBaseNode;
        };
        queue: Array<core.Nodes.IBaseNode>;
        current: core.Nodes.IBaseNode;
        next_node: core.Nodes.IBaseNode;
        next_edge: core.Edges.IBaseEdge;
        root_node: core.Nodes.IBaseNode;
        adj_nodes: Array<core.Nodes.NeighborEntry>;
    }
    export function BFS(graph: core.Graph.IGraph, v: core.Nodes.IBaseNode, config?: BFS_Config): {
        [id: string]: BFS_ResultEntry;
    };
    export function prepareBFSStandardConfig(): BFS_Config;
        
    /**
     * DFS
     */
    export interface DFS_Config {
        visit_result: {};
        callbacks: DFS_Callbacks;
        dir_mode: core.Graph.GraphMode;
        dfs_visit_marked: {
            [id: string]: boolean;
        };
        messages?: {};
        filters?: any;
    }
    export interface DFS_Callbacks {
        init_dfs?: Array<Function>;
        init_dfs_visit?: Array<Function>;
        node_popped?: Array<Function>;
        node_marked?: Array<Function>;
        node_unmarked?: Array<Function>;
        adj_nodes_pushed?: Array<Function>;
        sort_nodes?: Function;
    }
    export interface StackEntry {
        node: core.Nodes.IBaseNode;
        parent: core.Nodes.IBaseNode;
        weight?: number;
    }
    export interface DFSVisit_Scope {
        stack: Array<StackEntry>;
        adj_nodes: Array<core.Nodes.NeighborEntry>;
        stack_entry: StackEntry;
        current: core.Nodes.IBaseNode;
        current_root: core.Nodes.IBaseNode;
    }
    export interface DFS_Scope {
        marked: {
            [id: string]: boolean;
        };
        nodes: {
            [id: string]: core.Nodes.IBaseNode;
        };
    }
    export function DFSVisit(graph: core.Graph.IGraph, current_root: core.Nodes.IBaseNode, config?: DFS_Config): {};
    export function DFS(graph: core.Graph.IGraph, root: core.Nodes.IBaseNode, config?: DFS_Config): {}[];
    export function prepareDFSVisitStandardConfig(): DFS_Config;
    export function prepareDFSStandardConfig(): DFS_Config;
    
    
    /**
     * PFS
     */
    export interface PFS_Config {
        result: {
            [id: string]: PFS_ResultEntry;
        };
        callbacks: PFS_Callbacks;
        dir_mode: core.Graph.GraphMode;
        goal_node: core.Nodes.IBaseNode;
        messages?: PFS_Messages;
        filters?: any;
        evalPriority: any;
        evalObjID: any;
    }
    export interface PFS_ResultEntry {
        distance: number;
        parent: core.Nodes.IBaseNode;
        counter: number;
    }
    export interface PFS_Callbacks {
        init_pfs?: Array<Function>;
        not_encountered?: Array<Function>;
        node_open?: Array<Function>;
        node_closed?: Array<Function>;
        better_path?: Array<Function>;
        goal_reached?: Array<Function>;
    }
    export interface PFS_Messages {
        init_pfs_msgs?: Array<string>;
        not_enc_msgs?: Array<string>;
        node_open_msgs?: Array<string>;
        node_closed_msgs?: Array<string>;
        better_path_msgs?: Array<string>;
        goal_reached_msgs?: Array<string>;
    }
    export interface PFS_Scope {
        OPEN_HEAP: datastructs.BinaryHeap;
        OPEN: {
            [id: string]: core.Nodes.NeighborEntry;
        };
        CLOSED: {
            [id: string]: core.Nodes.NeighborEntry;
        };
        nodes: {
            [id: string]: core.Nodes.IBaseNode;
        };
        root_node: core.Nodes.IBaseNode;
        current: core.Nodes.NeighborEntry;
        adj_nodes: Array<core.Nodes.NeighborEntry>;
        next: core.Nodes.NeighborEntry;
        better_dist: number;
    }
    export function PFS(graph: core.Graph.IGraph, v: core.Nodes.IBaseNode, config?: PFS_Config): {
        [id: string]: PFS_ResultEntry;
    };
    export function preparePFSStandardConfig(): PFS_Config;
  }
  
  /**
   * INPUT
   */
  export namespace input {
    
    /**
     * CSVInput
     */
    export interface ICSVInput {
        _separator: string;
        _explicit_direction: boolean;
        _direction_mode: boolean;
        readFromAdjacencyListFile(filepath: string): core.Graph.IGraph;
        readFromAdjacencyList(input: Array<string>, graph_name: string): core.Graph.IGraph;
        readFromAdjacencyListURL(fileurl: string, cb: Function): any;
        readFromEdgeListFile(filepath: string): core.Graph.IGraph;
        readFromEdgeList(input: Array<string>, graph_name: string): core.Graph.IGraph;
        readFromEdgeListURL(fileurl: string, cb: Function): any;
    }
    export class CSVInput implements ICSVInput {
        _separator: string;
        _explicit_direction: boolean;
        _direction_mode: boolean;
        constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
        readFromAdjacencyListURL(fileurl: string, cb: Function): void;
        readFromEdgeListURL(fileurl: string, cb: Function): void;
        private readGraphFromURL(fileurl, cb, localFun);
        readFromAdjacencyListFile(filepath: string): core.Graph.IGraph;
        readFromEdgeListFile(filepath: string): core.Graph.IGraph;
        private readFileAndReturn(filepath, func);
        readFromAdjacencyList(input: Array<string>, graph_name: string): core.Graph.IGraph;
        readFromEdgeList(input: Array<string>, graph_name: string): core.Graph.IGraph;
        private checkNodeEnvironment();
    }
    
    
    /**
     * JSONInput
     */
    export interface JSONEdge {
        to: string;
        directed?: string;
        weight?: string;
        type?: string;
    }
    export interface JSONNode {
        edges: Array<JSONEdge>;
        coords?: {
            [key: string]: Number;
        };
        features?: {
            [key: string]: any;
        };
    }
    export interface JSONGraph {
        name: string;
        nodes: number;
        edges: number;
        data: {
            [key: string]: JSONNode;
        };
    }
    export interface IJSONInput {
        _explicit_direction: boolean;
        _direction: boolean;
        _weighted_mode: boolean;
        readFromJSONFile(file: string): core.Graph.IGraph;
        readFromJSON(json: {}): core.Graph.IGraph;
        readFromJSONURL(fileurl: string, cb: Function): void;
    }
    export class JSONInput implements IJSONInput {
        _explicit_direction: boolean;
        _direction: boolean;
        _weighted_mode: boolean;
        constructor(_explicit_direction?: boolean, _direction?: boolean, _weighted_mode?: boolean);
        readFromJSONFile(filepath: string): core.Graph.IGraph;
        readFromJSONURL(fileurl: string, cb: Function): void;
        readFromJSON(json: JSONGraph): core.Graph.IGraph;
        private checkNodeEnvironment();
    }
    
  }
 
  /**
   * OUTPUT
   */
  export namespace output {
    
    /**
     * CSVOutputt
     */
    export interface ICSVOutput {
        _separator: string;
        _explicit_direction: boolean;
        _direction_mode: boolean;
        writeToAdjacencyListFile(filepath: string, graph: core.Graph.IGraph): void;
        writeToAdjacencyList(graph: core.Graph.IGraph): string;
        writeToEdgeListFile(filepath: string, graph: core.Graph.IGraph): void;
        writeToEdgeList(graph: core.Graph.IGraph): string;
    }
    export class CSVOutput implements ICSVOutput {
        _separator: string;
        _explicit_direction: boolean;
        _direction_mode: boolean;
        constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
        writeToAdjacencyListFile(filepath: string, graph: core.Graph.IGraph): void;
        writeToAdjacencyList(graph: core.Graph.IGraph): string;
        writeToEdgeListFile(filepath: string, graph: core.Graph.IGraph): void;
        writeToEdgeList(graph: core.Graph.IGraph): string;
    }
    
  }
  
  /**
   * DATASTRUCTS
   */
  export namespace datastructs {
    export enum BinaryHeapMode {
        MIN = 0,
        MAX = 1,
    }
    export interface PositionHeapEntry {
        priority: number;
        position: number;
    }
    export interface IBinaryHeap {
        getMode(): BinaryHeapMode;
        getArray(): Array<any>;
        size(): number;
        getEvalPriorityFun(): Function;
        evalInputPriority(obj: any): number;
        getEvalObjIDFun(): Function;
        evalInputObjID(obj: any): any;
        insert(obj: any): void;
        remove(obj: any): any;
        peek(): any;
        pop(): any;
        find(obj: any): any;
        getPositions(): any;
    }
    export class BinaryHeap implements IBinaryHeap {
        private _mode;
        private _evalPriority;
        private _evalObjID;
        private _array;
        private _positions;
        constructor(_mode?: BinaryHeapMode, _evalPriority?: (obj: any) => number, _evalObjID?: (obj: any) => any);
        getMode(): BinaryHeapMode;
        getArray(): Array<any>;
        getPositions(): {
            [id: string]: PositionHeapEntry;
        } | {
            [id: string]: PositionHeapEntry[];
        };
        size(): number;
        getEvalPriorityFun(): Function;
        evalInputPriority(obj: any): number;
        getEvalObjIDFun(): Function;
        evalInputObjID(obj: any): any;
        peek(): any;
        pop(): any;
        find(obj: any): any;
        insert(obj: any): void;
        remove(obj: any): any;
        private trickleDown(i);
        private trickleUp(i);
        private orderCorrect(obj_a, obj_b);
        private setNodePosition(obj, new_pos, replace?, old_pos?);
        private getNodePosition(obj);
        private unsetNodePosition(obj);
    }
  }
  
  /**
   * UTILS
   */
  export namespace utils {
    
    export namespace struct {
      export function clone(obj: any): any;
      export function mergeArrays(args: Array<Array<any>>, cb?: Function): any[];
      export function mergeObjects(args: Array<Object>): {};
      export function findKey(obj: Object, cb: Function): string;
    }
    
    export namespace remote {
      export function retrieveRemoteFile(url: string, cb: Function): any;
    }
    
    export namespace callback {
      export function execCallbacks(cbs: Array<Function>, context?: any): void;
    }
    
  }
  
}


declare module "graphinius" {
  export = GraphiniusJS;
}
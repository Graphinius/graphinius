declare module Graphinius {
  
  interface IBaseNode {
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
      addEdge(edge: IBaseEdge): void;
      hasEdge(edge: IBaseEdge): boolean;
      hasEdgeID(id: string): boolean;
      getEdge(id: string): IBaseEdge;
      inEdges(): {
          [k: string]: IBaseEdge;
      };
      outEdges(): {
          [k: string]: IBaseEdge;
      };
      undEdges(): {
          [k: string]: IBaseEdge;
      };
      removeEdge(edge: IBaseEdge): void;
      removeEdgeID(id: string): void;
      clearOutEdges(): void;
      clearInEdges(): void;
      clearUndEdges(): void;
      clearEdges(): void;
      prevNodes(): Array<IBaseNode>;
      nextNodes(): Array<IBaseNode>;
      connNodes(): Array<IBaseNode>;
      adjNodes(): Array<IBaseNode>;
  }
  
  export interface IConnectedNodes {
      a: IBaseNode;
      b: IBaseNode;
  }
  
  /**
  * Edges are the most basic components in graphinius.
  * They control no other elements below them, but hold
  * references to the nodes they are connecting...
  * @param _id internal id, public
  * @param _label edge label, public
  */
  export interface IBaseEdge {
      getID(): string;
      getLabel(): string;
      setLabel(label: string): void;
      isDirected(): boolean;
      isWeighted(): boolean;
      getWeight(): number;
      setWeight(w: number): void;
      getNodes(): IConnectedNodes;
  }
  
  export interface EdgeConstructorOptions {
      directed?: boolean;
      weighted?: boolean;
      weight?: number;
      label?: string;
  }  
  
  export interface DegreeDistribution {
      in: Uint16Array;
      out: Uint16Array;
      dir: Uint16Array;
      und: Uint16Array;
      all: Uint16Array;
  }
  
  
  
  export enum GraphMode {
    INIT,
    DIRECTED,
    UNDIRECTED,
    MIXED
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
      addNode(id: string, opts?: {}): IBaseNode;
      hasNodeID(id: string): boolean;
      hasNodeLabel(label: string): boolean;
      getNodeById(id: string): IBaseNode;
      getNodeByLabel(label: string): IBaseNode;
      getNodes(): {
          [key: string]: IBaseNode;
      };
      nrNodes(): number;
      getRandomNode(): IBaseNode;
      deleteNode(node: any): void;
      addEdge(label: string, node_a: IBaseNode, node_b: IBaseNode, opts?: {}): IBaseEdge;
      addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): IBaseEdge;
      hasEdgeID(id: string): boolean;
      hasEdgeLabel(label: string): boolean;
      getEdgeById(id: string): IBaseEdge;
      getEdgeByLabel(label: string): IBaseEdge;
      getDirEdges(): {
          [key: string]: IBaseEdge;
      };
      getUndEdges(): {
          [key: string]: IBaseEdge;
      };
      nrDirEdges(): number;
      nrUndEdges(): number;
      deleteEdge(edge: IBaseEdge): void;
      getRandomDirEdge(): IBaseEdge;
      getRandomUndEdge(): IBaseEdge;
      deleteInEdgesOf(node: IBaseNode): void;
      deleteOutEdgesOf(node: IBaseNode): void;
      deleteDirEdgesOf(node: IBaseNode): void;
      deleteUndEdgesOf(node: IBaseNode): void;
      deleteAllEdgesOf(node: IBaseNode): void;
      clearAllDirEdges(): void;
      clearAllUndEdges(): void;
      clearAllEdges(): void;
      createRandomEdgesProb(probability: number, directed: boolean): void;
      createRandomEdgesSpan(min: number, max: number, directed: boolean): void;
  }
  
  
  export interface ICSVInput {
      _separator: string;
      _explicit_direction: boolean;
      _direction_mode: boolean;
      readFromAdjacencyListFile(filepath: string): IGraph;
      readFromAdjacencyList(input: Array<string>, graph_name: string): IGraph;
      readFromAdjacencyListURL(fileurl: string, cb: Function): any;
      readFromEdgeListFile(filepath: string): IGraph;
      readFromEdgeList(input: Array<string>, graph_name: string): IGraph;
      readFromEdgeListURL(fileurl: string, cb: Function): any;
  }
  
 
  export interface JSONNode {
      edges: Array<string>;
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
      _direction_mode: boolean;
      readFromJSONFile(file: string): IGraph;
      readFromJSON(json: {}): IGraph;
      readFromJSONURL(fileurl: string, cb: Function): void;
  }
  
  export interface BFSResult {
      distance: number;
      parent: IBaseNode;
      counter: number;
  }
  
  /**
   * @TODO Declare function DFS_Scope
   */
  
  export interface DFS_Callbacks {
      init_dfs?: Array<Function>;
      init_dfs_visit?: Array<Function>;
      node_popped?: Array<Function>;
      node_marked?: Array<Function>;
      node_unmarked?: Array<Function>;
      adj_nodes_pushed?: Array<Function>;
  }
  
  export interface StackEntry {
      node: IBaseNode;
      parent: IBaseNode;
  }
  
  export interface DFSVisitScope {
      marked_temp: {
          [id: string]: boolean;
      };
      stack: Array<StackEntry>;
      adj_nodes: Array<IBaseNode>;
      stack_entry: StackEntry;
      current: IBaseNode;
      current_root: IBaseNode;
  }
  
  export interface DFSScope {
      marked: {
          [id: string]: boolean;
      };
      nodes: {
          [id: string]: IBaseNode;
      };
  }

  export function DFSVisit(graph: IGraph, current_root: IBaseNode, callbacks?: DFS_Callbacks, dir_mode?: GraphMode): void;
  export function DFS(graph: IGraph, callbacks?: DFS_Callbacks, dir_mode?: GraphMode): void;
  export function prepareStandardDFSVisitCBs(result: {}, callbacks: DFS_Callbacks, count: number): void;
  export function prepareStandardDFSCBs(result: {}, callbacks: DFS_Callbacks, count: number): void;
  export function execCallbacks(cbs: Array<Function>, context: any): void;

}

declare module "graphinius" {
  export = Graphinius;
}
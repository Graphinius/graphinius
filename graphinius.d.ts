declare module GraphiniusJS {

  export module core {
    
    /**
     * EDGES
     */
    export module Edges {
    
      export interface IBaseEdge {
        
      }
      
    }

    /**
     * NODES
     */
    export module Nodes {
      
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
    
  }
  
  
  export module search {
    
  }
  
  
  export module io {
    
    export module input {
      
    }
    
    export module output {
      
    }
        
  }
  
  
  export module datastructs {
    
  }
  
  
  export module utils {
    
  }
  
}


declare module 'graphinius' {
  export = GraphiniusJS;
}
import { ITypedNode } from "./typed/TypedNode";
import { ITypedEdge } from "./typed/TypedEdge";
export declare enum DIR {
    in = "ins",
    out = "outs",
    und = "unds"
}
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
export declare type TypedNodes = Map<string, Map<string, ITypedNode>>;
export declare type TypedEdges = Map<string, Map<string, ITypedEdge>>;
export interface TypedGraphStats extends GraphStats {
    typed_nodes: {
        [key: string]: number;
    };
    typed_edges: {
        [key: string]: number;
    };
}
export interface ExpansionConfig {
    k?: number;
    freq?: boolean;
}

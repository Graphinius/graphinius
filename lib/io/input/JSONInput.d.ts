import * as $G from '../../core/BaseGraph';
import * as $R from '../../utils/RemoteUtils';
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
export interface IJSONInConfig {
    explicit_direction?: boolean;
    directed?: boolean;
    weighted?: boolean;
    typed?: boolean;
}
export interface IJSONInput {
    _config: IJSONInConfig;
    readFromJSONFile(file: string): $G.IGraph;
    readFromJSON(json: {}): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
}
declare class JSONInput implements IJSONInput {
    _config: IJSONInConfig;
    constructor(config?: IJSONInConfig);
    readFromJSONFile(filepath: string): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
    readFromJSON(json: JSONGraph): $G.IGraph;
    static handleEdgeWeights(edge_input: any): number;
}
export { JSONInput };

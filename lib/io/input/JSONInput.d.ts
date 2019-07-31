import { IGraph } from '../../core/base/BaseGraph';
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
    readFromJSONFile(file: string, graph?: IGraph): IGraph;
    readFromJSON(json: {}, graph?: IGraph): IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
}
declare class JSONInput implements IJSONInput {
    _config: IJSONInConfig;
    constructor(config?: IJSONInConfig);
    readFromJSONFile(filepath: string, graph?: IGraph): IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
    readFromJSON(json: JSONGraph, graph?: IGraph): IGraph;
    static handleEdgeWeights(edge_input: any): number;
}
export { JSONInput };

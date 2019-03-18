import * as $G from '../../core/Graph';
import * as $R from '../../utils/remoteUtils';
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
    readFromJSONFile(file: string): $G.IGraph;
    readFromJSON(json: {}): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
}
declare class JSONInput implements IJSONInput {
    _explicit_direction: boolean;
    _direction: boolean;
    _weighted_mode: boolean;
    constructor(_explicit_direction?: boolean, _direction?: boolean, _weighted_mode?: boolean);
    readFromJSONFile(filepath: string): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
    readFromJSON(json: JSONGraph): $G.IGraph;
    private handleEdgeWeights;
    private checkNodeEnvironment;
}
export { JSONInput };

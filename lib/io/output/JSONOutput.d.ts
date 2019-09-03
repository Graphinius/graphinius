import * as $E from '../../core/base/BaseEdge';
import * as $G from '../../core/base/BaseGraph';
import { TypedGraph } from "../../core/typed/TypedGraph";
export interface IJSONOutput {
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
}
export interface TypeLUT {
    nodes: {
        [key: string]: string;
    };
    edges: {
        [key: string]: string;
    };
}
declare class JSONOutput implements IJSONOutput {
    constructTypeRLUT(g: TypedGraph): [TypeLUT, TypeLUT];
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
    static handleEdgeWeight(edge: $E.IBaseEdge): string | number;
}
export { JSONOutput };

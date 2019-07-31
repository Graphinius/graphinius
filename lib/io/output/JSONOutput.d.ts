import * as $E from '../../core/base/BaseEdge';
import * as $G from '../../core/base/BaseGraph';
export interface IJSONOutput {
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
}
declare class JSONOutput implements IJSONOutput {
    constructor();
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
    static handleEdgeWeight(edge: $E.IBaseEdge): string | number;
}
export { JSONOutput };

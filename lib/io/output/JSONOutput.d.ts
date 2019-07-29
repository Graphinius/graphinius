import * as $E from '../../core/BaseEdge';
import * as $G from '../../core/BaseGraph';
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

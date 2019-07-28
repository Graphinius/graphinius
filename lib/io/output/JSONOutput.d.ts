import * as $G from '../../core/BaseGraph';
export interface IJSONOutput {
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
}
declare class JSONOutput implements IJSONOutput {
    constructor();
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONString(graph: $G.IGraph): string;
    private handleEdgeWeight;
}
export { JSONOutput };

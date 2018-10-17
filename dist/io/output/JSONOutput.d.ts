/// <reference path="../../../typings/tsd.d.ts" />
import * as $G from '../../core/Graph';
export interface IJSONOutput {
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONSString(graph: $G.IGraph): string;
}
declare class JSONOutput implements IJSONOutput {
    constructor();
    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
    writeToJSONSString(graph: $G.IGraph): string;
    private handleEdgeWeight(edge);
}
export { JSONOutput };

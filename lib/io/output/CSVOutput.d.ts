import * as $G from '../../core/base/BaseGraph';
export interface ICSVOutConfig {
    separator?: string;
    explicit_direction?: boolean;
    direction_mode?: boolean;
    weighted?: boolean;
}
export interface ICSVOutput {
    _config: ICSVOutConfig;
    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
    writeToAdjacencyList(graph: $G.IGraph): string;
    writeToEdgeListFile(filepath: string, graph: $G.IGraph, weighted: boolean): void;
    writeToEdgeList(graph: $G.IGraph, weighted: boolean): string;
}
declare class CSVOutput implements ICSVOutput {
    _config: ICSVOutConfig;
    constructor(config?: ICSVOutConfig);
    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
    writeToAdjacencyList(graph: $G.IGraph): string;
    writeToEdgeListFile(filepath: string, graph: $G.IGraph, weighted?: boolean): void;
    writeToEdgeList(graph: $G.IGraph, weighted?: boolean): string;
    private mergeFunc;
}
export { CSVOutput };

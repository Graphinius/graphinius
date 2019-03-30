import * as $G from '../../core/Graph';
export interface ICSVOutput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
    writeToAdjacencyList(graph: $G.IGraph): string;
    writeToEdgeListFile(filepath: string, graph: $G.IGraph): void;
    writeToEdgeList(graph: $G.IGraph): string;
}
declare class CSVOutput implements ICSVOutput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
    writeToAdjacencyList(graph: $G.IGraph): string;
    writeToEdgeListFile(filepath: string, graph: $G.IGraph): void;
    writeToEdgeList(graph: $G.IGraph): string;
}
export { CSVOutput };

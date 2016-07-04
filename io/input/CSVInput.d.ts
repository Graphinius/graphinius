/// <reference path="../../../typings/tsd.d.ts" />
import * as $G from '../../core/Graph';
export interface ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromAdjacencyListURL(fileurl: string, cb: Function): any;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeListURL(fileurl: string, cb: Function): any;
}
declare class CSVInput implements ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
    readFromAdjacencyListURL(fileurl: string, cb: Function): void;
    readFromEdgeListURL(fileurl: string, cb: Function): void;
    private readGraphFromURL(fileurl, cb, localFun);
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    private readFileAndReturn(filepath, func);
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
    private checkNodeEnvironment();
}
export { CSVInput };

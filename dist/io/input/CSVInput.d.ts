/// <reference path="../../../typings/tsd.d.ts" />
import * as $G from '../../core/Graph';
import * as $R from '../../utils/remoteUtils';
export interface ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    _weighted: boolean;
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): any;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): any;
}
declare class CSVInput implements ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    _weighted: boolean;
    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean, _weighted?: boolean);
    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): void;
    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): void;
    private readGraphFromURL(config, cb, localFun);
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    private readFileAndReturn(filepath, func);
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string, weighted?: boolean): $G.IGraph;
    private checkNodeEnvironment();
}
export { CSVInput };

/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';
/**
 * TODO Consider target node callbacks / messages
 * @param graph
 * @param v
 */
declare function Dijkstra(graph: $G.IGraph, source: $N.IBaseNode, target?: $N.IBaseNode): {
    [id: string]: $PFS.PFS_ResultEntry;
};
export { Dijkstra };

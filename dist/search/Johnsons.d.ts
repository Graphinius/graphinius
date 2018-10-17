/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
declare function Johnsons(graph: $G.IGraph): {};
/**
 *
 * @param target
 * @param nodeToAdd
 *
 * @todo check if
 */
declare function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph;
declare function reWeighGraph(target: $G.IGraph, distDict: {}, tempNode: $N.IBaseNode): $G.IGraph;
declare function PFSFromAllNodes(graph: $G.IGraph): {};
export { Johnsons, addExtraNandE, reWeighGraph, PFSFromAllNodes };

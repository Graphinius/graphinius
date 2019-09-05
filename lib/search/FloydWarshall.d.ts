import { MinAdjacencyListArray, NextArray } from '../core/interfaces';
import * as $G from '../core/base/BaseGraph';
declare function FloydWarshallAPSP(graph: $G.IGraph): {};
declare function FloydWarshallArray(graph: $G.IGraph): MinAdjacencyListArray;
declare function changeNextToDirectParents(input: NextArray): NextArray;
export { FloydWarshallAPSP, FloydWarshallArray, changeNextToDirectParents };

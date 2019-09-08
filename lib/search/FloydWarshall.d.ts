import { MinAdjacencyListArray, NextArray } from '../core/interfaces';
import { IGraph } from "../core/base/BaseGraph";
declare function FloydWarshallAPSP(graph: IGraph): {};
declare function FloydWarshallArray(graph: IGraph): MinAdjacencyListArray;
declare function changeNextToDirectParents(input: NextArray): NextArray;
export { FloydWarshallAPSP, FloydWarshallArray, changeNextToDirectParents };

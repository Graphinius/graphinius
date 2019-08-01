import { BaseEdge, IBaseEdge } from '../../core/base/BaseEdge';
import { TypedEdge, ITypedEdge } from '../../core/typed/TypedEdge';
import { IBaseNode, NeighborEntry } from '../../core/base/BaseNode';
import {ITypedNode} from "../../../lib/core/typed/TypedNode";
import { IGraph } from '../../core/base/BaseGraph';
import { TypedGraph } from '../../core/typed/TypedGraph';


export interface PotentialEdgeInfo {
	a							: IBaseNode;
	b							: IBaseNode;
	dir						: boolean;
	weighted			: boolean;
	weight?				: number;
	typed					: boolean;
	type?					: string;
}


class EdgeDupeChecker {

	constructor( private _graph: IGraph | TypedGraph ) {}

	isDupe(e: PotentialEdgeInfo): boolean {

		return true;
	}


	potentialEndpoints(e: PotentialEdgeInfo): Set<IBaseNode | ITypedNode> {
		const result = new Set();

		if ( e.dir ) {
			e.a.nextNodes().forEach(ne => {
				(ne.node === e.b) && result.add(ne.edge);
			});
		}
		else {
			/**
			 * node.connNodes() already takes care of a-b <-> b-a reversal
			 * which means ne.node will always be the "other" node
			 */
			e.a.connNodes().forEach(ne => {
				(ne.node === e.b) && result.add(ne.edge);
			});
		}
		return result;
	}

}


export {
	EdgeDupeChecker
}



/**
 * Type alias to express dependency of one property on another
 *
 * @todo doesn't produce `missing property` errors like interface does
 */
// type BasicPotentialEdgeInfo = {
// 	a							: IBaseNode,
// 	b							: IBaseNode,
// 	dir						: boolean,
// }
// type EdgeWeightInfo = {
// 	weighted			: true,
// 	weight				: number
// } | {
// 	weighted			: false
// }
// type EdgeTypeInfo = {
// 	typed					: true,
// 	type					: string
// } | {
// 	typed					: false
// }
// export type PotentialEdgeInfo = BasicPotentialEdgeInfo | EdgeWeightInfo | EdgeTypeInfo;
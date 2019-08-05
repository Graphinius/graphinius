import { BaseEdge, IBaseEdge } from '../../core/base/BaseEdge';
import { TypedEdge, ITypedEdge } from '../../core/typed/TypedEdge';
import { IBaseNode, NeighborEntry } from '../../core/base/BaseNode';
import {ITypedNode} from "../../../lib/core/typed/TypedNode";
import { IGraph } from '../../core/base/BaseGraph';
import { TypedGraph } from '../../core/typed/TypedGraph';
import { Logger } from "../../utils/Logger";
const logger = new Logger();


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
		// Potential Dupe Set
		let pds = this.potentialEndpoints(e);
		if ( !pds.size ) {
			return false;
		}

		for ( let pd of pds.values() ) {

			if ( !this.checkTypeWeightEquality(e, pd) ) {
				pds.delete(pd);
				continue;
			}

			// UNtyped & not weighted
			if ( !e.typed && !e.weighted ) {
				continue;
			}

			if ( !e.typed && e.weighted ) {
				if ( e.weight !== pd.getWeight() ) {
					pds.delete(pd);
				}
				continue;
			}

			if ( e.typed && BaseEdge.isTyped(pd) && e.type !== pd.type ) {
				pds.delete(pd);
			}

		}
		return !!pds.size;
	}


	checkTypeWeightEquality(e: PotentialEdgeInfo, oe: IBaseEdge): boolean {
		return BaseEdge.isTyped(oe) === e.typed && e.weighted === oe.isWeighted();
	}


	potentialEndpoints(e: PotentialEdgeInfo): Set<IBaseEdge | ITypedEdge> {
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

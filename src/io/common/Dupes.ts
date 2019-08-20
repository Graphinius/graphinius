import { BaseEdge, IBaseEdge } from '../../core/base/BaseEdge';
import { TypedEdge, ITypedEdge } from '../../core/typed/TypedEdge';
import { IBaseNode, NeighborEntry } from '../../core/base/BaseNode';
import { IGraph } from '../../core/base/BaseGraph';
import { TypedGraph } from '../../core/typed/TypedGraph';


export interface PotentialEdgeInfo {
	a							: IBaseNode;
	b							: IBaseNode;
	label?				: string;
	dir						: boolean;
	weighted			: boolean;
	weight?				: number;
	typed					: boolean;
	type?					: string;
}


class EdgeDupeChecker {

	constructor( private _graph: IGraph | TypedGraph ) {}

	isDupe(e: PotentialEdgeInfo): boolean {
		let pds = this.potentialEndpoints(e);
		if ( !pds.size ) {
			return false;
		}
		// logger.log(`Got ${pds.size} potential edge dupe`);

		for ( let pd of pds.values() ) {
			if ( !EdgeDupeChecker.checkTypeWeightEquality(e, pd)
				|| !EdgeDupeChecker.typeWeightDupe(e, pd) ) {
				pds.delete(pd);
			}
		}
		return !!pds.size;
	}


	potentialEndpoints(e: PotentialEdgeInfo): Set<IBaseEdge | ITypedEdge> {
		const result = new Set();

		if ( e.dir ) {
			e.a.nextNodes().forEach(ne => {
				(ne.node === e.b) && result.add(ne.edge);
			});
		}
		else {
			e.a.connNodes().forEach(ne => {
				(ne.node === e.b) && result.add(ne.edge);
			});
		}
		return result;
	}


	/**
	 * @todo has no effect on test cases - either
	 * 			 -) test cases are not granular enough
	 * 			 -) typed-weighted-equality is irrelevant
	 * @param e struct with potential edge info
	 * @param oe other edge: IBaseEdge
	 */
	static checkTypeWeightEquality(e: PotentialEdgeInfo, oe: IBaseEdge): boolean {
		return BaseEdge.isTyped(oe) === e.typed && e.weighted === oe.isWeighted();
	}


	static typeWeightDupe(e: PotentialEdgeInfo, oe: IBaseEdge) : boolean {
		const neitherTypedNorWeighted = !e.typed && !e.weighted;
		const notTypedButWeighted = !e.typed && e.weighted;
		const weightEqual = e.weight === oe.getWeight();
		const typeEqual = e.typed && BaseEdge.isTyped(oe) && e.type === oe.type;

		return ( neitherTypedNorWeighted || notTypedButWeighted && weightEqual || typeEqual );
	}
}


export {
	EdgeDupeChecker
}

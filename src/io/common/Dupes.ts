import { BaseEdge, IBaseEdge } from '../../core/base/BaseEdge';
import { TypedEdge, ITypedEdge } from '../../core/typed/TypedEdge';
import { IBaseNode } from '../../core/base/BaseNode';


export interface PotentialEdgeInfo {
	n_a						: IBaseNode;
	n_b						: IBaseNode;
	dir						: boolean;
	weighted			: boolean;
	weight				: number;
	typed					: boolean;
	type					: string;
}


export function isDupe(e: PotentialEdgeInfo): boolean {


	// if ( e1.isDirected() !== e2.isDirected()
	// 		 || e1.isWeighted() !== e2.isWeighted() ) {
	// 	return false;
	// }
	//
	// if ( !gotSameEndpoints(e1, e2) ) {
	// 	return false;
	// }

	return true;
}


export function gotSameEndpoints(e1: IBaseEdge | ITypedEdge, e2: IBaseEdge | ITypedEdge): boolean {
	const e1_nodes = e1.getNodes(),
		e2_nodes = e2.getNodes();

	// we only need to check first edge
	if ( e1.isDirected() ) {
		return e1_nodes.a === e2_nodes.a && e1_nodes.b === e2_nodes.b;
	}
	else {
		return ( e1_nodes.a === e2_nodes.a && e1_nodes.b === e2_nodes.b
					|| e1_nodes.a === e2_nodes.b && e1_nodes.b === e2_nodes.a )
	}
}

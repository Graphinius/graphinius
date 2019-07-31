import { BaseEdge, IBaseEdge } from '../../core/base/BaseEdge';
import { TypedEdge, ITypedEdge } from '../../core/typed/TypedEdge';


export function isDupe(e1: IBaseEdge | ITypedEdge, e2: IBaseEdge | ITypedEdge): boolean {


	if ( e1.isDirected() !== e2.isDirected()
			 || e1.isWeighted() !== e2.isWeighted() ) {
		return false;
	}

	if ( !gotSameEndpoints(e1, e2) ) {
		return false;
	}


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
import { EdgeDupeChecker, PotentialEdgeInfo } from '../../../src/io/common/Dupes';
import { IBaseEdge } from "../../../src/core/base/BaseEdge";
import { IGraph } from "../../../src/core/base/BaseGraph";
import { ITypedEdge } from "../../../src/core/typed/TypedEdge";
import { ITypedNode, TypedNode } from "../../../src/core/typed/TypedNode";
import { TypedGraph } from "../../../src/core/typed/TypedGraph";
import * as uuid from 'uuid'
const v4 = uuid.v4;


/**
 *
 * @todo Can we use instantiated edges at all?
 * 			 -> Guess NO, since we
 */
describe('Edge DUPE tests', function () {

	// const scenarios = {
	// 	dupes: [
	// 		{}
	// 	]
	// };
	//
	// const typeDirCombos = [
	// 	{type: 'USES', dir: true},
	// 	{type: 'LIKES', dir: true},
	// 	{type: 'PRODUCES', dir: true},
	// 	{type: 'SELLS', dir: true},
	// 	{type: 'KILLED_BY', dir: true},
	// 	{type: 'CO_LOCATED', dir: false}
	// ];

	enum relations {
		LIKES = "likes",
		DRINKS = "drinks",
		COLOCATED = "colocated",
		WORKS_AT = "works_at",
		CLEANS = "cleans",
		RAN_OUT_OF = "ran_out_of"
	}

	const
		nodeTypeA = 'PERSON',
		nodeTypeB = 'COFFEE',
		nodeTypeC = 'PERSON',
		nodeTypeD = 'OFFICE';

	let
		edc : EdgeDupeChecker,
		a: ITypedNode,
		b: ITypedNode,
		c: ITypedNode,
		d: ITypedNode,
		// Potential dupes
		e_1: IBaseEdge | ITypedEdge,
		e_2: IBaseEdge | ITypedEdge,
		graph: TypedGraph;


	/**
	 * build a skeleton test graph
	 */
	beforeEach(() => {
		graph = new TypedGraph("Duplius Testus");
		edc = new EdgeDupeChecker(graph);
		a = graph.addNode(new TypedNode('A', {type: nodeTypeA}));
		b = graph.addNode(new TypedNode('B', {type: nodeTypeB}));
		c = graph.addNode(new TypedNode('C', {type: nodeTypeC}));
		d = graph.addNode(new TypedNode('D', {type: nodeTypeD}));
	});


	/**
	 * Empty set -> NO potential dupes
	 *
	 * @description occurs in the following cases:
	 * 							-) endpoints are completely different
	 * 								i. directed vs. undirected (2)
	 * 						  -) only one endpoint is the same
	 *								i. a vs b (2)
	 * 						  	ii. directed vs. undirected (*2 = 4)
	 * 						  -) both endpoints are the same, but
	 * 						  	i.  direction type is different
	 * 						   		- a->b, directed vs. UN (1)
	 * 						   	  - b->a, directed vs. UN (1)
	 * 						  	ii. direction is different
	 * 						      - a->b vs. b->a (1)
	 * 						      - b->a vs. a->b (1)
	 */

	it('endpoints are completely different (same direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), c.id, d.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	/**
	 * @todo necessary?
	 */
	it('endpoints are completely different (different direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), c.id, d.id);
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('only one endpoint is the same (a, same direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, d.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	/**
	 * @todo necessary?
	 */
	it('only one endpoint is the same (a, different direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, d.id);
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('only one endpoint is the same (b, same direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), c.id, a.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	/**
	 * @todo necessary?
	 */
	it('only one endpoint is the same (b, different direction type)', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), c.id, a.id);
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('same endpoints, but undirected & directed edges can never be dupes ', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('same endpoints, undirected & directed edges can never be dupes (reversed direction)', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('same endpoints, both directed, but reversed direction', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('same endpoints, both directed, but reversed direction', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a:b, b:a,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});



	/**
	 * Same endpoints - are edges (pairwise) both typed and weighted?
	 *
	 * @description We consider both directed & undirected combinations here,
	 * 							although it's probably not necessary
	 * 						  -) weighted vs. unweighted
	 * 						  -) typed vs. untyped
	 * @todo adapt `no dupe scenarios` to ever more exact specification as you go...
	 */

	// it('should find e_1 as potential dupe (both undirected)', () => {
	// 	e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true, weighted: true});
	// 	const newEdgeInfo: PotentialEdgeInfo = {
	// 		a, b,	dir: true,	weighted: false, typed: false
	// 	};
	// 	expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1]));
	// });
	//
	//
	//
	// it('should find both edges as potential dupe (both undirected)', () => {
	// 	e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id);
	// 	e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id);
	// 	const newEdgeInfo: PotentialEdgeInfo = {
	// 		a, b,	dir: false,	weighted: false, typed: false
	// 	};
	// 	expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1, e_2]));
	// });
	//
	//
	// it('should find both edges as potential dupes', () => {
	// 	e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id);
	// 	e_2 = graph.addEdgeByNodeIDs(v4(), b.id, a.id);
	// 	const newEdgeInfo: PotentialEdgeInfo = {
	// 		a, b,	dir: false,	weighted: false, typed: false
	// 	};
	// 	expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1, e_2]));
	// });
	//
	//
	// it('should find both edges as potential dupes', () => {
	// 	e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
	// 	e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
	// 	const newEdgeInfo: PotentialEdgeInfo = {
	// 		a, b,	dir: true,	weighted: false, typed: false
	// 	};
	// 	expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1, e_2]));
	// });
	//
	//
	// it('should find e_2 edges edge as potential dupe (reverse direction)', () => {
	// 	e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
	// 	e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
	// 	const newEdgeInfo: PotentialEdgeInfo = {
	// 		a, b,	dir: true,	weighted: false, typed: false
	// 	};
	// 	expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_2]));
	// });


});

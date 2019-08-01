import { isDupe } from '../../../src/io/common/Dupes';
import { IBaseEdge } from "../../../src/core/base/BaseEdge";
import { ITypedEdge } from "../../../src/core/typed/TypedEdge";
import { ITypedNode, TypedNode } from "../../../src/core/typed/TypedNode";
import { IGraph } from "../../../src/core/base/BaseGraph";
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

	const id = 'NewTypedEdge',
		nodeTypeA = 'PERSON',
		nodeTypeB = 'COFFEE',
		nodeTypeC = 'PERSON',
		nodeTypeD = 'OFFICE';

	let n_a: ITypedNode,
		n_b: ITypedNode,
		n_c: ITypedNode,
		n_d: ITypedNode,
		// Potential dupes
		e_1: IBaseEdge | ITypedEdge,
		e_2: IBaseEdge | ITypedEdge,
		graph: TypedGraph;


	/**
	 * build a skeleton test graph
	 */
	beforeEach(() => {
		graph = new TypedGraph("Duplius Testus");
		n_a = graph.addNode(new TypedNode('A', {type: nodeTypeA}));
		n_b = graph.addNode(new TypedNode('B', {type: nodeTypeB}));
		n_c = graph.addNode(new TypedNode('C', {type: nodeTypeC}));
		n_d = graph.addNode(new TypedNode('D', {type: nodeTypeD}));
	});


	it('should find a potential set of edge dupes', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), n_a.getID(), n_b.getID());
		// expect(true).toBe(true);
	});

	//
	// it.skip('typed & untyped edges cannot be dupes', () => {
	// 	e_1 = new BaseEdge("1", n_a, n_b);
	// 	e_2 = new TypedEdge("2", n_a, n_b);
	// 	expect(isDupe(e_1, e_2)).toBe(false);
	// });
	//
	//
	// it('directed & undirected edges cannot be dupes', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b);
	// 	e_2 = new TypedEdge("2", n_a, n_b, {directed: true});
	// 	expect(isDupe(e_1, e_2)).toBe(false);
	// });
	//
	//
	// it('weighted & unweighted edges cannot be dupes', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b);
	// 	e_2 = new TypedEdge("2", n_a, n_b, {weighted: true});
	// 	expect(isDupe(e_1, e_2)).toBe(false);
	// });
	//
	//
	// it('different EndPoints -> NO dupe, directed', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b, {directed: true});
	// 	e_2 = new TypedEdge("2", n_c, n_d, {directed: true});
	// 	expect(isDupe(e_1, e_2)).toBe(false);
	// });
	//
	//
	// it('different EndPoints -> NO dupe, undirected', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b);
	// 	e_2 = new TypedEdge("2", n_a, n_c);
	// 	expect(isDupe(e_1, e_2)).toBe(false);
	// });


	// it('same EndPoints -> dupe, directed', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b, {directed: true});
	// 	e_2 = new TypedEdge("2", n_a, n_b, {directed: true});
	// 	expect(isDupe(e_1, e_2)).toBe(true);
	// });


});

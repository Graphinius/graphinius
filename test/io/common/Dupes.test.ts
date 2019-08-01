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


	it('set of potential duplicate should be empty', () => {
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	/**
	 * Reversed direction
	 */
	it('set of potential duplicate should be empty', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
	});


	it('should find e_1 edge as potential set of edge dupes', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id);
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1]));
	});


	it('should find both edges edge as potential set of edge dupes', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id);
		e_2 = graph.addEdgeByNodeIDs(v4(), b.id, a.id);
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: false,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1, e_2]));
	});


	it('should find both edges edge as potential set of edge dupes', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b,	dir: true,	weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1, e_2]));
	});


});

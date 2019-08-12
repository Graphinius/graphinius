import {EdgeDupeChecker, PotentialEdgeInfo} from '../../../src/io/common/Dupes';
import {IBaseEdge, BaseEdge} from "../../../src/core/base/BaseEdge";
import {IGraph} from "../../../src/core/base/BaseGraph";
import {ITypedEdge, TypedEdge} from "../../../src/core/typed/TypedEdge";
import {ITypedNode, TypedNode} from "../../../src/core/typed/TypedNode";
import {TypedGraph} from "../../../src/core/typed/TypedGraph";

import {Logger} from "../../../src/utils/Logger";
const logger = new Logger();

import * as uuid from 'uuid'
const v4 = uuid.v4;


/**
 *
 * @todo Can we use instantiated edges at all?
 *       -> Guess NO, since we
 */
describe('Edge DUPE tests', function () {

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
		edc: EdgeDupeChecker,
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
	 *              -) endpoints are completely different
	 *                i. directed vs. undirected (2)
	 *              -) only one endpoint is the same
	 *                i. a vs b (2)
	 *                ii. directed vs. undirected (*2 = 4)
	 *              -) both endpoints are the same, but
	 *                i.  direction type is different
	 *                  - a->b, directed vs. UN (1)
	 *                  - b->a, directed vs. UN (1)
	 *                ii. direction is different
	 *                  - a->b vs. b->a (1)
	 *                  - b->a vs. a->b (1)
	 * @description 10 test cases
	 */
	describe('same endpoints? - ', function () {

		it('endpoints are completely different (same direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), c.id, d.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		/**
		 * @todo necessary?
		 */
		it('endpoints are completely different (different direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), c.id, d.id);
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('only one endpoint is the same (a, same direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), a.id, d.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		/**
		 * @todo necessary?
		 */
		it('only one endpoint is the same (a, different direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), a.id, d.id);
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('only one endpoint is the same (b, same direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), c.id, a.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		/**
		 * @todo necessary?
		 */
		it('only one endpoint is the same (b, different direction type)', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), c.id, a.id);
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('same endpoints, but undirected & directed edges can never be dupes ', () => {
			e_2 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: false, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('same endpoints, undirected & directed edges can never be dupes (reversed direction)', () => {
			e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: false, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('same endpoints, both directed, but reversed direction', () => {
			e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});


		it('same endpoints, both directed, but reversed direction', () => {
			e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
			const newEdgeInfo: PotentialEdgeInfo = {
				a: b, b: a, dir: true, weighted: false, typed: false
			};
			expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set());
		});

	});


	/**
	 * Same endpoints - check sets
	 */
	it('same endpoints, both directed & same direction', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, {directed: true});
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1]));
	});


	it('same endpoints, both UNdirected', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), a.id, b.id, );
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: false, weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1]));
	});


	/**
	 * @todo graph shouldn't even have that...
	 */
	it('same endpoints, both UNdirected', () => {
		e_1 = graph.addEdgeByNodeIDs(v4(), b.id, a.id, );
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: false, weighted: false, typed: false
		};
		expect(edc.potentialEndpoints(newEdgeInfo)).toEqual(new Set([e_1]));
	});




	/**
	 * Same endpoints - are edges (pairwise) both typed and weighted?
	 * If yes, we have edges in our potential DUPE set
	 *
	 * @description -) weighted vs. unweighted
	 *              -) typed vs. untyped
	 *
	 */
	describe('weighted & typed? - ', function () {

		it('weighted & unweighted cannot be dupes', () => {
			e_1 = graph.addEdge(new TypedEdge(v4(), a, b, {weighted: true}));
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: false
			};
			expect(EdgeDupeChecker.checkTypeWeightEquality(newEdgeInfo, e_1)).toBe(false);
		});


		it('weighted & unweighted cannot be dupes (reversed)', () => {
			e_1 = graph.addEdge(new TypedEdge(v4(), a, b, {weighted: false}));
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: true, typed: false
			};
			expect(EdgeDupeChecker.checkTypeWeightEquality(newEdgeInfo, e_1)).toBe(false);
		});


		/**
		 * @description BaseEdges are automatically untyped...
		 */
		it('typed & untyped cannot be dupes (both weighted)', () => {
			e_1 = graph.addEdge(new BaseEdge(v4(), a, b, {weighted: true}));
			logger.log(BaseEdge.isTyped(e_1));

			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: true, typed: true
			};
			expect(EdgeDupeChecker.checkTypeWeightEquality(newEdgeInfo, e_1)).toBe(false);
		});


		it('typed & untyped cannot be dupes (both UNweighted)', () => {
			e_1 = graph.addEdge(new BaseEdge(v4(), a, b));
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: false, typed: true
			};
			expect(EdgeDupeChecker.checkTypeWeightEquality(newEdgeInfo, e_1)).toBe(false);
		});


		it('both weighted & typed => DUPE', () => {
			e_1 = graph.addEdge(new TypedEdge(v4(), a, b, {weighted: true}));
			const newEdgeInfo: PotentialEdgeInfo = {
				a, b, dir: true, weighted: true, typed: true
			};
			expect(EdgeDupeChecker.checkTypeWeightEquality(newEdgeInfo, e_1)).toBe(true);
		});

	});


	it('NO Type & no weight to distinguish -> DUPES - ', () => {
		e_1 = graph.addEdge(new BaseEdge(v4(), a, b, {directed: true, weighted: false}));
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: false, typed: false
		};
		expect(edc.isDupe(newEdgeInfo)).toBe(true);
	});


	it('NO Type & same weight -> DUPES - ', () => {
		e_1 = graph.addEdge(new BaseEdge(v4(), a, b, {directed: true, weighted: true, weight: 42}));
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: true, weight: 42, typed: false
		};
		expect(edc.isDupe(newEdgeInfo)).toBe(true);
	});


	it('NO Type & NOT same weight -> NO DUPES - ', () => {
		e_1 = graph.addEdge(new BaseEdge(v4(), a, b, {directed: true, weighted: true, weight: 41}));
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: true, weight: 42, typed: false
		};
		expect(edc.isDupe(newEdgeInfo)).toBe(false);
	});


	it('Typed & SAME type -> DUPES - ', () => {
		e_1 = graph.addEdge(new TypedEdge(v4(), a, b, {
			directed: true,
			type: relations.LIKES,
			weighted: true,
			weight: 42
		}));
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: true, weight: 42, typed: true, type: relations.LIKES
		};
		expect(edc.isDupe(newEdgeInfo)).toBe(true);
	});


	it('Typed & NOT same type -> NO DUPES - ', () => {
		e_1 = graph.addEdge(new TypedEdge(v4(), a, b, {
			directed: true,
			type: relations.LIKES,
			weighted: true,
			weight: 42
		}));
		const newEdgeInfo: PotentialEdgeInfo = {
			a, b, dir: true, weighted: true, weight: 42, typed: true, type: relations.WORKS_AT
		};
		expect(edc.isDupe(newEdgeInfo)).toBe(false);
	});

});

import {ITypedNode, TypedNode, TypedNodeConfig} from "../../../src/core/typed/TypedNode";
import {TypedGraph} from "../../../src/core/typed/TypedGraph";
import {ITypedEdge, TypedEdge} from "../../../src/core/typed/TypedEdge";
import {GENERIC_TYPES} from "../../../src/config/run_config";

import {Logger} from '../../../src/utils/Logger';
const logger = new Logger();

describe('==== NODE TESTS ====', () => {
	const id = "newTypedNode";

	describe('Basic node instantiation', () => {

		it('should set a default type of `undefined`', () => {
			const node = new TypedNode(id);
			expect(node.type).toBe(GENERIC_TYPES.Node);
		});

		it('should set correct type', () => {
			const type = 'POLAR_STATION';
			const node = new TypedNode(id, {type});
			expect(node.type).toBe(type);
		});

		it('should tell you it\'s typed', function () {
			expect(new TypedNode('blah').type).toBeTruthy();
		});

	});


	describe('Unique Neighbor ID builder tests - ', () => {
		let
			graph: TypedGraph,
			a: ITypedNode,
			b: ITypedNode,
			e: ITypedEdge;


		beforeEach(() => {
			graph = new TypedGraph('uniqus testus');
			a = graph.addNodeByID('A');
			b = graph.addNodeByID('B');
		});

		it('should return `B#1#u', () => {
			e = graph.addEdgeByID('1', a, b);
			expect(a.uniqueNID(e)).toBe('B#1#u');
		});

		// From perspective of 'A' -> still the same
		it('should return `B#1#u', () => {
			e = graph.addEdgeByID('1', b, a);
			expect(a.uniqueNID(e)).toBe('B#1#u');
		});

		it('should return `A#1#u', () => {
			e = graph.addEdgeByID('1', b, a);
			expect(b.uniqueNID(e)).toBe('A#1#u');
		});

		it('should return `B#42#w', () => {
			e = graph.addEdgeByID('42', a, b, {weighted: true});
			expect(a.uniqueNID(e)).toBe('B#42#w');
		});

		// From perspective of 'A' -> still the same
		it('should return `B#42#w', () => {
			e = graph.addEdgeByID('42', b, a, {weighted: true});
			expect(a.uniqueNID(e)).toBe('B#42#w');
		});

		it('should return `A#42#w', () => {
			e = graph.addEdgeByID('42', b, a, {weighted: true});
			expect(b.uniqueNID(e)).toBe('A#42#w');
		});

	});


	/**
	 * @todo take the test cases from above & extend by
	 *       -) type
	 *       -) direction
	 */
	describe('Edge addition / deletion tests - ', () => {
		enum NODE_TYPES {
			Person = 'PERSON',
			Coffee = 'COFFEE'
		}

		enum EDGE_TYPES {
			Friends = 'FRIENDS_WITH',
			Likes = 'LIKES',
			Drinks = 'DRINKS',
			KilledBy = 'KILLED_BY'
		}


		let
			graph: TypedGraph,
			a: ITypedNode,
			b: ITypedNode,
			c: ITypedNode,
			e1: ITypedEdge,
			e2: ITypedEdge,
			e3: ITypedEdge;


		beforeEach(() => {
			graph = new TypedGraph('uniqus testus');
			a = graph.addNodeByID('A', {type: NODE_TYPES.Person});
			b = graph.addNodeByID('B', {type: NODE_TYPES.Person});
			c = graph.addNodeByID('C', {type: NODE_TYPES.Coffee});
		});


		it('Should only have GENERIC type upon instantiation (1/2)', () => {
			expect(a.ins(GENERIC_TYPES.Edge)).not.toBeUndefined;
			expect(a.outs(GENERIC_TYPES.Edge)).not.toBeUndefined;
			expect(a.conns(GENERIC_TYPES.Edge)).not.toBeUndefined;
		});

		/**
		 * We have to check on SOME other specific relation type...
		 */
		it('should have only GENERIC type upon instantiation (2/2)', () => {
			expect(a.ins(EDGE_TYPES.Friends)).toBeUndefined;
			expect(a.outs(EDGE_TYPES.Friends)).toBeUndefined;
			expect(a.conns(EDGE_TYPES.Friends)).toBeUndefined;
		});


		it('should correctly add a FRIENDSHIP (undirected -> CONNS)', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).has(a.uniqueNID(e1))).toBe(true);
		});

		/**
		 * Checking that no entries in OTHER directions are present (CONNS)
		 */
		it('should correctly (and only) add a CONNS', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).has(a.uniqueNID(e1))).toBe(true);
			expect(a.ins(EDGE_TYPES.Friends)).toBeUndefined();
			expect(a.outs(EDGE_TYPES.Friends)).toBeUndefined();
		});

		/**
		 * Checking that no entries in OTHER directions are present (INS)
		 */
		it('should correctly (and only) add an OUT', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.conns(EDGE_TYPES.Likes)).toBeUndefined();
			expect(a.ins(EDGE_TYPES.Likes)).toBeUndefined();
			expect(a.outs(EDGE_TYPES.Likes).has(a.uniqueNID(e1))).toBe(true);
		});

		/**
		 * Checking that no entries in OTHER directions are present (OUTS)
		 */
		it('should correctly (and only) add an IN', () => {
			e1 = a.addEdge(new TypedEdge('bff', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.conns(EDGE_TYPES.Likes)).toBeUndefined();
			expect(a.ins(EDGE_TYPES.Likes).has(a.uniqueNID(e1))).toBe(true);
			expect(a.outs(EDGE_TYPES.Likes)).toBeUndefined();
		});


		it('directed -> OUTS A, INS B', () => {
			e1 = new TypedEdge('likey', a, b, {directed: true, type: EDGE_TYPES.Likes});
			a.addEdge(e1);
			b.addEdge(e1);
			expect(a.outs(EDGE_TYPES.Likes).has(a.uniqueNID(e1))).toBe(true);
			expect(b.ins(EDGE_TYPES.Likes).has(b.uniqueNID(e1))).toBe(true);
		});

		/**
		 * DUPLICATES
		 *
		 * @todo official duplicate check - OR - just UID
		 */
		it('directed -> OUTS -> several -> Rejects (ignores) duplicates', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
		});


		it('directed -> OUTS -> several -> Rejects (ignores) duplicates', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e1 = a.addEdge(new TypedEdge('bff', a, c, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
		});


		/* different ID -> also duplicate? */
		it('directed -> OUTS -> several -> Rejects (ignores) duplicates', () => {
			e1 = a.addEdge(new TypedEdge('bffff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
		});






		it.todo('directed -> OUTS -> delete one -> preserve type');

		it.todo('directed -> OUTS -> delete all -> lose type');

		it.todo('directed -> INS -> several');

		it.todo('directed -> INS -> delete one -> preserve type');

		it.todo('directed -> INS -> delete all -> lose type');

		it.todo('Generic type can never be deleted');
	});


	/**
	 * @todo shall we give the node a callback which
	 * 			 filters / reduces neighbors to return ?
	 */
	describe('Edge traversal tests - ', () => {

	});

});

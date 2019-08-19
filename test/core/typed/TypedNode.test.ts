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


		it('should correctly (and only) add an OUT', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.conns(EDGE_TYPES.Likes)).toBeUndefined();
			expect(a.ins(EDGE_TYPES.Likes)).toBeUndefined();
			expect(a.outs(EDGE_TYPES.Likes).has(a.uniqueNID(e1))).toBe(true);
		});


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


		it('directed -> OUTS -> several', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e2 = a.addEdge(new TypedEdge('bff', a, c, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
		});


		/**
		 * DUPLICATES
		 *
		 * @describe we check for duplicate edges on a graph level, but not on a node level
		 * 					 -) when systematically (batch) instantiationg from an input source,
		 * 					 		our input classes check for duplicate edges
		 * 					 -) when programmatically building a graph manually, the graph class
		 * 					 		will reject duplicates, whereas the node classes used internally
		 * 					 		will not -> don't use <node>.addEdge...() manually!
		 *
		 * @todo this is still a bit of a mess -> should we transfer Dupe checks into the graph
		 * 			 instead of handling this in the JSON / CSV inputs -> probably !
		 * @todo make a proper note of this in the (future) documentation !!!
		 * @todo use ID for faster lookup -> but NEVER for duplicate checking !!!
		 */

		/**
		 * @todo make sure this behavior is consistent with the BaseNode class
		 */
		it('directed -> OUTS -> several -> Overwrites duplicate ID', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e2 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
		});


		/* Node does not check for duplicates itself */
		it('directed -> OUTS -> several -> Accepts structureal duplicates of differenct ID', () => {
			e1 = a.addEdge(new TypedEdge('bffff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
			e2 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
		});


		it('directed -> OUTS -> delete one -> preserve type', () => {
			e1 = a.addEdge(new TypedEdge('bffff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			e2 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
			a.removeEdge(e1);
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(1);
		});


		it('directed -> OUTS -> delete all -> lose type', () => {
			e1 = a.addEdge(new TypedEdge('bffff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			e2 = a.addEdge(new TypedEdge('bff', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.outs(EDGE_TYPES.Likes).size).toBe(2);
			a.removeEdge(e1);
			a.removeEdge(e2);
			expect(a.outs(EDGE_TYPES.Likes)).toBeUndefined();
		});


		it('directed -> INS -> several', () => {
			e1 = a.addEdge(new TypedEdge('bff', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.ins(EDGE_TYPES.Likes).size).toBe(1);
			e2 = a.addEdge(new TypedEdge('bff', c, a, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.ins(EDGE_TYPES.Likes).size).toBe(2);
		});


		it('directed -> INS -> delete one -> preserve type', () => {
			e1 = a.addEdge(new TypedEdge('bff', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			e2 = a.addEdge(new TypedEdge('bff', c, a, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.ins(EDGE_TYPES.Likes).size).toBe(2);
			a.removeEdge(e1);
			expect(a.ins(EDGE_TYPES.Likes).size).toBe(1);
		});


		/**
		 * @todo something wrong with BaseClass if we pass it same edge ID's
		 * 			 - it seems to override the edge implicitly (if directed)
		 * 			 - but then we try to remove it again via TypedNode... aaargh
		 */
		it('directed -> INS -> delete all -> lose type', () => {
			e1 = a.addEdge(new TypedEdge('e1', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			e2 = a.addEdge(new TypedEdge('e2', c, a, {directed: true, type: EDGE_TYPES.Likes}));
			expect(a.ins(EDGE_TYPES.Likes).size).toBe(2);
			a.removeEdge(e1);
			a.removeEdge(e2);
			expect(a.ins(EDGE_TYPES.Likes)).toBeUndefined();
		});


		it('directed -> CONNS -> several', () => {
			e1 = a.addEdge(new TypedEdge('bffff', a, b, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(1);
			e2 = a.addEdge(new TypedEdge('bff', a, b, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(2);
		});


		it('directed -> CONNS -> delete one -> preserve type', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b, {type: EDGE_TYPES.Friends}));
			e2 = a.addEdge(new TypedEdge('e2', a, c, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(2);
			a.removeEdge(e1);
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(1);
		});


		it('directed -> CONNS -> delete all of certain direction -> preserve type', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b, {type: EDGE_TYPES.Friends}));
			e2 = a.addEdge(new TypedEdge('e2', a, c, {type: EDGE_TYPES.Friends}));
			e3 = a.addEdge(new TypedEdge('e3', c, a, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(3);
			a.removeEdge(e1);
			a.removeEdge(e2);
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(1);
		});


		it('directed -> CONNS -> delete all -> lose type', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b, {type: EDGE_TYPES.Friends}));
			e2 = a.addEdge(new TypedEdge('e2', a, c, {type: EDGE_TYPES.Friends}));
			expect(a.conns(EDGE_TYPES.Friends).size).toBe(2);
			a.removeEdge(e1);
			a.removeEdge(e2);
			expect(a.conns(EDGE_TYPES.Friends)).toBeUndefined();
		});


		it('GENERIC type can never be lost', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b));
			e2 = a.addEdge(new TypedEdge('e2', a, c));
			expect(a.conns(GENERIC_TYPES.Edge).size).toBe(2);
			a.removeEdge(e1);
			a.removeEdge(e2);
			expect(a.conns(GENERIC_TYPES.Edge)).toBeDefined();
			expect(a.conns(GENERIC_TYPES.Edge).size).toBe(0);
		});


		it('should return all edges of a type, regardless of direction', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			e1 = a.addEdge(new TypedEdge('e2', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			e1 = a.addEdge(new TypedEdge('e3', c, a, {type: EDGE_TYPES.Likes}));
			expect(a.all(EDGE_TYPES.Likes).size).toBe(3);
		});


		it('should give the correct stats', () => {
			e1 = a.addEdge(new TypedEdge('e1', a, b, {directed: true, type: EDGE_TYPES.Likes}));
			e1 = a.addEdge(new TypedEdge('e2', b, a, {directed: true, type: EDGE_TYPES.Likes}));
			e1 = a.addEdge(new TypedEdge('e3', b, a, {type: EDGE_TYPES.Friends}));
			e1 = a.addEdge(new TypedEdge('e4', a, c, {directed: true, type: EDGE_TYPES.Drinks}));
			e1 = a.addEdge(new TypedEdge('e5', c, a, {directed: true, type: EDGE_TYPES.KilledBy}));
			e1 = a.addEdge(new TypedEdge('e6', b, a, {directed: true}));
			e1 = a.addEdge(new TypedEdge('e7', a, b, {directed: true}));
			e1 = a.addEdge(new TypedEdge('e8', a, c));
			expect(a.stats).toEqual({
				typed_edges: {
					'GENERIC': {
						ins: 1,
						outs: 1,
						conns: 1
					},
					[EDGE_TYPES.Friends]: {
						ins: 0,
						outs: 0,
						conns: 1
					},
					[EDGE_TYPES.Likes]: {
						ins: 1,
						outs: 1,
						conns: 0
					},
					[EDGE_TYPES.Drinks]: {
						ins: 0,
						outs: 1,
						conns: 0
					},
					[EDGE_TYPES.KilledBy]: {
						ins: 1,
						outs: 0,
						conns: 0
					}
				}
			});
		});

	});

});

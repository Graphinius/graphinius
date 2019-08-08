import {ITypedNode, TypedNode, TypedNodeConfig} from "../../../src/core/typed/TypedNode";
import {TypedGraph} from "../../../src/core/typed/TypedGraph";
import {ITypedEdge, TypedEdge} from "../../../src/core/typed/TypedEdge";

import {Logger} from '../../../src/utils/Logger';

const logger = new Logger();

describe('==== NODE TESTS ====', () => {
	const id = "newTypedNode";

	describe('Basic node instantiation', () => {

		it('should set a default type of `undefined`', () => {
			const node = new TypedNode(id);
			expect(node.type).toBeUndefined();
		});

		it('should set correct type', () => {
			const type = 'POLAR_STATION';
			const node = new TypedNode(id, {type});
			expect(node.type).toBe(type);
		});

		it('should tell you it\'s typed', function () {
			expect(new TypedNode('blah').typed).toBe(true);
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
		enum TYPES {
			'GENERIC_TYPE' = 'GENERIC',
			'PERSON' = 'PERSON',
			'COFFEE' = 'COFFEE',
			'FRIENDS_WITH' = 'FRIENDS_WITH',
			'LIKES' = 'LIKES',
			'DRINKS' = 'DRINKS',
			'KILLED_BY' = 'KILLED_BY'
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
			a = graph.addNodeByID('A', {type: TYPES.PERSON});
			b = graph.addNodeByID('B', {type: TYPES.PERSON});
			c = graph.addNodeByID('C', {type: TYPES.COFFEE});
		});


		it('should have only GENERIC type upon instantiation', () => {
			expect(a.ins(TYPES.FRIENDS_WITH)).toBeUndefined;
		});


		it.todo('Generic type');


		it.todo('Generic type can never be deleted');


		it('should correctly add a FRIENDSHIP (undirected)', () => {
			e1 = a.addEdge(new TypedEdge('bff', a, b, {type: TYPES.FRIENDS_WITH}));
			expect(a.conns(TYPES.FRIENDS_WITH).has(a.uniqueNID(e1))).toBe(true);
		});


		it.todo('directed -> OUT');


		it.todo('directed -> IN');

	});


	describe('Edge traversal tests - ', () => {

	});

});

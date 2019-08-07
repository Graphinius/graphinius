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


	describe.only('Unique Neighbor ID builder tests - ', () => {
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

	});


	describe('Edge traversal tests - ', () => {

	});

});

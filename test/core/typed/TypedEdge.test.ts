import {BaseEdge} from '../../../src/core/base/BaseEdge';
import {ITypedNode, TypedNode} from '../../../src/core/typed/TypedNode';
import {ITypedEdge, TypedEdge} from '../../../src/core/typed/TypedEdge';
import {GENERIC_TYPES} from "../../../src/config/run_config";

describe('==== TYPED EDGE TESTS ====', () => {

	const typeDirCombos = [
		{type: 'USES', dir: true},
		{type: 'LIKES', dir: true},
		{type: 'PRODUCES', dir: true},
		{type: 'SELLS', dir: true},
		{type: 'KILLED_BY', dir: true},
		{type: 'CO_LOCATED', dir: false}
	];

	const id = 'NewTypedEdge',
		defType = typeDirCombos[0].type,
		defDir = typeDirCombos[0].dir,
		nodeTypeA = 'PERSON',
		nodeTypeB = 'COFFEE';

	let node_a: TypedNode,
		node_b: TypedNode;

	/**
	 * Possible relationship types: [USES, (DIS)LIKES, (CO)PROGRAMS, TESTS, REACTS_TO, INTERACTS_WITH]
	 */
	describe('Basic instantiation', () => {

		beforeEach(() => {
			node_a = new TypedNode('Bernd', {type: nodeTypeA});
			node_b = new TypedNode('Roesti', {type: nodeTypeB});
		});


		it('should return isTyped on BaseEdge of true', () => {
			const edge = new TypedEdge(id, node_a, node_b);
			expect(BaseEdge.isTyped(edge)).toBe(true);
		});


		it('should set a default type of GENERIC', () => {
			const edge = new TypedEdge(id, node_a, node_b);
			expect(edge.type).toBe(GENERIC_TYPES.Edge);
		});


		it('should correctly set a type', () => {
			const edge = new TypedEdge(id, node_a, node_b, {type: defType});
			expect(edge.type).toBe(defType);
		});

	});

});
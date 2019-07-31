import {isDupe} from '../../../src/io/common/Dupes';
import {IBaseEdge, BaseEdge} from '../../../src/core/base/BaseEdge';
import {ITypedEdge, TypedEdge} from '../../../src/core/typed/TypedEdge';
import {TypedNode} from "../../../src/core/typed/TypedNode";


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

	let n_a: TypedNode,
		n_b: TypedNode,
		n_c: TypedNode,
		n_d: TypedNode,
		e_1: TypedEdge | BaseEdge,
		e_2: TypedEdge | BaseEdge;


	beforeEach(() => {
		n_a = new TypedNode('A', {type: nodeTypeA});
		n_b = new TypedNode('B', {type: nodeTypeB});
		n_c = new TypedNode('C', {type: nodeTypeC});
		n_d = new TypedNode('D', {type: nodeTypeD});
	});


	it.skip('typed & untyped edges cannot be dupes', () => {
		e_1 = new BaseEdge("1", n_a, n_b);
		e_2 = new TypedEdge("2", n_a, n_b);
		expect(isDupe(e_1, e_2)).toBe(false);
	});


	it('directed & undirected edges cannot be dupes', () => {
		e_1 = new TypedEdge("1", n_a, n_b);
		e_2 = new TypedEdge("2", n_a, n_b, {directed: true});
		expect(isDupe(e_1, e_2)).toBe(false);
	});


	it('weighted & unweighted edges cannot be dupes', () => {
		e_1 = new TypedEdge("1", n_a, n_b);
		e_2 = new TypedEdge("2", n_a, n_b, {weighted: true});
		expect(isDupe(e_1, e_2)).toBe(false);
	});


	it('different EndPoints -> NO dupe, directed', () => {
		e_1 = new TypedEdge("1", n_a, n_b, {directed: true});
		e_2 = new TypedEdge("2", n_c, n_d, {directed: true});
		expect(isDupe(e_1, e_2)).toBe(false);
	});


	it('different EndPoints -> NO dupe, undirected', () => {
		e_1 = new TypedEdge("1", n_a, n_b);
		e_2 = new TypedEdge("2", n_a, n_c);
		expect(isDupe(e_1, e_2)).toBe(false);
	});


	// it('same EndPoints -> dupe, directed', () => {
	// 	e_1 = new TypedEdge("1", n_a, n_b, {directed: true});
	// 	e_2 = new TypedEdge("2", n_a, n_b, {directed: true});
	// 	expect(isDupe(e_1, e_2)).toBe(true);
	// });


});

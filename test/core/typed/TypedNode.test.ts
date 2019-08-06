import { TypedNode, TypedNodeConfig } from "../../../src/core/typed/TypedNode";


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

});

import * as $N from '../../src/core/BaseNode';
import * as $E from '../../src/core/BaseEdge';
import * as $G from '../../src/core/BaseGraph';
import { TypedGraph, GENERIC_TYPE } from '../../src/core/TypedGraph';

import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';

import { Logger } from '../../src/utils/Logger'
const logger = new Logger();



// let sn_config: ICSVInConfig = {
// 	separator: ' ',
// 	explicit_direction: false,
// 	direction_mode: false
// };



describe('TYPED GRAPH TESTS: ', () => {
	let graph: TypedGraph,
		stats: $G.GraphStats,
		json = new JSONInput();


	beforeEach(() => {
		graph = new TypedGraph("testus");
	});


	it('should construct a typed graph with a pre-set "generic" node type', () => {
		expect(graph.getRegisteredTypes().length).toBe(1);
		expect(graph.getRegisteredTypes()).toContain(GENERIC_TYPE);
	});


	it('should correctly register a node type `Person`', () => {
		expect(graph.getNumberOfTypedNodes("Person")).toBeNull();
		graph.addNode(new $N.BaseNode("A", {label: "Person"}));
		expect(graph.getRegisteredTypes().length).toBe(2);
		expect(graph.getRegisteredTypes()).toContain("Person");
		expect(graph.getNumberOfTypedNodes("Person")).toBe(1);
	});


	it.todo('should un-register a node type upon deletion of its last instance');




});

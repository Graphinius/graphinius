import * as $N from '../../src/core/BaseNode';
import * as $E from '../../src/core/BaseEdge';
import * as $G from '../../src/core/BaseGraph';
import { TypedGraph, GENERIC_TYPE } from '../../src/core/TypedGraph';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import { Logger } from '../../src/utils/Logger'
const logger = new Logger();



describe('TYPED GRAPH TESTS: ', () => {
	let graph: TypedGraph,
		stats: $G.GraphStats,
		json = new JSONInput();


	beforeEach(() => {
		graph = new TypedGraph("testus");
	});


	describe('Basic instantiation - ', () => {

		it('should construct a typed graph with a pre-set "generic" NODE type', () => {
			expect(graph.nodeTypes().length).toBe(1);
			expect(graph.nodeTypes()).toContain(GENERIC_TYPE);
		});


		it('should construct a typed graph with a pre-set "generic" EDGE type', () => {
			expect(graph.edgeTypes().length).toBe(1);
			expect(graph.edgeTypes()).toContain(GENERIC_TYPE);
		});

	});


	describe('Nodes - ', () => {

		const nodeType = 'PERSON',
					nodeTypeLower = 'person';

		it('should correctly register a node type `PERSON`', () => {
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nrTypedNodes(nodeType)).toBeNull;
			graph.addNode(new $N.BaseNode("A", {label: nodeType}));
			/* First check for nrNodes in BaseGraph */
			expect(graph.nrNodes()).toBe(1);
			/* Now check TypedGraph */
			expect(graph.nodeTypes().length).toBe(2);
			expect(graph.nodeTypes()).toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		it('should register a node type in UPPERCASE', () => {
			graph.addNode(new $N.BaseNode("A", {label: nodeTypeLower}));
			expect(graph.nodeTypes()).not.toContain(nodeTypeLower);
			expect(graph.nodeTypes()).toContain(nodeTypeLower.toUpperCase());
		});


		it('should check for node type existence in UPPERCASE', () => {
			graph.addNode(new $N.BaseNode("A", {label: nodeTypeLower}));
			expect(graph.nrTypedNodes(nodeTypeLower)).toBe(1);
		});


		it('should delete a node instance but still keep a non-empty set of types', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			expect(graph.nrNodes()).toBe(2);
			expect(graph.nrTypedNodes(nodeType)).toBe(2);
			graph.deleteNode(graph.getNodeById('A'));
			expect(graph.nrNodes()).toBe(1);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		it('should un-register a node type upon deletion of its last instance', () => {
			graph.addNode(new $N.BaseNode("A", {label: nodeType}));
			expect(graph.nodeTypes()).toContain(nodeType);
			graph.deleteNode(graph.getNodeById('A'));
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nodeTypes()).not.toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(null);
		});


		/**
		 * @todo this should actually never happen, except in case
		 * 			 we change the node label manually...
		 * 			 -> make label immutable?
		 */
		it('should throw error if node to delete has (new) label which does not exist as node type', () => {
			const node = new $N.BaseNode('A', {label: 'person'});
			graph.addNode(node);
			node.setLabel('non-person');
			expect(() => graph.deleteNode(node)).toThrow('Node type does not exist on this TypedGraph.');
		});


		it('should throw error if node to delete had its label changed to another (registered) type', () => {
			const n_a = new $N.BaseNode('A', {label: 'person'});
			const n_b = new $N.BaseNode('B', {label: 'non-person'});
			graph.addNode(n_a);
			graph.addNode(n_b);
			n_a.setLabel('non-person');
			expect(() => graph.deleteNode(n_a)).toThrow('This particular node is nowhere to be found in its typed set.');
		});

	});


	describe('Edges - ', () => {
		const nodeType = 'PERSON',
			edgeType = 'FRIENDS_WITH',
			edgeTypeLower = 'friends_with',
			edgeID = 'a_b_friends';

		it('should correctly register an edge type `FRIENDS_WITH`', () => {
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.nrTypedEdges("Person")).toBeNull();
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			graph.addEdgeByNodeIDs(edgeID, 'A', 'B', {label: edgeType});
			/* First check for nrUndEdges in BaseGraph */
			expect(graph.nrUndEdges()).toBe(1);
			/* Now check TypedGraph */
			expect(graph.edgeTypes().length).toBe(2);
			expect(graph.edgeTypes()).toContain(edgeType);
			expect(graph.nrTypedEdges(edgeType)).toBe(1);
		});


		it('should register an edge type in UPPERCASE', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));

			expect(graph.nrTypedNodes(nodeType)).toBe(2); /* probably unnecessary */

			graph.addEdgeByNodeIDs(edgeID, 'A', 'B', {label: edgeTypeLower});
			expect(graph.edgeTypes()).not.toContain(edgeTypeLower);
			expect(graph.edgeTypes()).toContain(edgeTypeLower.toUpperCase());
		});


		it('should check for edge type existence in UPPERCASE', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			graph.addEdgeByNodeIDs(edgeID, 'A', 'B', {label: edgeTypeLower});
			expect(graph.nrTypedEdges(edgeTypeLower)).toBe(1);
		});


		it('should delete an edge instance but still keep a non-empty set of types', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			graph.addEdgeByNodeIDs(edgeID, 'A', 'B', {label: edgeType});
			graph.addEdgeByNodeIDs('2nd_edge', 'A', 'B', {label: edgeType});
			graph.deleteEdge(graph.getEdgeById(edgeID));
			expect(graph.nrTypedEdges(edgeType)).toBe(1);
		});


		it('should un-register an edge type upon deletion of its last instance', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			graph.addEdgeByNodeIDs(edgeID, 'A', 'B', {label: edgeType});
			graph.deleteEdge(graph.getEdgeById(edgeID));
			expect(graph.edgeTypes()).not.toContain(edgeType);
			expect(graph.nrTypedEdges(edgeType)).toBe(null);
		});


		it('should throw error if edge to delete has (new) label which does not exist as edge type', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			let e_1 = new $E.BaseEdge(edgeID, graph.getNodeById('A'), graph.getNodeById('B'), {label: edgeType});
			graph.addEdge(e_1);
			e_1.setLabel('on-the-edge');
			expect(() => graph.deleteEdge(e_1)).toThrow('Edge type does not exist on this TypedGraph.');
		});


		it('should throw error if edge to delete had its label changed to another (registered) type', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			let e_1 = new $E.BaseEdge(edgeID, graph.getNodeById('A'), graph.getNodeById('B'), {label: edgeType});
			let e_2 = new $E.BaseEdge(edgeID+"2", graph.getNodeById('A'), graph.getNodeById('B'), {label: 'on-the-edge'});
			graph.addEdge(e_1);
			graph.addEdge(e_2);
			e_1.setLabel('on-the-edge');
			expect(() => graph.deleteEdge(e_1)).toThrow('This particular edge is nowhere to be found in its typed set.');
		});

	});


	describe('Stats - ', () => {
		const nodeType = 'PERSON',
			edgeType1 = 'FRIENDS_WITH',
			edgeType2 = 'CO_AUTHORS';

		it('should produce the correct graphStats', () => {
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			graph.addEdgeByNodeIDs('1', 'A', 'B', {label: edgeType1});
			graph.addEdgeByNodeIDs('2', 'B', 'A', {label: edgeType2});

			logger.log(JSON.stringify(graph.getStats()));

			expect(graph.getStats()).toEqual({
				mode: 2,
				nr_nodes: 2,
				nr_und_edges: 2,
				nr_dir_edges: 0,
				density_dir: 0,
				density_und: 2,
				node_types: [GENERIC_TYPE, 'PERSON'],
				edge_types: [GENERIC_TYPE, 'FRIENDS_WITH', 'CO_AUTHORS'],
				typed_nodes: {
					[GENERIC_TYPE]: 0,
					[nodeType]: 2
				},
				typed_edges: {
					[GENERIC_TYPE]: 0,
					[edgeType1]: 1,
					[edgeType2]: 1
				}
			});
		});


		// it('should read in ')

	});

});


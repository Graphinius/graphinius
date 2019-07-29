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

		it('should correctly register a node type `PERSON`', () => {
			const nodeType = 'PERSON';
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
			const nodeType = 'person';
			graph.addNode(new $N.BaseNode("A", {label: nodeType}));
			expect(graph.nodeTypes()).not.toContain(nodeType);
			expect(graph.nodeTypes()).toContain(nodeType.toUpperCase());
		});


		it('should check for node type existence in UPPERCASE', () => {
			const nodeType = 'person';
			graph.addNode(new $N.BaseNode("A", {label: nodeType}));
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		/**
		 * This should be handled by the super class already
		 * @todo can we construct a case (via calling TypecGraph methods)
		 * 			 in which the node existed in _nodes but not in any
		 * 			 _typedNodes ??
		 */
		it.todo('should throw an error if we try to delete a foreign node');


		it('should delete a node instance but still keep a non-empty set of types', () => {
			const nodeType = 'PERSON';
			['A', 'B'].forEach(id => graph.addNodeByID(id, {label: nodeType}));
			expect(graph.nrNodes()).toBe(2);
			expect(graph.nrTypedNodes(nodeType)).toBe(2);
			graph.deleteNode(graph.getNodeById('A'));
			expect(graph.nrNodes()).toBe(1);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		it('should un-register a node type upon deletion of its last instance', () => {
			const nodeType = 'PERSON';
			graph.addNode(new $N.BaseNode("A", {label: nodeType}));
			expect(graph.nodeTypes()).toContain(nodeType);
			graph.deleteNode(graph.getNodeById('A'));
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nodeTypes()).not.toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(null);
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


		it.todo('should throw error if edge has (new) label which does not exist as edge type');

	});

});


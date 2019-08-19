import {ITypedEdge, TypedEdge} from "../../../src/core/typed/TypedEdge";
import {BaseNode} from "../../../src/core/base/BaseNode";
import {ITypedNode, TypedNode} from "../../../src/core/typed/TypedNode";
import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {JSONInput, IJSONInConfig} from '../../../src/io/input/JSONInput';
import {JSON_REC_PATH, JSON_TYPE_PATH} from '../../config/config';
import {GENERIC_TYPES} from "../../../src/config/run_config";

import {Logger} from '../../../src/utils/Logger';
const logger = new Logger();


/**
 * @description dont use graph.addNodeByID since this just calls the
 *              parent class which omits the node type !
 */
describe('TYPED GRAPH TESTS: ', () => {
	let graph: TypedGraph;


	beforeEach(() => {
		graph = new TypedGraph("testus");
	});


	describe('Basic instantiation - ', () => {

		it('should construct a typed graph with a pre-set "generic" NODE type', () => {
			expect(graph.nodeTypes().length).toBe(1);
			expect(graph.nodeTypes()).toContain(GENERIC_TYPES.Node);
		});


		it('should construct a typed graph with a pre-set "generic" EDGE type', () => {
			expect(graph.edgeTypes().length).toBe(1);
			expect(graph.edgeTypes()).toContain(GENERIC_TYPES.Node);
		});


		it('should report TypedGraph to be typed', function () {
			expect(graph.type).toBe(GENERIC_TYPES.Graph);
		});

	});


	describe('Nodes - ', () => {

		const nodeType = 'PERSON',
			nodeTypeLower = 'person';


		it('receives a TypedNode from graph.getNodeByID', () => {
			let a = graph.addNodeByID('A');
			expect(BaseNode.isTyped(a)).toBe(true);
			expect(BaseNode.isTyped(graph.getNodeById('A'))).toBe(true);
		});


		it('should correctly register a node type `PERSON`', () => {
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nrTypedNodes(nodeType)).toBeNull;
			graph.addNode(new TypedNode("A", {type: nodeType}));
			/* First check for nrNodes in BaseGraph */
			expect(graph.nrNodes()).toBe(1);
			/* Now check TypedGraph */
			expect(graph.nodeTypes().length).toBe(2);
			expect(graph.nodeTypes()).toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		it('should register a node type in UPPERCASE', () => {
			graph.addNode(new TypedNode("A", {type: nodeTypeLower}));
			expect(graph.nodeTypes()).not.toContain(nodeTypeLower);
			expect(graph.nodeTypes()).toContain(nodeTypeLower.toUpperCase());
		});


		it('should check for node type existence in UPPERCASE', () => {
			graph.addNode(new TypedNode("A", {type: nodeTypeLower}));
			expect(graph.nrTypedNodes(nodeTypeLower)).toBe(1);
		});


		it('should delete a node instance but still keep a non-empty set of types', () => {
			['A', 'B'].forEach(id => graph.addNode(new TypedNode(id, {type: nodeType})));
			expect(graph.nrNodes()).toBe(2);
			expect(graph.nrTypedNodes(nodeType)).toBe(2);
			graph.deleteNode(graph.getNodeById('A') as TypedNode);
			expect(graph.nrNodes()).toBe(1);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});


		it('should un-register a node type upon deletion of its last instance', () => {
			graph.addNode(new TypedNode("A", {type: nodeType}));
			expect(graph.nodeTypes()).toContain(nodeType);
			graph.deleteNode(graph.getNodeById('A') as TypedNode);
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nodeTypes()).not.toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(null);
		});


		it('should add a TypedNode by ID', () => {
			expect(graph.nodeTypes()).not.toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(null);
			graph.addNodeByID("A", {type: nodeType});
			expect(graph.nodeTypes()).toContain(nodeType);
			expect(graph.nrTypedNodes(nodeType)).toBe(1);
		});

	});


	describe('Edges - ', () => {

		const nodeType = 'PERSON',
			edgeType = 'FRIENDS_WITH',
			edgeTypeLower = 'friends_with',
			edgeID = 'a_b_friends';

		let graph: TypedGraph,
			a: ITypedNode,
			b: ITypedNode;


		beforeEach(() => {
			graph = new TypedGraph("testus");
			a = graph.addNode(new TypedNode('A', {type: nodeType}));
			b = graph.addNode(new TypedNode('B', {type: nodeType}));
		});


		it('should correctly register an edge type `FRIENDS_WITH`', () => {
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.nrTypedEdges("Person")).toBeNull();
			graph.addEdge(new TypedEdge(edgeID, a, b, {type: edgeType}));
			/* First check for nrUndEdges in BaseGraph */
			expect(graph.nrUndEdges()).toBe(1);
			/* Now check TypedGraph */
			expect(graph.edgeTypes().length).toBe(2);
			expect(graph.edgeTypes()).toContain(edgeType);
			expect(graph.nrTypedEdges(edgeType)).toBe(1);
		});


		it('should register an edge type in UPPERCASE', () => {
			expect(graph.nrTypedNodes(nodeType)).toBe(2);
			graph.addEdge(new TypedEdge(edgeID, a, b, {type: edgeTypeLower}));
			expect(graph.edgeTypes()).not.toContain(edgeTypeLower);
			expect(graph.edgeTypes()).toContain(edgeTypeLower.toUpperCase());
		});


		it('should check for edge type existence in UPPERCASE', () => {
			graph.addEdge(new TypedEdge(edgeID, a, b, {type: edgeTypeLower}));
			expect(graph.nrTypedEdges(edgeTypeLower)).toBe(1);
		});


		it('should delete an edge instance but still keep a non-empty set of types', () => {
			graph.addEdge(new TypedEdge(edgeID, a, b, {type: edgeType}));
			graph.addEdge(new TypedEdge(edgeID + "2", a, b, {type: edgeType}));
			graph.deleteEdge(graph.getEdgeById(edgeID) as TypedEdge);
			expect(graph.nrTypedEdges(edgeType)).toBe(1);
		});


		it('should un-register an edge type upon deletion of its last instance', () => {
			graph.addEdge(new TypedEdge(edgeID, a, b, {type: edgeType}));
			graph.deleteEdge(graph.getEdgeById(edgeID) as TypedEdge);
			expect(graph.edgeTypes()).not.toContain(edgeType);
			expect(graph.nrTypedEdges(edgeType)).toBe(null);
		});


		const
			edgeType1 = 'FRIENDS_WITH',
			edgeType2 = 'CO_AUTHORS';


		it('should produce the correct graphStats', () => {
			graph.addEdge(new TypedEdge('1', a, b, {directed: true, type: edgeType1}));
			graph.addEdge(new TypedEdge('2', b, a, {directed: true, type: edgeType2}));

			// logger.log(JSON.stringify(graph.stats));

			expect(graph.stats).toEqual({
				mode: 1,
				nr_nodes: 2,
				nr_und_edges: 0,
				nr_dir_edges: 2,
				density_dir: 1,
				density_und: 0,
				typed_nodes: {
					[GENERIC_TYPES.Node]: 0,
					[nodeType]: 2
				},
				typed_edges: {
					[GENERIC_TYPES.Edge]: 0,
					[edgeType1]: 1,
					[edgeType2]: 1
				}
			});
		});


		describe('real-world graph (beer example)', () => {

			beforeEach(() => {
				graph = new TypedGraph('Bier her!');
			});


			it('should read beerGraph from neo4j example and give the correct stats', () => {
				const controlStats = {
					mode: 1,
					nr_nodes: 577,
					nr_und_edges: 0,
					nr_dir_edges: 870,
					density_dir: 0.0026177065280184866,
					density_und: 0,
					typed_nodes: {
						GENERIC: 0,
						BEER: 292,
						BREWERY: 49,
						CATEGORY: 11,
						CITY: 47,
						STATE: 26,
						COUNTRY: 11,
						STYLE: 141
					},
					typed_edges: {
						GENERIC: 0,
						BREWED_AT: 292,
						BEER_CATEGORY: 231,
						BEER_STYLE: 231,
						LOC_CITY: 49,
						LOC_STATE: 41,
						LOC_COUNTRY: 26
					}
				};
				const graphFile = JSON_REC_PATH + '/beerGraph.json';

				const tic = +new Date;
				graph = new JSONInput({dupeCheck: false}).readFromJSONFile(graphFile, graph) as TypedGraph;
				const toc = +new Date;

				// logger.log(`Reading in TypedGraph from Neo4j beer example took: ${toc - tic} ms.`);
				// logger.log(graph.stats);
				expect(graph.stats).toEqual(controlStats);
			});

		});

	});


	/**
	 * @todo construct graph with second node type & check this as well
	 * 			 - most popular person vs. most popular coffee...
	 */
	describe('Typed graph `histogram` tests - ', () => {

		enum NODE_TYPES {
			Person = 'PERSON',
			Coffee = 'COFFEE'
		}

		enum EDGE_TYPES {
			Likes = 'LIKES',
			Hates = 'HATES',
			Drinks = 'DRINKS',
			Coworker = 'COWORKER'
		}

		const
			json = new JSONInput(),
			g: TypedGraph = json.readFromJSONFile(JSON_TYPE_PATH + '/office.json', new TypedGraph('office graph')) as TypedGraph;


		it('should correctly compute the IN histogram of likes', () => {
			expect(g.inHistT(NODE_TYPES.Person, EDGE_TYPES.Likes)).toEqual([
				new Set([g.n('E'), g.n('F'), g.n('G')]),
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D')])
			]);
		});


		it('should correctly compute the OUT histogram of likes', () => {
			expect(g.outHistT(NODE_TYPES.Person, EDGE_TYPES.Likes)).toEqual([
				new Set([g.n('C'), g.n('D'), g.n('E'), g.n('G')]),
				new Set([g.n('B'), g.n('F')]),
				new Set([g.n('A')]),
			]);
		});


		it('should correctly compute the CONN histogram of likes', () => {
			expect(g.connHistT(NODE_TYPES.Person, EDGE_TYPES.Likes)).toEqual([
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D'), g.n('E'), g.n('F'), g.n('G')])
			]);
		});


		it('should correctly compute the IN histogram of hates', () => {
			expect(g.inHistT(NODE_TYPES.Person, EDGE_TYPES.Hates)).toEqual([
				new Set([g.n('B'), g.n('C'), g.n('F'), g.n('G')]),
				new Set([g.n('A')]),
				new Set([g.n('D'), g.n('E')])
			]);
		});


		it('should correctly compute the OUT histogram of hates', () => {
			expect(g.outHistT(NODE_TYPES.Person, EDGE_TYPES.Hates)).toEqual([
				new Set([g.n('A'),g.n('F'), g.n('G')]),
				new Set([g.n('B'), g.n('D'), g.n('E')]),
				new Set([g.n('C')])
			]);
		});


		it('should correctly compute the CONN histogram of hates', () => {
			expect(g.connHistT(NODE_TYPES.Person, EDGE_TYPES.Hates)).toEqual([
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D'), g.n('E'), g.n('F'), g.n('G')])
			]);
		});


		it('should correctly compute the IN histogram of coworkers', () => {
			expect(g.inHistT(NODE_TYPES.Person, EDGE_TYPES.Coworker)).toEqual([
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D'), g.n('E'), g.n('F'), g.n('G')])
			]);
		});


		it('should correctly compute the OUT histogram of coworkers', () => {
			expect(g.outHistT(NODE_TYPES.Person, EDGE_TYPES.Coworker)).toEqual([
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D'), g.n('E'), g.n('F'), g.n('G')])
			]);
		});


		it('should correctly compute the CONN histogram of coworkers', () => {
			expect(g.connHistT(NODE_TYPES.Person, EDGE_TYPES.Coworker)).toEqual([
				new Set([g.n('C'), g.n('E'), g.n('G')]),
				new Set([g.n('B'), g.n('F')]),
				new Set([g.n('A'), g.n('D')])
			]);
		});

	});

});

/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $N from '../../src/core/Nodes';
import * as $J from '../../src/io/input/JSONInput';
import * as $C from '../../src/io/input/CSVInput';
import * as $BF from '../../src/search/BellmanFord';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
let expect 	= chai.expect;
let JSON_IN	= $J.JSONInput;
let CSV_IN	= $C.CSVInput;

let bf_graph_file = "./test/test_data/bellman_ford.json",
		bf_graph_neg_cycle_file = "./test/test_data/bellman_ford_negative_cycle.json",
    social_300_file = "./test/test_data/social_network_edges_300.csv",
    social_1k_file = "./test/test_data/social_network_edges.csv";


describe('GRAPH SEARCH Tests - Bellman Ford - ', () => {
	
	let json 							: $J.IJSONInput,
			csv								: $C.ICSVInput,
			bf_graph    			: $G.IGraph,
			bf_neg_cycle_graph: $G.IGraph,
			sn_300_graph  		: $G.IGraph,
			sn_1k_graph				: $G.IGraph,
      stats							: $G.GraphStats,
      BF                : Function = $BF.BellmanFord,
			BF_expect     		: {} = {},
			BF_neg_expect			: {} = {},
			BF_compute				: {} = {};


	before(() => {
		json = new JSON_IN(true,false,true);
		csv = new CSV_IN(' ',false,false);
		bf_graph = json.readFromJSONFile(bf_graph_file);
		bf_neg_cycle_graph = json.readFromJSONFile(bf_graph_neg_cycle_file);
    sn_300_graph = csv.readFromEdgeListFile(social_300_file);
    sn_1k_graph = csv.readFromEdgeListFile(social_1k_file);
		BF_expect = { S: 0, A: 5, E: 8, C: 7, B: 5, D: 9 };
  });


	it('should correctly instantiate the test BF graph', () => {
		stats = bf_graph.getStats();
		expect(stats.nr_nodes).to.equal(6);
		expect(stats.nr_dir_edges).to.equal(8);
		expect(stats.nr_und_edges).to.equal(0);
	});


	it('BF should reject an undefined or null graph', () => {
		expect($BF.BellmanFord.bind($BF.BellmanFord, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.BellmanFord.bind($BF.BellmanFord, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('hasNegativeCycle should reject an undefined or null graph', () => {
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('BF should reject an undefined or null start node', () => {
		let graph = new $G.BaseGraph('emptinius');
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('hasNegativeCycle should reject an undefined or null start node', () => {
		let graph = new $G.BaseGraph('emptinius');
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, graph, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, graph, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('BF should refuse to search a graph without edges', () => {
		let graph = new $G.BaseGraph('emptinius');
		let node = graph.addNodeByID('firstus');
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, node)).to.throw(
			'Cowardly refusing to traverse a graph without edges.'
		);
	});


	it('shasNegativeCycle hould refuse to search a graph without edges', () => {
		let graph = new $G.BaseGraph('emptinius');
		let node = graph.addNodeByID('firstus');
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, graph, node)).to.throw(
			'Cowardly refusing to traverse a graph without edges.'
		);
	});


	it('BF should reject an outside node', () => {
		let node = new $N.BaseNode('firstus');
		expect($BF.BellmanFord.bind($BF.BellmanFord, bf_graph, node)).to.throw(
			'Cannot start from an outside node.'
		);
	});


	it('hasNegativeCycle should reject an outside node', () => {
		let node = new $N.BaseNode('firstus');
		expect($BF.hasNegativeCycle.bind($BF.hasNegativeCycle, bf_graph, node)).to.throw(
			'Cannot start from an outside node.'
		);
	});


	it('BF should correctly compute distances from S within BF test graph', () => {
		BF_compute = $BF.BellmanFord(bf_graph, bf_graph.getNodeById("S"));
		expect(BF_compute).to.deep.equal(BF_expect);
	});


	/**
	 * Computing 'correct' distances with negative cycles makes no sense,
	 * since they are not even defined in finite time.
	 */


	it('BF should not detect any negative cycle in the bf graph', () => {
		expect($BF.hasNegativeCycle(bf_graph, bf_graph.getNodeById("S"))).to.be.false;
	});


	it('BF should detect the negative cycle in the bf_neg_cycle graph', () => {
		BF_compute = $BF.BellmanFord(bf_neg_cycle_graph, bf_neg_cycle_graph.getNodeById("S"));
		expect($BF.hasNegativeCycle(bf_neg_cycle_graph, bf_neg_cycle_graph.getNodeById("S"))).to.be.true;
	});


	it('BF performance test on ~300 node social network graph', () => {
		let d = +new Date();
		BF_compute = $BF.BellmanFord(sn_300_graph, sn_300_graph.getRandomNode());
		let e = +new Date();
		console.log("BellmanFord on social network of ~300 nodes took " + (d-e) + " ms. to finish");
	});


	it.skip('BF performance test on ~1k node social network graph', () => {
		let d = +new Date();
		BF_compute = $BF.BellmanFord(sn_1k_graph, sn_1k_graph.getRandomNode());
		let e = +new Date();
		console.log("BellmanFord on social network of ~1k nodes took " + (d-e) + " ms. to finish");
	});
  
});
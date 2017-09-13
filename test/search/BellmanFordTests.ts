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
    social_300_file = "./test/test_data/social_network_edges_300.csv",
    social_1k_file = "./test/test_data/social_network_edges.csv";


describe.only('GRAPH SEARCH Tests - Bellman Ford - ', () => {
	
	let json 							: $J.IJSONInput,
			csv								: $C.ICSVInput,
			bf_graph    			: $G.IGraph,
			sn_300_graph  		: $G.IGraph,
			sn_1k_graph				: $G.IGraph,
      stats							: $G.GraphStats,
      BF                : Function = $BF.BellmanFord,
      BF_res_expect     : {} = {},
			BF_res_compute		: {} = {};


	before(() => {
		json = new JSON_IN(true,false,true);
		csv = new CSV_IN(' ',false,false);
		bf_graph = json.readFromJSONFile(bf_graph_file);
    sn_300_graph = csv.readFromEdgeListFile(social_300_file);
    sn_1k_graph = csv.readFromEdgeListFile(social_1k_file);

    let nodes = bf_graph.getNodes();
    for (let node in nodes) {
      BF_res_expect[node] = bf_graph.getNodeById(node).getFeature('distance_s');
    }
    // console.log(BF_res_expect);
  });


	it('should correctly instantiate the test BF graph', () => {
		stats = bf_graph.getStats();
		expect(stats.nr_nodes).to.equal(6);
		expect(stats.nr_dir_edges).to.equal(8);
		expect(stats.nr_und_edges).to.equal(0);
	});


	it('should reject an undefined or null graph', () => {
		expect($BF.BellmanFord.bind($BF.BellmanFord, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.BellmanFord.bind($BF.BellmanFord, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('should reject an undefined or null start node', () => {
		let graph = new $G.BaseGraph('emptinius');
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, undefined)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, null)).to.throw(
			'Graph as well as start node have to be valid objects.'
		);
	});


	it('should refuse to search a graph without edges', () => {
		let graph = new $G.BaseGraph('emptinius');
		let node = graph.addNodeByID('firstus');
		expect($BF.BellmanFord.bind($BF.BellmanFord, graph, node)).to.throw(
			'Cowardly refusing to traverse a graph without edges.'
		);
	});


	it('should reject an outside node', () => {
		let node = new $N.BaseNode('firstus');
		expect($BF.BellmanFord.bind($BF.BellmanFord, bf_graph, node)).to.throw(
			'Cannot start from an outside node.'
		);
	});


	it('should correctly compute distances from S within BF test graph', () => {
		BF_res_compute = $BF.BellmanFord(bf_graph, bf_graph.getNodeById("S"));
		expect(BF_res_compute).to.deep.equal(BF_res_expect);
	});


	it('performance test on ~300 node social network graph', () => {
		let d = +new Date();
		BF_res_compute = $BF.BellmanFord(sn_300_graph, sn_300_graph.getRandomNode());
		let e = +new Date();
		console.log("BellmanFord on social network of ~300 nodes took " + (d-e) + "ms to finish");
	});


	it.skip('performance test on ~1k node social network graph', () => {
		let d = +new Date();
		BF_res_compute = $BF.BellmanFord(sn_1k_graph, sn_1k_graph.getRandomNode());
		let e = +new Date();
		console.log("BellmanFord on social network of ~1k nodes took " + (d-e) + "ms to finish");
	});	
  
});
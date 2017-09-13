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


describe('GRAPH SEARCH Tests - Bellman Ford - ', () => {
	
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
    console.log(BF_res_expect);
  });


	it('should correctly instantiate the test BF graph', () => {
		stats = bf_graph.getStats();
		expect(stats.nr_nodes).to.equal(6);
		expect(stats.nr_dir_edges).to.equal(8);
		expect(stats.nr_und_edges).to.equal(0);
  });
  


  
});
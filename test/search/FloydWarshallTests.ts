/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $J from '../../src/io/input/JSONInput';
import * as $C from '../../src/io/input/CSVInput';
import * as $FW from '../../src/search/FloydWarshall';

import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
var expect 	= chai.expect;
var JSON_IN	= $J.JSONInput;
var CSV_IN	= $C.CSVInput;

var search_graph = "./test/test_data/search_graph.json";
var bernd_graph = "./test/test_data/bernd_ares.json";
var intermediate = "./test/test_data/bernd_ares_intermediate.json";
var social_graph = "./test/test_data/social_network_edges.csv";


describe.only('GRAPH SEARCH Tests - Floyd-Warshall - UNDIRECTED ', () => {
	
	var 	json 					: $J.IJSONInput,
			csv						: $C.ICSVInput,
			graph_search					: $G.IGraph,
			graph_bernd				: $G.IGraph,
			graph_midsize			: $G.IGraph,
			graph_social			: $G.IGraph,
			stats					: $G.GraphStats,
			FW_res					: {};


	before(() => {
		json = new JSON_IN(true,false,true);
		csv = new CSV_IN(' ',false,false);
		graph_search = json.readFromJSONFile(search_graph);
		graph_bernd = json.readFromJSONFile(bernd_graph);
		graph_midsize = json.readFromJSONFile(intermediate);
		graph_social = csv.readFromEdgeListFile(social_graph);
	});


	it('should correctly instantiate the search graph', () => {
		stats = graph_search.getStats();
		expect(stats.nr_nodes).to.equal(7);
		expect(stats.nr_dir_edges).to.equal(7);
		expect(stats.nr_und_edges).to.equal(2);
	});


	describe('Floyd-Warshall on small search graph - ', () => {


		it('should refuse to traverse an empty graph', () => {
			var empty_graph = new $G.BaseGraph("iamempty");
			expect($FW.FloydWarshall.bind($FW.FloydWarshall, empty_graph)).to.throw("Cowardly refusing to traverse graph without edges.");
		});


		describe('computing distances in UNDIRECTED _mode - ', () => {

			it('should correctly compute distances matrix for graph', () => {
				FW_res = $FW.FloydWarshall(graph_search);
				console.log(FW_res);
				
				expect(Object.keys(FW_res).length).to.equal(graph_search.nrNodes());
				let nodes = graph_search.getNodes();
				for (let i in nodes) {
					for (let j in nodes) {
						//For Node A
						if (i=="A"&&j=="A")
							expect(FW_res[i][j]).to.equal(0);
						else if(i=="A"&&j=="B")
							expect(FW_res[i][j]).to.equal(4);
						else if(i=="A"&&j=="C")
							expect(FW_res[i][j]).to.equal(2);
						else if(i=="A"&&j=="D")
							expect(FW_res[i][j]).to.equal(7);
						else if(i=="A"&&j=="E")
							expect(FW_res[i][j]).to.equal(12);
						else if(i=="A"&&j=="F")
							expect(FW_res[i][j]).to.equal(8);
						//For Node B
						else if(i=="B"&&j=="A")
							expect(FW_res[i][j]).to.equal(4);
						else if(i=="B"&&j=="B")
							expect(FW_res[i][j]).to.equal(0);
						else if(i=="B"&&j=="C")
							expect(FW_res[i][j]).to.equal(6);
						else if(i=="B"&&j=="D")
							expect(FW_res[i][j]).to.equal(11);
						else if(i=="B"&&j=="E")
							expect(FW_res[i][j]).to.equal(16);
						else if(i=="B"&&j=="F")
							expect(FW_res[i][j]).to.equal(12);
						//For Node C
						else if(i=="C"&&j=="A")
							expect(FW_res[i][j]).to.equal(2);
						else if(i=="C"&&j=="B")
							expect(FW_res[i][j]).to.equal(6);
						else if(i=="C"&&j=="C")
							expect(FW_res[i][j]).to.equal(1);
						else if(i=="C"&&j=="D")
							expect(FW_res[i][j]).to.equal(9);
						else if(i=="C"&&j=="E")
							expect(FW_res[i][j]).to.equal(14);
						else if(i=="C"&&j=="F")
							expect(FW_res[i][j]).to.equal(10);
						//For Node D
						else if(i=="D"&&j=="A")
							expect(FW_res[i][j]).to.equal(7);
						else if(i=="D"&&j=="B")
							expect(FW_res[i][j]).to.equal(11);
						else if(i=="D"&&j=="C")
							expect(FW_res[i][j]).to.equal(9);
						else if(i=="D"&&j=="D")
							expect(FW_res[i][j]).to.equal(11);
						else if(i=="D"&&j=="E")
							expect(FW_res[i][j]).to.equal(5);
						else if(i=="D"&&j=="F")
							expect(FW_res[i][j]).to.equal(11);
						// For Node E
						else if(i=="E"&&j=="A")
							expect(FW_res[i][j]).to.equal(12);
						else if(i=="E"&&j=="B")
							expect(FW_res[i][j]).to.equal(16);
						else if(i=="E"&&j=="C")
							expect(FW_res[i][j]).to.equal(14);
						else if(i=="E"&&j=="D")
							expect(FW_res[i][j]).to.equal(5);
						else if(i=="E"&&j=="E")
							expect(FW_res[i][j]).to.equal(0);
						else if(i=="E"&&j=="F")
							expect(FW_res[i][j]).to.equal(6);
						// For Node F
						else if(i=="F"&&j=="A")
							expect(FW_res[i][j]).to.equal(8);
						else if(i=="F"&&j=="B")
							expect(FW_res[i][j]).to.equal(12);
						else if(i=="F"&&j=="C")
							expect(FW_res[i][j]).to.equal(10);
						else if(i=="F"&&j=="D")
							expect(FW_res[i][j]).to.equal(11);
						else if(i=="F"&&j=="E")
							expect(FW_res[i][j]).to.equal(6);
						else if(i=="F"&&j=="F")
							expect(FW_res[i][j]).to.equal(0);
						// For Node G
						else if(i=="G"&&j=="G")
							expect(FW_res[i][j]).to.equal(0);
						else
							expect(FW_res[i][j]).to.be.undefined;
					}
				}
			});
		});

			
		it('performance test of sparse Floyd Warshal on a ~75 node / ~200 edge graph', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_bernd);
			let e = +new Date();
			console.log("Sparse Floyd on Bernd (75 nodes) took " + (d-e) + "ms to finish");
		});


		it('performance test of sparse FW implementation on 246 nodes)', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_midsize);
			let e = +new Date();
			console.log("Sparse Floyd on intermediate graph (246 nodes) took " + (d-e) + "ms to finish");
		});


		it('performance test on social graph with ~1k nodes and ~50k edges', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_social);
			let e = +new Date();
			console.log("Sparse Floyd on social network ~1k took " + (d-e) + "ms to finish");
		});

	});
	
});
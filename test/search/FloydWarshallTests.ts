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


describe('Basic GRAPH SEARCH Tests - Floyd-Warshall - UNDIRECTED ', () => {
	
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
				// just for comparison
				// let FW_res_sparse =
				//console.log(FW_res[1]);
				//console.log($FW.getAllShortestPaths(graph,FW_res[1]));

				FW_res = FW_res[0];
				expect(Object.keys(FW_res).length).to.equal(graph_search.nrNodes());
				let nodes = graph_search.getNodes();
				for (let a in nodes) {
					for (let b in nodes) {
						if(a==b)
							expect(FW_res[a][b]).to.equal(0);
						//For Node A
						else if(a=="A"&&b=="D")
							expect(FW_res[a][b]).to.equal(7);
						else if(a=="A"&&b=="B")
							expect(FW_res[a][b]).to.equal(4);
						else if(a=="A"&&b=="C")
							expect(FW_res[a][b]).to.equal(2);
						else if(a=="A"&&b=="F")
							expect(FW_res[a][b]).to.equal(8);
						else if(a=="A"&&b=="E")
							expect(FW_res[a][b]).to.equal(12);
						//For Node C
						else if(a=="C"&&b=="A")
							expect(FW_res[a][b]).to.equal(3);
						else if(a=="C"&&b=="D")
							expect(FW_res[a][b]).to.equal(10);
						else if(a=="C"&&b=="B")
							expect(FW_res[a][b]).to.equal(7);
						else if(a=="C"&&b=="F")
							expect(FW_res[a][b]).to.equal(11);
						else if(a=="C"&&b=="E")
							expect(FW_res[a][b]).to.equal(15);
						//For Node D
						else if(a=="D"&&b=="A")
							expect(FW_res[a][b]).to.equal(7);
						else if(a=="D"&&b=="B")
							expect(FW_res[a][b]).to.equal(11);
						else if(a=="D"&&b=="C")
							expect(FW_res[a][b]).to.equal(9);
						else if(a=="D"&&b=="F")
							expect(FW_res[a][b]).to.equal(11);
						else if(a=="D"&&b=="E")
							expect(FW_res[a][b]).to.equal(5);
						//For Node E
						else if(a=="E"&&b=="F")
							expect(FW_res[a][b]).to.equal(6);
						else
							expect(FW_res[a][b]).to.equal(Number.MAX_VALUE);
					}
				}
			});


			it('Floyd-Warshall result with sparse option should equal "normal" output', () => {
				FW_res = $FW.FloydWarshall(graph_search)[0];
				// just for comparison
				let FW_res_sparse = $FW.FloydWarshall(graph_search, {sparse: true})[0];
				expect(FW_res).to.deep.equal(FW_res_sparse);
			});

		});

			
		it('trying Floyd Warshal on a ~75 node / ~200 edge graph', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_bernd)[0];
			let e = +new Date();
			console.log("Floyd on Bernd took " + (d-e) + "ms to finish");
		});


		it('trying Floyd Warshal on a ~75 node / ~200 edge graph, sparse implementation', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_bernd, {sparse: true})[0];
			let e = +new Date();
			console.log("Floyd on Bernd took " + (d-e) + "ms to finish");
		});


		it('comparing dense and sparse FW implementation on slightly larger graph (75 nodes)', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_midsize)[0];
			let e = +new Date();
			console.log("Dense Floyd on intermediate sized graph took " + (d-e) + "ms to finish");

			d = +new Date();
			let FW_res_sparse = $FW.FloydWarshall(graph_midsize, {sparse: true})[0];
			e = +new Date();
			console.log("Sparse Floyd on intermediate sized graph took " + (d-e) + "ms to finish");
			
			expect(FW_res).to.deep.equal(FW_res_sparse);
		});


		it('performance test on social graph with ~1k nodes and ~50k edges', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_social, {sparse: true})[0];
			let e = +new Date();
			console.log("Sparse Floyd on social network ~1k took " + (d-e) + "ms to finish");

			// d = +new Date();
			// let FW_res_sparse = $FW.FloydWarshall(graph_social)[0];
			// e = +new Date();
			// console.log("Dense Floyd on social network ~1k took " + (d-e) + "ms to finish");

			// expect(FW_res).to.deep.equal(FW_res_sparse);
		});

	});
	
});
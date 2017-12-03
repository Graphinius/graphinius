/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $J from '../../src/io/input/JSONInput';
import * as $C from '../../src/io/input/CSVInput';
import * as $FW from '../../src/search/FloydWarshall';

import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
let expect 	= chai.expect;
let JSON_IN	= $J.JSONInput;
let CSV_IN	= $C.CSVInput;

let search_graph = "./test/test_data/search_graph_multiple_SPs.json";
let bernd_graph = "./test/test_data/bernd_ares_pos.json";
let intermediate = "./test/test_data/bernd_ares_intermediate_pos.json";
let social_graph = "./test/test_data/social_network_edges.csv";
let search_graph_pos = "./test/test_data/search_graph_multiple_SPs_positive.json";


describe('GRAPH SEARCH Tests - Floyd-Warshall - ', () => {
	
	let json 							: $J.IJSONInput,
			csv								: $C.ICSVInput,
			graph_search			: $G.IGraph,
			graph_nullcycle		: $G.IGraph,
			graph_bernd				: $G.IGraph,
			graph_midsize			: $G.IGraph,
			graph_social			: $G.IGraph,
			stats							: $G.GraphStats,
			FW_res						: {};


	before(() => {
		json = new JSON_IN(true,false,true);
		csv = new CSV_IN(' ',false,false);
		graph_search = json.readFromJSONFile(search_graph_pos);
		graph_bernd = json.readFromJSONFile(bernd_graph);
		graph_nullcycle = json.readFromJSONFile(search_graph);
		graph_midsize = json.readFromJSONFile(intermediate);
		graph_social = csv.readFromEdgeListFile(social_graph);
	});


	it('should correctly instantiate the search graph', () => {
		stats = graph_search.getStats();
		expect(stats.nr_nodes).to.equal(6);
		expect(stats.nr_dir_edges).to.equal(12);
		expect(stats.nr_und_edges).to.equal(2);
	});


	it('should refuse to compute FW APSP on empty graph', () => {
		var empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshallAPSP.bind($FW.FloydWarshallAPSP, empty_graph)).to.throw(
			"Cowardly refusing to traverse graph without edges.");
	});
	it('should refuse to compute FW on empty graph', () => {
		var empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshall.bind($FW.FloydWarshall, empty_graph)).to.throw(
			"Cowardly refusing to traverse graph without edges.");
	});
	it('should refuse to compute FW array on empty graph', () => {
		var empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshallArray.bind($FW.FloydWarshallArray, empty_graph)).to.throw(
			"Cowardly refusing to traverse graph without edges.");
	});

	describe('FW on small search graph - ', () => {

		describe('computing distances in UNDIRECTED _mode - ', () => {

			it.only('should correctly compute distance matrix for graph', () => {
				FW_res = $FW.FloydWarshallAPSP(graph_search);
				console.log(FW_res[0]);
				let expected_result = [
					[0, 3, 4, 1, 2, 4],
					[2, 0, 1, 3, 2, 1],
					[1, 4, 0, 2, 1, 5],
					[7, 6, 6, 0, 1, 7],
					[7, 5, 6, 1, 0, 6],
					[4, 7, 3, 5, 4, 0]
				];
				expect(FW_res[0]).to.deep.equal(expected_result);
			});

			it('should correctly compute distance matrix for graph with normal FW', () => {
				FW_res = $FW.FloydWarshall(graph_search);
				let expected_result =
					{ A: { B: 3, C: 4, D: 1, F: 4, E: 2 },
					B: { F: 1, C: 1, A: 2, E: 2, D: 3 },
					C: { E: 1, A: 1, B: 4, D: 2, F: 5 },
					D: { C: 6, E: 1, A: 7, B: 6, F: 7 },
					F: { E: 4, C: 3, A: 4, B: 7, D: 5 },
					E: { B: 5, D: 1, A: 7, C: 6, F: 6 } };

				expect(FW_res).to.deep.equal(expected_result);
			});

			it('should correctly compute distance matrix for graph, Array version', () => {
				FW_res = $FW.FloydWarshallArray(graph_search);
				// console.log( FW_res );
				let expected_result = [
					[0, 3, 4, 1, 2, 4],
					[2, 0, 1, 3, 2, 1],
					[1, 4, 0, 2, 1, 5],
					[7, 6, 6, 0, 1, 7],
					[7, 5, 6, 1, 0, 6],
					[4, 7, 3, 5, 4, 0]
				];
				expect(FW_res).to.deep.equal(expected_result);
			});

			/**
			 * TODO @Benedikt
			 */
			it.skip('should detect a negative cycle', () => {

			});

		});

	});

	describe('FW on several (slightly) larger graphs - ', () => {

		it('performance test of Floyd Warshal on a ~75 node / ~200 edge graph', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallArray(graph_bernd);			
			// FW_res = $FW.FloydWarshallWithShortestPaths(graph_bernd);
			// FW_res = $FW.FloydWarshallAPSP(graph_bernd);
			let e = +new Date();
			console.log("Floyd on Bernd (75 nodes) took " + (e-d) + "ms to finish");
		});


		it('performance test of FW implementation on 246 nodes)', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallAPSP(graph_midsize);
			let e = +new Date();
			console.log("Floyd on intermediate graph (246 nodes) with SPs took " + (e-d) + "ms to finish");
			d = +new Date();
			FW_res = $FW.FloydWarshall(graph_midsize);
			e = +new Date();
			console.log("Floyd on intermediate graph(246 nodes, DICT version) took " + (e-d) + "ms to finish");
			d = +new Date();
			FW_res = $FW.FloydWarshallArray(graph_midsize);
			// console.log(FW_res);
			e = +new Date();
			console.log("Floyd on intermediate graph without SPs (246 nodes, ARRAY version) took " + (e-d) + "ms to finish");
		});


		it.skip('75 nodes - FW with and without next should return same distance matrix', () => {
			let FW_with_next  = $FW.FloydWarshallAPSP(graph_bernd)[0];
			let FW_normal     = $FW.FloydWarshallArray(graph_bernd);
			expect(FW_with_next).to.deep.equal(FW_normal);
		});


		it('performance test of ~1k nodes and ~50k edges', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallArray(graph_social);
			// FW_res = $FW.FloydWarshallAPSP(graph_social);
			let e = +new Date();
			console.log("Floyd on social network ~1k (Array version) took " + (e-d) + "ms to finish");
		});
	});
	
});


function checkFWCentralitiesOnSmallGraph(graph_l, FW_res) {
	expect(Object.keys(FW_res).length).to.equal(graph_l.nrNodes());
	let nodes = graph_l.getNodes();
	for (let i in nodes) {
		for (let j in nodes) {
			//For Node A
			if(i=="A"&&j=="B")
				expect(FW_res[i][j]).to.equal(3);
			else if(i=="A"&&j=="C")
				expect(FW_res[i][j]).to.equal(4);
			else if(i=="A"&&j=="D")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="A"&&j=="E")
				expect(FW_res[i][j]).to.equal(2);
			else if(i=="A"&&j=="F")
				expect(FW_res[i][j]).to.equal(4);
			//For Node B
			else if(i=="B"&&j=="A")
				expect(FW_res[i][j]).to.equal(2);
			else if(i=="B"&&j=="C")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="B"&&j=="D")
				expect(FW_res[i][j]).to.equal(3);
			else if(i=="B"&&j=="E")
				expect(FW_res[i][j]).to.equal(2);
			else if(i=="B"&&j=="F")
				expect(FW_res[i][j]).to.equal(1);
			//For Node C
			else if(i=="C"&&j=="A")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="C"&&j=="B")
				expect(FW_res[i][j]).to.equal(4);
			else if(i=="C"&&j=="D")
				expect(FW_res[i][j]).to.equal(2);
			else if(i=="C"&&j=="E")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="C"&&j=="F")
				expect(FW_res[i][j]).to.equal(5);
			//For Node D
			else if(i=="D"&&j=="A")
				expect(FW_res[i][j]).to.equal(7);
			else if(i=="D"&&j=="B")
				expect(FW_res[i][j]).to.equal(6);
			else if(i=="D"&&j=="C")
				expect(FW_res[i][j]).to.equal(6);
			else if(i=="D"&&j=="E")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="D"&&j=="F")
				expect(FW_res[i][j]).to.equal(7);
			// For Node E
			else if(i=="E"&&j=="A")
				expect(FW_res[i][j]).to.equal(7);
			else if(i=="E"&&j=="B")
				expect(FW_res[i][j]).to.equal(5);
			else if(i=="E"&&j=="C")
				expect(FW_res[i][j]).to.equal(6);
			else if(i=="E"&&j=="D")
				expect(FW_res[i][j]).to.equal(1);
			else if(i=="E"&&j=="F")
				expect(FW_res[i][j]).to.equal(6);
			// For Node F
			else if(i=="F"&&j=="A")
				expect(FW_res[i][j]).to.equal(4);
			else if(i=="F"&&j=="B")
				expect(FW_res[i][j]).to.equal(7);
			else if(i=="F"&&j=="C")
				expect(FW_res[i][j]).to.equal(3);
			else if(i=="F"&&j=="D")
				expect(FW_res[i][j]).to.equal(5);
			else if(i=="F"&&j=="E")
				expect(FW_res[i][j]).to.equal(4);
		}
	}
}
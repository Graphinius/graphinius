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
			graph_nullcycle			: $G.IGraph,
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


	//TODO:::TODO
	it('should refuse to compute Graph with negative cylces', () => {
		var empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshallAPSP.bind($FW.FloydWarshallAPSP, graph_nullcycle)).to.throw(
			"Cannot compute FW on negative edges");
	});

	describe('FW on small search graph - ', () => {

		describe('computing distances in UNDIRECTED _mode - ', () => {

			it('should correctly compute distance matrix for graph by dense method', () => {
				FW_res = $FW.FloydWarshallAPSP(graph_search);
				checkFWCentralitiesOnSmallGraph(graph_search, FW_res[0]);
			});

		});

	});

	describe('FW on several (slightly) larger graphs - ', () => {

		it('performance test of Floyd Warshal on a ~75 node / ~200 edge graph', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallAPSP(graph_bernd);
			let e = +new Date();
			console.log("Floyd on Bernd (75 nodes) took " + (d-e) + "ms to finish");
		});

		it('performance test of FW implementation on 246 nodes)', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallAPSP(graph_midsize);
			let e = +new Date();
			console.log("Floyd on intermediate graph (246 nodes) with SPs took " + (d-e) + "ms to finish");
			d = +new Date();
			FW_res = $FW.FloydWarshall(graph_midsize);
			e = +new Date();
			console.log("Floyd on intermediate graph without SPs (246 nodes) took " + (d-e) + "ms to finish");
		});

		it('75 nodes - FW with and without next should return same distance matrix', () => {
			let FW_with_next  = $FW.FloydWarshallAPSP(graph_bernd)[0];
			let FW_normal     = $FW.FloydWarshall(graph_bernd);
			expect(FW_with_next).to.deep.equal(FW_normal);
		});


		it.skip('performance test of DENSE FW on ~1k nodes and ~50k edges', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshallAPSP(graph_social);
			let e = +new Date();
			console.log("DENSE Floyd on social network ~1k took " + (d-e) + "ms to finish");
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
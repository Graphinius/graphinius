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
			graph					: $G.IGraph,
			graph_bernd				: $G.IGraph,
			graph_midsize			: $G.IGraph,
			graph_social			: $G.IGraph,
			stats					: $G.GraphStats,
			FW_res					: {};


	before(() => {
		json = new JSON_IN(true,false,true);
		csv = new CSV_IN(' ',false,false);
		graph = json.readFromJSONFile(search_graph);
		graph_bernd = json.readFromJSONFile(bernd_graph);
		graph_midsize = json.readFromJSONFile(intermediate);
		graph_social = csv.readFromEdgeListFile(social_graph);
	});


	it('should correctly instantiate the search graph', () => {
		stats = graph.getStats();
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
				FW_res = $FW.FloydWarshall(graph);
				// just for comparison
				// let FW_res_sparse =
				//console.log(FW_res[1]);
				//console.log($FW.getAllShortestPaths(graph,FW_res[1]));

				FW_res = FW_res[0];
				expect(Object.keys(FW_res).length).to.equal(graph.nrNodes());
				let nodes = graph.getNodes();
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

			it('should correctly compute distances matrix for graph with sparse option', () => {
				FW_res = $FW.FloydWarshall(graph)[0];
				// just for comparison
				let FW_res_sparse = $FW.FloydWarshall(graph, true)[0];

				expect(FW_res).to.deep.equal(FW_res_sparse);
			});

			it.skip('should be equal Floyd-Warshalls (with and without adjency list)', () => {
				let dis: {} = $FW.FloydWarshall(graph)[0];
				let adj: {} = $FW.FloydWarshall(graph)[0];
				console.log(graph.nrNodes());
				console.log(dis);
				console.log(adj);
				expect(dis).to.equal(adj);
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
			FW_res = $FW.FloydWarshall(graph_bernd, true)[0];
			let e = +new Date();
			console.log("Floyd on Bernd took " + (d-e) + "ms to finish");
		});


		it('comparing dense and sparse FW implementation on slightly larger graph (75 nodes)', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_midsize)[0];
			let e = +new Date();
			console.log("Dense Floyd on intermediate sized graph took " + (d-e) + "ms to finish");

			d = +new Date();
			let FW_res_sparse = $FW.FloydWarshall(graph_midsize, true)[0];
			e = +new Date();
			console.log("Sparse Floyd on intermediate sized graph took " + (d-e) + "ms to finish");
			
			expect(FW_res).to.deep.equal(FW_res_sparse);
		});


		it.skip('performance test on social graph with ~1k nodes and ~50k edges', () => {
			let d = +new Date();
			FW_res = $FW.FloydWarshall(graph_social, true)[0];
			let e = +new Date();
			console.log("Sparse Floyd on social network ~1k took " + (d-e) + "ms to finish");

			d = +new Date();
			let FW_res_sparse = $FW.FloydWarshall(graph_social)[0];
			e = +new Date();
			console.log("Dense Floyd on social network ~1k took " + (d-e) + "ms to finish");

			expect(FW_res).to.deep.equal(FW_res_sparse);
		});

/*
		describe('computing distances in DIRECTED _mode - ', () => {

			it('should correctly compute distances from node A', () => {
				var root = graph.getNodeById('A'),
						config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(0);
				expect(bfs_res['B'].counter).to.equal(1);
				expect(bfs_res['C'].counter).to.equal(2);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(0);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(1);
				expect(bfs_res['B'].parent).to.equal(root);
				expect(bfs_res['C'].distance).to.equal(1);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node D', () => {
				var root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(0);
				expect(bfs_res['E'].counter).to.equal(1);
				expect(bfs_res['F'].counter).to.equal(2);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(0);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(1);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node C', () => {
				var root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(1);
				expect(bfs_res['B'].counter).to.equal(2);
				expect(bfs_res['C'].counter).to.equal(0);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(1);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(2);
				expect(bfs_res['B'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).to.equal(0);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node G', () => {
				var root = graph.getNodeById('G'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(0);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(0);
				expect(bfs_res['G'].parent).to.equal(root);
			});

		});


		describe('computing distances in MIXED _mode - ', () => {

			it('should correctly compute distances from node A', () => {
				var root = graph.getNodeById('A');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				// undirected before directed...
				// shall we sort those nodes by id first??
				// nope......
				expect(bfs_res['A'].counter).to.equal(0);
				expect(bfs_res['B'].counter).to.equal(1);
				expect(bfs_res['C'].counter).to.equal(2);
				expect(bfs_res['D'].counter).to.equal(4);
				expect(bfs_res['E'].counter).to.equal(5);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(0);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(1);
				expect(bfs_res['B'].parent).to.equal(root);
				expect(bfs_res['C'].distance).to.equal(1);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(1);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(2);
				expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node D', () => {
				var root = graph.getNodeById('D');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(2);
				expect(bfs_res['B'].counter).to.equal(4);
				expect(bfs_res['C'].counter).to.equal(5);
				expect(bfs_res['D'].counter).to.equal(0);
				expect(bfs_res['E'].counter).to.equal(1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(1);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(2);
				expect(bfs_res['B'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).to.equal(2);
				expect(bfs_res['C'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['D'].distance).to.equal(0);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(1);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node E', () => {
				var root = graph.getNodeById('E');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(0);
				expect(bfs_res['F'].counter).to.equal(1);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(0);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node G', () => {
				var root = graph.getNodeById('G');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(0);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(0);
				expect(bfs_res['G'].parent).to.equal(root);
			});

		});
		
		
		describe('computing distance weight_dists in MIXED _mode - ', () => {

			it('should correctly compute weight_dists from node A', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('A'),
						config = $BFS.prepareBFSStandardConfig(),
						weight_dists = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weight_dists['A']).to.equal(0);
				expect(weight_dists['B']).to.equal(4);
				expect(weight_dists['C']).to.equal(2);
				expect(weight_dists['D']).to.equal(7);
				expect(weight_dists['E']).to.equal(12);
				expect(weight_dists['F']).to.equal(8);
				expect(weight_dists['G']).to.equal(Number.POSITIVE_INFINITY);
			});
			
			
			it('should correctly compute weight_dists from node C', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('C'),
						config = $BFS.prepareBFSStandardConfig(),
						weight_dists = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weight_dists['A']).to.equal(3);
				expect(weight_dists['B']).to.equal(7);
				expect(weight_dists['C']).to.equal(0);
				expect(weight_dists['D']).to.equal(10);
				expect(weight_dists['E']).to.equal(15);
				expect(weight_dists['F']).to.equal(11);
				expect(weight_dists['G']).to.equal(Number.POSITIVE_INFINITY);				
			});
			
		});

		
	});

	
	/**
	 * Sorted BFS on small search graph PFS JSON
	 * 
	 * Running four tests on function sorting by weight_dists ascending,
	 * then four more tests on sorting by weight_dists descending
	 */
/*
	describe('PFS_BFS graph traversal tests with edge weight ascending sort - ', () => {

		var search_graph_pfs = "./test/test_data/search_graph_pfs.json",
				json = new $I.JSONInput(true, true, true),
				graph = json.readFromJSONFile(search_graph_pfs);

		beforeEach(() => {
			expect(graph.nrNodes()).to.equal(6);
			expect(graph.nrDirEdges()).to.equal(9);
			expect(graph.nrUndEdges()).to.equal(0);
		});
		
		
		it('Should traverse search graph in correct order, ascending, root is A', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = ascSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(0);
			expect(bfs_res['B'].counter).to.equal(2);
			expect(bfs_res['C'].counter).to.equal(3);
			expect(bfs_res['D'].counter).to.equal(1);
			expect(bfs_res['E'].counter).to.equal(4);
			expect(bfs_res['F'].counter).to.equal(5);

			expect(bfs_res['A'].distance).to.equal(0);
			expect(bfs_res['B'].distance).to.equal(1);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(1);
			expect(bfs_res['E'].distance).to.equal(2);
			expect(bfs_res['F'].distance).to.equal(2);

			expect(bfs_res['A'].parent).to.equal(root);
			expect(bfs_res['B'].parent).to.equal(root);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
		});


		it('Should traverse search graph in correct order, ascending, root is D', () => {
			var root = graph.getNodeById('D'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = ascSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(-1);
			expect(bfs_res['B'].counter).to.equal(-1);
			expect(bfs_res['C'].counter).to.equal(1);
			expect(bfs_res['D'].counter).to.equal(0);
			expect(bfs_res['E'].counter).to.equal(2);
			expect(bfs_res['F'].counter).to.equal(-1);

			expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(0);
			expect(bfs_res['E'].distance).to.equal(1);
			expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

			expect(bfs_res['A'].parent).to.equal(null);
			expect(bfs_res['B'].parent).to.equal(null);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(null);
		});


		it('Should traverse search graph in correct order, DEscending, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = descSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(0);
			expect(bfs_res['B'].counter).to.equal(2);
			expect(bfs_res['C'].counter).to.equal(1);
			expect(bfs_res['D'].counter).to.equal(3);
			expect(bfs_res['E'].counter).to.equal(4);
			expect(bfs_res['F'].counter).to.equal(5);

			expect(bfs_res['A'].distance).to.equal(0);
			expect(bfs_res['B'].distance).to.equal(1);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(1);
			expect(bfs_res['E'].distance).to.equal(2);
			expect(bfs_res['F'].distance).to.equal(2);

			expect(bfs_res['A'].parent).to.equal(root);
			expect(bfs_res['B'].parent).to.equal(root);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('C'));
			expect(bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
		});


		it('Should traverse search graph in correct order, DEscending, root is D', () => {
			var root = graph.getNodeById('D'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = descSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(-1);
			expect(bfs_res['B'].counter).to.equal(-1);
			expect(bfs_res['C'].counter).to.equal(2);
			expect(bfs_res['D'].counter).to.equal(0);
			expect(bfs_res['E'].counter).to.equal(1);
			expect(bfs_res['F'].counter).to.equal(-1);

			expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(0);
			expect(bfs_res['E'].distance).to.equal(1);
			expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

			expect(bfs_res['A'].parent).to.equal(null);
			expect(bfs_res['B'].parent).to.equal(null);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(null);
		});


		it('Should correctly compute weight distance with ascending sort function, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = ascSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(0);
			expect(weight_dists['B']).to.equal(3);
			expect(weight_dists['C']).to.equal(4);
			expect(weight_dists['D']).to.equal(1);
			expect(weight_dists['E']).to.equal(18);
			expect(weight_dists['F']).to.equal(4);
		});


		it('Should correctly compute weight distance with ascending sort function, root is B', () => {
			var root = graph.getNodeById('B'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = ascSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['B']).to.equal(0);
			expect(weight_dists['C']).to.equal(2);
			expect(weight_dists['D']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['E']).to.equal(6);
			expect(weight_dists['F']).to.equal(1);
		});


		it('Should correctly compute weight distance with DEscending sort function, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = descSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(0);
			expect(weight_dists['B']).to.equal(3);
			expect(weight_dists['C']).to.equal(4);
			expect(weight_dists['D']).to.equal(1);
			expect(weight_dists['E']).to.equal(5);
			expect(weight_dists['F']).to.equal(4);
		});


		it('Should correctly compute weight distance with DEscending sort function, root is B', () => {
			var root = graph.getNodeById('B'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = descSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['B']).to.equal(0);
			expect(weight_dists['C']).to.equal(2);
			expect(weight_dists['D']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['E']).to.equal(3);
			expect(weight_dists['F']).to.equal(1);
		});
*/
	});
	
});
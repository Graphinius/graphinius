/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $I from '../../../src/io/input/CSVInput';
import * as $C from '../../../test/io/input/common';
import * as $R from '../../../src/utils/remoteUtils';
import { Logger } from '../../../src/utils/logger';
const logger = new Logger();


var expect = chai.expect,
		Node = $N.BaseNode,
		Edge = $E.BaseEdge,
		Graph = $G.BaseGraph,
		CSV = $I.CSVInput;

const REMOTE_HOST = "raw.githubusercontent.com";
const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/csv/";
const CSV_EXTENSION = ".csv";

const REAL_GRAPH_NR_NODES = 5937,
	  	REAL_GRAPH_NR_EDGES = 17777;

		
describe("ASYNC CSV GRAPH INPUT TESTS - ", () => {
	
	var csv: $I.ICSVInput,
			sep: string,
			input_file: string,
			graph: $G.IGraph,
			stats: $G.GraphStats,
			DEFAULT_SEP: string = ',',
			config : $R.RequestConfig;
	
	beforeEach(() => {
		config = {
			remote_host: REMOTE_HOST,
			remote_path: REMOTE_PATH,
			file_name: undefined
		};
	});	
		
	/**
		* REMOTE test
		* The CSV will be encoded as an adjacency list
		*/
	it('should construct a very small graph from a REMOTELY FETCHED adjacency list and produce the right stats', (done) => {
		csv = new $I.CSVInput();
		config.file_name = "small_graph_adj_list_def_sep" + CSV_EXTENSION;
		csv.readFromAdjacencyListURL(config, function(graph, err) {
			$C.checkSmallGraphStats(graph);
			done();
		});
	});


	/**
		* REMOTE test
		* The CSV will be encoded as an edge list
		*/
	it('should construct a very small graph from a REMOTELY FETCHED edge list and produce the right stats', (done) => {
		config.file_name = "small_graph_edge_list" + CSV_EXTENSION;
		csv.readFromEdgeListURL(config, function(graph, err) {
			$C.checkSmallGraphStats(graph);
			done();
		});
	});


	/**
		* Remotely fetched edge list with a REAL sized graph, edges set to directed
		* graph should have 5937 nodes.
		*/
	it('should construct a real sized graph from a remote URL (edge list)', (done) => {
		csv._separator = " ";
		csv._explicit_direction = false;
		csv._direction_mode = true;
		config.file_name = "real_graph_edge_list_no_dir" + CSV_EXTENSION;
		csv.readFromEdgeListURL(config, function(graph, err) {
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(REAL_GRAPH_NR_NODES);
			expect(stats.nr_dir_edges).to.equal(REAL_GRAPH_NR_EDGES);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
			done();
		});
	});
		
});

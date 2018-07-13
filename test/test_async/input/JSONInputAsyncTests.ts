/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $I from '../../../src/io/input/JSONInput';
import * as $C from '../../../test/io/input/common';
import * as $R from '../../../src/utils/remoteUtils';

var expect 	= chai.expect;
var Node 	= $N.BaseNode;
var Edge 	= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;


describe('ASYNC JSON GRAPH INPUT TESTS - ', () => {
	
	var json 					: $I.IJSONInput,
			remote_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats;
	
	const REMOTE_HOST = "raw.githubusercontent.com";
	const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/json/";
	const JSON_EXTENSION = ".json";

	const REAL_GRAPH_NR_NODES = 6204,
		  	REAL_GRAPH_NR_EDGES = 18550;
	
	let config : $R.RequestConfig;


	describe('Small test graph', () => {

		beforeEach(() => {
			config = {
				remote_host: REMOTE_HOST,
				remote_path: REMOTE_PATH,
				file_name: "small_graph" + JSON_EXTENSION
			};
		});
				
		it('should correctly generate our small example graph from a remotely fetched JSON file with explicitly encoded edge directions', (done) => {
			json = new JSON_IN();
			json.readFromJSONURL(config, function(graph, err) {
				$C.checkSmallGraphStats(graph);
				done();
			});
		});
		
		
		it('should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected', (done) => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction = false; // undirected graph
			json.readFromJSONURL(config, function(graph, err) {
				expect(graph.nrNodes()).to.equal(4);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(4);
				expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
				done();
			});
		});
		
		
		it('should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected', (done) => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction = true; // undirected graph
			json.readFromJSONURL(config, function(graph, err) {
				expect(graph.nrNodes()).to.equal(4);
				expect(graph.nrDirEdges()).to.equal(7);
				expect(graph.nrUndEdges()).to.equal(0);
				expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
				done();
			});
		});
		
	});
	
	
	describe('Real graph from JSON', () => {
		
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 undirected nodes.
		 */ 
		it('should construct a real sized graph from a remotely fetched edge list with edges set to undirected', (done) => {
			json = new JSON_IN();
			config.file_name = "real_graph" + JSON_EXTENSION;
			json.readFromJSONURL(config, function(graph, err) {
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(REAL_GRAPH_NR_NODES);
				expect(stats.nr_dir_edges).to.equal(0);
				expect(stats.nr_und_edges).to.equal(REAL_GRAPH_NR_EDGES);
				expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
				done();
			});
			
		});
	
	});
			
});
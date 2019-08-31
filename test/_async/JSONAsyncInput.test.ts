import * as $G from '../../src/core/base/BaseGraph';
import * as $C from '../io/input/common';
import * as $R from '../../src/utils/RemoteUtils';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';


const std_json_in_config: IJSONInConfig = {
	explicit_direction: false,
	directed: false,
	weighted: false
};


describe('ASYNC JSON GRAPH INPUT TESTS - ', () => {

	let json: JSONInput,
		stats: $G.GraphStats;

	const REMOTE_HOST = "raw.githubusercontent.com";
	const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/json/";
	const JSON_EXTENSION = ".json";

	const REAL_GRAPH_NR_NODES = 6204,
				REAL_GRAPH_NR_EDGES = 18550;

	let config: $R.RequestConfig;


	describe('Small test graph', () => {

		beforeEach(() => {
			config = {
				remote_host: REMOTE_HOST,
				remote_path: REMOTE_PATH,
				file_name: "small_graph" + JSON_EXTENSION
			};
		});


		test(
			'should correctly generate our small example graph from a remotely fetched JSON file with explicitly encoded edge directions',
			(done) => {
				json = new JSONInput();
				json.readFromJSONURL(config, function (graph, err) {
					$C.checkSmallGraphStats(graph);
					done();
				});
			}
		);


		test(
			'should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected',
			(done) => {
				json = new JSONInput(std_json_in_config);
				json.readFromJSONURL(config, function (graph, err) {
					expect(graph.nrNodes()).toBe(4);
					expect(graph.nrDirEdges()).toBe(0);
					expect(graph.nrUndEdges()).toBe(4);
					expect(graph.getMode()).toBe($G.GraphMode.UNDIRECTED);
					done();
				});
			}
		);


		test(
			'should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected',
			(done) => {
				json = new JSONInput({explicit_direction: false, directed: true});
				json.readFromJSONURL(config, function (graph, err) {
					expect(graph.nrNodes()).toBe(4);
					expect(graph.nrDirEdges()).toBe(7);
					expect(graph.nrUndEdges()).toBe(0);
					expect(graph.getMode()).toBe($G.GraphMode.DIRECTED);
					done();
				});
			}
		);

	});


	describe('Real graph from JSON', () => {

		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 undirected nodes.
		 */
		test(
			'should construct a real sized graph from a remotely fetched edge list with edges set to undirected',
			(done) => {
				json = new JSONInput();
				config.file_name = "real_graph" + JSON_EXTENSION;
				json.readFromJSONURL(config, function (graph, err) {
					stats = graph.getStats();
					expect(stats.nr_nodes).toBe(REAL_GRAPH_NR_NODES);
					expect(stats.nr_dir_edges).toBe(0);
					expect(stats.nr_und_edges).toBe(REAL_GRAPH_NR_EDGES);
					expect(stats.mode).toBe($G.GraphMode.UNDIRECTED);
					done();
				});

			}
		);

	});

});
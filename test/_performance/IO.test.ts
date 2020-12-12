import { GraphMode } from '../../lib/core/interfaces';
import { CSV_DATA_PATH, JSON_DATA_PATH, OUTPUT_PATH } from "../config/test_paths";
import { CSVInput } from '../../lib/io/input/CSVInput';
import { CSVOutput, ICSVOutConfig } from '../../lib/io/output/CSVOutput';
import { JSONInput } from "../../lib/io/input/JSONInput";

let csvIn = new CSVInput({
	separator: ' ',
	explicit_direction: false,
	direction_mode: false
});

let csvOut = new CSVOutput({
	separator: ',',
	explicit_direction: false,
	direction_mode: false
});

const
	graph_6K_file = `${JSON_DATA_PATH}/real_graph.json`,
	json = new JSONInput({ explicit_direction: false, directed: false, weighted: false }),
	graph_6K = json.readFromJSONFile(graph_6K_file);

const
	REAL_GRAPH_NR_NODES = 6204,
	REAL_GRAPH_NR_EDGES = 18550;


describe('CSVInput performance tests - ', () => {

	test(
		'should construct a real sized graph from an edge list, UNdirected',
		() => {
			const input_file = "real_graph_edge_list_no_dir.csv";
			const graph = csvIn.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
			const stats = graph.getStats();
			expect(stats.nr_nodes).toBe(5937);
			expect(stats.nr_dir_edges).toBe(0);
			expect(stats.nr_und_edges).toBe(17777);
			expect(stats.mode).toBe(GraphMode.UNDIRECTED);
		}
	);


	test(
		'should construct a real sized graph from an edge list with edges, directed',
		() => {
			csvIn._config.direction_mode = true;
			const input_file = "real_graph_edge_list_no_dir.csv";
			const graph = csvIn.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
			const stats = graph.getStats();
			expect(stats.nr_nodes).toBe(5937);
			expect(stats.nr_dir_edges).toBe(17777);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe(GraphMode.DIRECTED);
		}
	);

});



describe('CSVOutput performance tests - ', () => {

	test('should output a real graph as CSV file', () => {
		expect(graph_6K.nrNodes()).toBe(REAL_GRAPH_NR_NODES);
		expect(graph_6K.nrUndEdges()).toBe(REAL_GRAPH_NR_EDGES);

		let outfile = OUTPUT_PATH + "/adj_list_real_graph.csv";
		csvOut.writeToAdjacencyListFile(outfile, graph_6K);

		csvIn = new CSVInput({ separator: ',', explicit_direction: false, direction_mode: false });
		let inGraph = csvIn.readFromAdjacencyListFile(outfile);
		expect(inGraph.nrNodes()).toBe(REAL_GRAPH_NR_NODES);
		expect(inGraph.nrDirEdges()).toBe(0);
		expect(inGraph.nrUndEdges()).toBe(REAL_GRAPH_NR_EDGES);
	});

});



describe('JSONInput performance tests - ', () => {

	const json: JSONInput = new JSONInput();


	it('should construct a real sized graph from an edge list with edges set to undirected',
		() => {
			const graph = json.readFromJSONFile(graph_6K_file);
			const stats = graph.getStats();
			expect(stats.nr_nodes).toBe(REAL_GRAPH_NR_NODES);
			expect(stats.nr_dir_edges).toBe(0);
			expect(stats.nr_und_edges).toBe(REAL_GRAPH_NR_EDGES);
			expect(stats.mode).toBe(GraphMode.UNDIRECTED);
		}
	);


	it(
		'should construct a real sized graph from an edge list with edges set to directed',
		() => {
			json._config.explicit_direction = false;
			json._config.directed = true;
			const graph = json.readFromJSONFile(graph_6K_file);
			const stats = graph.getStats();
			expect(stats.nr_nodes).toBe(REAL_GRAPH_NR_NODES);
			expect(stats.nr_dir_edges).toBe(REAL_GRAPH_NR_EDGES);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe(GraphMode.DIRECTED);
		}
	);


	/**
	 * @todo this is actually a BaseGraph test using JSONInput... ignore for now...
	 */
	it(
		'should mutilate a graph (delte nodes) until it is completely empty - in a performant way',
		() => {
			json._config.explicit_direction = false;
			json._config.directed = false;
			const graph = json.readFromJSONFile(graph_6K_file);

			let nr_nodes = graph.nrNodes();
			while (nr_nodes--) {
				graph.deleteNode(graph.getNodeById(String(nr_nodes)));
			}
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
		}
	);

});
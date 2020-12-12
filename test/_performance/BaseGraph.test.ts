import {CSV_SN_PATH, JSON_DATA_PATH} from "../config/test_paths";
import {Logger} from "../../src/utils/Logger";
import {CSVInput} from "../../src/io/input/CSVInput";
import {JSONInput} from "../../src/io/input/JSONInput";
import {DegreeCentrality} from "../../src/centralities/Degree";
import {DFS} from "../../src/traversal/DFS";
import {ComputeGraph} from "../../src/core/compute/ComputeGraph";

const logger = new Logger();

const csv = new CSVInput({
	separator: ' ',
	explicit_direction: false,
	direction_mode: true,
	weighted: true
});

const json = new JSONInput({
	explicit_direction: false,
	directed: false,
	weighted: true
});

const bernd_graph_file = `${JSON_DATA_PATH}/BerndAres2016.json`;

const
	sn_graph_300 = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_300.csv`),
	sn_graph_1K = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_1K.csv`),
	graph_6K = json.readFromJSONFile(`${JSON_DATA_PATH}/real_graph.json`);


const
	REAL_GRAPH_NR_NODES = 6204,
	REAL_GRAPH_NR_EDGES = 18550;


describe("Adjacency List performance test - ", () => {

	describe('DICT version - ', () => {

		[sn_graph_300, sn_graph_1K].forEach(graph => {
			it('should measure the time it takes to create the adj.list.DICT for a 1034 node graph',
				() => {
					let tic = +new Date;
					let adjListDict = new ComputeGraph(graph).adjListW(false, false);
					let toc = +new Date;

					logger.log(`Construction of adjList DICT on ${graph.nrNodes()} took ${toc - tic} ms.`);
					expect(Object.keys(adjListDict).length).toBe(graph.nrNodes());
				}
			);
		});

	});


	describe('ARRAY version - ', () => {

		[sn_graph_300, sn_graph_1K].forEach(graph => {
			it('performance test on next array including incoming edges for UNDIRECTED, UNWEIGHTED graph',
				() => {
					let tic = +new Date;
					const adj_list = new ComputeGraph(graph).adjMatrixW(true);
					let toc = +new Date;

					logger.log(`Construction of adjList ARRAY on ${graph.nrNodes()} took ${toc - tic} ms.`);
					expect(adj_list.length).toBe(graph.nrNodes());
					adj_list.forEach(adj_entry => expect(adj_entry.length).toBe(graph.nrNodes()));
				}
			);
		});

	});


	describe('NEXT array - ', () => {
		[sn_graph_300, sn_graph_1K].forEach(graph => {
			it('performance test on NEXT array including incoming edges for UNDIRECTED, UNWEIGHTED graph',
				() => {
					let tic = +new Date;
					new ComputeGraph(graph).nextArray(true);
					let toc = +new Date;

					logger.log(`Construction of NEXT ARRAY on ${graph.nrNodes()} took ${toc - tic} ms.`);
				}
			);

		});

	});

});


describe('Graph cloning - ', () => {

	it('should successfully clone a real-world graph in explicit mode including weights',
		() => {
			const degCent = new DegreeCentrality();
			const deg_dist_all = degCent.degreeDistribution(graph_6K).all;

			const clone_graph = graph_6K.cloneStructure();
			let clone_deg_dist_all = degCent.degreeDistribution(clone_graph).all;

			expect(clone_graph.nrNodes()).toBe(REAL_GRAPH_NR_NODES);
			expect(clone_graph.nrUndEdges()).toBe(REAL_GRAPH_NR_EDGES);
			expect(clone_graph.nrDirEdges()).toBe(0);
			expect(clone_deg_dist_all).toEqual(deg_dist_all);
			// expect(clone_graph).toEqual(graph_6K); // max call stack size exceeded
		}
	);

	/**
	 * @todo find better `standard` graphs so we don't need to guess a starting node
	 * @todo node number check is non expressive since the target node's component could be smaller
	 * @todo edge number check is meaningless since we only got it from checking the output ;-)
	 */
	[sn_graph_1K].forEach(graph => {
		it('should successfully clone a subgraph', () => {
			const clone_graph = graph.cloneSubGraphStructure(graph.getNodeById("1374"), 300);

			// logger.log(clone_graph.nrDirEdges());
			expect(clone_graph.nrNodes()).toBe(300);
			expect(clone_graph.nrUndEdges()).toBe(0);
			expect(clone_graph.nrDirEdges()).toBe(9234);
		});
	});

});


describe('Negative cycle checks - ', () => {

	test(
		'performance test on bernd graph (1483 nodes), no negative cycles',
		() => {
			const json = new JSONInput({explicit_direction: false, directed: true, weighted: false});
			const graph_bernd = json.readFromJSONFile(bernd_graph_file);
			const start_node = "1040";
			expect(DFS(graph_bernd, graph_bernd.getNodeById(start_node)).length).toBe(5);
			expect(graph_bernd.hasNegativeCycles()).toBe(false);
		}
	);


	test(
		'performance test on bernd graph (1483 nodes), WITH negative cycles',
		() => {
			const json = new JSONInput({explicit_direction: false, directed: true, weighted: true});
			const graph_bernd = json.readFromJSONFile(bernd_graph_file);
			const start_node = "1040";
			const edges = graph_bernd.getDirEdges();
			for (let edge_idx in edges) {
				edges[edge_idx].setWeight(-1);
			}
			expect(DFS(graph_bernd, graph_bernd.getNodeById(start_node)).length).toBe(5);
			expect(graph_bernd.hasNegativeCycles()).toBe(true);
		}
	);

});
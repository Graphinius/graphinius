import * as $G from '../../src/core/base/BaseGraph';
import * as $FW from '../../src/search/FloydWarshall';
import { CSVInput, ICSVInConfig } from '../../src/io/input/CSVInput';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import { CSV_SN_PATH, JSON_DATA_PATH } from '../config/test_paths';

import {Logger} from '../../src/utils/Logger';
import {GraphStats} from "../../src/core/interfaces";
const logger = new Logger();

let social_graph = `${CSV_SN_PATH}/social_network_edges_1K.csv`;
let search_graph = `${JSON_DATA_PATH}/search_graph_multiple_SPs.json`;
let bernd_graph = `${JSON_DATA_PATH}/bernd_ares_pos.json`;
let intermediate = `${JSON_DATA_PATH}/bernd_ares_intermediate_pos.json`;
let search_graph_pos = `${JSON_DATA_PATH}/search_graph_multiple_SPs_positive.json`;

const csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

const json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: false,
	weighted: true
};


describe('GRAPH SEARCH Tests - Floyd-Warshall - ', () => {

	let
		json: JSONInput,
		csv: CSVInput,
		graph_search: $G.IGraph,
		graph_nullcycle: $G.IGraph,
		graph_bernd: $G.IGraph,
		graph_intermediate: $G.IGraph,
		graph_social: $G.IGraph,
		stats: GraphStats,
		FW_res: {};


	beforeAll(() => {
		json = new JSONInput(json_in_config);
		csv = new CSVInput(csv_config);
		graph_search = json.readFromJSONFile(search_graph_pos);
		graph_bernd = json.readFromJSONFile(bernd_graph);
		graph_nullcycle = json.readFromJSONFile(search_graph);
		graph_intermediate = json.readFromJSONFile(intermediate);
		graph_social = csv.readFromEdgeListFile(social_graph);
	});


	test('should correctly instantiate the search graph', () => {
		stats = graph_search.getStats();
		expect(stats.nr_nodes).toBe(6);
		expect(stats.nr_dir_edges).toBe(12);
		expect(stats.nr_und_edges).toBe(2);
	});


	test('should refuse to compute FW APSP on empty graph', () => {
		let empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshallAPSP.bind($FW.FloydWarshallAPSP, empty_graph)).toThrowError("Cowardly refusing to traverse graph without edges.");
	});


	test('should refuse to compute FW array on empty graph', () => {
		let empty_graph = new $G.BaseGraph("iamempty");
		expect($FW.FloydWarshallArray.bind($FW.FloydWarshallArray, empty_graph)).toThrowError("Cowardly refusing to traverse graph without edges.");
	});


	describe('FW on small search graph - ', () => {

		describe('computing distances in UNDIRECTED _mode - ', () => {

			test('should correctly compute distance matrix for graph', () => {
				FW_res = $FW.FloydWarshallAPSP(graph_search);
				logger.log(FW_res[1]);
				//@Bernd: when I solved it on paper, I got different results
				//there is an edge between D and E with a weight of 0
				//and it seems to re-weigh it to 1, that is causing the differences
				const expected_result = [
					[0, 3, 4, 1, 2, 4],
					[2, 0, 1, 3, 2, 1],
					[1, 4, 0, 2, 1, 5],
					[7, 6, 6, 0, 1, 7],
					[7, 5, 6, 1, 0, 6],
					[4, 7, 3, 5, 4, 0]
				];
				expect(FW_res[0]).toEqual(expected_result);
			});


			test(
				'should correctly compute distance matrix for graph, Array version',
				() => {
					FW_res = $FW.FloydWarshallArray(graph_search);
					// logger.log( FW_res );
					const expected_result = [
						[0, 3, 4, 1, 2, 4],
						[2, 0, 1, 3, 2, 1],
						[1, 4, 0, 2, 1, 5],
						[7, 6, 6, 0, 1, 7],
						[7, 5, 6, 1, 0, 6],
						[4, 7, 3, 5, 4, 0]
					];
					expect(FW_res).toEqual(expected_result);
				}
			);
		});


		test(
			'75 nodes - FW with and without next should return same distance matrix',
			() => {
				let FW_with_next = $FW.FloydWarshallAPSP(graph_bernd)[0];
				let FW_normal = $FW.FloydWarshallArray(graph_bernd);
				expect(FW_with_next).toEqual(FW_normal);
			}
		);

	});

});


/**
 *
 * @param graph_l
 * @param FW_res
 *
 * @todo make it feel used again ;-)
 * @todo first adapt FW to re-map Array weights to a dict - then invoke this again
 */
/*
function checkFWCentralitiesOnSmallGraph(graph_l, FW_res) {
	expect(Object.keys(FW_res).length).toBe(graph_l.nrNodes());
	let nodes = graph_l.getNodes();
	for (let i in nodes) {
		for (let j in nodes) {
			//For Node A
			if (i == "A" && j == "B")
				expect(FW_res[i][j]).toBe(3);
			else if (i == "A" && j == "C")
				expect(FW_res[i][j]).toBe(4);
			else if (i == "A" && j == "D")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "A" && j == "E")
				expect(FW_res[i][j]).toBe(2);
			else if (i == "A" && j == "F")
				expect(FW_res[i][j]).toBe(4);
			//For Node B
			else if (i == "B" && j == "A")
				expect(FW_res[i][j]).toBe(2);
			else if (i == "B" && j == "C")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "B" && j == "D")
				expect(FW_res[i][j]).toBe(3);
			else if (i == "B" && j == "E")
				expect(FW_res[i][j]).toBe(2);
			else if (i == "B" && j == "F")
				expect(FW_res[i][j]).toBe(1);
			//For Node C
			else if (i == "C" && j == "A")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "C" && j == "B")
				expect(FW_res[i][j]).toBe(4);
			else if (i == "C" && j == "D")
				expect(FW_res[i][j]).toBe(2);
			else if (i == "C" && j == "E")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "C" && j == "F")
				expect(FW_res[i][j]).toBe(5);
			//For Node D
			else if (i == "D" && j == "A")
				expect(FW_res[i][j]).toBe(7);
			else if (i == "D" && j == "B")
				expect(FW_res[i][j]).toBe(6);
			else if (i == "D" && j == "C")
				expect(FW_res[i][j]).toBe(6);
			else if (i == "D" && j == "E")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "D" && j == "F")
				expect(FW_res[i][j]).toBe(7);
			// For Node E
			else if (i == "E" && j == "A")
				expect(FW_res[i][j]).toBe(7);
			else if (i == "E" && j == "B")
				expect(FW_res[i][j]).toBe(5);
			else if (i == "E" && j == "C")
				expect(FW_res[i][j]).toBe(6);
			else if (i == "E" && j == "D")
				expect(FW_res[i][j]).toBe(1);
			else if (i == "E" && j == "F")
				expect(FW_res[i][j]).toBe(6);
			// For Node F
			else if (i == "F" && j == "A")
				expect(FW_res[i][j]).toBe(4);
			else if (i == "F" && j == "B")
				expect(FW_res[i][j]).toBe(7);
			else if (i == "F" && j == "C")
				expect(FW_res[i][j]).toBe(3);
			else if (i == "F" && j == "D")
				expect(FW_res[i][j]).toBe(5);
			else if (i == "F" && j == "E")
				expect(FW_res[i][j]).toBe(4);
		}
	}
}
*/

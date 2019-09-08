import * as $G from '../../src/core/base/BaseGraph';
import { CSVInput, ICSVInConfig } from '../../src/io/input/CSVInput';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import * as $CC from '../../src/centralities/Closeness';
import {CSV_CENT_PATH, CSV_DATA_PATH, CSV_SN_PATH, JSON_DATA_PATH} from '../config/test_paths';


const csv_in_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

const json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: true,
	weighted: true
};


const csv = new CSVInput(csv_in_config),
	json = new JSONInput(json_in_config),
	sn_graph_file_1K 		= `${CSV_SN_PATH}/social_network_edges_1K.csv`,
	sn_graph_file_300 	= `${CSV_SN_PATH}/social_network_edges_300.csv`,
	und_unw_graph 			= `${CSV_DATA_PATH}/undirected_unweighted_6nodes.csv`,
	deg_cent_graph 			= `${JSON_DATA_PATH}/search_graph_pfs_extended.json`,
	graph: $G.IGraph = json.readFromJSONFile(deg_cent_graph),
	graph_und_unw: $G.IGraph = csv.readFromEdgeListFile(und_unw_graph),
	CC = new $CC.ClosenessCentrality();


describe("Closeness Centrality Tests", () => {

	test('should return a map of nodes of length 6', () => {
		let ccfw = CC.getCentralityMapFW(graph);
		expect(Object.keys(ccfw).length).toBe(6);
		let cc = CC.getCentralityMap(graph);
		expect(Object.keys(cc).length).toBe(6);
	});

	test('Testing on single node graph', () => {
		let graph_1: $G.IGraph = json.readFromJSONFile(`${JSON_DATA_PATH}/centralities_equal_score_1.json`);

		expect(CC.getCentralityMap.bind(CC.getCentralityMap, graph_1)).toThrowError("Cowardly refusing to traverse graph without edges.");
		expect(CC.getCentralityMapFW.bind(CC.getCentralityMapFW, graph_1)).toThrowError("Cowardly refusing to traverse graph without edges.");

		//This results in an empty map because there are no edges in the graph
		//expect( Object.keys( closeness_map ).length ).to.equal(0);
	});


	test('should return the correct closeness map, PFS on weighted directed graph', () => {
			let expected_closeness_map = {
				"A": 0.07692307692307693,
				"B": 0.08333333333333333,
				"C": 0.08333333333333333,
				"D": 0.041666666666666664,
				"E": 0.041666666666666664,
				"F": 0.045454545454545456

			};
			let closeness_map = CC.getCentralityMap(graph);
			expect(closeness_map).toEqual(expected_closeness_map);
		}
	);

	test('should return the correct closenesses, FW on weighted directed graph', () => {
			let expected_closeness_map = [
				0.07692307692307693,
				0.08333333333333333,
				0.08333333333333333,
				0.041666666666666664,
				0.041666666666666664,
				0.045454545454545456
			];
			let CCFW = new $CC.ClosenessCentrality();
			let closeness_map = CCFW.getCentralityMapFW(graph);
			expect(closeness_map).toEqual(expected_closeness_map);
		}
	);

	test('should return the correct closeness map, PFS/FW on unweighted undirected graph, for normal and FW with next', () => {
			let expected_closeness_map = {
				"1": 0.14285714285714285,   //1/7
				"2": 0.16666666666666666,   //1/6
				"3": 0.2,                   //1/5
				"4": 0.14285714285714285,
				"5": 0.16666666666666666,
				"6": 0.14285714285714285

			};
			let CCFW = new $CC.ClosenessCentrality();
			let closeness_map_FW = CCFW.getCentralityMapFW(graph_und_unw);
			let closeness_map = CC.getCentralityMap(graph_und_unw);


			let ctr = 0;
			for (let key in closeness_map) {
				//console.log("["+key+"]"+closeness_map[key]+" " +closeness_map_FW[ctr]+"["+ctr+"]");
				expect(closeness_map[key]).toBe(closeness_map_FW[ctr]);
				ctr++;
			}
			expect(closeness_map).toEqual(expected_closeness_map);
		}
	);


	/**
	 * @todo same for each node!? (=correct?)
	 */
	test('should return the same centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.', () => {
			let CCFW = new $CC.ClosenessCentrality();
			let graph_2 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_2.csv`);
			let graph_3 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_3.csv`);
			let graph_6 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_6.csv`);
			checkScoresEqual(graph_2, CC.getCentralityMap(graph_2));
			checkScoresEqual(graph_3, CC.getCentralityMap(graph_3));
			checkScoresEqual(graph_6, CC.getCentralityMap(graph_6));
			//checkScoresEqual(graph_2,CCFW.getCentralityMapFW( graph_2 ));
			//checkScoresEqual(graph_3,CCFW.getCentralityMapFW( graph_3 ));
			//checkScoresEqual(graph_6,CCFW.getCentralityMapFW( graph_6 ));
		}
	);

});


function checkScoresEqual(graph, closeness) {
	let last = closeness[graph.getRandomNode().getID()];
	for (let key in graph.getNodes()) {
		expect(closeness[key]).toBe(last);
		last = closeness[key];
	}
}
import * as fs from 'fs';
import * as $G from '../../src/core/BaseGraph';
import {Brandes, BrandesHeapEntry} from '../../src/centralities/Brandes';
import {betweennessCentrality} from '../../src/centralities/Betweenness';
import {CSVInput, ICSVInConfig} from '../../src/io/input/CSVInput';
import {JSONInput, IJSONInConfig} from '../../src/io/input/JSONInput';
import { CSV_SN_PATH, JSON_DATA_PATH, JSON_CENT_PATH, RES_CENT_PATH } from '../config/config';

import {Logger} from '../../src/utils/Logger';

const logger = new Logger();


let csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

let std_json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: false,
	weighted: true
};

let json = new JSONInput(std_json_in_config);

let socialNet300 						= "social_network_edges_300",
	socialNet1K 							= "social_network_edges_1K",
	socialNet20K 							= "social_network_edges_20K",
	weightedSocialNet300 			= "social_network_edges_300_weighted",
	weightedSocialNet1K 			= "social_network_edges_1K_weighted",
	weightedSocialNet20K 			= "social_network_edges_20K_weighted";

let path_3nodeUnd 										= JSON_CENT_PATH + '/' + "3nodeUnd.json",
	path_3nodeDir 											= JSON_CENT_PATH + '/' + "3nodeDir.json",
	path_3node2SPs1direct 							= JSON_CENT_PATH + '/' + "3node2SPs1direct.json",
	path_4node2SPs1direct 							= JSON_CENT_PATH + '/' + "4node2SPs1direct.json",
	path_5nodeLinear 										= JSON_CENT_PATH + '/' + "5nodeLinear.json",
	path_7nodeMerge1beforeGoal 					= JSON_CENT_PATH + '/' + "7nodeMerge1beforeGoal.json",
	path_8nodeSplitMerge 								= JSON_CENT_PATH + '/' + "8nodeSplitMerge.json",
	path_8nodeSplitAfter1mergeBefore1 	= JSON_CENT_PATH + '/' + "8nodeSplitAfter1mergeBefore1.json",
	//until this point, all graphs have checking values in the features
	path_search_no1DE 									= JSON_DATA_PATH + '/' + "search_graph_multiple_SPs_no1DE.json",
	path_midSizeGraph 									= JSON_DATA_PATH + '/' + "bernd_ares_intermediate_pos.json",
	path_search_pos 										= JSON_DATA_PATH + '/' + "search_graph_multiple_SPs_positive.json",
	path_search_nullEdge 								= JSON_DATA_PATH + '/' + "search_graph_multiple_SPs.json",
	path_bf_graph 											= JSON_DATA_PATH + '/' + "bellman_ford.json",
	path_bf_graph_neg_cycle 						= JSON_DATA_PATH + '/' + "negative_cycle.json";


/**
 * @todo {Bernd} Only read graphs when needed within test...
 * => Test Isolation !!
 */
let graph_3nodeUnd: $G.IGraph = json.readFromJSONFile(path_3nodeUnd),
	graph_3nodeDir = json.readFromJSONFile(path_3nodeDir),
	graph_3node2SPs1direct = json.readFromJSONFile(path_3node2SPs1direct),
	graph_4node2SPs1direct = json.readFromJSONFile(path_4node2SPs1direct),
	graph_5nodeLinear = json.readFromJSONFile(path_5nodeLinear),
	graph_7nodeMerge1beforeGoal = json.readFromJSONFile(path_7nodeMerge1beforeGoal),
	graph_8nodeSplitMerge = json.readFromJSONFile(path_8nodeSplitMerge),
	graph_8nodeSplitAfter1mergeBefore1 = json.readFromJSONFile(path_8nodeSplitAfter1mergeBefore1),
	graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph),
	graph_search_no1DE = json.readFromJSONFile(path_search_no1DE),
	graph_search_pos = json.readFromJSONFile(path_search_pos),
	graph_search_nullEdge = json.readFromJSONFile(path_search_nullEdge),
	graph_bf_graph = json.readFromJSONFile(path_bf_graph),
	graph_bf_graph_neg_cycle = json.readFromJSONFile(path_bf_graph_neg_cycle);



describe('check correctness and runtime of betweenness centrality functions', () => {

	test(
		'test correctness of Brandes WITHOUT normalization - compare to networkx data',
		() => {
			let graph = json.readFromJSONFile(path_5nodeLinear);
			let nodes = graph.getNodes();
			let mapControl = {};
			logger.log("unnormalized betweenness values for the chosen graph (Networkx)");
			for (let key in nodes) {
				mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;
			}
			logger.log(mapControl);
			let BResult = new Brandes(graph).computeUnweighted(false, false);
			logger.log("Betweenness computed with Brandes: ");
			logger.log(BResult);

			expect(BResult).toEqual(mapControl);
		}
	);

	test(
		'test correctness of Brandes WITH normalization - compare to networkx data',
		() => {
			let graph = json.readFromJSONFile(path_7nodeMerge1beforeGoal);
			let nodes = graph.getNodes();
			let mapControl = {};
			logger.log("normalized betweenness values for the chosen graph (Networkx)");
			for (let key in nodes) {
				mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].default;
			}

			logger.log(mapControl);
			let BUResult = new Brandes(graph).computeUnweighted(true, true);
			logger.log("Betweenness computed with Brandes, normalized: ");
			logger.log(BUResult);

			logger.log(mapControl);
			let BWResult = new Brandes(graph).computeWeighted(true, true);
			logger.log("Betweenness computed with Brandes, normalized: ");
			logger.log(BWResult);

			logger.log(mapControl);
			let BPResult = new Brandes(graph).computePFSbased(true, true);
			logger.log("Betweenness computed with Brandes, normalized: ");
			logger.log(BPResult);

			let epsilon = 1e-4;
			[BUResult, BWResult, BPResult].forEach(result => {
				Object.keys(result).forEach(n => expect(result[n]).toBeGreaterThan(mapControl[n] - epsilon));
				Object.keys(result).forEach(n => expect(result[n]).toBeLessThan(mapControl[n] + epsilon));
			});
		}
	);

	test('test correctness of BrandesForWeighted without normalization', () => {
		let graph = json.readFromJSONFile(path_search_pos);

		let resBCslow = betweennessCentrality(graph, true, false);
		logger.log("Betweenness centrality calculated with slow but correct algorithm: ");
		logger.log(resBCslow);

		let resBFW = new Brandes(graph).computeWeighted(false, true);
		logger.log("Betweenness computed with BrandesForWeighted2: ");
		logger.log(resBFW);

		expect(resBCslow).toEqual(resBFW);
	});

	test(
		'test correctness of BrandesForWeighted without normalization, on a graph containing zero-weight edge',
		() => {
			let graph = json.readFromJSONFile(path_search_nullEdge);

			let resBCslow = betweennessCentrality(graph, true, false);
			logger.log("Betweenness centrality calculated with slow but correct algorithm: ");
			logger.log(resBCslow);

			let resBFW = new Brandes(graph).computeWeighted(false, false);
			logger.log("Betweenness computed with BrandesForWeighted2: ");
			logger.log(resBFW);

			expect(resBCslow).toEqual(resBFW);
		}
	);

	test('test if BrandesWeighted rejects negative cycle graphs', () => {
		let graph = json.readFromJSONFile(path_bf_graph_neg_cycle);
		let brandes = new Brandes(graph);

		expect(brandes.computeWeighted.bind(brandes, graph)).toThrowError("The graph contains a negative cycle, thus it can not be processed");

		graph = graph_bf_graph;
		expect(brandes.computeWeighted.bind(brandes, graph)).not.toThrowError("The graph contains a negative cycle, thus it can not be processed");

		graph = graph_search_pos;
		expect(brandes.computeWeighted.bind(brandes, graph)).not.toThrowError("The graph contains a negative cycle, thus it can not be processed");
	});

	test(
		'test if BrandesWeighted can reweigh and traverse negative graphs',
		() => {
			let graph = json.readFromJSONFile(path_bf_graph);
			let workingGraph = graph.cloneStructure();
			let workingGraph2 = graph.cloneStructure();

			expect(workingGraph.hasNegativeEdge()).toBe(true);
			expect(workingGraph2.hasNegativeEdge()).toBe(true);

			let resSlow = betweennessCentrality(workingGraph, true, true);
			logger.log("Betweenness with slow but correct algorithm: ");
			logger.log(resSlow);

			let resBFW = new Brandes(workingGraph2).computeWeighted(false, false);
			logger.log("Betweenness computed with BrandesForWeighted2: ");
			logger.log(resBFW);

			expect(resSlow).toEqual(resBFW);

			expect(workingGraph.hasNegativeEdge()).toBe(false);
			expect(workingGraph2.hasNegativeEdge()).toBe(false);
		}
	);

	test(
		'compare runtime of BrandesForWeighted to PFS based Brandes, UNnormalized',
		() => {
			let graph = json.readFromJSONFile(path_midSizeGraph);
			let brandes = new Brandes(graph);

			logger.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, UNnormalized mode:`);

			let startBW = +new Date();
			let resBW = brandes.computeWeighted(false, false);
			let endBW = +new Date();

			logger.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

			let startBP = +new Date();
			let resBP = brandes.computePFSbased(false, false);
			let endBP = +new Date();
			logger.log("runtime of Brandes, PFS based: " + (endBP - startBP));

			let epsilon = 1e-12;
			Object.keys(resBP).forEach(n => expect(resBP[n]).toBeGreaterThan(resBW[n] - epsilon));
			Object.keys(resBP).forEach(n => expect(resBP[n]).toBeLessThan(resBW[n] + epsilon));
		}
	);

	test(
		'compare runtime of BrandesForWeighted to PFS based Brandes, normalized',
		() => {
			let graph = json.readFromJSONFile(path_midSizeGraph);
			let brandes = new Brandes(graph);

			logger.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, normalized mode:`);

			let startBW = +new Date();
			let resBW = brandes.computeWeighted(true, false);
			let endBW = +new Date();
			logger.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

			let startBP = +new Date();
			let resBP = brandes.computePFSbased(true, false);
			let endBP = +new Date();
			logger.log("runtime of Brandes, PFS based: " + (endBP - startBP));

			let epsilon = 1e-12;
			Object.keys(resBP).forEach(n => expect(resBP[n]).toBeGreaterThan(resBW[n] - epsilon));
			Object.keys(resBP).forEach(n => expect(resBP[n]).toBeLessThan(resBW[n] + epsilon));
		}
	);


	test(
		'compare results of all BrandesForWeighted functions, using the betweennessCentrality2 too',
		() => {
			let graph = json.readFromJSONFile(path_search_nullEdge);
			let brandes = new Brandes(graph);

			logger.log("Betweenness with slow but good algorithm:");
			let resultBCOld = betweennessCentrality(graph, true, true);
			logger.log(resultBCOld);

			logger.log("Betweenness computed with our BrandesForWeighted function:");
			let resultBCWHeapBased = brandes.computeWeighted(false, false);
			logger.log(resultBCWHeapBased);

			logger.log("Betweenness computed with our BrandesPFSBased function:");
			let resultBrandesPFS = brandes.computePFSbased(false, false);
			logger.log(resultBrandesPFS);

			expect(resultBCOld).toEqual(resultBCWHeapBased);
			expect(resultBCOld).toEqual(resultBrandesPFS);
		}
	);


	/**
	 * Usually, a social network would have undirected (bi-directional) friend relations - nevertheless, for sake of comparison (edge lists are read in a directed manner by networkx) we are switching to directed mode as well.
	 */
	describe('Brandes Performance tests on (UN)weighted social networks', () => {

		[socialNet300].forEach(graph_name => { // socialNet1K, socialNet20K
			test(`Runtime of Brandes (UNweighted) on graph ${graph_name}:`, () => {
				csv_config.direction_mode = true;
				let csv = new CSVInput(csv_config);
				let graph_path = CSV_SN_PATH + '/' + graph_name + ".csv",
					graph = csv.readFromEdgeListFile(graph_path),
					brandes = new Brandes(graph);

				let startBU = +new Date();
				let resBU = brandes.computeUnweighted(true, true);
				let endBU = +new Date();
				logger.log(`runtime of Brandes, UNweighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBU - startBU} ms.`);

				let controlFileName = `${RES_CENT_PATH}/betweenness/betweenness_${graph_name}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

				expect(Object.keys(resBU).length).toBe(Object.keys(controlMap).length);

				let epsilon = 1e-12;
				Object.keys(resBU).forEach(n => expect(resBU[n]).toBeGreaterThan(controlMap[n] - epsilon));
				Object.keys(resBU).forEach(n => expect(resBU[n]).toBeLessThan(controlMap[n] + epsilon));
			});
		});


		[weightedSocialNet300].forEach(graph_name => { // weightedSocialNet1K, weightedSocialNet20K
			test(`Runtime of Brandes (Weighted) on graph ${graph_name}:`, () => {
				csv_config.weighted = true;
				let csv = new CSVInput(csv_config);
				let graph_path = CSV_SN_PATH + '/' + graph_name + ".csv",
					graph = csv.readFromEdgeListFile(graph_path),
					brandes = new Brandes(graph);

				let startBW = +new Date();
				let resBW = brandes.computeWeighted(true, true);
				let endBW = +new Date();
				logger.log(`runtime of Brandes, weighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBW - startBW} ms.`);

				let controlFileName = `${RES_CENT_PATH}//betweenness/betweenness_${graph_name}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

				expect(Object.keys(resBW).length).toBe(Object.keys(controlMap).length);

				let epsilon = 1e-12;
				Object.keys(resBW).forEach(n => expect(resBW[n]).toBeGreaterThan(controlMap[n] - epsilon));
				Object.keys(resBW).forEach(n => expect(resBW[n]).toBeLessThan(controlMap[n] + epsilon));
			});
		});
	});
});


/**
 * TODO: Write some normalization tests...
 */


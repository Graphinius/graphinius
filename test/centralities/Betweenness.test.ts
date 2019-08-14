import * as fs from 'fs';
import * as $G from '../../src/core/base/BaseGraph';
import {Brandes, BrandesHeapEntry} from '../../src/centralities/Brandes';
import {betweennessCentrality} from '../../src/centralities/Betweenness';
import {CSVInput, ICSVInConfig} from '../../src/io/input/CSVInput';
import {JSONInput, IJSONInConfig} from '../../src/io/input/JSONInput';
import {CSV_SN_PATH, JSON_DATA_PATH, JSON_CENT_PATH, RES_CENT_PATH} from '../config/config';
import {Logger} from '../../src/utils/Logger';

const logger = new Logger();
const BETW_FEAT = "betweenness";

let std_json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: false,
	weighted: true
};

const json = new JSONInput(std_json_in_config);

const
	path_5nodeLinear = JSON_CENT_PATH + '/' + "5nodeLinear.json",
	path_7nodeMerge1beforeGoal = JSON_CENT_PATH + '/' + "7nodeMerge1beforeGoal.json",
	path_midSizeGraph = JSON_DATA_PATH + '/' + "bernd_ares_intermediate_pos.json",
	path_search_pos = JSON_DATA_PATH + '/' + "search_graph_multiple_SPs_positive.json",
	path_search_nullEdge = JSON_DATA_PATH + '/' + "search_graph_multiple_SPs.json",
	path_bf_graph = JSON_DATA_PATH + '/' + "bellman_ford.json",
	path_bf_graph_neg_cycle = JSON_DATA_PATH + '/' + "negative_cycle.json",
	
	graph_search_pos = json.readFromJSONFile(path_search_pos),
	graph_bf_graph = json.readFromJSONFile(path_bf_graph);


describe('check correctness and runtime of betweenness centrality functions', () => {

	test(
		'test correctness of Brandes WITHOUT normalization - compare to networkx data',
		() => {
			let graph = json.readFromJSONFile(path_5nodeLinear);
			let nodes = graph.getNodes();
			let mapControl = {};
			logger.log("unnormalized betweenness values for the chosen graph (Networkx)");
			for (let key in nodes) {
				mapControl[nodes[key].getID()] = nodes[key].getFeatures()[BETW_FEAT].unnormalized;
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
				mapControl[nodes[key].getID()] = nodes[key].getFeatures()[BETW_FEAT].default;
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
		'compare results of all BrandesForWeighted functions, using the betweennessCentrality2 as well',
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

});


/**
 * TODO: Write some normalization tests...
 */


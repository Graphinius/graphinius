import {Brandes} from "../../src/centralities/Brandes";
import {CSVInput, ICSVInConfig} from "../../src/io/input/CSVInput";
import {CSV_SN_PATH, RES_CENT_PATH} from "../config/config";
import * as fs from "fs";
import {Logger} from '../../src/utils/Logger';
import {IGraph} from "../../src/core/base/BaseGraph";

const logger = new Logger();

const csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};
const csv = new CSVInput(csv_config);

const
	socialNet300 = "social_network_edges_300",
	socialNet1K = "social_network_edges_1K",
	socialNet20K = "social_network_edges_20K",
	weightedSocialNet300 = "social_network_edges_300_weighted",
	weightedSocialNet1K = "social_network_edges_1K_weighted",
	weightedSocialNet20K = "social_network_edges_20K_weighted",
	sn_300_graph = readCSVGraph(socialNet300);

csv._config.direction_mode = true;
const
	sn_300_graph_d = readCSVGraph(socialNet300),
	sn_1K_graph_d = readCSVGraph(socialNet1K),
	sn_20K_graph_d = readCSVGraph(socialNet20K);
csv._config.weighted = true;
const
	sn_300_graph_dw = readCSVGraph(weightedSocialNet300),
	sn_1K_graph_dw = readCSVGraph(weightedSocialNet1K),
	sn_20K_graph_dw = readCSVGraph(weightedSocialNet20K);


function readCSVGraph(graphFile): IGraph {
	return csv.readFromEdgeListFile(`${CSV_SN_PATH}/${graphFile}.csv`);
}


describe('Betweenness centrality performance tests - ', () => {

	describe('comparison to PFS', () => {

		[false, true].forEach(normalize => {
			it(`compares runtimes of BrandesForWeighted to PFS based Brandes, normalize: ${normalize}`,
				() => {
					let brandes = new Brandes(sn_300_graph);

					logger.log(`Running on graph of ${sn_300_graph.nrNodes()} nodes and ${sn_300_graph.nrDirEdges() + sn_300_graph.nrUndEdges()} edges, UNnormalized mode:`);

					let startBW = +new Date();
					let resBW = brandes.computeWeighted(normalize, false);
					let endBW = +new Date();

					logger.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

					let startBP = +new Date();
					let resBP = brandes.computePFSbased(normalize, false);
					let endBP = +new Date();
					logger.log("runtime of Brandes, PFS based: " + (endBP - startBP));

					let epsilon = 1e-9;
					Object.keys(resBP).forEach(n => expect(resBP[n]).toBeGreaterThanOrEqual(resBW[n] - epsilon));
					Object.keys(resBP).forEach(n => expect(resBP[n]).toBeLessThanOrEqual(resBW[n] + epsilon));
				}
			);
		});

	});


	/**
	 * Usually, a social network would have undirected (bi-directional) friend relations -
	 * nevertheless, for sake of comparison (edge lists are read in a directed manner by networkx)
	 * we are switching to directed mode as well.
	 */
	describe('(UN)weighted social networks', () => {

		[sn_300_graph_d].forEach(graph => { // sn_1K_graph_d, sn_20K_graph_d
			test(`Runtime of Brandes (UNweighted) on graph ${graph.label}:`, () => {
				const brandes = new Brandes(graph);
				const result_name = graph.label.split('.')[0];

				let startBU = +new Date();
				let resBU = brandes.computeUnweighted(true, true);
				let endBU = +new Date();
				logger.log(`runtime of Brandes, UNweighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBU - startBU} ms.`);

				let controlFileName = `${RES_CENT_PATH}/betweenness/betweenness_${result_name}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

				expect(Object.keys(resBU).length).toBe(Object.keys(controlMap).length);

				let epsilon = 1e-12;
				Object.keys(resBU).forEach(n => expect(resBU[n]).toBeGreaterThan(controlMap[n] - epsilon));
				Object.keys(resBU).forEach(n => expect(resBU[n]).toBeLessThan(controlMap[n] + epsilon));
			});
		});


		[sn_300_graph_dw].forEach(graph => { // sn_1K_graph_dw, sn_20K_graph_dw
			test(`Runtime of Brandes (Weighted) on graph ${graph.label}:`, () => {
				const brandes = new Brandes(graph);
				const result_name = graph.label.split('.')[0];

				let startBW = +new Date();
				let resBW = brandes.computeWeighted(true, true);
				let endBW = +new Date();
				logger.log(`runtime of Brandes, weighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBW - startBW} ms.`);

				let controlFileName = `${RES_CENT_PATH}/betweenness/betweenness_${result_name}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

				expect(Object.keys(resBW).length).toBe(Object.keys(controlMap).length);

				let epsilon = 1e-12;
				Object.keys(resBW).forEach(n => expect(resBW[n]).toBeGreaterThan(controlMap[n] - epsilon));
				Object.keys(resBW).forEach(n => expect(resBW[n]).toBeLessThan(controlMap[n] + epsilon));
			});
		});
	});

});
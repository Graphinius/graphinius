import {JSON_DATA_PATH, JSON_REC_PATH} from "../config/test_paths";
import {JSONInput} from "../../src/io/input/JSONInput";
import {ComputeGraph} from "../../src/core/compute/ComputeGraph";

import {Logger} from "../../src/utils/Logger";
const logger = new Logger();

const tf = require('@tensorflow/tfjs-node');
console.log(tf.getBackend());

const json = new JSONInput({
	explicit_direction: false,
	directed: false,
	weighted: false
});

const beer_graph_file = `${JSON_REC_PATH}/beerGraph.json`;


describe('transitivity - clustering coefficient performance tests - ', () => {

	const beerGraph = new JSONInput().readFromJSONFile(beer_graph_file);
	const computeBeer = new ComputeGraph(beerGraph, tf);
	let tic, toc;

	it('computes the transitivity of a ~500 nodes, ~7k edges graph', () => {
		tic = Date.now();
		computeBeer.transitivity();
		toc = Date.now();
		logger.log(`Computing transitivity (TF) on beer graph took ${toc - tic} ms.`);
	});


	it('computes the local clustering coefficients of a ~500 nodes, ~7k edges graph', () => {
		tic = Date.now();
		computeBeer.clustCoef();
		toc = Date.now();
		logger.log(`Computing CC (TF) on beer graph took ${toc - tic} ms.`);
	});

});


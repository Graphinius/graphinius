import {BaseGraph, IGraph} from '../../../src/core/base/BaseGraph';
import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {ComputeGraph, IComputeGraph} from '../../../src/core/compute/ComputeGraph';
import {JSONInput} from "../../../src/io/input/JSONInput";
import {JSON_DATA_PATH} from "../../config/test_paths";

const tf = require('@tensorflow/tfjs-node');
// console.log(tf);
console.log(tf.getBackend());

// import * as tfc from '@tensorflow/tfjs-core';
// console.log(tfc);


describe('Clustering coefficient tests - ', () => {

	const small_graph_file = JSON_DATA_PATH + '/small_graph.json';
	const triangle_graph_file = `${JSON_DATA_PATH}/triangle_graph.json`;


	let
		g: IGraph = null,
		cg: IComputeGraph = null;


	beforeEach(() => {
		expect(tf).toBeDefined;
	});


	describe('small graph - ', () => {

		beforeEach(() => {
			g = new BaseGraph('triangulus');
			cg = new ComputeGraph(g, tf);
		});


		it('triangle Counting should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.triangleCount()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef."));
		});


		it('CC should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.globalCC()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef."));
		});


		it('should compute triangle counts on small graph using TF', (done) => {
			g = new JSONInput().readFromJSONFile(small_graph_file, g);
			cg.triangleCount().then(res => {
				expect(res.dir).toBe(0);
				expect(res.und).toBe(0);
				done();
			});
		});


		// it('should compute global UNweighted CC on small graph using TF', (done) => {
		// 	g = new JSONInput().readFromJSONFile(small_graph_file, g);
		// 	cg.globalCC().then(res => {
		// 		console.log(res);
		// 		expect(res.und).toBe(0);
		// 		done();
		// 	});
		// });


		/**
		 * @todo should we take the direction explicitly or not?
		 * 			 -> computing on UNdirected adj_list AND directed one?
		 */
		it('should compute triangle counts on triangle graph using TF', (done) => {
			g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
			cg.triangleCount().then(res => {
				expect(res.dir).toBe(8);
				expect(res.und).toBe(4);
				done();
			});
		});



		// it('should compute global UNweighted CC on triangle graph using TF', (done) => {
		// 	g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
		// 	cg.globalCC().then(res => {
		// 		console.log(res);
		// 		done();
		// 	});
		// });

	});

});

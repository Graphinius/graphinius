import {BaseGraph, IGraph} from '../../../src/core/base/BaseGraph';
import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {ComputeGraph, IComputeGraph} from '../../../src/core/compute/ComputeGraph';
import {JSONInput} from "../../../src/io/input/JSONInput";
import {JSON_DATA_PATH} from "../../config/test_paths";

import {Logger} from "../../../src/utils/Logger";
const logger = new Logger();


const tf = require('@tensorflow/tfjs-node');
// console.log(tf);
console.log(tf.getBackend());

// import * as tfc from '@tensorflow/tfjs-core';
// console.log(tfc);


describe('Clustering coefficient tests - ', () => {

	const small_graph_file = JSON_DATA_PATH + '/small_graph.json';
	const triangle_graph_file = `${JSON_DATA_PATH}/triangle_graph.json`;
	const triangle_directed = `${JSON_DATA_PATH}/triangle_directed.json`;


	let
		g: IGraph = null,
		cg: IComputeGraph = null;


	beforeEach(() => {
		expect(tf).toBeDefined;
	});


	describe('small & triangle graph - ', () => {

		it('triangle Counting should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.triangleCount()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef."));
		});


		it('CC should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.transitivity()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef."));
		});


		describe('UN-directed', () => {

			beforeEach(() => {
				g = new BaseGraph('triangulus');
				cg = new ComputeGraph(g, tf);
			});


			it('should compute triad counts on small graph ', () => {
				g = new JSONInput({explicit_direction: false, directed: false}).readFromJSONFile(small_graph_file, g);
				const res = cg.triadCount();
				expect(res).toBe(3);
			});


			it('should compute triangle counts on small graph ', (done) => {
				g = new JSONInput({explicit_direction: false, directed: false}).readFromJSONFile(small_graph_file, g);
				cg.triangleCount().then(res => {
					expect(res).toBe(0);
					done();
				});
			});


			it('should compute UNdirected transitivity on small graph ', (done) => {
				g = new JSONInput().readFromJSONFile(small_graph_file, g);
				cg.transitivity().then(res => {
					// console.log(res);
					expect(res).toBe(0);
					done();
				});
			});


			it('should compute triad counts on triangle graph ', () => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				const res = cg.triadCount();
				expect(res).toBe(19);
			});


			/**
			 * @todo should we take the direction explicitly or not?
			 *       -> computing on UNdirected adj_list AND directed one?
			 */
			it('should compute triangle counts on triangle graph ', (done) => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				cg.triangleCount().then(res => {
					expect(res).toBe(4);
					done();
				});
			});


			it('should compute UNdirected transitivity on triangle graph ', (done) => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				cg.transitivity().then(res => {
					// console.log(res);
					expect(res).toBe(0.631578947368421);
					done();
				});
			});

		});


		/**
		 * @description frequency of loops of length two in a directed network: `reciprocity`
		 */
		describe('DIRECTED - ', () => {

			beforeAll(() => {
				g = new JSONInput({explicit_direction: false, directed: true}).readFromJSONFile(triangle_directed);
				cg = new ComputeGraph(g, tf);
			});


			it('should compute triad counts on triangle graph ', () => {
				const res = cg.triadCount(true);
				expect(res).toBe(10);
			});


			it('should compute triangle counts on triangle graph ', (done) => {
				cg.triangleCount(true).then(res => {
					expect(res).toBe(2);
					done();
				});
			});


			it('should compute DIRECTED transitivity on triangle graph ', (done) => {
				cg.transitivity(true).then(res => {
					// console.log(res);
					expect(res).toBe(0.6);
					done();
				});
			});

		});

	});

});

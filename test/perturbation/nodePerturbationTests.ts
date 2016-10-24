/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $JI from '../../src/io/input/JSONInput';
import { Logger } from '../../src/utils/logger';

var expect = chai.expect;
var REAL_GRAPH_NR_NODES = 6204,
    REAL_GRAPH_NR_UND_EDGES = 18550,
    graph : $G.IGraph,
    real_graph = "./test/test_data/real_graph.json",
    logger : Logger = new Logger();


describe('GRAPH PERTURBATION TESTS: - ', () => {
	var stats	: $G.GraphStats,
        json	: $JI.JSONInput = new $JI.JSONInput();

    beforeEach( () => {
        graph = json.readFromJSONFile(real_graph);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_UND_EDGES);
    });

	describe('Deleting different percentages of nodes - ', () => {

        [20, 40, 60, 80].forEach( (p) => {
            it(`should delete ${p}% of all nodes`, () => {
                
                graph.randomlyDeleteNodes(p);
                expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES - ( (REAL_GRAPH_NR_NODES * p/100)|0+1 ) );
                logger.log("Remaining number of egdes: " + graph.nrUndEdges());

            });
        });
        
    });

});
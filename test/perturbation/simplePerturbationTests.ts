/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $JI from '../../src/io/input/JSONInput';

let expect = chai.expect;
let REAL_GRAPH_NR_NODES = 6204,
    REAL_GRAPH_NR_EDGES = 18550,
    graph : $G.IGraph,
    real_graph = "./test/test_data/real_graph.json",
    json : $JI.IJSONInput,
    stats : $G.GraphStats;
    
    
describe('GRAPH PERTURBATION TESTS: - ', () => {
    
  describe('UNDIRECTED Graph - ', () => {

    beforeEach( () => {
      json = new $JI.JSONInput();
      graph = json.readFromJSONFile(real_graph);
      stats = graph.getStats();
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      expect(graph.nrDirEdges()).to.equal(0);
    });

    /**
     * TODO enhance by node types
     */
    describe('Deleting different percentages of NODES - ', () => {

        [20, 40, 60, 80, 100].forEach( (p) => {
            it(`should delete ${p}% of all nodes`, () => {                
                graph.randomlyDeleteNodesPercentage(p);
                expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES - Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
            });
        });
        
    });


    /**
     * TODO: enhance by edge types
     */
    describe('Deleting different percentages of UNDIRECTED Edges - ', () => {

        [20, 40, 60, 80, 100].forEach( (p) => {
            it(`should delete ${p}% of all edges`, () => {
                graph.randomlyDeleteUndEdgesPercentage(p);
                expect(graph.nrUndEdges()).to.equal( REAL_GRAPH_NR_EDGES - Math.ceil(REAL_GRAPH_NR_EDGES * p/100) );
                expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
            });
        });
    });
    
    
    describe.skip('Adding different percentages of UNDIRECTED Edges - ', () => {
        
    });    
    
  });

  
  describe('DIRECTED Graph - ', () => {

    beforeEach( () => {
      json = new $JI.JSONInput(false, true, false);
      graph = json.readFromJSONFile(real_graph);
      stats = graph.getStats();
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrUndEdges()).to.equal(0);
      expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES);
    });
    /**
     * TODO: enhance by edge types
     */
    describe('Deleting different percentages of DIRECTED EDGES - ', () => {

        [20, 40, 60, 80, 100].forEach( (p) => {
            it(`should delete ${p}% of all edges`, () => {        
                graph.randomlyDeleteDirEdgesPercentage(p);
                expect(graph.nrDirEdges()).to.equal( REAL_GRAPH_NR_EDGES - Math.ceil(REAL_GRAPH_NR_EDGES * p/100) );
                expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
            });
        });

    });
    
  });

});
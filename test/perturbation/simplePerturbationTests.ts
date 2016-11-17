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
        
        it('should refuse to delete a negative amount of nodes', () => {
            expect(graph.randomlyDeleteNodesAmount.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of nodes');
        });
        
        
        it('should refuse to delete a negative percentage of nodes', () => {
            expect(graph.randomlyDeleteNodesPercentage.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of nodes');
        });
        
        
        it('should simply delete all nodes when passing an amount greater than the number of existing nodes', () => {
            graph.randomlyDeleteNodesAmount(10e6);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(0);
        });
        
        
        it('should simply delete all nodes when passing a percentage greater than 100%', () => {
            graph.randomlyDeleteNodesPercentage(101);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(0);
        });
        

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
        
        it('should refuse to delete a negative amount of edges', () => {
            expect(graph.randomlyDeleteUndEdgesAmount.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should refuse to delete a negative percentage of edges', () => {
            expect(graph.randomlyDeleteUndEdgesPercentage.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should simply delete all edges when passing an amount greater than the number of existing edges', () => {
            graph.randomlyDeleteUndEdgesAmount(10e6);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should simply delete all edges when passing a percentage greater than 100%', () => {
            graph.randomlyDeleteUndEdgesPercentage(101);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should delete a specified amount of edges', () => {
            let nr_edges_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_EDGES);
            graph.randomlyDeleteUndEdgesAmount(nr_edges_to_be_deleted);          
            expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES - nr_edges_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        

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

        it('should refuse to delete a negative amount of edges', () => {
            expect(graph.randomlyDeleteDirEdgesAmount.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should refuse to delete a negative percentage of edges', () => {
            expect(graph.randomlyDeleteDirEdgesPercentage.bind(graph, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should simply delete all edges when passing an amount greater than the number of existing edges', () => {
            graph.randomlyDeleteDirEdgesAmount(10e6);            
            expect(graph.nrDirEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should simply delete all edges when passing a percentage greater than 100%', () => {
            graph.randomlyDeleteDirEdgesPercentage(101);            
            expect(graph.nrDirEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should delete a specified amount of edges', () => {
            let nr_edges_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_EDGES);
            graph.randomlyDeleteDirEdgesAmount(nr_edges_to_be_deleted);          
            expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES - nr_edges_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });


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
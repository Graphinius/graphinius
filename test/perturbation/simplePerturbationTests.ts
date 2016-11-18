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
    stats : $G.GraphStats,
    deg_config : $G.NodeAdditionConfiguration;
    
    
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
    
    
    describe('Randomly add different amounts / percentages of NODES - ', () => {
      
      it('should refuse to add a negative amount of nodes', () => {
         expect(graph.randomlyAddNodesAmount.bind(graph, -1))
            .to.throw('Cowardly refusing to add a negative amount of nodes'); 
      });
      
      
      it('should refuse to add a negative percentage of nodes', () => {
         expect(graph.randomlyAddNodesPercentage.bind(graph, -1))
            .to.throw('Cowardly refusing to add a negative amount of nodes'); 
      });
      
      
      it('should add a specified amount of nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
    

      it(`should add some random percentage of all nodes`, () => {
        let p = Math.floor(Math.random()*100);              
        graph.randomlyAddNodesPercentage(p);
        expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES + Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should add a specified amount of nodes with a regular degree of undirected nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + 3 * nr_nodes_to_be_added);        
      });
      
      
      it('should add a specified amount of nodes with a regular degree of directed nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(3 * nr_nodes_to_be_added);        
      });
      
    });

    /**
     * TODO enhance by node types
     */
    describe('Randomly delete different amounts / percentages of NODES - ', () => {
        
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
        
        
        it('should delete a specified amount of nodes', () => {
            let nr_nodes_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
            graph.randomlyDeleteNodesAmount(nr_nodes_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES - nr_nodes_to_be_deleted);
        });
        

        it(`should delete some random percentage of all nodes`, () => {
            let p = Math.floor(Math.random()*100);                
            graph.randomlyDeleteNodesPercentage(p);
            expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES - Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
        });
        
    });


    /**
     * TODO: enhance by edge types
     */
    describe('Randomly delete different amounts / percentages of UNDIRECTED Edges - ', () => {
        
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
        

        it(`should delete a random percentage of all edges`, () => {
            let p = Math.floor(Math.random()*100);                
            graph.randomlyDeleteUndEdgesPercentage(p);
            expect(graph.nrUndEdges()).to.equal( REAL_GRAPH_NR_EDGES - Math.ceil(REAL_GRAPH_NR_EDGES * p/100) );
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
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
    describe('Randomly deleting different amounts / percentages of DIRECTED EDGES - ', () => {

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


        it(`should delete a certain percentage of all edges`, () => {
            let p = Math.floor(Math.random()*100);                
            graph.randomlyDeleteDirEdgesPercentage(p);
            expect(graph.nrDirEdges()).to.equal( REAL_GRAPH_NR_EDGES - Math.ceil(REAL_GRAPH_NR_EDGES * p/100) );
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
    });
    
  });

});
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
    deg_config : $G.NodeDegreeConfiguration;

const DEGREE_PROBABILITY = 0.002; 

/**
 * TODO introduce sinon & check for methods called
 * depending on the degree configuration obj's state
 */ 
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
    
    
    describe('Randomly ADD different amounts / percentages of NODES - ', () => {
      
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
    

      it(`should add some random percentage of nodes`, () => {
        let p = Math.floor(Math.random()*100);              
        graph.randomlyAddNodesPercentage(p);
        expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES + Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should reject a negative node degree as invalid', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: -3 };
        
        expect(graph.randomlyAddNodesAmount.bind(graph, nr_nodes_to_be_added, deg_config)).to.throw("Minimum degree cannot be negative.");
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should reject a node degree greater than the amount of nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        let one_too_many = REAL_GRAPH_NR_NODES + nr_nodes_to_be_added + 1
        deg_config = { und_degree: one_too_many };
        
        expect(graph.randomlyAddNodesAmount.bind(graph, nr_nodes_to_be_added, deg_config)).to.throw("Maximum degree exceeds number of reachable nodes.");
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should add a specified amount of nodes with a regular degree of undirected edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should ignore a span of UNdirected edges to add when a specific degree is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, min_und_degree: 2, max_und_degree: 5 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add an amount of nodes within a specified degree span of UNdirected edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 3, max_und_degree: 5 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add a specified amount of nodes with a regular degree of directed edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should ignore a span of directed edges to add when a specific degree is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, min_dir_degree: 2, max_dir_degree: 5 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add an amount of nodes within a specified degree span of directed edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5 };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore directed edge probabilities when a specific degree of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, probability_dir: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore directed edge probabilities when a degree span of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5, probability_dir: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore directed edge probabilities when a specific degree of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, probability_dir: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore directed edge probabilities when a degree span of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 2, max_und_degree: 5, probability_dir: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
      });
      
      
      it('should create directed edges according to a given probability', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*200);
        deg_config = { probability_dir: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        // TODO - figure out way to test probabilities (distribution of values)
        // console.log( `Created ${graph.nrDirEdges()} DIRECTED edges.` );
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.probability_dir/2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.probability_dir*2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
      });
      
      
      it('should ignore UNdirected edge probabilities when a specific degree of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, probability_und: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore UNdirected edge probabilities when a degree span of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5, probability_und: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore UNdirected edge probabilities when a specific degree of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, probability_und: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore UNdirected edge probabilities when a degree span of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 2, max_und_degree: 5, probability_und: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
      });
      
      
      it('should create UNdirected edges according to a given probability', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*200);
        deg_config = { probability_und: DEGREE_PROBABILITY };
        
        graph.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        // TODO - figure out way to test probabilities (distribution of values)
        // console.log( `Created ${graph.nrUndEdges() - REAL_GRAPH_NR_EDGES} UNDIRECTED edges.` );
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + (deg_config.probability_und/2) * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.probability_und*2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
      });
      
      
    });

    /**
     * TODO enhance by node types
     */
    describe('Randomly DELETE different amounts / percentages of NODES - ', () => {
        
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
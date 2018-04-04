/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import {DegreeDistribution, DegreeCentrality} from '../../src/centralities/Degree';
import * as $JI from '../../src/io/input/JSONInput';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $P from '../../src/perturbation/SimplePerturbations';

const degCent = new DegreeCentrality();

let expect = chai.expect;
let REAL_GRAPH_NR_NODES = 6204,
    REAL_GRAPH_NR_EDGES = 18550,
    graph : $G.IGraph,
    real_graph = "./test/test_data/real_graph.json",
    json : $JI.IJSONInput,
    stats : $G.GraphStats,
    deg_config : $P.NodeDegreeConfiguration,
    perturber : $P.ISimplePerturber;

const DEGREE_PROBABILITY = 0.002;
const MAX_EDGES_TO_CREATE = 500;

/**
 * TODO introduce sinon & check for methods called
 * depending on the degree configuration obj's state
 */ 
describe('GRAPH PERTURBATION TESTS: - ', () => {
    
  describe('UNDIRECTED Graph - ', () => {

    beforeEach( () => {
      json = new $JI.JSONInput();
      graph = json.readFromJSONFile( real_graph );
      perturber = new $P.SimplePerturber( graph );
      stats = graph.getStats();
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      expect(graph.nrDirEdges()).to.equal(0);
    });
    
    
    describe('Randomly ADD different amounts / percentages of NODES - ', () => {
      
      it('should refuse to add a negative amount of nodes', () => {
         expect(perturber.randomlyAddNodesAmount.bind(perturber, -1))
            .to.throw('Cowardly refusing to add a negative amount of nodes'); 
      });
      
      
      it('should refuse to add a negative percentage of nodes', () => {
         expect(perturber.randomlyAddNodesPercentage.bind(perturber, -1))
            .to.throw('Cowardly refusing to add a negative amount of nodes'); 
      });
      
      
      it('should add a specified amount of nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
    

      it(`should add some random percentage of nodes`, () => {
        let p = Math.floor(Math.random()*100);              
        perturber.randomlyAddNodesPercentage(p);
        expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES + Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should reject a negative node degree as invalid', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: -3 };
        
        expect(perturber.randomlyAddNodesAmount.bind(perturber, nr_nodes_to_be_added, deg_config)).to.throw("Minimum degree cannot be negative.");
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should reject a node degree greater than the amount of nodes', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        let one_too_many = REAL_GRAPH_NR_NODES + nr_nodes_to_be_added + 1
        deg_config = { und_degree: one_too_many };
        
        expect(perturber.randomlyAddNodesAmount.bind(perturber, nr_nodes_to_be_added, deg_config)).to.throw("Maximum degree exceeds number of reachable nodes.");
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      });
      
      
      it('should add a specified amount of nodes with a regular degree of undirected edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should ignore a span of UNdirected edges to add when a specific degree is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, min_und_degree: 2, max_und_degree: 5 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add an amount of nodes within a specified degree span of UNdirected edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 3, max_und_degree: 5 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add a specified amount of nodes with a regular degree of directed edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should ignore a span of directed edges to add when a specific degree is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, min_dir_degree: 2, max_dir_degree: 5 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);        
      });
      
      
      it('should add an amount of nodes within a specified degree span of directed edges', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5 };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore directed edge probabilities when a specific degree of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, probability_dir: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore directed edge probabilities when a degree span of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5, probability_dir: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore directed edge probabilities when a specific degree of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, probability_dir: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore directed edge probabilities when a degree span of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 2, max_und_degree: 5, probability_dir: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
      });
      
      
      it('should create directed edges according to a given probability', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*200);
        deg_config = { probability_dir: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        // TODO - figure out way to test probabilities (distribution of values)
        // console.log( `Created ${graph.nrDirEdges()} DIRECTED edges.` );
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.probability_dir/2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.probability_dir*2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
      });
      
      
      it('should ignore UNdirected edge probabilities when a specific degree of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { dir_degree: 3, probability_und: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.equal(deg_config.dir_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore UNdirected edge probabilities when a degree span of directed edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_dir_degree: 2, max_dir_degree: 5, probability_und: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.least(deg_config.min_dir_degree * nr_nodes_to_be_added);
        expect(graph.nrDirEdges()).to.be.at.most(deg_config.max_dir_degree * nr_nodes_to_be_added);
      });
      
      
      it('should ignore UNdirected edge probabilities when a specific degree of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { und_degree: 3, probability_und: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);  
      });
      
      
      it('should ignore UNdirected edge probabilities when a degree span of UNdirected edges is given', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
        deg_config = { min_und_degree: 2, max_und_degree: 5, probability_und: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
      });
      
      
      it('should create UNdirected edges according to a given probability', () => {
        let nr_nodes_to_be_added = Math.floor(Math.random()*200);
        deg_config = { probability_und: DEGREE_PROBABILITY };
        
        perturber.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES + nr_nodes_to_be_added);
        // TODO - figure out way to test probabilities (distribution of values)
        // console.log( `Created ${graph.nrUndEdges() - REAL_GRAPH_NR_EDGES} UNDIRECTED edges.` );
        expect(graph.nrUndEdges()).to.be.at.least(REAL_GRAPH_NR_EDGES + (deg_config.probability_und/2) * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
        expect(graph.nrUndEdges()).to.be.at.most(REAL_GRAPH_NR_EDGES + deg_config.probability_und*2 * nr_nodes_to_be_added * REAL_GRAPH_NR_NODES);
      });      
      
    });


    describe('Randomly adding different amounts / percentages of UNDIRECTED edges', () => {

      it('should refuse to add a negative amount of UNdirected edges', () => {
         expect(perturber.randomlyAddEdgesAmount.bind(perturber, -1, {directed: false}))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });


      it('should refuse to add a negative percentage of UNdirected edges to an empty graph', () => {
         graph = new $G.BaseGraph("empty graph");
         expect(perturber.randomlyAddUndEdgesPercentage.bind(perturber, -1, {directed: false}))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });
      
      
      it('should refuse to add a negative percentage of UNdirected edges', () => {
         expect(perturber.randomlyAddUndEdgesPercentage.bind(perturber, -1, {directed: false}))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });


      it('should add a specified amount of UNdirected edges', () => {
        let nr_und_edges_to_be_added = Math.floor(Math.random() * MAX_EDGES_TO_CREATE);
        perturber.randomlyAddEdgesAmount(nr_und_edges_to_be_added, {directed: false});
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + nr_und_edges_to_be_added);
        expect(graph.nrDirEdges()).to.equal(0);
      });


      it('should add a specified percentage of UNdirected edges', () => {
        let percentage_und_edges_to_be_added = Math.random() * 100;
        perturber.randomlyAddUndEdgesPercentage(percentage_und_edges_to_be_added);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES + Math.ceil( REAL_GRAPH_NR_EDGES * percentage_und_edges_to_be_added / 100) );
        expect(graph.nrDirEdges()).to.equal(0);
      });

    });


    /**
     * TODO enhance by node types
     */
    describe('Randomly DELETE different amounts / percentages of NODES - ', () => {
        
        it('should refuse to delete a negative amount of nodes', () => {
            expect(perturber.randomlyDeleteNodesAmount.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of nodes');
        });
        
        
        it('should refuse to delete a negative percentage of nodes', () => {
            expect(perturber.randomlyDeleteNodesPercentage.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of nodes');
        });
        
        
        it('should simply delete all nodes when passing an amount greater than the number of existing nodes', () => {
            perturber.randomlyDeleteNodesAmount(10e6);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(0);
        });
        
        
        it('should simply delete all nodes when passing a percentage greater than 100%', () => {
            perturber.randomlyDeleteNodesPercentage(101);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(0);
        });
        
        
        it('should delete a specified amount of nodes', () => {
            let nr_nodes_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_NODES);
            perturber.randomlyDeleteNodesAmount(nr_nodes_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES - nr_nodes_to_be_deleted);
        });
        

        it(`should delete some random percentage of all nodes`, () => {
            let p = Math.floor(Math.random()*100);                
            perturber.randomlyDeleteNodesPercentage(p);
            expect(graph.nrNodes()).to.equal( REAL_GRAPH_NR_NODES - Math.ceil(REAL_GRAPH_NR_NODES * p/100) );
        });
        
    });


    /**
     * TODO: enhance by edge types
     */
    describe('Randomly delete different amounts / percentages of UNDIRECTED Edges - ', () => {
        
        it('should refuse to delete a negative amount of edges', () => {
            expect(perturber.randomlyDeleteUndEdgesAmount.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should refuse to delete a negative percentage of edges', () => {
            expect(perturber.randomlyDeleteUndEdgesPercentage.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should simply delete all edges when passing an amount greater than the number of existing edges', () => {
            perturber.randomlyDeleteUndEdgesAmount(10e6);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should simply delete all edges when passing a percentage greater than 100%', () => {
            perturber.randomlyDeleteUndEdgesPercentage(101);            
            expect(graph.nrUndEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should delete a specified amount of edges', () => {
            let nr_edges_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_EDGES);
            perturber.randomlyDeleteUndEdgesAmount(nr_edges_to_be_deleted);          
            expect(graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES - nr_edges_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        

        it(`should delete a random percentage of all edges`, () => {
            let p = Math.floor(Math.random()*100);                
            perturber.randomlyDeleteUndEdgesPercentage(p);
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
      perturber = new $P.SimplePerturber( graph );
      stats = graph.getStats();
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrUndEdges()).to.equal(0);
      expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES);
    });
    /**
     * TODO: enhance by edge types
     */
    describe('Randomly deleting different amounts / percentages of DIRECTED edges - ', () => {

        it('should refuse to delete a negative amount of edges', () => {
            expect(perturber.randomlyDeleteDirEdgesAmount.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should refuse to delete a negative percentage of edges', () => {
            expect(perturber.randomlyDeleteDirEdgesPercentage.bind(perturber, -1))
                .to.throw('Cowardly refusing to remove a negative amount of edges');
        });
        
        
        it('should simply delete all edges when passing an amount greater than the number of existing edges', () => {
            perturber.randomlyDeleteDirEdgesAmount(10e6);            
            expect(graph.nrDirEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should simply delete all edges when passing a percentage greater than 100%', () => {
            perturber.randomlyDeleteDirEdgesPercentage(101);            
            expect(graph.nrDirEdges()).to.equal(0);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
        
        it('should delete a specified amount of edges', () => {
            let nr_edges_to_be_deleted = Math.floor(Math.random()*REAL_GRAPH_NR_EDGES);
            perturber.randomlyDeleteDirEdgesAmount(nr_edges_to_be_deleted);          
            expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES - nr_edges_to_be_deleted);
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });


        it(`should delete a certain percentage of all edges`, () => {
            let p = Math.floor(Math.random()*100);                
            perturber.randomlyDeleteDirEdgesPercentage(p);
            expect(graph.nrDirEdges()).to.equal( REAL_GRAPH_NR_EDGES - Math.ceil(REAL_GRAPH_NR_EDGES * p/100) );
            expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        });
        
    });


    describe('Randomly adding different amounts / percentages of DIRECTED edges', () => {

      it('should refuse to add a negative amount of directed edges', () => {
         expect(perturber.randomlyAddEdgesAmount.bind(perturber, -1, {directed: true}))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });


      it('should refuse to add a negative percentage of directed edges to an empty graph', () => {
         graph = new $G.BaseGraph("empty graph");
         expect(perturber.randomlyAddDirEdgesPercentage.bind(perturber, -1, {directed: true}))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });
      
      
      it('should refuse to add a negative percentage of directed edges', () => {
         expect(perturber.randomlyAddDirEdgesPercentage.bind(perturber, -1))
            .to.throw('Cowardly refusing to add a non-positive amount of edges'); 
      });


      it('should add a specified amount of directed edges', () => {
        let nr_dir_edges_to_be_added = Math.floor(Math.random() * MAX_EDGES_TO_CREATE);
        perturber.randomlyAddEdgesAmount(nr_dir_edges_to_be_added, {directed: true});
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES + nr_dir_edges_to_be_added);
        expect(graph.nrUndEdges()).to.equal(0);
      });


      it('should add a specified percentage of directed edges', () => {
        let percentage_dir_edges_to_be_added = Math.random() * 100;
        perturber.randomlyAddDirEdgesPercentage(percentage_dir_edges_to_be_added);
        expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
        expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES + Math.ceil( REAL_GRAPH_NR_EDGES * percentage_dir_edges_to_be_added / 100) );
        expect(graph.nrUndEdges()).to.equal(0);
      });

    });
    
  });



	/**
	 * We don't know how to test RANDOM generation of something yet,
	 * so we fall back to simply test differences in the degree distribution
	 * This is a VERY WEAK test however, for even the addition or
	 * deletion of a single edge would lead to the same result...
	 * TODO figure out how to test this properly
	 * PLUS - how to test for runtime ???
	 */
	describe('Randomly generate edges in an existing graph (create a random graph)', () => {
		var test_graph_file = "./test/test_data/small_graph_adj_list_def_sep.csv",
				probability : number,
				min	: number,
				max : number,
				deg_dist : DegreeDistribution,
        graph : $G.IGraph,
        perturber: $P.ISimplePerturber,
			  csv	: $CSV.CSVInput = new $CSV.CSVInput();


    beforeEach(() => {
				graph = csv.readFromAdjacencyListFile(test_graph_file),
        perturber = new $P.SimplePerturber( graph );
    });
				
		
		describe('Random edge generation via probability', () => {
				
			it('should throw an error if probability is smaller 0', () => {
				probability = -1;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(perturber.createRandomEdgesProb.bind(graph, probability, true)).to.throw('Probability out of range');
			});

			
			it('should throw an error if probability is greater 1', () => {
				probability = 2;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(perturber.createRandomEdgesProb.bind(graph, probability, true)).to.throw('Probability out of range');
			});

			
			it('DIRECTED - should randomly generate directed edges', () => {
				probability = 0.5;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				perturber.createRandomEdgesProb(probability, true);
				expect(graph.nrDirEdges()).not.to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(degCent.degreeDistribution(graph)).not.to.deep.equal(deg_dist);
			});

			
			it('UNDIRECTED - should randomly generate UNdirected edges', () => {
				probability = 0.5;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				perturber.createRandomEdgesProb(probability, false);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);		
				expect(degCent.degreeDistribution(graph)).not.to.deep.equal(deg_dist);
			});

			
			it('UNDIRECTED - should default to UNdirected edges if no direction is provided', () => {
				probability = 0.5;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				perturber.createRandomEdgesProb(probability);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);		
				expect(degCent.degreeDistribution(graph)).not.to.deep.equal(deg_dist);
			});
		
		});
				
		
		/**
		 * Although we clearly specify min / max in this case,
		 * we can still not test for specific node degree (ranges),
		 * except for the general fact that a nodes degree
		 * should be in the range [0, max+n-1], as
		 * all n-1 other nodes might have an edge to that node
		 */
		describe('Random edge generation via min / max #edges per node', () => {
				
			it('should throw an error if min is smaller 0', () => {
				min = -1;
				max = 10;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).to.throw('Minimum degree cannot be negative.');
			});
			
			
			it('should throw an error if max is greater (n-1)', () => {
				min = 0;
				max = 4;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).to.throw('Maximum degree exceeds number of reachable nodes.');
			});
			
			
			it('should throw an error if max is greater (n-1)', () => {
				min = 4;
				max = 2;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).to.throw('Minimum degree cannot exceed maximum degree.');
			});

			
			it('DIRECTED - should randomly generate directed edges', () => {
				min = 1;
				max = 3;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				perturber.createRandomEdgesSpan(min, max, true);
				expect(graph.nrDirEdges()).not.to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(degCent.degreeDistribution(graph)).not.to.deep.equal(deg_dist);
			});
			
			
			it('UNDIRECTED - should randomly generate UNdirected edges', () => {
				min = 1;
				max = 3;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);
				perturber.createRandomEdgesSpan(min, max, false);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);
				expect(degCent.degreeDistribution(graph)).not.to.deep.equal(deg_dist);
			});
		
		});
		
	});

});
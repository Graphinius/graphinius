/// <reference path="../../../typings/tsd.d.ts" />

import * as fs from 'fs';
import * as chai from 'chai';
import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $JI from '../../../src/io/input/JSONInput';
import * as $JO from '../../../src/io/output/JSONOutput';

let expect = chai.expect,
    jsonIn: $JI.IJSONInput,
    jsonOut: $JO.IJSONOutput,
    graph: $G.IGraph,
    resultString: string,
    search_graph_in = "./test/test_data/search_graph.json",
    search_graph_out = "./test/test_data/output/search_graph_out.json";


describe('GRAPH JSON OUTPUT TESTS - ', () => {

  beforeEach( () => {
    graph = new $G.BaseGraph("Output Test graph");
  });


  describe('Output toy JSON structs', () => {

    /**
     * Shall a node without edges still have an 
     * empty edges array and an empty features object?
     */
    it('Should correctly output a graph of just one node', () => {
      graph.addNodeByID("A");
      jsonOut = new $JO.JSONOutput();
      resultString = jsonOut.writeToJSONSString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 1,
        dir_edges: 0,
        und_edges: 0,
        data: {
          A: {
            edges: [],
            features: {}
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).to.equal(JSONControlString);
    });


    it('Should correctly output a graph of two nodes and an UNdirected edge', () => {
      let n_a = graph.addNodeByID("A");
      let n_b = graph.addNodeByID("B");
      graph.addEdge("Test edge", n_a, n_b);
      jsonOut = new $JO.JSONOutput();
      resultString = jsonOut.writeToJSONSString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 2,
        dir_edges: 0,
        und_edges: 1,
        data: {
          A: {
            edges: [
              {
                to: "B",
                directed: false,
                weight: undefined
              }
            ],
            features: { }
          },
          B: {
            edges: [
              {
                to: "A",
                directed: false,
                weight: undefined
              }
            ],
            features: { }
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).to.equal(JSONControlString);
    });


    it('Should correctly output a graph of two nodes and a directed edge', () => {
      let n_a = graph.addNodeByID("A");
      let n_b = graph.addNodeByID("B");
      graph.addEdge("Single directed edge", n_b, n_a, {directed: true});
      jsonOut = new $JO.JSONOutput();
      resultString = jsonOut.writeToJSONSString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 2,
        dir_edges: 1,
        und_edges: 0,
        data: {
          A: {
            edges: [ ],
            features: { }
          },
          B: {
            edges: [
              {
                to: "A",
                directed: true,
                weight: undefined
              }
            ],
            features: { }
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).to.equal(JSONControlString);
    });


    it('Should correctly output a graph of two nodes and a directed edge with weight', () => {
      let n_a = graph.addNodeByID("A");
      let n_b = graph.addNodeByID("B");
      graph.addEdge("Single directed edge", n_b, n_a, {
        directed: true,
        weighted: true,
        weight: 5
      });
      jsonOut = new $JO.JSONOutput();
      resultString = jsonOut.writeToJSONSString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 2,
        dir_edges: 1,
        und_edges: 0,
        data: {
          A: {
            edges: [ ],
            features: { }
          },
          B: {
            edges: [
              {
                to: "A",
                directed: true,
                weight: 5
              }
            ],
            features: { }
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).to.equal(JSONControlString);
    });


    it('Should correctly output a graph of one node and its features', () => {
      let n_a = graph.addNodeByID("A");
      let features = {
        coords: {
          x: 1,
          y: 1,
          z: 1
        }
      }
      n_a.setFeatures( features );
      jsonOut = new $JO.JSONOutput();
      resultString = jsonOut.writeToJSONSString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 1,
        dir_edges: 0,
        und_edges: 0,
        data: {
          A: {
            edges: [ ],
            features: {
              coords: {
                x: 1,
                y: 1,
                z: 1
              }
            },
            coords: {
              x: 1,
              y: 1,
              z: 1
            }
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).to.equal(JSONControlString);
    });

  });


  /**
   * Only works with files specifically written to resemble
   * the internal order of nodes after creation
   * 
   * e.g. nodes A -> B -> C would internally become
   * A -> C -> B if an edge A -> C existed in file...
   */
  describe('Output small JSON structs from file', () => {

    it('Should correctly output search graph after reading it from file', () => {
      jsonIn = new $JI.JSONInput( true, false, true );
      let in_graph = fs.readFileSync( search_graph_in ).toString().replace(/\s/g, '');

      graph = jsonIn.readFromJSONFile( search_graph_in );
      let JSONControlString = jsonOut.writeToJSONSString( graph );

      expect( JSONControlString ).to.equal( in_graph );
    });

  });


  describe('Writing small JSON structs from file', () => {

    afterEach( () => {
      fs.unlinkSync( search_graph_out );
      expect(fs.existsSync(search_graph_out)).to.be.false;
    })

    it('Should correctly output search graph file after reading from file', () => {
      jsonIn = new $JI.JSONInput( true, false, true );
      graph = jsonIn.readFromJSONFile( search_graph_in );
      
      jsonOut.writeToJSONFile( search_graph_out, graph );
      expect( fs.existsSync( search_graph_out ) ).to.be.true;

      let graph2 = jsonIn.readFromJSONFile( search_graph_out );
      expect( graph ).to.deep.equal( graph2 );

      graph.addNodeByID('superfluous');
      expect( graph ).to.not.deep.equal( graph2 );
    });

  });

});
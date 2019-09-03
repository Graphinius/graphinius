import * as fs from 'fs';
import * as $N from '../../../src/core/base/BaseNode';
import * as $E from '../../../src/core/base/BaseEdge';
import * as $G from '../../../src/core/base/BaseGraph';
import { JSONInput, IJSONInConfig } from '../../../src/io/input/JSONInput';
import { JSONOutput } from '../../../src/io/output/JSONOutput';
import { labelKeys } from '../../../src/io/interfaces';
import { CSV_DATA_PATH, JSON_DATA_PATH, OUTPUT_PATH } from '../../config/config';
import {TypedGraph} from "../../../src/core/typed/TypedGraph";

import {Logger} from "../../../src/utils/Logger";
import {TypedNode} from "../../../src/core/typed/TypedNode";
const logger = new Logger();


let jsonIn: JSONInput,
    jsonOut: JSONOutput,
    graph: $G.IGraph,
    resultString: string,
    search_graph_in = `${JSON_DATA_PATH}/search_graph.json`,
    search_graph_out = `${OUTPUT_PATH}/search_graph_out.json`;

let std_json_in_config: IJSONInConfig = {
  explicit_direction: true,
  directed: false,
  weighted: true
};


describe('GRAPH JSON OUTPUT TESTS - ', () => {


  describe('Output toy JSON structs', () => {

    beforeEach(() => {
      graph = new $G.BaseGraph("Output Test graph");
    });


    test('Should correctly output a graph of just one node', () => {
      graph.addNodeByID("A");
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 1,
        dir_e: 0,
        und_e: 0,
        data: {
          A: {
            [labelKeys.edges]: [],
            [labelKeys.n_features]: {}
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);
    });


    test('Should correctly output a graph node of certain label', () => {
      let n_a = graph.addNodeByID("A");
      n_a.setLabel("Labellius");
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 1,
        dir_e: 0,
        und_e: 0,
        data: {
          A: {
            [labelKeys.edges]: [],
            [labelKeys.n_label]: "Labellius",
            [labelKeys.n_features]: {}
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toEqual(JSONControlString);
    });


    test(
      'Should correctly output a graph of two nodes and an UNdirected edge',
      () => {
        let n_a = graph.addNodeByID("A");
        let n_b = graph.addNodeByID("B");
        graph.addEdgeByID("Test edge", n_a, n_b);
        jsonOut = new JSONOutput();
        resultString = jsonOut.writeToJSONString( graph );

        let JSONControlStruct = {
          name: "Output Test graph",
          nodes: 2,
          dir_e: 0,
          und_e: 1,
          data: {
            A: {
              [labelKeys.edges]: [
                {
                  [labelKeys.e_to]: "B",
                  [labelKeys.e_dir]: 0,
                  [labelKeys.e_weight]: undefined
                }
              ],
              [labelKeys.n_features]: { }
            },
            B: {
              [labelKeys.edges]: [
                {
                  [labelKeys.e_to]: "A",
                  [labelKeys.e_dir]: 0,
                  [labelKeys.e_weight]: undefined
                }
              ],
              [labelKeys.n_features]: { }
            }
          }
        };
        let JSONControlString = JSON.stringify( JSONControlStruct );
        expect(resultString).toBe(JSONControlString);
      }
    );


    test(
      'Should correctly output a graph of two nodes and a directed edge',
      () => {
        let n_a = graph.addNodeByID("A");
        let n_b = graph.addNodeByID("B");
        graph.addEdgeByID("Single directed edge", n_b, n_a, {
          directed: true,
          label: 'FRIENDS_WITH'
        });
        jsonOut = new JSONOutput();
        resultString = jsonOut.writeToJSONString( graph );

        let JSONControlStruct = {
          name: "Output Test graph",
          nodes: 2,
          dir_e: 1,
          und_e: 0,
          data: {
            A: {
              [labelKeys.edges]: [ ],
              [labelKeys.n_features]: { }
            },
            B: {
              [labelKeys.edges]: [
                {
                  [labelKeys.e_to]: "A",
                  [labelKeys.e_dir]: 1,
                  [labelKeys.e_weight]: undefined,
                  [labelKeys.e_label]: 'FRIENDS_WITH'
                }
              ],
              [labelKeys.n_features]: { }
            }
          }
        };
        let JSONControlString = JSON.stringify( JSONControlStruct );
        expect(resultString).toBe(JSONControlString);
      }
    );


    test(
      'Should correctly output a graph of two nodes and a directed edge with weight',
      () => {
        let n_a = graph.addNodeByID("A");
        let n_b = graph.addNodeByID("B");
        graph.addEdgeByID("Single directed edge", n_b, n_a, {
          directed: true,
          weighted: true,
          weight: 5
        });
        jsonOut = new JSONOutput();
        resultString = jsonOut.writeToJSONString( graph );

        let JSONControlStruct = {
          name: "Output Test graph",
          nodes: 2,
          dir_e: 1,
          und_e: 0,
          data: {
            A: {
              [labelKeys.edges]: [ ],
              [labelKeys.n_features]: { }
            },
            B: {
              [labelKeys.edges]: [
                {
                  [labelKeys.e_to]: "A",
                  [labelKeys.e_dir]: 1,
                  [labelKeys.e_weight]: 5
                }
              ],
              [labelKeys.n_features]: { }
            }
          }
        };
        let JSONControlString = JSON.stringify( JSONControlStruct );
        expect(resultString).toBe(JSONControlString);
      }
    );


    test('Should correctly output a graph of one node and its features', () => {
      let n_a = graph.addNodeByID("A");
      let features = {
        [labelKeys.coords]: {
          x: 1,
          y: 1,
          z: 1
        }
      };
      n_a.setFeatures( features );
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );

      let JSONControlStruct = {
        name: "Output Test graph",
        nodes: 1,
        dir_e: 0,
        und_e: 0,
        data: {
          A: {
            [labelKeys.edges]: [ ],
            [labelKeys.n_features]: {
              [labelKeys.coords]: {
                x: 1,
                y: 1,
                z: 1
              }
            },
            [labelKeys.coords]: {
              x: 1,
              y: 1,
              z: 1
            }
          }
        }
      };
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);
    });

  });


  describe('Output toy JSON structs - TYPED graph', () => {

    let typedGraph : TypedGraph;
    const nodeType1 = 'PERSON';
    const nodeType2 = 'COFFEE';
    const edgeID = 'TypedEdge';
    const edgeType = 'DRINKS';


    beforeEach(() => {
      typedGraph = new TypedGraph("Output Test graph");
      let n_a = typedGraph.addNodeByID("A", {type: nodeType1});
      let n_b = typedGraph.addNodeByID("B", {type: nodeType2});
      typedGraph.addEdgeByID(edgeID, n_a, n_b, {type: edgeType, directed: true});
    });


    /**
     * @todo why is PERSON without double quotes, but COFFEE is with...?
     */
    it('should correctly output the node type', function () {
      const [lut, rlt] =  new JSONOutput().constructTypeRLUT(typedGraph);
      resultString = new JSONOutput().writeToJSONString(typedGraph);
      // logger.log(resultString);
      expect(resultString).toContain(`"${labelKeys.n_type}":"${lut.nodes['PERSON']}"`);
      expect(resultString).toContain(`"${labelKeys.n_type}":"${lut.nodes['COFFEE']}"`);
    });


    it('should correctly output the edge type', () => {
      const [lut, rlt] =  new JSONOutput().constructTypeRLUT(typedGraph);
      resultString =  new JSONOutput().writeToJSONString(typedGraph);
      expect(resultString).toContain(`"e":[{"t":"B","d":1,"${labelKeys.e_type}":"${lut.edges['DRINKS']}"`);
    });


    it('should construct the correct LUT', () => {
      const rlt_exp = {
        nodes: { '@': 'GENERIC', 'A': 'PERSON', 'B': 'COFFEE' },
        edges: { '@': 'GENERIC', 'A': 'DRINKS' }
      };
      const rlt =  new JSONOutput().constructTypeRLUT(typedGraph)[1];
      expect(rlt).toEqual(rlt_exp);
    });


    it('should include the LUT in the output string', () => {
      const rlut_exp = {
        nodes: { '@': 'GENERIC', 'A': 'PERSON', 'B': 'COFFEE' },
        edges: { '@': 'GENERIC', 'A': 'DRINKS' }
      };
      resultString = new JSONOutput().writeToJSONString(typedGraph);
      expect(resultString).toContain(JSON.stringify(rlut_exp));
      expect(JSON.parse(resultString).typeRLT).toEqual(rlut_exp);
      console.log(resultString);
    });

  });


  /**
   * @description Only works with files specifically written to resemble
   *              the internal order of nodes after creation
   *        
   *              e.g. nodes A -> B -> C would internally become
   *              A -> C -> B if an edge A -> C existed in file...
   * 
   * @todo solution => only check for existence, not order or properties
   */
  describe('Output small JSON structs from file', () => {

    test('Should correctly output search graph after reading it from file', () => {
      jsonIn = new JSONInput(std_json_in_config);
      let in_graph = fs.readFileSync( search_graph_in ).toString().replace(/\s/g, '');

      graph = jsonIn.readFromJSONFile( search_graph_in );
      let JSONControlString = jsonOut.writeToJSONString( graph );

      expect( JSONControlString ).toBe(in_graph);
    });

  });


  describe('Writing small JSON structs from file', () => {

    afterEach(() => {
      fs.unlinkSync( search_graph_out );
      expect(fs.existsSync(search_graph_out)).toBe(false);
    });

    test(
      'Should correctly output search graph file after reading from file',
      () => {
        jsonIn = new JSONInput(std_json_in_config);
        graph = jsonIn.readFromJSONFile( search_graph_in );
        
        jsonOut.writeToJSONFile( search_graph_out, graph );
        expect( fs.existsSync( search_graph_out ) ).toBe(true);

        let graph2 = jsonIn.readFromJSONFile( search_graph_out );
        expect( graph ).toEqual(graph2);

        graph.addNodeByID('superfluous');
        expect( graph ).not.toEqual(graph2);
      }
    );

  });


  describe('correctly handle extreme edge weight cases', () => {
    let JSONControlStruct = {},
        n_a : $N.IBaseNode,
        n_b : $N.IBaseNode;

    beforeEach(() => {
      graph = new $G.BaseGraph('Output Test graph');
      n_a = graph.addNodeByID("A");
      n_b = graph.addNodeByID("B");

      JSONControlStruct = {
        name: "Output Test graph",
        nodes: 2,
        dir_e: 1,
        und_e: 0,
        data: {
          A: {
            [labelKeys.edges]: [ ],
            [labelKeys.n_features]: { }
          },
          B: {
            [labelKeys.edges]: [
              {
                [labelKeys.e_to]: "A",
                [labelKeys.e_dir]: 1,
                [labelKeys.e_weight]: undefined
              }
            ],
            [labelKeys.n_features]: { }
          }
        }
      };
    });
    

    test('should encode Positive Infinity as string "infinity"', () => {
      graph.addEdgeByID("Single directed edge", n_b, n_a, {
        directed: true,
        weighted: true,
        weight: Number.POSITIVE_INFINITY
      });
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );
      JSONControlStruct['data']['B'][labelKeys.edges][0][labelKeys.e_weight] = 'Infinity';
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);      
    });


    test('should encode Negative Infinity as string "-infinity"', () => {  
      graph.addEdgeByID("Single directed edge", n_b, n_a, {
        directed: true,
        weighted: true,
        weight: Number.NEGATIVE_INFINITY
      });
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );
      JSONControlStruct['data']['B'][labelKeys.edges][0][labelKeys.e_weight] = '-Infinity';
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);      
    });


    test('should encode Max Value as string "max"', () => {
      graph.addEdgeByID("Single directed edge", n_b, n_a, {
        directed: true,
        weighted: true,
        weight: Number.MAX_VALUE
      });
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );
      JSONControlStruct['data']['B'][labelKeys.edges][0][labelKeys.e_weight] = 'MAX';
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);      
    });


    test('should encode Min Value as string "min"', () => {
      graph.addEdgeByID("Single directed edge", n_b, n_a, {
        directed: true,
        weighted: true,
        weight: Number.MIN_VALUE
      });
      jsonOut = new JSONOutput();
      resultString = jsonOut.writeToJSONString( graph );
      JSONControlStruct['data']['B'][labelKeys.edges][0][labelKeys.e_weight] = 'MIN';
      let JSONControlString = JSON.stringify( JSONControlStruct );
      expect(resultString).toBe(JSONControlString);      
    });

  });

});

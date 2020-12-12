import * as $N from '../../lib/core/base/BaseNode';
import * as $E from '../../lib/core/base/BaseEdge';
import * as $G from '../../lib/core/base/BaseGraph';
import { JSONInput, IJSONInConfig } from '../../lib/io/input/JSONInput';
import { JSONOutput} from '../../lib/io/output/JSONOutput';

import * as $EME from '../../lib/energyminimization/ExpansionBoykov';
import { CSV_DATA_PATH, JSON_DATA_PATH } from '../config/test_paths';


let json = new JSONInput({explicit_direction: false, directed: false, weighted: true}),
    eme_graph = `${JSON_DATA_PATH}/energy_minimization_expansion_graph.json`,
    graph : $G.IGraph,
    labels : Array<string> = ["1", "2"],
    eme : $EME.IEMEBoykov;


describe('EME Boykov Tests - ', () => {

  beforeEach(() => {
    graph = json.readFromJSONFile(eme_graph);
    eme = new $EME.EMEBoykov(graph, labels);
  });


  describe("Base Tests - ", () => {

    test('should instantiate a standard config', () => {
      expect(eme.prepareEMEStandardConfig()).toHaveProperty('directed');
      expect(eme.prepareEMEStandardConfig()).toHaveProperty('labeled');
      expect(eme.prepareEMEStandardConfig()).toHaveProperty('interactionTerm');
      expect(eme.prepareEMEStandardConfig()).toHaveProperty('dataTerm');

      expect( eme.prepareEMEStandardConfig().directed ).toBe(false);
      expect( eme.prepareEMEStandardConfig().labeled ).toBe(false);
      expect( eme.prepareEMEStandardConfig().interactionTerm ).toBeInstanceOf(Function);
      expect( eme.prepareEMEStandardConfig().dataTerm ).toBeInstanceOf(Function);
    });

  });


  describe("Helper Functions Tests - ", () => {

    test('should correctly initialize the graph with the correct labels', () => {
      let lGraph: $G.IGraph = eme.initGraph(graph);

      // check that all labels got copied correctly
      let nodes = lGraph.getNodes();
      for (let i = 0; i < Object.keys(nodes).length; i++) {
          let node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
          expect(node.getLabel()).toBe(node.getFeature('label'));
      }
    });


    test('should correctly construct the expansion graph', () => {
      /* TODO think about better way to test this function.. */
      /* TODO write new test case => we build the expansion grpah as a directed graph now */

      let eGraph: $G.IGraph = eme.constructGraph();

      // constructGraph is dependent on the energy functions and the active label
      // as this is the first action we perform:
      // the active label is set to the first label ("1")
      // and we are using the standard energy functions defined at the top

      let nodes: {[keys: string] : $N.IBaseNode} = eGraph.getNodes();
      let edges: {[keys: string] : $E.IBaseEdge} = eGraph.getDirEdges();

      // get all node ids
      let pixel_nodes = Object.keys(graph.getNodes());
      expect(pixel_nodes).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']));
      // get all auxiliary nodes ids
      let aux_nodes_ind = Object.keys(nodes).filter(element => pixel_nodes.concat(['SOURCE', 'SINK']).indexOf(element) < 0);
      // all non zero nodes ( labeled with 2 in the graph)
      let non_zero_nodes = ['A', 'C', 'D', 'G'];
      let zero_nodes = ['B', 'E', 'F', 'H', 'I'];

      // check for total number of nodes and edges
      expect(Object.keys(nodes).length).toBe(16);
      expect(Object.keys(edges).length).toBe(80);

      // // check for number of neighbors for each node + SOURCE + SINK
      // expect(Object.keys(nodes['A'].connNodes()).length).toBe(4);
      // expect(Object.keys(nodes['B'].connNodes()).length).toBe(5);
      // expect(Object.keys(nodes['C'].connNodes()).length).toBe(4);
      // expect(Object.keys(nodes['D'].connNodes()).length).toBe(5);
      // expect(Object.keys(nodes['E'].connNodes()).length).toBe(6);
      // expect(Object.keys(nodes['F'].connNodes()).length).toBe(5);
      // expect(Object.keys(nodes['G'].connNodes()).length).toBe(4);
      // expect(Object.keys(nodes['H'].connNodes()).length).toBe(5);
      // expect(Object.keys(nodes['I'].connNodes()).length).toBe(4);
      // expect(Object.keys(nodes['SOURCE'].connNodes()).length).toBe(9);
      // expect(Object.keys(nodes['SINK'].connNodes()).length).toBe(14);

      // check edges to sink
      // weights should all be zero
      non_zero_nodes.forEach((element) => {
        let edge: $E.IBaseEdge = eGraph.getDirEdgeByNodeIDs(element, 'SINK');
        expect(edge.getWeight()).toBe(0);
      });
      // weights should all be infinity
      zero_nodes.forEach((element) => {
        let edge: $E.IBaseEdge = eGraph.getDirEdgeByNodeIDs(element, 'SINK');
        expect(edge.getWeight()).toBe(Infinity);
      });
      // weights should all be 1
      aux_nodes_ind.forEach((element) => {
        let edge: $E.IBaseEdge = eGraph.getDirEdgeByNodeIDs(element, 'SINK');
        expect(edge.getWeight()).toBe(1);
      });

      // check edges to source
      // weights should all be zero
      non_zero_nodes.forEach((element) => {
        let edge: $E.IBaseEdge = eGraph.getDirEdgeByNodeIDs(element, 'SOURCE');
        expect(edge.getWeight()).toBe(1.5);
      });
      // weights should all be infinity
      zero_nodes.forEach((element) => {
        let edge: $E.IBaseEdge = eGraph.getDirEdgeByNodeIDs(element, 'SOURCE');
        expect(edge.getWeight()).toBe(0);
      });

      // check inter node edges
      expect(eGraph.getDirEdgeByNodeIDs('E', 'F').getWeight()).toBe(0);
      expect(eGraph.getDirEdgeByNodeIDs('A', 'D').getWeight()).toBe(1);
      expect(eGraph.getDirEdgeByNodeIDs('B', 'E').getWeight()).toBe(0);
      expect(eGraph.getDirEdgeByNodeIDs('D', 'G').getWeight()).toBe(1);
      expect(eGraph.getDirEdgeByNodeIDs('E', 'H').getWeight()).toBe(0);
      expect(eGraph.getDirEdgeByNodeIDs('F', 'I').getWeight()).toBe(0);
      expect(eGraph.getDirEdgeByNodeIDs('H', 'I').getWeight()).toBe(0);
      // check node -> aux_node edges


      /**
       * @todo check for edges between nodes and auxiliary nodes
       */

    });

    /**
     * @todo write testcase for labelGraph function
     */
  });

  describe("Simple Potts Test - ", () => {

    test('should solve the potts model', () => {
      let pGraph = eme.calculateCycle().graph;
      let nodes = pGraph.getNodes();

      expect(nodes['A'].getLabel()).toBe('2');
      expect(nodes['B'].getLabel()).toBe('1');
      expect(nodes['C'].getLabel()).toBe('1');
      expect(nodes['D'].getLabel()).toBe('2');
      expect(nodes['E'].getLabel()).toBe('1');
      expect(nodes['F'].getLabel()).toBe('1');
      expect(nodes['G'].getLabel()).toBe('2');
      expect(nodes['H'].getLabel()).toBe('1');
      expect(nodes['I'].getLabel()).toBe('1');

      /**
       * @todo think about better test
       */

      // let jsonOut = new $JO.JSONOutput();
      // jsonOut.writeToJSONFile( "", pGraph );
      // console.log(eme.calculateCycle().graph.getStats());
      // expect( eme.calculateCycle().result)
    });
  });


});

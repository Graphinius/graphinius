import * as $N from '@/core/base/BaseNode';
import * as $E from '@/core/base/BaseEdge';
import * as $G from '@/core/base/BaseGraph';
import * as $MC from '@/mincutmaxflow/MinCutMaxFlowBoykov';


export type EnergyFunctionTerm = (arg1: string, arg2: string) => number;
// type EnergyFunctionDataTerm = (arg1: string, ...args: any[]) => number;
// type EnergyFunction = (...args: any[]) => number;


export interface EMEConfig {
  directed: boolean; // do we
  labeled: boolean;
  interactionTerm: EnergyFunctionTerm;
  dataTerm: EnergyFunctionTerm;
}


export interface EMEResult {
  graph: $G.IGraph;
}


export interface IEMEBoykov {
  calculateCycle(): EMEResult;
  constructGraph(): $G.IGraph;
  initGraph(graph: $G.IGraph): $G.IGraph;
  prepareEMEStandardConfig(): EMEConfig;
}


export interface EMEState {
  expansionGraph: $G.IGraph;
  labeledGraph: $G.IGraph;
  activeLabel: string;
  energy: number;
}



/**
 *
 */
class EMEBoykov implements IEMEBoykov {

  private _config: EMEConfig;
  private _state: EMEState = {
    expansionGraph: null,
    labeledGraph: null,
    activeLabel: '',
    energy: Infinity
  };
  private _interactionTerm: EnergyFunctionTerm;
  private _dataTerm: EnergyFunctionTerm;

  constructor(private _graph: $G.IGraph,
    private _labels: Array<string>,
    config?: EMEConfig) {
    this._config = config || this.prepareEMEStandardConfig();

    // set the energery functions
    this._interactionTerm = this._config.interactionTerm;
    this._dataTerm = this._config.dataTerm;

    // initialize graph => set labels
    this._graph = this.initGraph(_graph);

    // init state
    this._state.labeledGraph = this._graph.cloneStructure();
    this._state.activeLabel = this._labels[0];
  }


  calculateCycle() {
    let success: boolean = true;

    let mincut_options: $MC.MCMFConfig = { directed: true };

    while (success) {
      success = false;
      // for each label
      for (let i = 0; i < this._labels.length; i++) {
        this._state.activeLabel = this._labels[i];
        // find a new labeling f'=argminE(f') within one expansion move of f
        this._state.expansionGraph = this.constructGraph(); // construct new expansion graph

        let source: $N.IBaseNode = this._state.expansionGraph.getNodeById("SOURCE");
        let sink: $N.IBaseNode = this._state.expansionGraph.getNodeById("SINK");

        // logger.log("compute mincut");
        let MinCut: $MC.IMCMFBoykov;
        MinCut = new $MC.MCMFBoykov(this._state.expansionGraph, source, sink, mincut_options);
        let mincut_result: $MC.MCMFResult = MinCut.calculateCycle();
        // logger.log("done mincut");

        if (mincut_result.cost < this._state.energy) {
          this._state.energy = mincut_result.cost;
          this._state.labeledGraph = this.labelGraph(mincut_result, source);
          success = true;
        }

      }
      // the minimum can be found in one cycle
      if (this._labels.length <= 2) {
        break;
      }
    }

    let result: EMEResult = {
      graph: this._state.labeledGraph
    };

    return result;
  }


  constructGraph(): $G.IGraph {
    let graph: $G.IGraph = this._state.labeledGraph.cloneStructure();

    // copy node information
    let nodes: { [key: string]: $N.IBaseNode } = graph.getNodes();
    let node_ids: Array<string> = Object.keys(nodes);

    // add source (alpha) and sink (not alpha) to graph
    let source: $N.IBaseNode = graph.addNodeByID("SOURCE");
    let sink: $N.IBaseNode = graph.addNodeByID("SINK");

    // copy edge information now -> will cause infinite loop otherwise
    // let edges: {[key: string] : $E.IBaseEdge} = graph.getUndEdges();
    let edge_ids: Array<string> = Object.keys(graph.getUndEdges());
    let edges_length: number = edge_ids.length;

    // for all nodes add
    // edge to source and edge to sink
    for (let i = 0; i < node_ids.length; i++) {
      let node: $N.IBaseNode = nodes[node_ids[i]];

      let edge_options: $E.BaseEdgeConfig = { directed: true, weighted: true, weight: 0 };
      // add edge to source
      edge_options.weight = this._dataTerm(this._state.activeLabel, this._graph.getNodeById(node.getID()).getLabel());
      let edge_source: $E.IBaseEdge = graph.addEdgeByID(node.getID() + "_" + source.getID(), node, source, edge_options);
      let edge_source_reverse: $E.IBaseEdge = graph.addEdgeByID(source.getID() + "_" + node.getID(), source, node, edge_options);

      // add edge to sink
      edge_options.weight = (node.getLabel() == this._state.activeLabel) ? Infinity : this._dataTerm(node.getLabel(), this._graph.getNodeById(node.getID()).getLabel());
      let edge_sink: $E.IBaseEdge = graph.addEdgeByID(node.getID() + "_" + sink.getID(), node, sink, edge_options);
      let edge_sink_source: $E.IBaseEdge = graph.addEdgeByID(sink.getID() + "_" + node.getID(), sink, node, edge_options);
    }

    // for all neighboring pixels {p, q} where label(p) != label(q) :
    // add auxiliary node a_{p_q}
    // add edge from auxiliary node to sink
    // add edges to auxiliary node (from p and q)
    // remove edge between p and q
    for (let i = 0; i < edges_length; i++) {
      // let edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
      let edge: $E.IBaseEdge = graph.getEdgeById(edge_ids[i]);
      let node_p: $N.IBaseNode = edge.getNodes().a;
      let node_q: $N.IBaseNode = edge.getNodes().b;

      let edge_options: $E.BaseEdgeConfig = { directed: true, weighted: true, weight: 0 };

      // we don't care further for nodes of same labels
      if (node_p.getLabel() == node_q.getLabel()) {
        // just set the edge weight and convert to directed
        edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
        graph.deleteEdge(edge);
        graph.addEdgeByID(node_p.getID() + "_" + node_q.getID(), node_p, node_q, edge_options);
        graph.addEdgeByID(node_q.getID() + "_" + node_p.getID(), node_q, node_p, edge_options);
        continue;
      }

      // add auxiliary node
      let node_aux: $N.IBaseNode = graph.addNodeByID("aux_" + node_p.getID() + "_" + node_q.getID());

      // add 3 edges [{p, aux}, {aux, q}, {aux, sink}]
      // add edge {p, aux}
      edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
      let edge_p_aux: $E.IBaseEdge = graph.addEdgeByID(node_p.getID() + "_" + node_aux.getID(), node_p, node_aux, edge_options);
      let edge_p_aux_reverse: $E.IBaseEdge = graph.addEdgeByID(node_aux.getID() + "_" + node_p.getID(), node_aux, node_p, edge_options);

      // add edge {aux, q}
      edge_options.weight = this._interactionTerm(this._state.activeLabel, node_q.getLabel());
      let edge_aux_q: $E.IBaseEdge = graph.addEdgeByID(node_aux.getID() + "_" + node_q.getID(), node_aux, node_q, edge_options);
      let edge_aux_q_reverse: $E.IBaseEdge = graph.addEdgeByID(node_q.getID() + "_" + node_aux.getID(), node_q, node_aux, edge_options);

      // add edge {aux, sink}
      edge_options.weight = this._interactionTerm(node_p.getLabel(), node_q.getLabel());
      let edge_aux_sink: $E.IBaseEdge = graph.addEdgeByID(node_aux.getID() + "_" + sink.getID(), node_aux, sink, edge_options);
      let edge_aux_sink_reverse: $E.IBaseEdge = graph.addEdgeByID(sink.getID() + "_" + node_aux.getID(), sink, node_aux, edge_options);

      // remove the edge between p and q
      graph.deleteEdge(edge);
    }
    return graph;
  }


  // label a graph based on the result of a mincut
  labelGraph(mincut: $MC.MCMFResult, source: $N.IBaseNode) {
    let graph: $G.IGraph = this._state.labeledGraph;
    source = this._state.expansionGraph.getNodeById("SOURCE");

    for (let i = 0; i < mincut.edges.length; i++) {
      let edge: $E.IBaseEdge = mincut.edges[i];

      let node_a: $N.IBaseNode = edge.getNodes().a;
      let node_b: $N.IBaseNode = edge.getNodes().b;
      if (node_a.getID() == source.getID()) {
        graph.getNodeById(node_b.getID()).setLabel(this._state.activeLabel);
        continue;
      }
      if (node_b.getID() == source.getID()) {
        graph.getNodeById(node_a.getID()).setLabel(this._state.activeLabel);
      }

    }

    return graph;
  }


  initGraph(graph: $G.IGraph) {
    let nodes = graph.getNodes();
    let node_ids: Array<string> = Object.keys(nodes);
    let nodes_length: number = node_ids.length;
    for (let i = 0; i < nodes_length; i++) {
      // let node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
      let node: $N.IBaseNode = nodes[node_ids[i]];
      node.setLabel(node.getFeature('label'));
    }
    return graph;
  }


  prepareEMEStandardConfig(): EMEConfig {
    // we use the potts model as standard interaction term
    let interactionTerm: EnergyFunctionTerm = function (label_a: string, label_b: string) {
      return (label_a == label_b) ? 0 : 1;
    };

    // squared difference of new label and observed label as standard data term
    // label: new label; node_id is needed to get the original(observed) label
    let dataTerm: EnergyFunctionTerm = function (label: string, observed: string) {
      // get the label of the same node in the original graph
      // let observed: string = this._graph.getNodeById(node_id).getLabel();

      let label_number: number = Number(label);
      let observed_number: number = Number(observed);

      if (isNaN(label_number) || isNaN(observed_number)) {
        throw new Error('Cannot convert labels to numbers!');
      }

      return 1.5 * Math.pow(label_number - observed_number, 2);
    };

    return {
      directed: false,
      labeled: false,
      interactionTerm: interactionTerm,
      dataTerm: dataTerm
    }
  }

}


export {
  EMEBoykov
};

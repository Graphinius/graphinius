/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $SU from '../utils/structUtils'

export enum DegreeMode{
  in,
  out,
  und,
  dir,
  all
}

class degreeCentrality{

  getCentralityMap( graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode):{[id:string]: number}{
    weighted = ( weighted != null ) ? !!weighted : true;
    conf = ( conf == null ) ? DegreeMode.all : conf;
    
    let ret:{[id:string]: number} = {}; //Will be a map of [nodeID] = centrality

    switch(conf){ //Switch on the outside for faster loops
      case DegreeMode.in:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            if(!weighted)
              ret[key] = node.inDegree();
            else{
              ret[key] = ret[key]||0;
              for(let k in node.inEdges()){
                ret[key] += node.inEdges()[k].getWeight();
              }
            }
        }
        break;
      case DegreeMode.out:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            if(!weighted)
              ret[key] = node.outDegree();
            else{
              ret[key] = ret[key]||0;
              for(let k in node.outEdges())
                ret[key] += node.outEdges()[k].getWeight();
            }
        }
        break;
      case DegreeMode.und:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            if(!weighted)
              ret[key] = node.degree();
            else{
              ret[key] = ret[key]||0;
              for(let k in node.undEdges())
                ret[key] += node.undEdges()[k].getWeight();
            }
        }
        break;
      case DegreeMode.dir:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            if(!weighted)
              ret[key] = node.inDegree() + node.outDegree();
            else{
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
              for(let k in comb)
                ret[key] += comb[k].getWeight();
            }
        }
        break;
      case DegreeMode.all:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            if(!weighted)
              ret[key] = node.degree() + node.inDegree() + node.outDegree();
            else{
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
              for(let k in comb){
                ret[key] += comb[k].getWeight();
              }
            }
        }
        break;
    }
    return ret;
  }

  getHistorgram(graph: $G.IGraph){
    return graph.degreeDistribution();
  }
}

export {
  degreeCentrality
};
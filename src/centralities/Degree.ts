import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $SU from '../utils/StructUtils'

export enum DegreeMode {
  in,
  out,
  und,
  dir,
  all
}

/**
 * @todo per edge type ???
 */
export interface DegreeDistribution {
	in	: Uint32Array;
	out	: Uint32Array;
	dir	: Uint32Array;
	und	: Uint32Array;
	all	: Uint32Array;
}


class DegreeCentrality {

  constructor(){}

  getCentralityMap( graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode):{[id:string]: number} {
    weighted = ( weighted != null ) ? !!weighted : true;
    conf = ( conf == null ) ? DegreeMode.all : conf;
    
    let ret:{[id:string]: number} = {}; //Will be a map of [nodeID] = centrality

    switch(conf){ //Switch on the outside for faster loops
      case DegreeMode.in:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.inDegree();
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.inEdges()) {
                ret[key] += node.inEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.out:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.outDegree();
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.outEdges()) {
                ret[key] += node.outEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.und:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.degree();
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.undEdges()) {
                ret[key] += node.undEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.dir:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.inDegree() + node.outDegree();
            }
            else {
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
              for(let k in comb) {
                ret[key] += comb[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.all:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.degree() + node.inDegree() + node.outDegree();
            }
            else {
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
              for(let k in comb) {
                ret[key] += comb[k].getWeight();
              }
            }
          }
        }
        break;
    }
    return ret;
  }

  
	/**
	 * @TODO Weighted version !
   * @TODO per edge type !
	 */
  degreeDistribution(graph: $G.IGraph) {
		var max_deg : number = 0,
        key			: string,
        nodes   : {[id: string] : $N.IBaseNode} = graph.getNodes(),
				node 		: $N.IBaseNode,
				all_deg : number;

		for ( key in nodes ) {
			node = nodes[key];
			all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
			max_deg =  all_deg > max_deg ? all_deg : max_deg;
		}

		var deg_dist : DegreeDistribution = {
			in: new Uint32Array(max_deg),
			out: new Uint32Array(max_deg),
			dir: new Uint32Array(max_deg),
			und: new Uint32Array(max_deg),
			all: new Uint32Array(max_deg)
		};

		for ( key in nodes ) {
			node = nodes[key];
			deg_dist.in[node.inDegree()]++;
			deg_dist.out[node.outDegree()]++;
			deg_dist.dir[node.inDegree() + node.outDegree()]++;
			deg_dist.und[node.degree()]++;
			deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
		}
		// console.dir(deg_dist);
		return deg_dist;
	}
}

export {
  DegreeCentrality
};
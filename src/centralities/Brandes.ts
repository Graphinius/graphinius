/**
 * Created by ru on 14.09.17.
 */



import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';

function Brandes(graph: $G.IGraph): {} {
    //Information taken from graph
    let adj_array = graph.adjListArray(),
        nodes = graph.getNodes();
    //Variables for Brandes algorithm
    let s,     //current node of outer loop
        v : $N.IBaseNode,     //current node of inner loop
        w : $N.IBaseNode,     //neighbour of v
        Pred : { [key: string] : $N.IBaseNode[]} = {},     //list of Predecessors
        sigma : {[key:string] : number} = {}, //number of shortest paths from source to v
        delta : {[key:string] : number} = {}, //dependency of source on v
        dist  : {[key:string] : number} = {},  //distances
        Q : $N.IBaseNode[] = [],     //Queue of nodes
        S : $N.IBaseNode[] = [],     //stack of nodes
        CB: {[key:string] : number} = {};    //Betweenness values

    let N = graph.nrNodes();
    for(let i = 0; i < N; i++){
        s = nodes[i];

        //Initialization
        for(let n in nodes){
            Pred[nodes[n].getID()] = [];
        }
        for(let n in nodes){
            dist[nodes[n].getID()]  = Number.POSITIVE_INFINITY;
            sigma[nodes[n].getID()] = 0;
        }
        dist[s.getID()]  = 0;
        sigma[s.getID()] = 1;
        Q.push(s);

        while(Q.length >= 1){ //Queue not empty
            v = Q.shift();
            S.push(s);
            let neighbors = v.nextNodes();
            for(let ne in neighbors){
                w = neighbors[ne].node;
                //Path discovery: w found for the first time?
                if(dist[w.getID()]<0){
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                //Path counting: edge (v,w) on shortest path?
                if(dist[w.getID()] == dist[v.getID()]+1){
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v);
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        delta = {};
        while(S.length >= 1){
            w = S.pop();
            for(let key in Pred[w.getID()]){
                let lvKey = Pred[w.getID()][key].getID();
                delta[lvKey] += (sigma[lvKey]/sigma[w.getID()]*(1+delta[w.getID()]))
            }
            if(w.getID()!=s.getID()){
                CB[w.getID()] += delta[w.getID()];
            }
        }
    }
    return CB;
};

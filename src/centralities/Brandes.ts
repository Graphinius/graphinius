/**
 * Created by ru on 14.09.17.
 */



import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
/*
function Brandes(graph: $G.IGraph): {} {
    //Information taken from graph
    let adj_array = graph.adjListArray(),
        nodes = graph.getNodes();
    //Variables for Brandes algorithm
    let s,     //current node of outer loop
        v : $N.IBaseNode,     //current node of inner loop
        w : $N.IBaseNode,     //neighbour of v
        S,     //stack of nodes
        P,     //list of nodes
        sigma, //
        d,     //distances
        Q : [$N.IBaseNode],     //Queue of nodes
        CB;    //Betweenness values

    let N = graph.nrNodes();
    for(let i = 0; i < N; i++){
        s = nodes[i];
        S = []; //empty stack
        

        Q = []; //empty queue
        while(Q.length >= 1){ //Queue not empty
            v = Q.shift();
            S.push(s);
            let neighbors = v.nextNodes();
            for(let ne in neighbors){
                w = neighbors[ne].node;
                //w found for the first time?
                if(d[w.getID()]<0){
                    Q.push(w);
                    d[w.getID()] = d[v.getID()] + 1;
                }
                //shortest path to w via v?
                if(d[w.getID()] == d[v.getID()]+1){
                    sigma[w.getID()] += sigma[v.getID()];
                    P[w.getID()].push(v);
                }
            }
        }
    }
    while(S.length >= 1){

    }
};
*/
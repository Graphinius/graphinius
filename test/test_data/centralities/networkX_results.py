"""
These are experiments to compare the Betweenness results
from the python networkX library to some handwritten
notes and check if our expectations were correct.

Especially, we want to figure out how undirected edges
are handled in comparison to directed ones, how
end-point consideration changes the results, and if
Normalization makes more or less sense for our use
cases (also which normalization is used).

We therefore need to check each topology / configuration for:

-) directed / undirectedness (only for the first 2 graphs, as example)
-) endpoints to SP included or not (given as argument to _betweenness)

Normalization is set to 1/(n-2)(n-1) for directed and
2/(n-2)(n-1) for undirected graphs as formally described
and makes centralities more comparable between
graphs of different sizes; edge cases:

-) 1 node: no SP's, of course...
-) 2 nodes: apparently only (n-1) is considered, see results below
-) 1 direct SP, 1 indirect: direct SP influences (diminishes) 
   score on node on indirect SP

Also good points to implement:

-) strenght of a node in a weighed graph
which follows a power-law distribution: 
s(k)\approx k^{\beta }
-) strength / betweenness ratio
A study of the average value  s(b) of the strength 
for vertices with betweenness b shows that the 
functional behavior can be approximated by a scaling form:
s(b)\approx b^{{\alpha }}

where strength = sum of the weight of the adjacent edges,
so a_ij * w_ij

Currently, in Graphinius a_ij = w_ij[w_ij < Infinity]


IDEA: since strength is given by a matrix multiplication
which might be vectorized, and we know there's a relation
(and thus approximate mapping) between strength and
betweenness, why not train a CNN on strength and see
what happens...
"""

import networkx as nx
from networkx import betweenness_centrality

print("========================================================")
print("1-node graph: A")
print("========================================================")
G_1n = nx.Graph()
G_1n.add_node('A')
print( "\ndefault:\n" + str( betweenness_centrality( G_1n ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_1n, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_1n, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_1n, endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("2-node graph with one connecting edge, UNdirected: A--B")
print("========================================================")
G_2n_1e = nx.Graph()
G_2n_1e.add_edge('A', 'B')
print( "\ndefault:\n" + str( betweenness_centrality( G_2n_1e ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_2n_1e, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_2n_1e, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_2n_1e, endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("2-node graph with one connecting edge, directed: A->B")
print("========================================================")
G_2n_1e_di = nx.DiGraph()
G_2n_1e_di.add_edge('A', 'B')
print( "\ndefault:\n" + str( betweenness_centrality( G_2n_1e_di ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_2n_1e_di, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_2n_1e_di, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_2n_1e_di, endpoints=True, normalized=False ) ) )


"""
Shortest paths:
A--B
B--A
A--C
C--A
B--C
C--A
without endpoints:
A, C := 0
B: lies on A--C as well as C--A && there are 2 SP's between A--C := 1
with endpoints (Normalization == 1, so no difference):
A: lies on A--B twice (score=1), lies on A--C twice (score=1) := 2
C: lies on A--C twice (score=1), lies on B--C twice (score=1) := 2
B: A--B (score=1), B--C (score=1), A--C (score=1) : = 3
"""

print("\n========================================================")
print("3-node graph with two connecting edges, UNdirected: A--B--C")
print("========================================================")
G_3n_path = nx.Graph()
G_3n_path.add_edge('A', 'B')
G_3n_path.add_edge('B', 'C')
print( "\ndefault:\n" + str( betweenness_centrality( G_3n_path ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_3n_path, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_3n_path, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_3n_path, endpoints=True, normalized=False ) ) )


"""
Shorest paths:
A->B
A->C
B->C
normalization factor: 1/2
without endpoints:
A, C := 0
B: lies on A->C & there is only one SP(A->C) := 1
without endpoints, normalized:
B := 1/2
with endpoints:
A: A->B (score=1), A->C (score=1) := 2
C: A->C (score=1), B->C (score=1) := 2
B: A->B (score=1), A->C (score=1), B->C (score=1) := 3
with endpoints, normalized:
A, C := 1
B := 1.5
"""

print("\n========================================================")
print("3-node graph with two connecting edges, directed: A->B->C")
print("========================================================")
G_3n_path_di = nx.DiGraph()
G_3n_path_di.add_edge('A', 'B')
G_3n_path_di.add_edge('B', 'C')
print( "\ndefault:\n" + str( betweenness_centrality( G_3n_path_di ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_3n_path_di, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_3n_path_di, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_3n_path_di, endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("5-node graph with 4 connecting edges, directed: A->B->C->D->E")
print("========================================================")
G_5n_path = nx.Graph()
G_5n_path.add_edge('A', 'B')
G_5n_path.add_edge('B', 'C')
G_5n_path.add_edge('C', 'D')
G_5n_path.add_edge('D', 'E')
print( "\ndefault:\n" + str( betweenness_centrality( G_5n_path ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_5n_path, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_5n_path, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_5n_path, endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("3-node cycle graph, directed: A->B->C->A")
print("========================================================")
G_3n_cycle = nx.DiGraph() 
G_3n_cycle.add_cycle(['A', 'B', 'C'])
print( "\ndefault:\n" + str( betweenness_centrality( G_3n_cycle ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_3n_cycle, normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_3n_cycle, endpoints=True ) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_3n_cycle, endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("3-node graph, directed, weighted: A->B; A->C->B")
print("========================================================")
G_2waySP = nx.DiGraph() 
G_2waySP.add_edge('A', 'B', weight=1)
G_2waySP.add_edge('A', 'C', weight=0)
G_2waySP.add_edge('C', 'B', weight=1)
print( "\ndefault:\n" + str( betweenness_centrality( G_2waySP, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_2waySP, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_2waySP, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_2waySP, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("8-node graph, directed, one start split, one end merge: A->C->D->E->B; A->I->J->K->B")
print("========================================================")
G_8n_split_merge = nx.DiGraph() 
G_8n_split_merge.add_edge('A', 'C')
G_8n_split_merge.add_edge('C', 'D')
G_8n_split_merge.add_edge('D', 'E')
G_8n_split_merge.add_edge('E', 'B')
G_8n_split_merge.add_edge('A', 'I')
G_8n_split_merge.add_edge('I', 'J')
G_8n_split_merge.add_edge('J', 'K')
G_8n_split_merge.add_edge('K', 'B')
print( "\ndefault:\n" + str( betweenness_centrality( G_8n_split_merge, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_8n_split_merge, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_8n_split_merge, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_8n_split_merge, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("7-node graph, directed, start, one split, end merge: A->C->D->E->B; A->C->I->J->B")
print("========================================================")
G_7n_start_split_merge = nx.DiGraph() 
G_7n_start_split_merge.add_edge('A', 'C')
G_7n_start_split_merge.add_edge('C', 'D')
G_7n_start_split_merge.add_edge('D', 'E')
G_7n_start_split_merge.add_edge('E', 'B')
G_7n_start_split_merge.add_edge('C', 'I')
G_7n_start_split_merge.add_edge('I', 'J')
G_7n_start_split_merge.add_edge('J', 'B')
print( "\ndefault:\n" + str( betweenness_centrality( G_7n_start_split_merge, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_7n_start_split_merge, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_7n_start_split_merge, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_7n_start_split_merge, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("7-node graph, one split, one merge, end: A->C->D->E->B; A->I->J->E->B")
print("========================================================")
G_7n_split_merge_end = nx.DiGraph() 
G_7n_split_merge_end.add_edge('A', 'C')
G_7n_split_merge_end.add_edge('C', 'D')
G_7n_split_merge_end.add_edge('D', 'E')
G_7n_split_merge_end.add_edge('E', 'B')
G_7n_split_merge_end.add_edge('A', 'I')
G_7n_split_merge_end.add_edge('I', 'J')
G_7n_split_merge_end.add_edge('J', 'E')
print( "\ndefault:\n" + str( betweenness_centrality( G_7n_split_merge_end, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_7n_split_merge_end, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_7n_split_merge_end, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_7n_split_merge_end, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("8-node graph, start, split, merge, end: A->C->D->E->B; A->I->J->E->B")
print("========================================================")
G_8n_start_split_merge_end = nx.DiGraph() 
G_8n_start_split_merge_end.add_edge('A', 'C')
G_8n_start_split_merge_end.add_edge('C', 'D')
G_8n_start_split_merge_end.add_edge('D', 'E')
G_8n_start_split_merge_end.add_edge('E', 'F')
G_8n_start_split_merge_end.add_edge('F', 'B')
G_8n_start_split_merge_end.add_edge('C', 'I')
G_8n_start_split_merge_end.add_edge('I', 'J')
G_8n_start_split_merge_end.add_edge('J', 'F')
print( "\ndefault:\n" + str( betweenness_centrality( G_8n_start_split_merge_end, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_8n_start_split_merge_end, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_8n_start_split_merge_end, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_8n_start_split_merge_end, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("4-node quadrangle graph, directed: A->B; A->J->K->B")
print("========================================================")
G_4n_quadrangle = nx.DiGraph() 
G_4n_quadrangle.add_edge('A', 'B')
G_4n_quadrangle.add_edge('A', 'J')
G_4n_quadrangle.add_edge('J', 'K')
G_4n_quadrangle.add_edge('K', 'B')
print( "\ndefault:\n" + str( betweenness_centrality( G_4n_quadrangle, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_4n_quadrangle, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_4n_quadrangle, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_4n_quadrangle, weight="weight", endpoints=True, normalized=False ) ) )


print("\n========================================================")
print("search_graph_multiple_SPs_no1DE")
print("========================================================")
G_search_graph_multiple_SPs_no1DE=nx.DiGraph()
G_search_graph_multiple_SPs_no1DE.add_edge('A','B',weight=3)
G_search_graph_multiple_SPs_no1DE.add_edge('A','C',weight=4)
G_search_graph_multiple_SPs_no1DE.add_edge('A','D',weight=1)
G_search_graph_multiple_SPs_no1DE.add_edge('B','A',weight=5)
G_search_graph_multiple_SPs_no1DE.add_edge('B','C',weight=1)
G_search_graph_multiple_SPs_no1DE.add_edge('B','E',weight=5)
G_search_graph_multiple_SPs_no1DE.add_edge('B','F',weight=1)
G_search_graph_multiple_SPs_no1DE.add_edge('C','A',weight=1)
G_search_graph_multiple_SPs_no1DE.add_edge('C','E',weight=1)
G_search_graph_multiple_SPs_no1DE.add_edge('D','C',weight=6)
G_search_graph_multiple_SPs_no1DE.add_edge('D','E',weight=17)
G_search_graph_multiple_SPs_no1DE.add_edge('E','B',weight=5)
G_search_graph_multiple_SPs_no1DE.add_edge('F','C',weight=3)
G_search_graph_multiple_SPs_no1DE.add_edge('F','E',weight=5)
print( "\ndefault:\n" + str( betweenness_centrality( G_search_graph_multiple_SPs_no1DE, weight="weight" ) ) )
print( "\nUNnormalized:\n" + str( betweenness_centrality( G_search_graph_multiple_SPs_no1DE, weight="weight", normalized=False ) ) )
print( "\nendpoints:\n" + str( betweenness_centrality( G_search_graph_multiple_SPs_no1DE, weight="weight", endpoints=True) ) )
print( "\nendpoints, UNnormalized:\n" + str( betweenness_centrality( G_search_graph_multiple_SPs_no1DE, weight="weight", endpoints=True, normalized=False ) ) )

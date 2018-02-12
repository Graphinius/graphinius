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



"""
G_4n_path = nx.Graph()
G_4n_path.add_edge('A', 'B')
G_4n_path.add_edge('B', 'C')
G_4n_path.add_edge('C', 'D')
print( "\n4 nodes directed path:\n" + str( betweenness_centrality( G_4n_path ) ) )


G_3n_cycle = nx.Graph() 
G_3n_cycle.add_cycle(['A', 'B', 'C'])
print( "\n3 nodes cycle path:\n" + str( betweenness_centrality( G_3n_cycle ) ) )

G_2waySP = nx.Graph() 
G_2waySP.add_edge('A', 'B', weight=1)
G_2waySP.add_edge('A', 'C', weight=0)
G_2waySP.add_edge('C', 'B', weight=1)
print( "\n3 nodes 2-way SP:\n" + str( betweenness_centrality( G_2waySP ) ) )


G=nx.DiGraph()
G.add_edge('A','B',weight=3)
G.add_edge('A','C',weight=4)
G.add_edge('A','D',weight=1)
G.add_edge('B','A',weight=5)
G.add_edge('B','C',weight=1)
G.add_edge('B','E',weight=5)
G.add_edge('B','F',weight=1)
G.add_edge('C','A',weight=1)
G.add_edge('C','E',weight=1)
G.add_edge('D','C',weight=6)
G.add_edge('D','E',weight=17)
G.add_edge('E','B',weight=5)
G.add_edge('F','C',weight=3)
G.add_edge('F','E',weight=5)
G.add_edge('D','E',weight=1)
G.add_edge('E','D',weight=1)
print( "\n6 nodes, directed, weighted graph:\n" + str( betweenness_centrality(G, weight="weight") ) )
"""
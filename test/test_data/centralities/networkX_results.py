import networkx as nx
from networkx import betweenness_centrality

G_2n_1e = nx.Graph()
G_2n_1e.add_edge('A', 'B')
print( "\n2 nodes, 1 directed, unweighted edge:\n" + str( betweenness_centrality(G_2n_1e) ) )

G_2n_2e = nx.Graph()
G_2n_2e.add_edge('A', 'B')
G_2n_2e.add_edge('B', 'A')
print( "\n2 nodes, 2 directed, unweighted edges:\n" + str( betweenness_centrality(G_2n_2e) ) )

G_3n_path = nx.Graph()
G_3n_path.add_edge('A', 'B')
G_3n_path.add_edge('B', 'C')
print( "\n3 nodes directed path:\n" + str( betweenness_centrality( G_3n_path ) ) )

G_4n_path = nx.Graph()
G_4n_path.add_edge('A', 'B')
G_4n_path.add_edge('B', 'C')
G_4n_path.add_edge('C', 'D')
print( "\n4 nodes directed path:\n" + str( betweenness_centrality( G_4n_path ) ) )

G_5n_path = nx.Graph()
G_5n_path.add_edge('A', 'B')
G_5n_path.add_edge('B', 'C')
G_5n_path.add_edge('C', 'D')
G_5n_path.add_edge('D', 'E')
print( "\n5 nodes directed path:\n" + str( betweenness_centrality( G_5n_path ) ) )

G_3n_cycle = nx.Graph() 
G_3n_cycle.add_cycle(['A', 'B', 'C'])
print( "\n3 nodes cycle path:\n" + str( betweenness_centrality( G_3n_cycle ) ) )

G_2waySP = nx.Graph() 
G_2waySP.add_edge('A', 'B', weight=1)
G_2waySP.add_edge('A', 'C', weight=0)
G_2waySP.add_edge('C', 'B', weight=1)
print( "\n3 nodes 2-way SP:\n" + str( betweenness_centrality( G_2waySP ) ) )



G=nx.Graph()
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

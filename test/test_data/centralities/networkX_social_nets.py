import networkx as nx
from networkx import betweenness_centrality
import time

G_social_300 = nx.read_edgelist('../social_network_edges_300.csv')
G_social_1K = nx.read_edgelist('../social_network_edges.csv')

start = time.time()
betweenness_centrality(G_social_300)
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~300 node social net took " + str(duration) + " ms.")

start = time.time()
betweenness_centrality(G_social_1K)
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~1K node social net took " + str(duration) + " ms.")

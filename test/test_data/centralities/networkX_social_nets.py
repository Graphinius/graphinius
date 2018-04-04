import networkx as nx
from networkx import betweenness_centrality
import time

''' 
Unweighted graphs
'''
G_social_300 = nx.read_edgelist('../social_network_edges_300.csv')
G_social_1K = nx.read_edgelist('../social_network_edges.csv')

start = time.time()
betweenness_centrality(G_social_300, normalized=True)
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~300 node social net took " + str(duration) + " ms.")

start = time.time()
betweenness_centrality(G_social_1K, normalized=True)
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~1K node social net took " + str(duration) + " ms.")


'''
Weighted graphs
'''
G_social_300_weighted = nx.read_weighted_edgelist('../social_network_edges_300_weighted.csv')
G_social_1K_weighted = nx.read_weighted_edgelist('../social_network_edges_weighted.csv')

start = time.time()
betweenness_centrality(G_social_300_weighted, normalized=True, weight="weight")
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~300 node weighted social net took " + str(duration) + " ms.")

start = time.time()
betweenness_centrality(G_social_1K_weighted, normalized=True, weight="weight")
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~300 node weighted social net took " + str(duration) + " ms.")

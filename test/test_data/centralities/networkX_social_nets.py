import networkx as nx
from networkx import betweenness_centrality
import time
import json

''' 
Unweighted graphs
'''
# G_social_300 = nx.read_edgelist('../social_network_edges_300.csv', create_using=nx.DiGraph())
# G_social_1K = nx.read_edgelist('../social_network_edges_1K.csv', create_using=nx.DiGraph())
G_social_20K = nx.read_edgelist('../social_network_edges_20K.csv', create_using=nx.DiGraph())

# start = time.time()
# cb_300 = betweenness_centrality(G_social_300, normalized=True)
# end = time.time()
# duration = (end-start)*1000
# print("Betweenness on ~300 node social net took " + str(duration) + " ms.")
# file = open('./betweenness_social_network_edges_300_results.json', 'w')
# file.write( json.dumps(cb_300) )
# file.close

# start = time.time()
# cb_1K = betweenness_centrality(G_social_1K, normalized=True)
# end = time.time()
# duration = (end-start)*1000
# print("Betweenness on ~1K node social net took " + str(duration) + " ms.")
# file = open('./betweenness_social_network_edges_1K_results.json', 'w')
# file.write( json.dumps(cb_1K) )
# file.close

start = time.time()
cb_20K = betweenness_centrality(G_social_20K, normalized=True)
end = time.time()
duration = (end-start)*1000
print("Betweenness on ~20K node social net took " + str(duration) + " ms.")
file = open('./betweenness_social_network_edges_20K_results.json', 'w')
file.write( json.dumps(cb_20K) )
file.close

'''
Weighted graphs
'''
# G_social_300_weighted = nx.read_weighted_edgelist('../social_network_edges_300_weighted.csv', create_using=nx.DiGraph())
# G_social_1K_weighted = nx.read_weighted_edgelist('../social_network_edges_1K_weighted.csv', create_using=nx.DiGraph())
# G_social_20K_weighted = nx.read_weighted_edgelist('../social_network_edges_20K_weighted.csv', create_using=nx.DiGraph())

# start = time.time()
# cb_300_w = betweenness_centrality(G_social_300_weighted, normalized=True, weight="weight")
# end = time.time()
# duration = (end-start)*1000
# print("Betweenness on ~300 node weighted social net took " + str(duration) + " ms.")
# file = open('./betweenness_social_network_edges_300_weighted_results.json', 'w')
# file.write( json.dumps(cb_300_w) )
# file.close

# start = time.time()
# cb_1K_w = betweenness_centrality(G_social_1K_weighted, normalized=True, weight="weight")
# end = time.time()
# duration = (end-start)*1000
# print("Betweenness on ~1K node weighted social net took " + str(duration) + " ms.")
# file = open('./betweenness_social_network_edges_1K_weighted_results.json', 'w')
# file.write( json.dumps(cb_1K_w) )
# file.close

# start = time.time()
# cb_20K_w = betweenness_centrality(G_social_20K_weighted, normalized=True, weight="weight")
# end = time.time()
# duration = (end-start)*1000
# print("Betweenness on ~20K node weighted social net took " + str(duration) + " ms.")
# file = open('./betweenness_social_network_edges_20K_weighted_results.json', 'w')
# file.write( json.dumps(cb_20K_w) )
# file.close


# print("Dimensions of graph: ")
# print("#Nodes: " + str(nx.number_of_nodes(G_social_20K_weighted)))
# print("#Edges: " + str(nx.number_of_edges(G_social_20K_weighted)))
# print(G_social_300_weighted.edges(data = True))
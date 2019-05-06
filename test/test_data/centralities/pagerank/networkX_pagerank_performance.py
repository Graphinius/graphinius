import networkx as nx
from networkx import pagerank
import time
import json

''' 
Unweighted graphs
'''
print("========================================")
print("========== UNWEIGHTED GRAPHS ===========")
print("========================================")

G_social_300 = nx.read_edgelist('../../social_network_edges_300.csv', create_using=nx.DiGraph())
G_social_1K = nx.read_edgelist('../../social_network_edges_1K.csv', create_using=nx.DiGraph())
G_social_20K = nx.read_edgelist('../../social_network_edges_20K.csv', create_using=nx.DiGraph())

start = time.time()
cb_300 = pagerank(G_social_300, alpha=0.85)
end = time.time()
duration = (end-start)*1000
print("PageRank on ~300 node social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_300.csv_results.json', 'w')
file.write( json.dumps(cb_300) )
file.close

start = time.time()
cb_1K = pagerank(G_social_1K, alpha=0.85)
end = time.time()
duration = (end-start)*1000
print("PageRank on ~1K node social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_1K.csv_results.json', 'w')
file.write( json.dumps(cb_1K) )
file.close

start = time.time()
cb_20K = pagerank(G_social_20K, alpha=0.85)
end = time.time()
duration = (end-start)*1000
print("PageRank on ~20K node social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_20K.csv_results.json', 'w')
file.write( json.dumps(cb_20K) )
file.close

'''
Weighted graphs
'''
print("========================================")
print("=========== WEIGHTED GRAPHS ============")
print("========================================")

G_social_300_weighted = nx.read_weighted_edgelist('../../social_network_edges_300_weighted.csv', create_using=nx.DiGraph())
G_social_1K_weighted = nx.read_weighted_edgelist('../../social_network_edges_1K_weighted.csv', create_using=nx.DiGraph())
G_social_20K_weighted = nx.read_weighted_edgelist('../../social_network_edges_20K_weighted.csv', create_using=nx.DiGraph())

start = time.time()
cb_300_w = pagerank(G_social_300_weighted, alpha=0.85, weight="weight")
end = time.time()
duration = (end-start)*1000
print("PageRank on ~300 node weighted social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_300.csv_weighted_results.json', 'w')
file.write( json.dumps(cb_300_w) )
file.close

start = time.time()
cb_1K_w = pagerank(G_social_1K_weighted, alpha=0.85, weight="weight")
end = time.time()
duration = (end-start)*1000
print("PageRank on ~1K node weighted social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_1K.csv_weighted_results.json', 'w')
file.write( json.dumps(cb_1K_w) )
file.close

start = time.time()
cb_20K_w = pagerank(G_social_20K_weighted, alpha=0.85, weight="weight")
end = time.time()
duration = (end-start)*1000
print("PageRank on ~20K node weighted social net took " + str(duration) + " ms.")
file = open('./pagerank_social_network_edges_20K.csv_weighted_results.json', 'w')
file.write( json.dumps(cb_20K_w) )
file.close


# print("Dimensions of graph: ")
# print("#Nodes: " + str(nx.number_of_nodes(G_social_20K_weighted)))
# print("#Edges: " + str(nx.number_of_edges(G_social_20K_weighted)))
# print(G_social_300_weighted.edges(data = True))

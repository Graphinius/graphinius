import networkx as nx
from networkx import pagerank, pagerank_numpy, pagerank_scipy
import time, json, os

output_folder = 'comparison_selected'

'''
!!! EGO !!!
'''

# ego_path = os.path.join(os.getcwd(), '../../ego_networks/')
ego_path = '../../ego_networks/'
ego_output_path = './comparison_selected'
# print(ego_path)

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(ego_path):
    for file in f:
        if '.json' in file:
            files.append(os.path.join(r, file))

for f in files:
  for algo in [pagerank, pagerank_numpy, pagerank_scipy]:
    for w in [nx.read_edgelist, nx.read_weighted_edgelist]:
    # print(f)
    # print(algo)

      ego_graph = w(f, create_using=nx.DiGraph())
      tic = time.time()
      pr = algo(ego_graph, alpha=0.85)
      toc = time.time()
      duration = (toc-tic)*1000
      # print("PageRank on graph with |V|=" + len(ego_graph.nodes) )
      
    
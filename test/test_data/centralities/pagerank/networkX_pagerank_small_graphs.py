import networkx as nx
from networkx import pagerank
import time
import json

''' 
Small graphs
'''

n3graph = nx.read_edgelist('../3node2SPs1direct.csv', create_using=nx.DiGraph())
n3res = pagerank(n3graph, alpha=0.85, personalization=None, dangling=None, max_iter=1000, tol=1e-4,nstart=None)
print(n3res)

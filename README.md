#Visualizing Categorical Multiplicative Data

For a full description of this visualization and its motivation, read the
**[essay](http://www.eecs.tufts.edu/~mgolds07/icfp_viz/)**.

This is a visualization implemented in d3.js meant for data that is categorical
and multiplicative. Categorical, in that some dimension of that dataset is
unordered. Multiplicative, in that the data represent speedups or slowdowns
over a baseline.

The master branch contains code for data with multiple series, e.g. multiple
configurations tested under the same benchmark. The `single-series` branch
contains some simplifications and optimizations for when the data are only a
baseline and one other series.

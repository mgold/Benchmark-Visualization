#Visualizing Benchmarks

This is a visualization of benchmark data, i.e. improvements over a baseline.
It is easy to embed in larger webpages using any data of the correct format.

For a full description of the motivation and design, read the
**[essay](http://www.eecs.tufts.edu/~mgolds07/icfp_viz/)**.

##Documentation

###Terminology
This visualization is meant primarily for comparing performance on various tasks against a baseline. With that in mind,

* A **series** is a category of something being tested. This can be a programming language, computer architecture, or athlete. Visually these are colors.
* A **benchmark** is task on which each series is tested, resulting in a numeric **performance**. This can be software test batteries or the name of a atheletic event. Visually these are groups of columns.
* The **baseline** is the currently selected series. The performance of the other series are scaled relative to the baseline's performance in that benchmark. Visually the baseline is implicit, except that it is noted on the *y*-axis label.

Again: performance is scaled relative to another series's performance on the
same benchmark, not the same series's performance on another benchmark. This is
because benchmarks are expected to not be comparable tasks. Benchmarks are
categorical; they have no order or relationship. (If you have one task
paramterized over a number, use a line plot.)

###Inclusion
Include the following lines in the document head.

````html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<link href="benchmarks.css" rel="stylesheet" type="text/css"></link>
<script src="benchmarks.js" type="text/javascript"></script>
````

There is only one exposed function, `benchmarks(datafile, selector, width, height)`.
* **datafile** is a string path to a json file in the format described below.
* **selector** is an optional string D3-style selector to indicate a DOM element to be the parent of the visualizations's svg. The expected use when embedded in a larger webpage is `#id_of_element`. By default, appends to `body`.
* **width** and **height** are optional numbers to set the total dimensions of the svg element. The default is 900x500.

###JSON File Format

Data is expected as a JSON file obeying this schema. The top-level object has
two fields. The key `series` has a value of an array of strings (names of
series). The `benchmarks` key is also an array. Each element is an array of two
elements: a string (benchmark name), and an array of performances. Each array
of performances must have the same length as the array of series. Examples are
given in the repo.

###Known Issues
* There are only 10 hard-coded colors (which correspond to series).
* There is no support for benchmarks known for only some of the series. But conceptually, when a series with incomplete data is chosen to be the baseline, how should the benchmarks without data be scaled?
* The font sizes are hard-coded and do not account for the window size (change this in the CSS if you need to).
* The data is expected to come from a file, rather than passing in a JS object directly. If you actually have a use case for this functionality, open an issue and it may be added.

## Misc

This is a visualization implemented in d3.js meant for data that is categorical
and multiplicative. Categorical, in that some dimension of that dataset is
unordered. Multiplicative, in that the data represent speedups or slowdowns
over a baseline.

The master branch contains code for data with multiple series, e.g. multiple
configurations tested under the same benchmark. The `single-series` branch
contains some simplifications and optimizations for when the data are only a
baseline and one other series.


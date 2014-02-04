function benchmarks(datafile, selector, total_width, total_height){

    total_width |= 900;
    total_height |= 500;
    var leftroom = 45;
    var rightroom = 30;
    var headroom = 20;
    var footroom = 30;
    var w = total_width - leftroom - rightroom;
    var h = total_height - headroom - footroom;

    selector |= "body";
    var svg = d3.select(selector)
                .append("svg")
                .attr("width", total_width)
                .attr("height", total_height)
                .attr("class", "benchmarks")
    var plot = svg.append("g")
                .attr("transform", "translate("+String(leftroom)+","+String(headroom)+")")

    //Without this, mousemove events are erratic
    plot.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("class", "background")

    function remove_underscores (s) {return s.split('_').join(' '); }

    //benchmark = set of bars
    //series = one bar in each set, color-coded
    //time = y axis (normalized)
    var benchmark = d3.scale.ordinal()
    var time = d3.scale.log()
                .range([h, 0])
    var colors = d3.scale.category10()
                .domain([0, 9])

    d3.json(datafile, function(err, parsed) {
            var series = parsed.series;
            var benchmarks = parsed.benchmarks;
            benchmark.domain(benchmarks.map(function (a) { return a[0]; }));
            benchmark.rangeRoundBands([0,w],0.3,0.1)
            var bar_width = benchmark.rangeBand() / (series.length - 1);
            var legend_snap = d3.scale.quantize()
                                .domain([0,w])
                                .range(benchmark.range())

            var max_difference = d3.max(parsed.benchmarks, function(arr){
                var extent = d3.extent(arr[1])
                return extent[1]/extent[0]
            })
            time.domain([1/max_difference, max_difference]);
            var timeOf1 = time(1);

            var baseline = 0;
            var bars = [];

            var entering = plot.selectAll(".bar")
                            .data(benchmarks)
                            .enter()

            for(var i = 0; i < series.length; i++){
                bars.push(drawBars(entering.append("rect").attr("class", "bar"), i, true))
            }

            function drawBars(selection, index, listen){
                if (listen){
                    selection = selection
                                  .on("click", function(d) {
                                          baseline = index;
                                          update();
                                      })
                }

                if (index == baseline){
                    return selection
                       .attr("x", function(d) {
                            return benchmark(d[0]) + index*bar_width;
                       })
                       .attr("y", timeOf1)
                       .attr("width", 0.001)
                       .attr("height", 0.001)
                       .attr("fill", "white")

                }else{
                    return selection
                       .attr("x", function(d) {
                            var offset = index > baseline ? index-1 : index;
                            return benchmark(d[0]) + offset*bar_width;
                       })
                       .attr("y", function(d) {
                            var val = +(d[1][index]) / +(d[1][baseline])
                            if (val > 1) { return time(val); }
                            return timeOf1;
                       })
                       .attr("width", bar_width)
                       .attr("height", function(d){
                            return Math.abs(time(+(d[1][index]) / +(d[1][baseline])) - timeOf1);
                       })
                       .attr("fill", colors(index))
                    }

            }

            var legendText = svg.append("text").attr("text-anchor", "middle").attr("class", "label")
            var old_mPos = [0,0];
            plot.on("mousemove", function(){legend(d3.mouse(this))})
            plot.on("mouseout", function(){legend([0,0])});
            legend();
            function legend (mPos){
                if (mPos == undefined) {
                    mPos = old_mPos;
                }else{
                    old_mPos = mPos;
                }
                legendText.selectAll("tspan").remove();
                legendText.selectAll("tspan")
                    .data(series)
                    .enter()
                    .append("tspan")
                    .attr("fill", function(d, i){ return colors(i); })
                    .text(function(d){return remove_underscores(d)+" "})
                    .filter(function(d, i){ return baseline == i })
                    .remove()

                legendText.selectAll("tspan")
                    .append("tspan")
                    .attr("fill", "black")
                    .text("| ")
                    .filter(function(d, i){ return i > series.length -3})
                    .remove()

                legendText.attr("transform", function (){
                              var half_width = this.getBBox().width / 2;
                              var x = leftroom + legend_snap(mPos[0]) + benchmark.rangeBand()/2;
                              x = Math.max(half_width, Math.min(leftroom+w-half_width, x))
                              var y = mPos[1] > timeOf1 ? headroom+h+(footroom/2) : headroom/2;
                              return "translate("+x+","+y+")"
                          })
            }

            function update(){
                axis_label.transition()
                            .duration(0)
                            .delay(750)
                            .attr("fill", colors(baseline))
                            .text(remove_underscores(series[baseline]))
                            .each("end", legend)
                for(var i = 0; i < bars.length; i++){
                    drawBars(bars[i].transition().duration(1000), i);
                }

            }

            plot.append("g")
               .attr("class", "axis xaxis")
               .attr("transform", "translate(0," + timeOf1 + ")")
               .call(d3.svg.axis().scale(benchmark))

            plot.selectAll(".xaxis text")
                .text(remove_underscores)

            svg.append("g")
               .attr("class", "axis")
               .attr("transform", "translate("+String(leftroom)+","+String(headroom)+")")
               .call(d3.svg.axis()
                       .scale(time)
                       .orient("left")
                       .tickFormat(function(d){
                            if (max_difference < 20){
                                return d3.format(".1r")(d);
                            }else{
                               if (d.toString().match("^(0\.0*1|1.*)$"))
                                   return d3.format("s")(d)
                               return "";
                            }
                       })
                    )

            var axis_label = svg.append("text")
               .attr("transform", "translate(10,"+(timeOf1+headroom+100)+"), rotate(-90)")
               .attr("text-anchor", "left")
               .attr("class", "label")
             .append("tspan")
               .text("Execution Time Relative to ")
             .append("tspan")
               .style("font-weight", "bold")
               .attr("fill", colors(baseline))
               .text(remove_underscores(series[baseline]));

        });
}

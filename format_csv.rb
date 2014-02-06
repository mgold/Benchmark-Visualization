require 'csv'
require 'json'

in_file = ARGV[0]
usage_string = "usage: ruby format_csv.rb your_data.csv
       data as benchmark,series,performance and sorted"
if !in_file then abort usage_string end

series = []
benchmarks = []
cur_performance = []
last_bench = ""
series_done = false

class String
    def numeric?
        Float(self) != nil rescue false
    end
end

CSV.foreach(in_file) do |bench, ser, perf|
    if !perf.numeric? then abort "Error: Non-numeric performance" end
    if ser == series[0]
        series_done = true
        benchmarks << [last_bench, cur_performance]
        cur_performance = []
    end
    if !series_done
        if series.include? ser then abort usage_string end
        series << ser
    end
    cur_performance << perf.to_f
    last_bench = bench
end
benchmarks << [last_bench, cur_performance]

print JSON.fast_generate({series: series, benchmarks: benchmarks}) + "\n"

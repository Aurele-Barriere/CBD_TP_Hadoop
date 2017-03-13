input_file 	= "runtime.dat"
output_file = "runtime.eps"

set terminal postscript eps size 4.0,3.5 enhanced color font "Helvetica,18" solid
set output output_file

set style data histogram
set style histogram cluster errorbars gap 1
#set style fill solid border -1
set boxwidth 0.8
#set grid y
set ylabel 'Average Iteration Time (sec)'
set yrange [0: ]
set xtics mirror rotate by 45 right

plot input_file u 3:4:5:xtic(1) notitle fs pattern 1 lt 1

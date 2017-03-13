input_file  = "spare.dat"
output_file = "spare.eps"

set terminal postscript eps size 4.0,3.5 enhanced color font "Helvetica,18" solid
set output output_file

set ylabel "Percentage of Time"
set style data histogram
set style histogram rowstacked 
set key center top
set yrange [0:115]
set boxwidth 0.75
set xtics mirror rotate by 45 right

plot input_file using 2:xtic(1) title "Write Time" fs pattern 1, \
	     input_file using 3:xtic(1) title "Idle Time"  fs pattern 4

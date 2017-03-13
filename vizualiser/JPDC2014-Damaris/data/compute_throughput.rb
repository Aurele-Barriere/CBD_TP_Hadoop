
# Reading size of files

$sizes = []
$processes = []

File.open(ARGV[0]+"/ls.txt") do | file |
	lines = file.readlines
	lines.each do | line |
		elems = line.split
		size = elems[4].to_i
		name = elems[8].chomp
		elems = name.split(".")
		iteration = elems[1].to_i
		process = elems[2].to_i
		if(iteration < 10)
			if($sizes[iteration] == nil)
				$sizes[iteration] = []
			end
			$sizes[iteration][process] = size
		end
		$processes << process
	end
end
$processes.uniq!

# Reading write times

$times = []

$processes.each do | process |
File.open(ARGV[0]+"/damaris-#{process}.txt") do | file |
	lines = file.readlines
	for i in 0...10
		tstart = lines[2*i].split[1].to_f
		tend   = lines[2*i+1].split[1].to_f
		if($times[i] == nil)
			$times[i] = []
		end
		$times[i][process] = tend-tstart
	end
end
end

# Compute throughput for each iteration
$throughput = []
for i in 0...10
	# get maximum write time
	max_wrt = 0.0
	for j in 0...$times[i].size
		max_wrt = $times[i][j] if max_wrt < $times[i][j]
	end
	# get total size written
	tot_size = 0
	for j in 0...$sizes[i].size
		tot_size += $sizes[i][j]
	end
	# divide
	$throughput << (tot_size.to_f/max_wrt)
end

# Find average, min and max throughput
avg = 0.0
min = $throughput[0]
max = min
for i in 0...$throughput.size
	avg += $throughput[i]
	min = $throughput[i] if min > $throughput[i]
	max = $throughput[i] if max < $throughput[i]
end
avg /= (1024*1024)
min /= (1024*1024)
max /= (1024*1024)
avg /= $throughput.size
print "#{avg}\t#{min}\t#{max}\n"

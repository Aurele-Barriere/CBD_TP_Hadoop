$times = []
File.open(ARGV[0]) do | file |
	file.readlines.each do | line |
		if(line.include?("Start"))
			$times << line.split[1].to_f
		end
	end
end

avg = 0.0
min = $times[1] - $times[0]
max = min
for i in 1...$times.size
	t = $times[i] - $times[i-1]
	avg += t
	max = t if max < t
	min = t if min > t
end
avg /= ($times.size-1)
print "#{avg}\t#{min}\t#{max}\n"

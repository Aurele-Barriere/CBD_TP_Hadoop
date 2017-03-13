$times = []
File.open(ARGV[0]) do | file |
	lines = file.readlines
	tstart = 0.0
	lines.each do | line |
		if line.include?("Damaris")
			if line.include?("Damaris iteration")
				tstart = line.split[6].to_f
			elsif line.include?("end_iteration")
				tend = line.split[5].to_f
				$times << tend - tstart
			end
		end
	end
end

avg = 0.0
min = $times[0]
max = min
for i in 0...10
	t = $times[i]
	avg += t
	min = t if t < min
	max = t if t > max
end
avg /= 10
print "#{avg}\t#{min}\t#{max}\n"


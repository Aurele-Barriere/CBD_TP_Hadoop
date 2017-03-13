#!/usr/bin/env ruby

events = []
iteration = -1

File.open(ARGV[0]) do | file |
	lines = file.readlines
	lines.each do | line |
		if(line.include?("call userchk"))
			iteration += 1
			events[iteration] = []
		end
		if(line.include?("Damaris"))
			elems = line.split
			if(line.include?("Damaris iteration"))
				events[iteration] << {:type => :start, :time => elems[6].to_f}
			elsif(line.include?("process"))
				events[iteration] << {:type => :done, :time => elems[6].to_f}
			#elsif(line.include?("after"))
			#	events << {:type => :finish, :time => elems[5].to_f}
			end
		end
	end
end

p events

count = 0
events.each do | evlist |
	evlist.sort_by! do | ev |
		if ev[:type] == :start
			0.0
		else
			ev[:time]
		end
	end
	if(count < 10)
	evlist.each do | ev |
		print ev[:type].to_s.capitalize+" "+ev[:time].to_s+"\n"
	end
	end

	if(count == 10)
		print "Start #{evlist[0][:time]}\n"
	end
	count += 1
end

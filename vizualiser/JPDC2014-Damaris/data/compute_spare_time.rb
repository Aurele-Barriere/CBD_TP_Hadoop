files = Dir.entries(ARGV[0])
for i in 0...files.size
	if not files[i].include?("damaris")
		files[i] = nil
	end
end
files.compact!

$tps_io = 0.0
$tps_spare = 0.0

files.each do | filename |
	fname = ARGV[0]+"/"+filename
	File.open(fname) do | file |
		lines = file.readlines
		if lines.size % 2 != 0
			lines[-1] = nil
		end
		lines.compact!
		for i in 0...(lines.size-2)
			t1 = lines[i].split[1].to_f
			t2 = lines[i+1].split[1].to_f
			if(i % 2 == 0)
				$tps_io += (t2-t1)
			else
				$tps_spare += (t2-t1)
			end
		end
	end
end

print "#{$tps_io*100/($tps_io+$tps_spare)}\n"


GTFS data downloaded May 7, 2017 from 
http://opendata.toronto.ca/TTC/routes/OpenData_TTC_Schedules.zip

The Route 65 data was pulled from shapes.txt using:
$ cat gtfs_data/shapes.txt | grep ^671892, > src/data/raw/65_north.csv
$ cat gtfs_data/shapes.txt | grep ^671891, > src/data/raw/65_south.csv
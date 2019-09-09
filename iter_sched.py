#!/usr/bin/python3

#############################
#############################

# Returns individual schedule from arttix csv file.

# 1. Add locations
# 2. Find better way to associate location, time, and days (attrs of name?)
#    Something in csv module for headers?
# 3. Fix to handle name variation (user inputs 'zach' instead of 'Zach', etc.)
# 4. .pdf -> .csv 
# 5. .csv -> google calendars?

#############################
#############################

import csv

# Open, read schedule
file = open('testsched.csv')
csv_file = csv.reader(file)

# Get user name
name = input("Name? ")
name = name.lower()

# Associate record indexes with Weekday
days = ["None", "Monday", "Monday", "Monday", "Tuesday", "Tuesday", "Tuesday",
        "Wednesday", "Wednesday", "Wednesday", "Thursday", "Thursday",
        "Thursday", "Friday", "Friday", "Friday", "Saturday", "Saturday",
        "Saturday", "Sunday", "Sunday", "Sunday"]

ind_sched = []

print("\nHey " + name + ", you work the following shifts: \n")

# Look for name in csv file and make a list of the day and
# time of each instance.

for row in csv_file:
	for i in range(len(row)):
		if row[i].lower() == name:
			time = str(row[i + 1])
			day = days[i]
			shift = day + ", " + time
			ind_sched.append(shift)

# Function moves string objects in a list (first argument) to the front if they
# begin with specified characters (taken as the second argument). Call
# function repeatedly with new second argument for novel ordering. A clumsy
# way to do this, but works for now.

def day_orderer(list, day_str):
	for i in range(len(list)):
		if list[i].startswith(day_str):
			ind_sched.insert(0, ind_sched.pop(i))

# Orders list by weekday in reverse from Sunday -> Saturday -> ...

day_orderer(ind_sched, "M")
day_orderer(ind_sched, "Tu")
day_orderer(ind_sched, "W")
day_orderer(ind_sched, "Th")
day_orderer(ind_sched, "F")
day_orderer(ind_sched, "Sa")
day_orderer(ind_sched, "Su")

# Reverse the reversed ordering above. This way preserves correct
# ordering on shifts on same day (Saturday, 9:45 -> Saturday, 1:45
# -> Saturday 6:15 without having to deal with problem of shifts
# not being labelled AM or PM. This is clumsy too, but works for now.

ind_sched.reverse() 

print(str('\n'.join(ind_sched))) # Print shifts on new lines
print("\n___________________")


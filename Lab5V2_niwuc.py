## PERIHELION  Mercury's perihelion precession and general relativity
#
# In this lab assignment, a student completes a Python program to test with
# data an accurate prediction of Einstein’s theory, namely the perihelion
# precession of Mercury. Mercury’s orbit around the Sun is not a stationary
# ellipse, as Newton’s theory predicts when there are no other bodies. With
# Einstein’s theory, the relative angle of Mercury’s perihelion (position
# nearest the Sun) varies by about 575.31 arcseconds per century.
#
# Copyright (c) 2022, University of Alberta
# Electrical and Computer Engineering
# All rights reserved.
#
# Student name: Natasha Iwuc
# Student CCID: niwuc
# Others: ChatGPT(10%) Natasha(90%)
#
# To avoid plagiarism, list the names of persons, Version 0 author(s)
# excluded, whose code, words, ideas, or data you used. To avoid
# cheating, list the names of persons, excluding the ENCMP 100 lab
# instructor and TAs, who gave you compositional assistance.
#
# After each name, including your own name, enter in parentheses an
# estimate of the person's contributions in percent. Without these
# numbers, adding to 100%, follow-up questions will be asked.
#
# For anonymous sources, enter pseudonyms in uppercase, e.g., SAURON,
# followed by percentages as above. Email a link to or a copy of the
# source to the lab instructor before the assignment is due.
#
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

def main():
    data = loaddata('horizons_results')
    data = locate(data) # Perihelia
    data = select(data,25,('Jan','Feb','Mar'))
    data = refine(data,'horizons_results')
    makeplot(data,'horizons_results')
    savedata(data,'horizons_results')
    
def savedata(data, filename):
    # Makes header by joining all header names, puts string in called file,
    #takes out the numdate, strdate, x coordinate,y coordinate, and z coordinate
    #and put it in a list, Joins all list values. 
    file = open(filename+'_v2.csv','w+')
    header = data[0]
    header_names = []
    for key in header.keys():
        header_names.append(key.upper())
    header_names.pop()
    header_names.append("XCOORD")
    header_names.append("YCOORD")
    header_names.append("ZCOORD")
    header_names = ",".join(header_names)
    file.write(f"{header_names}\n")
    for i in range(len(data)):
        row = []
        for value in data[i].values():
            row.append(value)
        coords = list(row.pop())
        for i in range(len(coords)):
            row.append(coords[i])
        for i in range(len(row)):
            if type(row[i]) != str:
                row[i] = str(row[i])
        row = ",".join(row)
        file.write(f"{row}\n")
    file.close()

def loaddata(filename):
    # Uses data from file to turn data into directory. Then puts data into
    # a new list and returns the new list. 
    file = open(filename+'.txt','r')
    lines = file.readlines()
    file.close()
    noSOE = True
    data = []
    for line in lines:
        if noSOE:
            if line.rstrip() == "$$SOE":
                noSOE = False
        elif line.rstrip() != "$$EOE":
            datum = str2dict(line)
            data.append(datum)
        else:
            break # for
    return data

def str2dict(line):
    # Turns string into a list and saves first value from list. Splits secound 
    # values by spaces. Takes values and turns lists them as a date. Takes 3rd,
    # 4th, and 5th values and turns them into 3D coordinates. Returns all values
    # organized in the dictionaries. 
    line = line.split(", ")
    number = round(float(line[0]), 6)
    strdate = line[1]
    strdate = strdate.split(" ")
    strdate = strdate[1]
    coord = (round(float(line[2]), 6), round(float(line[3]), 6), round(float(line[4][:-2]), 6))
            # also rounds x, y, z coordinates to 6 decimal places
    return {'numdate':number,'strdate':strdate,
            'coord':coord}

def locate(data1):
    # Locates perihelia from data. (creates the points on the graph)
    dist = [] # Vector lengths
    for datum in data1:
        coord = np.array(datum['coord'])
        dot = np.dot(coord,coord)
        dist.append(np.sqrt(dot))
    data2 = []
    for k in range(1,len(dist)-1):
        if dist[k] < dist[k-1] and dist[k] < dist[k+1]:
            data2.append(data1[k])
    return data2

def refine(data, filename):
    # Makes file name, opens file and takes perehelion. Returns all perehelia. 
    temp = []
    for i in range(len(data)):
        date = data[i]["strdate"]
        name = filename + "_" + date
        try:
            data2 = loaddata(name)
            perehelia = locate(data2)
            temp.append(perehelia[0])
        except FileNotFoundError:
            pass
    return temp

def select(data,ystep,month):
    # Checks for year in lines of data to be an integer multiple of ystep.
    # Puts it in a list and returns the list. 
    temp = []
    for i in range(len(data)):
        date = data[i]["strdate"]
        date = date.split("-")
        year = int(date[0])
        if year % ystep == 0 and date[1] in month:
            temp.append(data[i])
    return temp

def makeplot(data,filename):
    # Plot for graph
    (numdate,strdate,arcsec) = precess(data)
    plt.plot(numdate,arcsec,'bo')
    plt.xticks(numdate,strdate,rotation=45)
    add2plot(numdate,arcsec)
    plt.savefig(filename+'.png',bbox_inches='tight')
    plt.show()

def precess(data):
    # y-axis for graph
    numdate = []
    strdate = []
    arcsec = []
    v = np.array(data[0]['coord']) # Reference (3D)
    for datum in data:
        u = np.array(datum['coord']) # Perihelion (3D)
        ratio = np.dot(u,v)/np.sqrt(np.dot(u,u)*np.dot(v,v))
        if np.abs(ratio) <= 1:
            angle = 3600*np.degrees(np.arccos(ratio))
            numdate.append(datum['numdate'])
            strdate.append(datum['strdate'])
            arcsec.append(angle)
    return (numdate,strdate,arcsec)

def add2plot(numdate,actual):
    # Plots points, adds labels to x and y axis and legend, and adds legend. 
    r = stats.linregress(numdate,actual)
    bestfit = []
    for k in range(len(numdate)):
        bestfit.append(r[0]*numdate[k]+r[1])
    plt.plot(numdate,bestfit,'b-')
    plt.xlabel("Perihelion date")
    plt.ylabel("Precession (arcsec)")
    plt.legend(["Actual data","Best fit line"])
    slope = r[0]*(365.25*100)
    print(slope)
    plt.title("Slope of best fit line: %.2f arcsec/cent" % slope)
    
main()
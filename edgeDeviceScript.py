import serial

ser = serial.Serial('/dev/ttyS0', 9600)

while True:
    line = ser.readline()
    print(line)
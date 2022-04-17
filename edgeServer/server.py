import serial

ser = serial.Serial('/dev/ttyS0', 9600)

while True:
    line = ser.readline().decode("utf-8").strip().split(", ")
    print(line)
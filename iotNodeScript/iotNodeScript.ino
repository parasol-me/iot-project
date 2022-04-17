#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int timerCount = 0;
String delimiter = ", ";
String decimalPoint = ".";

bool readSensors = false;

void setup() 
{
  Serial.begin(9600);

  // digital humidity and tempurature
  dht.begin();

  cli();                      //stop interrupts for till we make the settings
  /*1. First we reset the control register to make sure we start with everything disabled.*/
  TCCR1A = 0;                 // Reset entire TCCR1A to 0 
  TCCR1B = 0;                 // Reset entire TCCR1B to 0
 
  /*2. We set the prescalar to the desired value by changing the CS10 CS12 and CS12 bits. */  
  TCCR1B |= B00000100;        //Set CS12 to 1 so we get prescalar 256  
  
  /*3. We enable compare match mode on register A*/
  TIMSK1 |= B00000010;        //Set OCIE1A to 1 so we enable compare match A 
  
  /*4. Set the value of register A to 31250*/
  OCR1A = 65535;             //Finally we set compare register A to this value  
  sei();                     //Enable back the interrupts
}

void loop() {
  // TODO: conditional triggers and actuator control from serial read goes here

  if (readSensors) {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)

    // Read humidity
    float h = dht.readHumidity();
    
    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();

    // Compute heat index in Celsius (isFahreheit = false)
    float hic = dht.computeHeatIndex(t, h, false);

    // get ldr value from analogue sensor
    int ldr = analogRead(A0);

    Serial.println(ldr + delimiter + h + delimiter + t + delimiter + hic);

    readSensors = false;
  }
}

// 1000ms ISR
ISR(TIMER1_COMPA_vect){
  TCNT1  = 0; //First, set the timer back to 0 so it resets for next interrupt

  // by using a counter we can multiply the delay to 5000ms
  if (timerCount < 4) {
    timerCount++;
    return;    
  }
  // reset counter now that the right delay is reached
  timerCount = 0;

  // reading temp sensor takes a while so use a flag to execute this in the main loop instead
  readSensors = true;
}
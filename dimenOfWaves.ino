#include <Servo.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN            46
// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      12
Adafruit_NeoPixel leds = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
int servoPin[] = {2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19};

const int servoAmount = 18;
const int ledsCount=9;
Servo servo[servoAmount];

float servoVal[servoAmount];

int currentPos = -1;
int bright[ledsCount];

void setup() {
  #if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
  leds.begin();
  //leds.setBrightness(0);
  Serial.begin(9600);
  
  for(int i = 0; i < sizeof(servoPin)/sizeof(int); i++ ){
    
    pinMode( i+2, OUTPUT );
    
    servo[i].attach(i+2);
    
  }
  
  for( int i = 0; i < sizeof(servoPin)/sizeof(int)/2; i++ ){
  
    servoVal[i] = 0.0;
    servoVal[i+9]=180.0;
    bright[i]=0;
  }
  for(int i=0;i<12;i++){
    leds.setPixelColor(i, leds.Color(0,0,0));
    leds.show();
  }
}

void loop() {
  
  if(Serial.available() > 0){
  
    currentPos = Serial.read();
    //currentPos = Serial.read()-48;
    delay(5);
    
    Serial.write(currentPos);
  
  }
  
  for(int i = 0; i < sizeof(servoPin)/sizeof(int); i++ ){//18
    if(i < sizeof(servoPin)/sizeof(int)/2){//9
      //bright[i]=map(servoVal[i],0,100,0,255)/255;
       bright[i]=map(servoVal[i],0,100,0,255);

      if( i == currentPos){
        lerpInput(i, servoVal[i]);
        
        if(i==0){
          leds.setPixelColor(0, leds.Color(115,204,211));
        }
        if (i==1){
          leds.setPixelColor(1, leds.Color(0,129,133));
         //leds.show();
        }
        if(i==2){
          leds.setPixelColor(2, leds.Color(0,164,202));
          leds.setPixelColor(3, leds.Color(0,164,202));
          leds.show();
        }
        if(i==3){
           leds.setPixelColor(4, leds.Color(0,126,162));    
           leds.show();    
        }
        if(i==4){
          leds.setPixelColor(5, leds.Color(0,104,143));
          leds.setPixelColor(6, leds.Color(0,104,143));
          leds.show();
        }
        if(i==5){
          leds.setPixelColor(7, leds.Color(4,252,171));
          leds.show();
        }
        if(i==6){
          leds.setPixelColor(8, leds.Color(92,40,136));
          leds.show();
        }
        if(i==7){
          leds.setPixelColor(9, leds.Color(122,193,65));
          leds.setPixelColor(10, leds.Color(122,193,65));
          leds.show();
        }
        if(i==8){
          leds.setPixelColor(11, leds.Color(6,115,91));
          leds.show();
        }
        
      }//end if i==currpos
      else{
        lerpReset(i, servoVal[i]);
        if(i==0){
          
          leds.setPixelColor(0,115*bright[i],204*bright[i],211*bright[i]);
          leds.show();
        }
        if (i==1){
          leds.setPixelColor(1, 0*bright[i],129*bright[i],133*bright[i]);
         //leds.show();
        }
        if(i==2){
          leds.setPixelColor(2,0*bright[i],164*bright[i],202*bright[i]);
          leds.setPixelColor(3, 0*bright[i],164*bright[i],202*bright[i]);
          leds.show();
        }
        if(i==3){
           leds.setPixelColor(4,0*bright[i],126*bright[i],162*bright[i]);    
           leds.show();    
        }
        if(i==4){
          leds.setPixelColor(5,0*bright[i],104*bright[i],143*bright[i]);
          leds.setPixelColor(6,0*bright[i],104*bright[i],143*bright[i]);
          leds.show();
        }
        if(i==5){
          leds.setPixelColor(7, 4*bright[i],252*bright[i],171*bright[i]);
          leds.show();
        }
        if(i==6){
          leds.setPixelColor(8, 92*bright[i],40*bright[i],136*bright[i]);
          leds.show();
        }
        if(i==7){
          leds.setPixelColor(9, 122*bright[i],193*bright[i],65*bright[i]);
          leds.setPixelColor(10,122*bright[i],193*bright[i],65*bright[i]);
          leds.show();
        }
        if(i==8){
          leds.setPixelColor(11,6*bright[i],115*bright[i],91*bright[i]);
          leds.show();
        }
       
      }//end else
    }//end if
    
    servo[i].write( int(servoVal[i]) );

  }//end for
  
  delay(40);

}


void lerpInput(int pos, float pAngle){
  
  servoVal[pos] += 0.05 * ( 100 - pAngle );
  servoVal[pos+9] = 180 - servoVal[pos];

}

void lerpReset(int pos, int pAngle){
  
  servoVal[pos] += 0.05 * ( 0 - pAngle );
  servoVal[pos+9] = 180 - servoVal[pos];

}


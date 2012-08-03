#include <Servo.h> 

Servo neckServo; 

int dirPin  = 4;
int stepperPin = 3;
int sleepPin = 7;
int safePinStart = 5;
int safePinEnd = 6;

long currentStep;
char commandByte;
int speedDivision;
int stepNum;
int stepNum2;
int neckAngle;
int stopVlueZero;
int stopVlueEnd;

bool saftyStop = false;

void setup () {
  currentStep = 0;
  Serial.begin( 9600 );
  
  neckServo.attach(9); 

  pinMode ( dirPin, OUTPUT );
  pinMode ( stepperPin, OUTPUT );
  pinMode( sleepPin, OUTPUT );
  pinMode( safePinStart, INPUT );
  pinMode( safePinEnd, INPUT );
  
  stopVlueZero = HIGH;
  stopVlueEnd = HIGH;
}


void loop(){
  char checkByte;
  char secondCheckByte;
  if( Serial.available() > 3 ) {
    checkByte = Serial.read();
//    Serial.write( checkByte );
    if( 'x' == checkByte ){
//      secondCheckByte = Serial.read();
//      if( 'x' == secondCheckByte ){
        commandByte = Serial.read();
        //Serial.write( commandByte );
        stepNum = Serial.read();
        //Serial.write( stepNum );
        switch(commandByte){
          case 'F':
            if( stopVlueEnd == LOW ){
            Serial.write( 'Y' );
              currentStep = 0;
            } else {
              step( false, stepNum );
            }
            break;
          case 'B':
            if( stopVlueZero == LOW ){
            Serial.write( 'X' );
          } else {
             step( true, stepNum );
          }
            break;
          case 'R':
            resetZero();
            break;
          case 'N':
            stepNum = stepNum - 48;
            stepNum2 = Serial.read() - 48;
            
            neckAngle = stepNum * 10 + stepNum2;
            neckAngle = (neckAngle > 60 ? 60 : neckAngle) * 2 + 30;
            
            neckServo.write(neckAngle);
            Serial.println(neckAngle);
            Serial.println(stepNum);
            Serial.println(stepNum2);
            break;
           default:
             break;
        }
//      }
    }
  }
}

void step( boolean dir,int steps ) {
  digitalWrite( sleepPin, HIGH );
  digitalWrite( dirPin, dir );
  delay( 25 );
  for( int i = 0; i <= steps; i++ ) {
    stopVlueZero = digitalRead( safePinStart );
    stopVlueEnd = digitalRead( safePinEnd );
    if( stopVlueZero == LOW ){
      Serial.write( 'X' );
      currentStep = 0;
      break;
    } else {
      doStep();
      if( dir ) {
          currentStep--;
        } else {
          currentStep++;
        }  
    }
    if( stopVlueEnd == LOW ){
      Serial.write( 'Y' );
      break;
    } else {
      doStep();
      if( dir ) {
          currentStep--;
        } else {
          currentStep++;
        }
 
    }
    
  }
  Serial.print( currentStep, DEC );
  digitalWrite( sleepPin, LOW );
}


void doStep(){
    digitalWrite( stepperPin, HIGH );
    delayMicroseconds( 3200 );
    digitalWrite( stepperPin, LOW );
    delayMicroseconds( 3200 );
}

void resetZero(){
  digitalWrite( sleepPin, HIGH );
  digitalWrite( dirPin, true );
  delay( 25 );
  while(1){
    doStep();
    stopVlueZero = digitalRead( safePinStart );
    stopVlueEnd = digitalRead( safePinEnd );
    if( stopVlueZero == LOW ){
        currentStep = 0;
        digitalWrite( sleepPin, LOW );
        Serial.print( currentStep, DEC );
        break;
     }
  }
}

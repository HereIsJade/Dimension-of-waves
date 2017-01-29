var section = 0;
var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1411';  // fill in your serial port name here
var pts= [];
var onPressed;
var cButtton;

var s0,s1, s2, s3, s4, s5, s6, s7, s8;
var sounds = [];

function preload() {
  s0 = loadSound('assets/0.mp3');
  s1 = loadSound('assets/1.mp3');
  s1 = loadSound('assets/2.mp3');
  s3 = loadSound('assets/3.mp3');
  s4 = loadSound('assets/4.mp3');
  s5 = loadSound('assets/5.mp3');
  s6 = loadSound('assets/6.mp3');
  s7 = loadSound('assets/7.mp3');
  s8 = loadSound('assets/8.mp3');
}

function setup() {
  //fullscreen(1);

  createCanvas(980,670);
  colorMode(HSB,360,100,100);
  rectMode(CENTER);
  background(208,5.88,95);
  sounds.push(s0,s1, s2, s3, s4, s5, s6, s7, s8);
  
  cButton = createButton('Clear');
  cButton.position(29, 19);
  cButton.mousePressed(changeBG);


  //serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial = new p5.SerialPort('128.122.6.186');
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port

  function serverConnected(){
  	console.log("connected");
  }

  function printList(list){

  	for(i = 0; i < list.length; i++){
  		console.log(list[i]);
  	}

  }

  function portOpen(){
  	console.log("open");
  	serial.write('0');
  }

  function serialError(error){

  	console.log(error);

  }

  function portClose(){
  	console.log("port closed");
  }

  function serialEvent(){

  	var inData = Number(serial.read());

  	serial.write(section);

  	console.log("indata="+inData);

  }

}

function draw(){
  if (onPressed) {
    //Each press creates 10 particle objects
    for (var i=0;i<2;i++) {
      var newP = new Particle(mouseX, mouseY, i+pts.length, i+pts.length);
      pts.push(newP);
    }
  }
   //update and display
  for (var i=0; i<pts.length; i++) {
    pts[i].update();
    pts[i].display();
  }

  for (var i=pts.length-1; i>-1; i--) {
    if (pts[i].dead) {
      pts.splice(i,1);
    }
  }
  

// 	section = floor( (touchX / width) * 9 );
// 	if(section > 8){
// 		section = 8;
// 	}
}

function touchMoved() {
  onPressed = true;
  section = floor( (touchX / width) * 9 );
  sounds[section].play();
	if(section > 8){
		section = 8;
	}
	return false;
}

function touchEnded() {
  onPressed = false;
}


function Particle(x, y, xOffset, yOffset){
  this.passedLife=0;
  this.dead=false;

  this.loc = new createVector(x,y);
  var randDegrees = random(360);
  this.vel = new createVector(cos(radians(randDegrees)), sin(radians(randDegrees)));
  this.vel.mult(random(5));

  this.acc = new createVector(0,0);
  this.lifeSpan = random(30, 90);
  this.decay = random(0.75, 0.9);
  //this.c = color(random(255),random(255),255);
  this.c = color(random(120,210),random(50,100),random(70,100));

  var tempSeed=random(-1,1);
  //for blackNwhite
  /*
  if (tempSeed<0){
    this.c = color(random(360),0,random(0,30));//black
  }
  else {
   this.c = color(random(360),0,random(70,100));//white
  }*/

  //for sunset manhattan
  /*
  if (tempSeed<(-0.7)){
    this.c = color(random(40,68),random(40,65),random(90,100));//red--yellow
  }
  else if ((tempSeed>(-0.7))&&(tempSeed<0)){
    this.c = color(random(340,360),random(50,70),random(90,100));
  }
  else{
    this.c = color(random(245,295),random(40,60),random(40,80));
  }
   */
  this.weightRange = random(50,80);

  this.xOffset = xOffset;
  this.yOffset = yOffset;

  this.update=function(){
    if(this.passedLife>=this.lifeSpan){
      this.dead = true;
    }else{
      this.passedLife=this.passedLife+1;
    }

    this.alpha = (this.lifeSpan-this.passedLife)/this.lifeSpan * 1;
    this.weight = (this.lifeSpan-this.passedLife)/this.lifeSpan * this.weightRange;
    this.acc.set(0,0);

    var rn = (noise((this.loc.x+frameCount+this.xOffset)*0.01, (this.loc.y+frameCount+this.yOffset)*0.01)-0.5)*3*PI;
    var mag = noise((this.loc.y+frameCount)*0.01, (this.loc.x+frameCount)*0.01);
    var dir = createVector(cos(rn),sin(rn));
    this.acc.add(dir);
    this.acc.mult(mag);

    var randDegrees = random(360);
    var randV = createVector(cos(radians(randDegrees)), sin(radians(randDegrees)));
    randV.mult(0.5);
    this.acc.add(randV);

    this.vel.add(this.acc);
    this.vel.mult(this.decay);
    //this.vel.limit(3);
    this.loc.add(this.vel);
  }

  this.display = function(){
    strokeWeight(this.weight+1.5);
    stroke(360, this.alpha);
    point(this.loc.x, this.loc.y);

    strokeWeight(this.weight);
    stroke(this.c);
    point(this.loc.x, this.loc.y);
  }
}

function clearDrawing() {
  background(208,5.88,95);
}

function changeBG() {
  background(208,5.88,95);
}

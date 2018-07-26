let ImageLoader = function(){
  this.images = {};
  this.loading = 0;
  this.loaded = 0;
};
ImageLoader.prototype.loadImage = function(name,path){
  this.loading++;
  const image = new Image();
  image.src = path;
  image.onload = () => {this.loaded++};
  this.images[name] = image;
};
ImageLoader.prototype.completed = function(){
  return this.loaded > 0 && this.loaded === this.loading;
};
ImageLoader.prototype.get = function(name){
  return this.images[name];
};
ImageLoader.prototype.remove = function(name){
  delete this.images[name];
};

const requestAnimationFrame = window.requestAnimationFrame
                           || window.webkitRequestAnimationFrame
                           || window.mozRequestAnimationFrame
                           || window.msRequestAnimationFrame
                           || window.setTimeout;
const cancelAnimationFrame = window.cancelAnimationFrame
                          || window.mozCancelAnimationFrame
                          ||　window.webkitCancelAnimationFrame
                          || window.msCancelAnimationFrame
                          || window.clearTimeout;
document.addEventListener('DOMContentLoaded',function(){
  //params
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const stageWidth = canvas.width;
  const stageHeight = canvas.height;
  const stageCenter = stageWidth / 2;
  const startX = stageCenter;
  const startY = stageHeight - 60;
  let mouseX = startX;
  let mouseY = startY;
  let clickX = -1, clickY = -1;
  //events listener
  /* //使わなさそう
  let mouseOnCanvas = false;
  canvas.addEventListener('mouseenter',(e)=>mouseOnCanvas = true);
  canvas.addEventListener('mouseleave',(e)=>mouseOnCanvas = false);
  */
  canvas.addEventListener('wheel',(e) => e.preventDefault());
  canvas.addEventListener('touchmove',(e) => e.preventDefault());
  window.addEventListener('scroll', (e) => {
    const crect = canvas.getBoundingClientRect();
    let diff = document.documentElement.clientHeight - crect.height;
    if (1 || diff < 50) {
      if (Math.abs(crect.top) < 10) {
        scrollBy(0, crect.top - diff/2);
      }
    }
  });
  const onMousemove = (e) => {
    const crect = canvas.getBoundingClientRect();
    mouseX = Math.floor(stageWidth * (e.clientX - crect.left) / crect.width);
    mouseY = Math.floor(stageHeight * (e.clientY - crect.top) / crect.height);
  };
  const onClick = (e) => {
    clickX = mouseX;
    clickY = mouseY;
    setTimeout(function(){
      clickX = -1;
      clickY = -1;
    },interval*1.6)
  };
  canvas.addEventListener('mousemove',onMousemove);
  canvas.addEventListener('touchmove',onMousemove);
  canvas.addEventListener('mousedown',onClick); //タッチでも発火

  //game init
  const imgs = new ImageLoader();
  imgs.loadImage('koishi','./img/koishi.png');
  imgs.loadImage('heart','./img/heart.png');
  
  let Scene = function(){
    this.frameCount = 0;
    this.objects = {};
  };
  Scene.prototype.addObject = function(object){
    //this.objects[object.id] = object;
  };
  Scene.prototype.update = function(){
    this.frameCount++;
    for (let o in this.objects) {
      this.objects[o].update();
    }
  };
  Scene.prototype.draw = function(){
    for (let o in this.objects) {
      this.objects[o].draw();
    }
  };
  
  const loading = new Scene();
  loading.addObject();
  
  const scenes = {};
  let currentScene = null;
  let nextScene = null;
  scenes['loading'] = loading;

  const game = () => {
    if (nextScene) {
      currentScene = nextScene;
      nextScene = null;
    }
    if (imgs.completed()) fps30();
  };

  //gameroop
  let passage, interval, fps;
  let animating = true;
  const animStart = () => {
    let prevpass, startTime, prevTime, currTime = new Date().getTime();
    startTime = currTime;
    (function animation(){
      game();
      if (animating) {
        requestAnimationFrame(animation,1000/60);
      } else {
        cancelAnimationFrame(animation);
      }
      //fps status
      prevTime = currTime;
      currTime = new Date().getTime();
      prevpass = Math.floor(passage/1000);
      passage = currTime - startTime;
      interval = currTime - prevTime;
      fps = 1000 / interval;
      if (prevpass + 0.995 < passage/1000) {
        //console.log(Math.floor(fps*10)/10);
      }
    })();
  };
  animStart();

  //image loading
  let ld = 0;
  const imgload = () => {
    ld++;
    if (ld >= 2) {
      animating = true;
      //animStart();
    }
  }
  var img = new Image();
  img.src = './img/heart.png'; // hontoha supuraito gazou
  img.onload = imgload;
  var kimg = new Image();
  kimg.src = './img/koishi.png';
  kimg.onload = imgload;
  var hearts = [{
    x: 480, y: 270, 
    theta: Math.PI, speed: 24,
    img: '', width: 48, height: 48,
    next: function(x,y,theta,speed){
      return {
        x: x + speed * Math.cos(theta),
        y: y + speed * Math.sin(theta),
        theta: (theta + 0.0314),
        speed: (0.01 + speed / 1.05)
      };
    },
    clear: function(x,y,theta,speed){
      var ip = Math.abs((480-x)*Math.cos(theta-Math.PI/2) + (270-y)*Math.sin(theta-Math.PI/2))/kyori(x,y);
      return ip < 0.01;
    }
  }];
  var counter1 = 0;
  var counter2 = 0;
  var counter3 = 0;
  function fps30(){
    context.clearRect(0,0,canvas.width,canvas.height);
    ugokuheart();
    counter1++;
    if (counter1 > 7) {
      counter1 = 0;
      counter2++;
      for (var i = 0; i < 24; i++) {
        var sayu = (counter3 > 12) ? +1 : -1;
        counter3++;
        hearts.push({
          x: 480, y: 270, 
          theta: sayu * Math.PI * (i / 6 + counter2 / 5), speed: 15,
          img: '', width: 48, height: 48,
          next: function(t){
            return function(x,y,theta,speed){
              return {
                x: x + speed * Math.cos(theta),
                y: y + speed * Math.sin(theta),
                theta: (theta + t * 0.0314),
                speed: (0.01 + speed / 1.005)
              };
            }
          }(-1*sayu),
          clear: function(x,y,theta,speed){
            var b0 = (x<-100 || y<-100 || canvas.width+100<x || canvas.height+100<y);
            var ip = Math.abs((480-x)*Math.cos(theta) + (270-y)*Math.sin(theta))/kyori(x,y);
            var b1 = (x != 480 && y != 270 && ip < 0.01)
            return b0 || b1;
          }
        });
      }
      counter3 = 0;
    }
    context.drawImage(kimg,stageWidth/2-100,270-100,200,200);
    context.drawImage(kimg,mouseX-50,mouseY-50,100,100);
  }
  function kyori(x,y,a,b){
    a = (a===0) ? 0 : (a || 480);
    b = (b===0) ? 0 : (b || 270);
    return Math.sqrt((x-a)**2 + (y-b)**2);
  }
  function ugokuheart(){
    var i, l = hearts.length;
    for (i = 0; i < l; i++) {
      var h = hearts[i];
      if (h) {
        context.save();
        context.translate(h.x,h.y);
        context.rotate(h.theta - Math.PI/2);
        context.drawImage(img,-h.width/2,-h.height/2);
        context.restore();
        var newX, newY, newT, newS;
        if (h.next) {
          var n = h.next(h.x,h.y,h.theta,h.speed);
          newX = n.x;
          newY = n.y;
          newT = n.theta;
          newS = n.speed;
        } else {
          newX = h.x + h.speed * Math.cos(h.theta);
          newY = h.y + h.speed * Math.sin(h.theta);
          newT = h.theta;
          newS = h.speed;
        }
        if (h.clear && h.clear(h.x,h.y,h.theta,h.speed)) {
          hearts.splice(i,1);
          i--;
        } else if (h.x<-100 || h.y<-100 || canvas.width+100<h.x || canvas.height+100<h.y) {
          hearts.splice(i,1);
          i--;
        }
        h.x = newX;
        h.y = newY;
        h.theta = newT;
        h.speed = newS;
      }
    }
  };
});
//https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0
//view-source:http://gobori.ehoh.net/

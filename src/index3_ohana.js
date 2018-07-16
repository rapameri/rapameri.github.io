document.addEventListener('DOMContentLoaded',function(){
  var context = canvas.getContext('2d');
  var mouseX = 0, mouseY = 0;
  function x(e){
    return (e.clientX - canvas.offsetLeft); //960x540
  }
  function y(e){
    return (e.clientY - canvas.offsetTop); //responsiveの拡大縮小率で補正すること！
  }
  function onClick(e){
    if (480-100 < mouseX && mouseX < 480+100 && 270-100 < mouseY && mouseY < 270+100) {
      console.log('こいしちゃん');
      /*
      type = (type != 'ego') ? 'ego' : 'ido';
      var i, l = hearts.length;
      for (i = 0; i < l; i++) {
        var h = hearts[i];
        h.type = type;
      }
      */
    }
  }
  function onMousemove(e){
    var rect = e.target.getBoundingClientRect();
    var crect = canvas.getBoundingClientRect();
    mouseX = Math.floor(960 * (e.clientX - rect.left) / crect.width);
    mouseY = Math.floor(540 * (e.clientY - rect.top) / crect.height);
    //scrollしたとき・touchしたときにも更新しような
  }
  function onMouseover(e){
  }
  canvas.addEventListener('click',onClick);
  canvas.addEventListener('mousemove',onMousemove);
  canvas.addEventListener('mouseover',onMouseover);
  
  //kokokara 2017/7/15
  // var type = 'ido';
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
  var ld = 0;
  function imgload(){
    ld++;
    if (ld >= 2) {
      var interval = setInterval(fps30,1000/30);
    }
  }
  var img = new Image();
  img.src = './img/heart.png'; // hontoha supuraito gazou
  img.onload = imgload;
  var kimg = new Image();
  kimg.src = './img/koishi.png';
  kimg.onload = imgload;
  var counter1 = 0;
  var counter2 = 0;
  var counter3 = 0;
  function fps30(){
    context.clearRect(0,0,canvas.width,canvas.height);
    ugokuheart();
    counter1++;
    if (counter1 > 5) {
      counter1 = 0;
      counter2++;
      for (var i = 0; i < 16; i++) {
        var sayu = (counter3 > 8) ? +1 : -1;
        counter3++;
        hearts.push({
          x: 480, y: 270, 
          theta: sayu * Math.PI * (i / 4 + counter2 / 5), speed: 16,
          img: '', width: 48, height: 48,
          next: function(t){
            return function(x,y,theta,speed){
              return {
                x: x + speed * Math.cos(theta),
                y: y + speed * Math.sin(theta),
                theta: (theta + t * 0.0314),
                speed: (0.01 + speed / 1.025)
              };
            }
          }(-1*sayu),
          clear: function(x,y,theta,speed){
            var b0 = (x<-100 || y<-100 || canvas.width+100<x || canvas.height+100<y);
            var ip = Math.abs((480-x)*Math.cos(theta-Math.PI/2) + (270-y)*Math.sin(theta-Math.PI/2))/kyori(x,y);
            var b1 = (x != 480 && y != 270 && ip < 0.01)
            return b0 || b1;
          }
        });
      }
      counter3 = 0;
    }
    context.drawImage(kimg,480-100,270-100,200,200);
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

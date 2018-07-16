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
    /*
    if (480-100 < mouseX && mouseX < 480+100 && 270-100 < mouseY && mouseY < 270+100) {
      type = (type != 'ego') ? 'ego' : 'ido';
      var i, l = hearts.length;
      for (i = 0; i < l; i++) {
        var h = hearts[i];
        h.type = type;
      }
    }
    */
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
  var direction = 'outside';
  var type = 'ido';
  var hearts = [];
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
  function fps30(){
    context.clearRect(0,0,canvas.width,canvas.height);
    ugokuheart();
    /*
    var theta = Math.random() * Math.PI * 2
    var newheart = (type != 'ego') ? {
      x: 480, y: 270, theta: theta, speed: 8 + Math.random() * 24, to: 'outside', type: 'ido'
    } : {
      x: 480 + 600 * Math.cos(theta), y: 270 + 600 * Math.sin(theta), theta: theta, speed: 8 + Math.random() * 24, to: 'center', type: 'ido'
    };
    hearts.push(newheart);
    */
    counter1++;
    if (counter1 > 5) {
      counter1 = 0;
      counter2++;
      for (var i = 0; i < 12; i++) {
        hearts.push({
          x: 480, y: 270, theta: Math.PI * (i / 6 + counter2 / 5), speed: 10, type: ''
        });
      }
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
        var newX, newY;
        if (type != 'ego') {
          newX = h.x + h.speed * Math.cos(h.theta);
          newY = h.y + h.speed * Math.sin(h.theta);
          context.translate(h.x,h.y);
          context.rotate(h.theta - Math.PI/2);
          context.drawImage(img,-24,-24);
          if (h.x < -100 || h.y < -100 || canvas.width + 100 < h.x || canvas.height + 100 < h.y) {
            hearts.splice(i,1);
            i--;
          }
        } else {
          newX = h.x - h.speed * Math.cos(h.theta);
          newY = h.y - h.speed * Math.sin(h.theta);
          context.translate(h.x,h.y);
          context.rotate(h.theta + Math.PI/2);
          context.drawImage(img,-24,-24);
          if (kyori(h.x,h.y) < kyori(newX,newY)) {
            hearts.splice(i,1);
            i--;
          }
        }
        h.x = newX;
        h.y = newY;
        context.restore();
      }
      //context.rotate(-theta);
    }
  };
});
//https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0
//view-source:http://gobori.ehoh.net/

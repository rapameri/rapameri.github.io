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
    console.log(mouseX,mouseY);
    context.fillRect(mouseX,mouseY,10,10);
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
  
  context.fillRect(0,0,10,10);
  context.fillRect(480,270,10,10);

  //kokokara 2017/7/15
  var hearts = [{
    x: 480,
    y: 270,
    theta: 0,
    speed: 16,
    to: 'outside'
  }];
  var img = new Image();
  img.src = './img/koishi.png'; // hontoha supuraito gazou
  img.onload = function(){
    var interval = setInterval(fps30,1000/30);
  }
  function ugokuheart(){
    var i, l = hearts.length;
    for (i = 0; i < l; i++) {
      var h = hearts[i];
      context.rotate(3.14);
      context.drawImage(img,h.x,h.y,180,180);
      //context.rotate(-3.14);
      h.x = (h.x > canvas.width) ? 0 : (h.x + h.speed);
      h.y = (h.y > canvas.height) ? 0 : (h.y + h.speed);
    }
  };
  function fps30(){
    context.clearRect(0,0,canvas.width,canvas.height);
    ugokuheart();
  }
});
//https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0
//view-source:http://gobori.ehoh.net/

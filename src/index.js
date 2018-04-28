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
});
//https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0
//view-source:http://gobori.ehoh.net/

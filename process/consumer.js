var num = 0;

process.on('message', function(m) {
  console.log('CHILD got message:', m);
  
});
//process.send({ foo: 'bar' });

loop();

function loop() {
    num ++;
    console.log(num);
    setTimeout(loop, 5000);
}
const { fork } = require('child_process')

const child = fork('./dist/main.js', [], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
})

// setTimeout(() => {
child.send({
  command: 'START',
});
// }, 60_000);

setInterval(() => {
  child.send({
    command: 'SEND_MESSAGE',
    data: {
      to: '62895346266988',
      message: Math.random() + '\n\nHello World\n\nhttps://github.com/vermaysha',
    }
  })
  console.log('Dispatached')
}, 10_000);

setInterval(() => {
  child.send({
    command: 'MEMORY_USAGE'
  })
}, 2000);

child.on('message', (data) => {
  console.log(data);
})


child.stdout.on('data', (data) => {
  console.log(data.toString());
})

child.stderr.on('data', (data) => {
  console.error(data.toString());
})

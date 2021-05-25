// 每个任务都超过一帧的时间 16ms, 需要把控制权交给浏览器
let taskQueue = [
  () => {
    console.log("task1 start");
    sleep(20);
    console.log("task1 end");
  },
  () => {
    console.log("task2 start");
    sleep(20);
    console.log("task2 end");
  },
  () => {
    console.log("task3 start");
    sleep(20);
    console.log("task3 end");
  },
];

let sleep = (delay) => {
  for (let start = Date.now(); Date.now() - start <= delay; ) {}
};

let performUnitOfWork = () => {
  taskQueue.shift()();
};

let workloop = (deadline) => {
  console.log(`此帧的剩余时间 --> ${deadline.timeRemaining()} ms`);
  // 此帧剩余时间大于0
  while (deadline.timeRemaining() > 0 && taskQueue.length > 0) {
    performUnitOfWork();
    console.log(`还剩时间: ${deadline.timeRemaining()} ms`);
  }
  // 否则应该放弃执行任务控制权，把执行权交还给浏览器。
  if (taskQueue.length > 0) {
    // 申请下一个时间片
    requestIdleCallback(workloop);
  }
};

// 注册任务，告诉浏览器如果每一帧存在空闲时间，就可以执行注册的这个任务
requestIdleCallback(workloop);

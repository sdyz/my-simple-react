// 定义一个任务队列
let taskQueue = [
  () => {
    console.log("task1 start");
    console.log("task1 end");
  },
  () => {
    console.log("task2 start");
    console.log("task2 end");
  },
  () => {
    console.log("task3 start");
    console.log("task3 end");
  },
];

// 执行工作单元。每次取出队列中的第一个任务，并执行
let performUnitOfWork = () => {
  taskQueue.shift()();
};

/**
 * callback 接收默认参数 deadline，timeRamining 属性表示当前帧还剩多少时间
 */
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

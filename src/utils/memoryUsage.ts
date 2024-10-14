const memoryUsage = process.memoryUsage();
export const printMemoryUsage = () => {
  console.log("");
  console.log("Memory Usage:");
  console.log(
    `RSS: ${Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100} MB`
  );
  console.log(
    `Heap Total: ${
      Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100
    } MB`
  );
  console.log(
    `Heap Used: ${
      Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100
    } MB`
  );
  console.log(
    `External: ${
      Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100
    } MB`
  );
};

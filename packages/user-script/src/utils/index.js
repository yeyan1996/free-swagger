export const retry = async ({
  cb,
  retryNumber = 10,
  endCondition = () => {},
  success = () => {},
  error = () => {}
}) => {
  await cb();
  const shouldEnd = endCondition();
  if (shouldEnd) {
    success();
    return;
  }
  if (shouldEnd || retryNumber < 0) {
    error();
    return;
  }
  await wait();
  await retry({
    cb,
    endCondition,
    retryNumber: retryNumber - 1,
    success,
    error
  });
};

export const wait = async (time = 500) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

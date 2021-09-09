export const retry = async ({
  cb = () => {},
  time = 500,
  retryNumber = 10,
  endCondition = res => res,
  success = () => {},
  error = () => {}
}) => {
  const res = await cb();
  const shouldEnd = endCondition(res);
  if (shouldEnd) {
    success(res);
    return;
  }
  if (shouldEnd || retryNumber < 0) {
    error(res);
    return;
  }
  await wait(time);
  await retry({
    cb,
    time,
    endCondition,
    retryNumber: retryNumber - 1,
    success,
    error
  });
};

export const waitUntil = (cb, time = 500, retryNumber = 10) =>
  new Promise(async (resolve, reject) => {
    const shouldEnd = await cb();
    if (shouldEnd) {
      resolve();
    }
    if (shouldEnd || retryNumber < 0) {
      reject("timeout");
      return;
    }
    await wait(time);
    await waitUntil(cb, time, retryNumber - 1);
    resolve();
  });

export const wait = async (time = 500) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

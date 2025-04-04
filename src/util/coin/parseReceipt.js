export const parseReceipt = (receipt, contract) => {
  try {
    if (!receipt?.logs?.length) {
      return {};
    }
    let targetLog;
    for (const log of receipt?.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (['Buy', 'Sell'].includes(parsedLog?.name)) {
          targetLog = parseSingleData(parsedLog, parsedLog?.name);
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return targetLog;
  } catch (err) {
    console.log(err);
  }
};

const parseSingleData = (data, type) => {
  let obj = {};
  if (type === 'Buy') {
    const [buyerAddress, tokenAmount, okbAmount] = data?.args || [];
    obj = {
      type: 1,
      address: buyerAddress.toLowerCase(),
      amount: String(okbAmount),
      tokenAmount: String(tokenAmount)
    };
  } else if (type === 'Sell') {
    const [sellerAddress, tokenAmount, okbAmount] = data?.args || [];
    obj = {
      type: 0,
      address: sellerAddress.toLowerCase(),
      amount: String(okbAmount),
      tokenAmount: String(tokenAmount)
    };
  }
  return obj;
};
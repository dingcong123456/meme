import {formatEther, parseEther} from 'ethers';

export const formatNumberWithSuffix = (numStr) => {
  const numValue = Number(numStr);
  if (isNaN(numValue)) return "Invalid Number";
  const normalStr = numValue.toLocaleString('fullwide', { useGrouping: false });
  const num = Number(normalStr);

  const absNum = Math.abs(num);
  let scaled;
  let suffix = "";

  if (absNum < 1e3) {
    return normalStr;
  } else if (absNum < 1e6) {
    scaled = num / 1e3;
    suffix = "k";
  } else if (absNum < 1e9) {
    scaled = num / 1e6;
    suffix = "m";
  } else if (absNum < 1e12) {
    scaled = num / 1e9;
    suffix = "b";
  } else {
    scaled = num / 1e9;
    suffix = "b";
  }
  let formatted;
  if (scaled % 1 !== 0) {
    formatted = scaled.toFixed(3);
    formatted = parseFloat(formatted).toString();
  } else {
    formatted = scaled.toString();
  }

  return formatted + suffix;
}

export const parseBitInt = (numStr) => {
  const str = formatEther(BigInt(numStr));
  return {
    display: formatNumberWithSuffix(str),
    value: str
  };
}
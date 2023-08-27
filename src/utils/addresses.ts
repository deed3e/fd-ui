import { getAddress } from 'ethers/lib/utils';

export const shortenAddress = (address: string, firstLength?: number, lastLength?: number) => {
  if (address && address.length > 0) {
    return `${address.substring(0, firstLength || 4)}..${address.substring(
      address.length - (lastLength || 3),
      address.length,
    )}`;
  }
};

export function isAddress(value: string): string | false {
  try {
    return getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

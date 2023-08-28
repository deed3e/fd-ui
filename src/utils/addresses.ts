export const shortenAddress = (address: any, firstLength?: number, lastLength?: number) => {
  if(typeof address !== 'string'){
    return 'undefine'
  }
  if (address && address.length > 0) {
    return `${address.substring(0, firstLength || 4)}..${address.substring(
      address.length - (lastLength || 3),
      address.length,
    )}`;
  }
};


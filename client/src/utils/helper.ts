export const convertCentToUSD = (cents: number) => {
  const intl = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  return intl.format(cents / 100);
};

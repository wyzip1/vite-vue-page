export const cn = (base: string, ...args: (string | undefined)[]) => {
  return [base, ...args].filter(Boolean).join(" ");
};

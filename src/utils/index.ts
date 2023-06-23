export const formatDate = (
  value: string | Date | number | null,
  detail: boolean = false,
  formatDate: string = "-",
  formatTime: string = ":"
): string => {
  if (!value) return "-";
  const formatNum = (num: string | number) => (num < 10 ? "0" + num : num);
  const date = new Date(value);
  const localDate = date
    .toLocaleDateString()
    .split("/")
    .map((item) => formatNum(item))
    .join(formatDate);
  const localTime = detail
    ? " " + date.toLocaleTimeString().replaceAll(":", formatTime)
    : "";
  return localDate + localTime;
};

export { copyInfo, createImg } from "./module/copy";
export { formatDate } from "./module/date";
export {
  assembleTree,
  eachTree,
  formatTree,
  findTreePath,
} from "./module/tree";
export {
  getCookie,
  transferDataToQuery,
  transferQueryToData,
  parseJSON,
} from "./module/parseQuery";
export {
  formatNum,
  formatMutipleNum,
  formatMoneyPreSubFix,
} from "./module/number";
export { setValue, getValue, filterObjEmpty } from "./module/object";

export function guid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const toggleList = <T>(
  list: T[],
  item: T,
  customValidate?: (item: T) => boolean,
) => {
  const index = list.findIndex((e) =>
    typeof customValidate === "function" ? customValidate(e) : e === item,
  );
  if (index > -1) list.splice(index, 1);
  else list.push(item);
  return list;
};

export function debounce(event: Function, delay = 300) {
  let timer: NodeJS.Timer | undefined;
  return (...args: unknown[]) => {
    timer && clearTimeout(timer as unknown as number);
    timer = setTimeout(() => event(...args), delay);
  };
}

export function throttle(fn: Function, delay = 300) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timer | undefined;
  return (...args: unknown[]) => {
    if (timer) return;
    fn(...args);
    timer = setTimeout(() => (timer = undefined), delay);
  };
}

export const SelectFile = (type = "*") => {
  return new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    window.addEventListener(
      "focus",
      () => {
        setTimeout(() => {
          resolve(input.files?.[0]);
        }, 300);
      },
      { once: true },
    );
    input.type = "file";
    input.accept = type;
    input.click();
  });
};

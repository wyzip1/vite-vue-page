export const copyToEl = (el: Element) => {
  const selection = window.getSelection()!;
  if (selection.rangeCount > 0) selection.removeAllRanges();
  const range = document.createRange();
  document.body.appendChild(el);
  range.selectNode(el); //传入dom
  selection.addRange(range);
  document.execCommand("copy");
  document.body.removeChild(el);
};

export const copyText = async (data: string) => {
  const permissions = await navigator.permissions.query({
    // @ts-ignore
    name: "clipboard-write",
  });
  if (permissions.state === "granted") {
    await navigator.clipboard.writeText(data);
    return;
  }

  const text = document.createElement("span");
  text.innerText = data;
  copyToEl(text);
};

export const createImg = (url: string) => {
  return new Promise<HTMLImageElement>((rev, rej) => {
    const img = document.createElement("img");
    img.src = url;
    img.crossOrigin = "Anonymous"; //解决跨域图片问题

    img.onload = () => rev(img);
    img.onerror = (e) => rej(e);
  });
};

export const copyImg = async (data: { type: "img"; url: string }) => {
  const permissions = await navigator.permissions.query({
    // @ts-ignore
    name: "clipboard-write",
  });
  if (permissions.state === "granted") {
    const res = await fetch(data.url, { headers: { "Response-Type": "blob" } });
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return;
  }

  const img = await createImg(data.url);
  copyToEl(img);
};

export const copyInfo = async (
  data?: string | { type: "img"; url: string },
) => {
  try {
    if (!data) return;
    typeof data === "string" ? copyText(data) : copyImg(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

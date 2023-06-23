import { parse, compileScript } from "@vue/compiler-sfc";
import MagicString from "magic-string";
import type { PluginOption } from "vite";
interface tempAttrs {
  lang?: boolean;
  title?: string;
  name?: string;
  keepAlive?: boolean;
}

const createScripteTemplate = ({ lang, ...attrs }: tempAttrs) => `
<script ${lang ? `lang="${lang}"` : ""}>
    import { defineComponent } from 'vue'
    export default defineComponent({${mapAttrs(attrs)}})
</script>`;
type keyMap = "lang" | "title" | "name" | "keepAlive";
const mapAttrs = (attrs: tempAttrs) => {
  let result = "",
    key: keyMap = "lang";
  for (key in attrs) {
    result += `${key}: '${attrs[key]}',`;
  }
  return result.substring(0, result.length - 1);
};

export default function VueScriptSetupExtend(): PluginOption {
  return {
    name: "transform-file",
    enforce: "pre",
    transform(code: string, id: string) {
      if (!/\.vue$/.test(id)) return null;
      const { descriptor } = parse(code);
      if (descriptor.script || !descriptor.scriptSetup) return null;

      const result = compileScript(descriptor, { id });
      const str = new MagicString(code);
      const scriptTemplate = createScripteTemplate(result.attrs);
      str.appendLeft(0, scriptTemplate);
      return { map: str.generateMap(), code: str.toString() };
    },
  };
}

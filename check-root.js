import fs from "fs/promises";
import { createRequire } from "module";
import { parseDocument } from "htmlparser2";
const require = createRequire(import.meta.url);
const glob = require("glob");

// 검사할 디렉토리를 설정합니다.
const directoryPath =
  "/Users/dvmoomoodv/Project/company/gsitm/framework/ustra-framework3-node";

// glob을 Promise로 래핑합니다.
const globPromise = (pattern) =>
  new Promise((resolve, reject) =>
    glob(pattern, (err, files) => (err ? reject(err) : resolve(files)))
  );

// 단일 루트 요소를 확인하는 함수
const hasSingleRootElement = (templateContent) => {
  const document = parseDocument(templateContent);
  const rootNodes = document.children.filter((node) => node.type === "tag");
  return rootNodes.length === 1;
};

try {
  // Vue 파일들을 찾습니다.
  const files = await globPromise(`${directoryPath}/**/*.vue`);

  // 파일들을 하나씩 검사합니다.
  for (const file of files) {
    try {
      const data = await fs.readFile(file, "utf8");

      // <template> 섹션을 추출합니다.
      const templateMatch = data.match(/<template>([\s\S]*?)<\/template>/);
      if (templateMatch) {
        const templateContent = templateMatch[1].trim();

        // <template> 섹션 내에 단일 루트 요소가 존재하는지 확인합니다.
        if (hasSingleRootElement(templateContent)) {
          //   console.log(
          //     `File ${file} contains a single root component in <template>.`
          //   );
        } else {
          console.log(
            `File ${file} does not contain a single root component in <template>.`
          );
        }
      } else {
        console.log(`File ${file} does not contain a <template> section.`);
      }
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
    }
  }
} catch (err) {
  console.error("Error while finding Vue files:", err);
}

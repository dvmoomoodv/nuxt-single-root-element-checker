import { promises as fs } from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const glob = require("glob");

// 검사할 디렉토리를 설정합니다.
const directoryPath = "~/Project/company/gsitm/framework/ustra-framework3-node";
// glob을 Promise로 래핑합니다.
const globPromise = (pattern) =>
  new Promise((resolve, reject) =>
    glob(pattern, (err, files) => (err ? reject(err) : resolve(files)))
  );

try {
  // Vue 파일들을 찾습니다.
  const files = await globPromise(`${directoryPath}/**/*.vue`);

  // 파일들을 하나씩 검사합니다.
  for (const file of files) {
    try {
      const data = await fs.readFile(file, "utf8");

      // <script> 태그의 개수를 센다.
      const scriptTags = data.match(/<template\b[^>]*>/gi) || [];
      if (scriptTags.length > 1) {
        console.log(`File ${file} contains more than one <script> tag.`);
      }
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
    }
  }
} catch (err) {
  console.error("Error while finding Vue files:", err);
}

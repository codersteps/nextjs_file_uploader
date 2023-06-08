export * from "./environment";
export * from "./parse-form";

import util from "util";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const deepLog = (obj: any, depth?: number) => {
  console.log(
    util.inspect(obj, { showHidden: false, depth: depth ?? null, colors: true })
  );
};

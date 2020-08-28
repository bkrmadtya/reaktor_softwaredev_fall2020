import { fetchData } from "./fetchData.js";
import { displayData } from "./displayData.js";
import { parseData } from "./parseData.js";

async function load() {
  let packageList = [];

  const { platform, filePath, data } = await fetchData();

  packageList = parseData(data);

  displayData(platform, filePath, packageList);
}

// make the load function available to HTML elements outside the module
window.load = load;

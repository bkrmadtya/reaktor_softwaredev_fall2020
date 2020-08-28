// parse each package from list to relevant information
export const parseData = (data) => {
  let packageList = [];

  // split packages on basis of double consecutive line break
  const packageArray = data.trim().split(/\n{2}/);

  packageArray.forEach((singlePackage) => {
    const parsedPackage = parsePackageInfo(singlePackage);

    if (parsedPackage) {
      packageList.push(parsedPackage);
    }
  });

  packageList = sortByName(packageList);
  packageList = addReverseDependencies(packageList);

  return packageList;
};

// sort the packagae by name
const sortByName = (arr) => {
  return arr.sort((item1, item2) => {
    // 0 i.e. if the name is same then the items are not sorted and kept in original place
    let result = 0;
    result = item1.name < item2.name ? -1 : 1;

    return result;
  });
};

// parse each singlePackage to get relevant info (name, dependencies, description)
const parsePackageInfo = (singlePackage) => {
  if (singlePackage.includes("Package")) {
    const name = singlePackage
      .match(/^Package: ([\s\S]*?)\n/i)[0]
      .replace("Package: ", "")
      .trim();

    const regexForDescription = () => {
      let lookBehind = ".$";
      const indexOfOriginal = singlePackage.indexOf("Original");
      const indexOfHomepage = singlePackage.indexOf("Homepage");

      if (indexOfOriginal > 0 || indexOfHomepage > 0) {
        lookBehind =
          indexOfOriginal < indexOfHomepage
            ? indexOfOriginal > 0
              ? "Original"
              : "Homepage"
            : indexOfHomepage > 0
            ? "Homepage"
            : "Original";
      }

      let regex = new RegExp(
        "^Description: ([\\s\\S]*?)(.*)(?=" + lookBehind + ")",
        "im"
      );

      return regex;
    };

    const description = singlePackage.includes("Description")
      ? singlePackage
          .match(regexForDescription())[0]
          .replace("Description: ", "")
          .trim()
      : "none";

    const dependencies = singlePackage.includes("\nDepends")
      ? singlePackage
          .match(/^Depends: ([\s\S]*?)(?=\n)/im)[0] // get all the dependencies starting from "Depends: "
          .replace(/ *\([^)]*\) */g, "") // remove the brackets
          .split(",")
      : [];

    return {
      name,
      description,
      dependencies: dependencies.map((item) =>
        item.replace("Depends:", "").trim()
      ),
    };
  } else {
    return null;
  }
};

// N.B. :: Since, package is reserved word in ES6 modules, singlePackage is used as variable name instead

// add array of reverse dependencies for each singlePackage
const addReverseDependencies = (packageList) => {
  return packageList.map((singlePackage) => {
    // search and filter all the packages that have singlePackage as its dependencies and extract just their names
    const reverseDependencies = packageList
      .filter((item) => item.dependencies.indexOf(singlePackage.name) != -1)
      .map((item) => item.name);

    return { ...singlePackage, reverseDependencies: [...reverseDependencies] };
  });
};

// auxiliary array of packages for diplayPackageInfo and removeOptionalDependencies functions
let packages = [];

export const displayData = (platform, filePath, packageList) => {
  packages = [...packageList];

  displaySystemInfo(platform, filePath, packageList.length);

  displayPackageList(packageList);
};

const displaySystemInfo = (platform, filePath, noOfPackages) => {
  const systemInfoTableBody = document.getElementById("sytem_info_table_body");

  systemInfoTableBody.innerHTML += `<tr>
      <td width="20%"><strong>Platform</strong></td>
      <td width="70%">${platform}</td>
    </tr>
    <tr>
      <td width="20%"><strong>File path</strong></td>
      <td width="70%">${filePath}</td>
    </tr>
    <tr>
      <td width="20%"><strong>No of packages</strong></td>
      <td width="70%">${noOfPackages}</td>
    </tr>`;
};

// add each package to the package list table in DOM
const displayPackageList = (packageList) => {
  const packageListTableBody = document.getElementById(
    "package_list_table_body"
  );
  packageListTableBody.innerHTML += packageList
    .map((item, index) => {
      return `<tr>
          <td>
            ${index + 1}
          </td>
          <td>
            <a href="#" onclick="displayPackageInfo('${item.name}')">
            ${item.name}
            </a>
          </td>
        </tr>`;
    })
    .join("");
};

// display package info for a single package when its name is clicked
// the method is called each time the a link is pressed, and it is globally available hence no identifier
const displayPackageInfo = (packageName) => {
  const packageDetail = document.getElementById("package_detail");
  const singlePackage = packages.find((item) => item.name === packageName);
  packageDetail.innerHTML = createHTMLForPackageDetail(singlePackage);
};

// make the displayPackageInfo function available to HTML elements outside the module
window.displayPackageInfo = displayPackageInfo;

// convert package info for a single package when its name is clicked
const createHTMLForPackageDetail = (singlePackage) => {
  return `<div class="card curved">
            <div class="title">Package Info</div>
            <div class="package curved">
                <h3>Package: ${singlePackage.name}</h3>
                <p><strong>Dependencies:</strong> ${dependenciesToLink(
                  singlePackage.dependencies
                )}
                </p>
                <p><strong>Reverse Dependencies:</strong> ${dependenciesToLink(
                  singlePackage.reverseDependencies
                )}
                </p>
                <div>
                    <strong>Description: </strong><pre>${
                      singlePackage.description
                    }</pre>
                </div>
            </div>
      </div>`;
};

// convert dependencies to link
const dependenciesToLink = (dependencies) => {
  let result;

  if (dependencies.length === 0) {
    result = "None";
  } else {
    result = removeOptionalDependencies(dependencies);
    result = result
      .map(
        (item) =>
          `<a href="#" onclick="displayPackageInfo('${item}')">${item}</a>`
      )
      .join(", ");
  }

  return result;
};

// remove dependencies which are optional and are seperated by pipe "|"
// and keep one which is in the list of package
const removeOptionalDependencies = (dependencies) => {
  let result = dependencies.map((item) => {
    if (item.includes("|")) {
      return item.split("|").map((d) => d.trim());
    }

    return item;
  });

  result = result.flat();

  // return packages that are only in the list
  return result.filter((i) =>
    packages.some((singlePackage) => singlePackage.name === i)
  );
};

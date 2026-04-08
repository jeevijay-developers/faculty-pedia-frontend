const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      if (f.endsWith(".jsx")) callback(dirPath);
    }
  });
}

const targetFiles = [];
walkDir("src", function(filePath) {
    let content = fs.readFileSync(filePath, "utf-8");
    if ((content.includes("bg-white") || content.includes("bg-gray-50") || content.includes("bg-blue-50") || content.includes("bg-green-50")) && !content.includes("dark:bg")) {
       targetFiles.push(filePath);
    } else if (content.includes("bgColor=\"bg-white\"") || content.includes("bgColor=\"bg-gray-50\"")) {
       targetFiles.push(filePath);
    }
});

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, "utf-8");
  const sr = (regex, replacement) => { content = content.replace(regex, replacement); };

  sr(/\bbg-white\b(?!\s+dark:)/g, "bg-white dark:bg-gray-900");
  sr(/\btext-gray-900\b(?!\s+dark:)/g, "text-gray-900 dark:text-gray-100");
  sr(/\btext-gray-800\b(?!\s+dark:)/g, "text-gray-800 dark:text-gray-200");
  sr(/\btext-gray-700\b(?!\s+dark:)/g, "text-gray-700 dark:text-gray-300");
  sr(/\btext-gray-600\b(?!\s+dark:)/g, "text-gray-600 dark:text-gray-400");
  sr(/\btext-gray-500\b(?!\s+dark:)/g, "text-gray-500 dark:text-gray-400");
  sr(/\bbg-gray-50\b(?!\s+dark:)/g, "bg-gray-50 dark:bg-gray-800");
  sr(/\bbg-gray-100\b(?!\s+dark:)/g, "bg-gray-100 dark:bg-gray-800");
  sr(/\bbg-gray-200\b(?!\s+dark:)/g, "bg-gray-200 dark:bg-gray-700");
  sr(/\bborder-gray-100\b(?!\s+dark:)/g, "border-gray-100 dark:border-gray-800");
  sr(/\bborder-gray-200\b(?!\s+dark:)/g, "border-gray-200 dark:border-gray-700");
  sr(/\bborder-gray-300\b(?!\s+dark:)/g, "border-gray-300 dark:border-gray-600");
  sr(/\bhover:bg-gray-50\b(?!\s+dark:)/g, "hover:bg-gray-50 dark:hover:bg-gray-800");
  sr(/\bhover:bg-white\b(?!\s+dark:)/g, "hover:bg-white dark:hover:bg-gray-800");
  sr(/\bhover:text-gray-900\b(?!\s+dark:)/g, "hover:text-gray-900 dark:hover:text-gray-100");

  sr(/\bbg-blue-50\b(?!\s+dark:)/g, "bg-blue-50 dark:bg-blue-900\/20");
  sr(/\bbg-green-50\b(?!\s+dark:)/g, "bg-green-50 dark:bg-green-900\/20");
  sr(/\bbg-purple-50\b(?!\s+dark:)/g, "bg-purple-50 dark:bg-purple-900\/20");
  sr(/\bbg-orange-50\b(?!\s+dark:)/g, "bg-orange-50 dark:bg-orange-900\/20");
  sr(/\bbg-sky-50\b(?!\s+dark:)/g, "bg-sky-50 dark:bg-sky-900\/20");
  sr(/\bbg-pink-50\b(?!\s+dark:)/g, "bg-pink-50 dark:bg-pink-900\/20");
  sr(/\bbg-rose-50\b(?!\s+dark:)/g, "bg-rose-50 dark:bg-rose-900\/20");

  sr(/bgColor="bg-white"/g, "bgColor=\"bg-white dark:bg-gray-900\"");
  sr(/bgColor="bg-gray-50"/g, "bgColor=\"bg-gray-50 dark:bg-gray-800\"");

  fs.writeFileSync(file, content);
});
console.log("Processed files: " + targetFiles.length);


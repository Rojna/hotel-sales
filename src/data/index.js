const Papa = require("papaparse");
const fs = require("fs");

function readCSVWriteJSON({
  readFilename,
  processResultsBeforeWrite = function(json) {
    console.log("default callback");
    var jsonData={};
    json.forEach(item => {
        const itemKey = item.title;
        for (const [key, value] of Object.entries(item)) {
          if(key !== 'title'){
            // itemValue[itemKey] = value;
            if(!jsonData[key]){
              jsonData[key] = {};
            }
            jsonData[key][itemKey] = value;
          }
        }
      });
      console.log('jsonData', jsonData);
    return jsonData;
  },
}) {
  console.log('filename', __dirname);
  const file = fs.readFileSync(`${__dirname}/csv/${readFilename}.csv`, "utf8");
  const processed = file.replace(/\uFEFF/g, "");
  const fileProcessed = processed.replace(/\u2013|\u2014/g, '--')

  const options = {
    header: true,
    encoding: "utf8",
    complete: function(results) {
      if (!results || !results.data) {
        console.log("no results or results.data");
        return;
      }
      const processedResults = processResultsBeforeWrite(results.data);
      
        fs.writeFileSync(
          `${__dirname}/language-test.json`,
          JSON.stringify(processedResults),
          "utf8"
        );
    },
  };

  Papa.parse(fileProcessed, options);
}

readCSVWriteJSON({
  readFilename: "language"
});


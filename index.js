const DomParser = require('dom-parser');
const fs = require('fs');

// Add as many folders as you want layers. 
let folders = ['Background', '2nd', '3rd'];
let outputFolder = "Output";

let fileData = []
folders.forEach((dirname, index) => {
    fileData[index] = [];

    const filenames = fs.readdirSync(dirname);
    filenames.forEach(function(filename) {
        const content = fs.readFileSync(dirname + "/" + filename, {encoding:'utf8', flag:'r'});
        fileData[index].push(content);
    });
});

let generateSvgTag = function(attributes) {
    let svgTag = "<svg";
    attributes.forEach((attribute) => {
        if (attribute.value !== "") {
            svgTag += " " + attribute.name + "='" + attribute.value + "'";
        }
    })

    svgTag += ">"
    return svgTag;
}

let loopFileData = function(i, numberOfFolders, svgsToCombine) {
    if (i == numberOfFolders) {
        return;
    }

    for (let j = 0; j < fileData[i].length; j++) {
        svgsToCombine.push(fileData[i][j]);
        loopFileData(i+1, numberOfFolders, svgsToCombine);

        if (svgsToCombine.length === numberOfFolders) {
            let svgXml = generateSvgTag(parser.parseFromString(svgsToCombine[0]).getElementsByTagName("svg")[0].attributes);
            svgsToCombine.forEach((svg) => {
                let svgDetail = parser.parseFromString(svg).getElementsByTagName("svg")[0].innerHTML;
                svgXml += svgDetail;
            });
            svgXml += "</svg>"
            fs.writeFileSync(outputFolder + "/" + Date.now() + ".svg", svgXml);
        }

        svgsToCombine.pop();
    }
}

let parser = new DomParser();
loopFileData(0, folders.length, []);
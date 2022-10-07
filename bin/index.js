#! /usr/bin/env node

const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Name of the app: ", (path) => {
  readline.question("Description of the app: ", (description) => {
    readline.question("Link to author's git repository: ", (github) => {
      fs.access(`${__dirname}/Apps/${path}`, (error) => {
        // To check if the given directory
        // already exists or not
        if (error) {
          // If current directory does not exist
          // then create it
          fs.mkdir(`Apps/${path}`, (error) => {
            if (error) {
              console.log(error);
            } else {
              const dets = {
                imports: path,
              };
              fs.readFile("apps.json", (err, resp) => {
                let response = JSON.parse(resp);
                // console.log(resp);
                response.push(dets);
                fs.writeFile("apps.json", JSON.stringify(response), (err) => {
                  if (err) console.log(err);
                });
                // let format = `\n\nconst ${path}Router = require("./${path}/index")\nmodule.exports = ${path}`;
                let format = `\t`;
                for (i of response) {
                  format += `\nconst ${i.imports}Router = require("./${i.imports}/index")`;
                }
                fs.writeFile("Apps/index.js", format, (err) => {
                  if (err) console.log(err);
                });
                // let format = `\nconst ${path}Router = require("./${path}/index")`;
                // fs.appendFile("Apps/index.js", format, (err) => {
                //   if (err) console.log(err);
                // });
                let secFormat = `\nmodule.exports = {`;
                for (i of response) {
                  secFormat += `${i.imports}Router, `;
                }
                secFormat += `}`;
                fs.appendFile("Apps/index.js", secFormat, (err) => {
                  if (err) console.log(err);
                });
              });
              const details = `const ${path}Router = require("express").Router()\n\nmodule.exports = ${path}Router`;
              fs.writeFile(`Apps/${path}/index.js`, details, function (err) {
                if (err) throw err;
              });
              console.log(`Apps/${path} has been created`);
              const pattern = {
                appName: path,
                description,
                githubLink: github,
              };
              fs.readFile("developers.json", function (err, data) {
                var json = JSON.parse(data);
                json.push(pattern);

                fs.writeFile("developers.json", JSON.stringify(json), (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Updated developers.json");
                  }
                });
              });
            }
          });
        } else {
          console.log(`${path} already exist`);
        }
        readline.close();
      });
    });
  });
});

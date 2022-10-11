#! /usr/bin/env node

const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const path = process.argv.slice(2)[0];
if (path) {
  // readline.question("Name of the app: ", (path) => {
  readline.question("Description of the app: ", (description) => {
    readline.question("Link to author's git repository: ", (github) => {
      fs.access(`Apps/${path}`, (error) => {
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
                  else console.log(`apps.json updated.`);
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
                  else {
                    console.log(`Apps/index.js updated`);
                  }
                });
                const datas = `\n${path}URI = mongodb+srv://backwrap:backwrap@cluster0.w1bdsly.mongodb.net/${path}?retryWrites=true&w=majority`;
                fs.appendFile(".env", datas, (err) => {
                  if (err) console.log(err);
                  else {
                    console.log(`.env updated`);
                  }
                });
              });
              const details = `const ${path}Router = require("express").Router()
const mongoose = require("mongoose");
require("dotenv").config({path: require("find-config")(".env")})

const ${path}URI = process.env.${path}URI || "";
mongoose.connect(${path}URI, (err) => {
  if(err) {
    console.log("Error connecting to the ${path} database");
  } else {
    console.log("Connected to the ${path} databese")
  }
});

module.exports = ${path}Router`;
              fs.writeFile(`Apps/${path}/index.js`, details, function (err) {
                if (err) throw err;
                else {
                  console.log(`Apps/${path}/index.js created`);
                }
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
        // process.exit(0);
      });
    });
  });
  // });
} else {
  console.log(`create-backwrap-app takes one argument`);
  process.exit(1);
}

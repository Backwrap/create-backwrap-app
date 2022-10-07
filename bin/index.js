#! /usr/bin/env node

const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Name of the app: ", (path) => {
  readline.question("Description of the app: ", (description) => {
    readline.question("Link to author's git repository: ", (github) => {
      fs.access(`${__dirname}/${path}`, (error) => {
        // To check if the given directory
        // already exists or not
        if (error) {
          // If current directory does not exist
          // then create it
          fs.mkdir(path, (error) => {
            if (error) {
              console.log(error);
            } else {
              const details = `const ${path} = () => {\n\n}\nmodule.exports = ${path}`;
              fs.writeFile(`${path}/index.js`, details, function (err) {
                if (err) throw err;
              });
              console.log(`${path} has been created`);
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
                    console.log("Edited developers.json");
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

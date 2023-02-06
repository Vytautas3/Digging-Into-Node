#!/usr/bin/env node

"use strict";

const util = require("util");
const childProc = require("child_process");


// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 100;

const delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
    console.log(`Load testing http://localhost:${HTTP_PORT}...`);

    let x = 0;

    while (true) {
        x++;
        process.stdout.write(`Trying ${MAX_CHILDREN} requests...`);
        let childs = [];
        for (let i = 0; i < MAX_CHILDREN; i++) {
            childs.push(
                childProc.spawn("node", ["ex7-child.js"])
            );
        }
        let responses = childs.map(function wait(child) {
            return new Promise(function c(res) {
                child.on("exit", function (code) {
                    code === 0 ? res(true) : res(false);
                });
            });
        });

        if (x > 5) {
            foo();
        }

        responses = await Promise.all(responses);

        console.log(responses);

        let determiner = array => array.every(val => val === true);

        console.log(determiner(responses) === true ? "Success!" : "Failure :( !");

        await delay(500);
    }
}

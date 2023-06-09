/*
Copyright © Adobe, Inc. All rights reserved.
See COPYING.txt for license details.
*/

import shellPkg from 'shelljs';
const { cp, rm, sed } = shellPkg;
import * as fs from 'fs';
import { dirname, join } from 'path';
import chalk from "chalk";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const changelog = 'CHANGELOG.md';

export function copyTemplate(jiraProject) {
  const templateDirectory = `${join(__dirname, '../')}templates/${jiraProject.toLowerCase()}`;
  const currentDirectory = process.cwd();
  const changelogExists = fs.existsSync(join(currentDirectory, changelog));
  if (changelogExists) {
    rm(changelog);
  }

  if (fs.existsSync(templateDirectory)) {
    cp('-R', `${templateDirectory}/*`, currentDirectory);
    console.log(`${chalk.white('\n\n✔ Template copied.')}`);
  } else {
    console.error('\nThe requested template was not found.');
    process.exit(1);
  }
}

export function replacePlaceholders(answers) {
  const questionAnswers = Object.entries(answers);
  for (const [questionName, answer] of questionAnswers) {
    const placeholder = new RegExp(`\\[${questionName.toUpperCase()}\\]`, "g");
    sed('-i', placeholder, answer.toString(), changelog);
  }
  console.log(`${chalk.white('✔ Template placeholders replaced.')}`);
}

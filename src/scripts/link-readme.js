/**
 * Script that automatically creates links to issues and users inside README.md
 *
 * e.g. "#123" => "[#123](https://github.com/getferdi/ferdi/issues/123)"
 * and  "franz/#123" => "[franz#123](https://github.com/meetfranz/franz/issues/123)"
 * and "@abc" => "[@abc](https://github.com/abc)"
 */

const fs = require('fs-extra');
const path = require('path');

console.log('Linking issues and PRs in README.md');

const readmepath = path.join(__dirname, '../../', 'README.md');

// Read README.md
let readme = fs.readFileSync(readmepath, 'utf-8');

let replacements = 0;

// Replace Ferdi issues
// Regex matches strings that don't begin with a "[", i.e. are not already linked and
// don't begin with "franz", i.e. are not Franz issues, followed by a "#" and 3 digits to indicate
// a GitHub issue, and not ending with a "]"
readme = readme.replace(/(?<!\[|franz)#\d{3}(?!\])/gi, (match) => {
  const issueNr = match.replace('#', '');
  replacements += 1;
  return `[#${issueNr}](https://github.com/getferdi/ferdi/issues/${issueNr})`;
});

// Replace Franz issues
// Regex matches strings that don't begin with a "[", i.e. are not already linked
// followed by a "franz#" and 3 digits to indicate
// a GitHub issue, and not ending with a "]"
readme = readme.replace(/(?<!\[)franz#\d{3,}(?!\])/gi, (match) => {
  const issueNr = match.replace('franz#', '');
  replacements += 1;
  return `[franz#${issueNr}](https://github.com/meetfranz/franz/issues/${issueNr})`;
});

// Link GitHub users
// Regex matches strings that don't begin with a "[", i.e. are not already linked
// followed by a "@" and at least one word character and not ending with a "]"
readme = readme.replace(/(?<!\[)@\w+(?!\])/gi, (match) => {
  const username = match.replace('@', '');
  replacements += 1;
  return `[@${username}](https://github.com/${username})`;
});

// Write to file
fs.writeFileSync(readmepath, readme);

console.log(`Added ${replacements} strings`);

/**
 * Add CrowdIn Contributors to AllContributors list
 *
 * This script will add CrowdIn Contributors to the list of all contributors.
 * As the CrowdIn API doesn't give good access to the data needed, this script
 * requires you to manually execute a script on the members page of CrowdIn
 * and paste its output into this script.
 *
 * Usage:
 * 1. Open https://crowdin.com/project/getferdi/settings#members
 * 2. Open the console and execute the script below:

const members = [];
// All elements containing members
const membersEl = [...document.querySelectorAll('.ps-members-name')];
// Remove the first 4 contributors as they are already in the list
for (let i = 0; i < 4; i += 1) {
  membersEl.shift();
}
membersEl.forEach((el) => {
  const text = el.innerText;
  let picture = el.querySelector('img').getAttribute('src');
  picture = picture.replace(/\?.+/, '');

  // Check if the text includes a separate username
  if (text.includes('(')) {
    const username = /(?<=\()\w*(?=\))/.exec(text)[0];
    const name = /^.*(?= \()/.exec(text)[0];

    if (username) {
      members.push({
        name: name || username,
        login: username,
        avatar_url: picture,
      });
      return;
    }
  }
  members.push({
    name: text,
    login: text,
    avatar_url: picture,
  });
});

// Output data to console
console.clear();
console.log(JSON.stringify(members));

 * 3. Paste the output of the script (JSON Array) below to set 'list' to that value
 * 4. Execute this script using 'node src/scripts/add-crowdin-contributors.js'
 * 5. Regenerate the README table using the CLI ('all-contributors generate')
 * Please check if the generated data is ok and no data is lost.
*/
const list = [];

const fs = require('fs-extra');
const path = require('path');
const allContributors = require('all-contributors-cli');

const infoPath = path.join(__dirname, '../../.all-contributorsrc');

(async () => {
  const info = await fs.readJSON(infoPath);

  for (const user of list) {
    // eslint-disable-next-line no-await-in-loop
    info.contributors = await allContributors.addContributorWithDetails({
      ...user,
      contributions: ['translation'],
      profile: `https://crowdin.com/profile/${user.login}`,
      options: {
        contributors: info.contributors,
      },
    });
  }

  fs.writeJSON(infoPath, info, {
    spaces: 2,
  });
})();

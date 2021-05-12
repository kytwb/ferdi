/**
 * Script to get information on which selectors use the brand color.
 * This is needed to provide the accent color feature - the feature will create CSS rules
 * to overwrite the color of these selectors.
 */
const css = require('css');
const fs = require('fs-extra');
const path = require('path');
const theme = require('@meetfranz/theme');

// Colors that should be replaced with the accent color
const accentColors = [
  theme.DEFAULT_ACCENT_COLOR.toLowerCase(),
  '#7367f0',
  '#5e50ee',
];

const cssFile = path.join(__dirname, '../../', 'build', 'styles', 'main.css');
const outputFile = path.join(__dirname, '../', 'assets', 'themeInfo.json');

// Parse and extract the rules from a CSS stylesheet file
async function getRulesFromCssFile(file) {
  const cssSrc = (await fs.readFile(file)).toString();
  const cssTree = css.parse(cssSrc);

  return cssTree.stylesheet.rules;
}

/**
 * Get all selectors from a list of parsed CSS rules that set any property to one of the specified
 * values.
 *
 * This function will output an object in this format:
 * {
 *  'property-name': [ array of selectors ]
 * }
 *
 * e.g.
 * {
 *  'background-color': [
 *   '.background',
 *   '.input-dark'
 *  ]
 * }
 *
 * @param {Array} rules Rules as outputted by the `css` module
 * @param {Array} values Array of values that should be searched for
 */
function getSelectorsDeclaringValues(rules, values) {
  const output = {};

  rules.forEach((rule) => {
    if (rule.declarations) {
      rule.declarations.forEach((declaration) => {
        if (declaration.type === 'declaration'
            && values.includes(declaration.value.toLowerCase())) {
          if (!output[declaration.property]) {
            output[declaration.property] = [];
          }
          output[declaration.property] = output[declaration.property].concat(rule.selectors);
        }
      });
    }
  });

  return output;
}

async function generateThemeInfo() {
  if (!await fs.pathExists(cssFile)) {
    console.log('Please make sure to build the project first.');
    return;
  }

  // Read and parse css bundle
  const rules = await getRulesFromCssFile(cssFile);

  console.log(`Found ${rules.length} rules`);

  // Get rules specifying the brand colors
  const brandRules = getSelectorsDeclaringValues(rules, accentColors);

  console.log(`Found ${Object.keys(brandRules).join(', ')} properties that set color to brand color`);

  // Join array of declarations into a single string
  Object.keys(brandRules).forEach((rule) => {
    brandRules[rule] = brandRules[rule].join(', ');
  });

  // Write object with theme info to file
  fs.writeFile(
    outputFile,
    JSON.stringify(brandRules),
  );
}

generateThemeInfo();

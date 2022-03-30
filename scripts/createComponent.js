const fs = require('fs');
const path = require('path');

(async function () {
  const componentName = process.argv[2];
  if (!componentName) {
    throw new Error('You need to provide a component name!');
  }

  const jsFileContent =
`import React from 'react';

export default function ${componentName} () {
  return (
    <>
      <h2>${componentName}</h2>
    </>
  );
}
`;

  const testFileContent =
`/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import ${componentName} from './${componentName}';

test('Renders the ${componentName} title', () => {
  render(<${componentName} />);
  const titleElement = screen.getByText(/${componentName}/i);
  expect(titleElement).toBeInTheDocument();
});
`;

  const cssFileContent = '';

  const indexFileContent =
`export { default } from './${componentName}';
`;

  const componentDirPath = path.join(__dirname, '..', 'src', 'components', componentName);

  await fs.promises.mkdir(componentDirPath);
  await fs.promises.writeFile(path.join(componentDirPath, `${componentName}.js`), jsFileContent, 'utf-8');
  await fs.promises.writeFile(path.join(componentDirPath, `${componentName}.test.js`), testFileContent, 'utf-8');
  await fs.promises.writeFile(path.join(componentDirPath, `${componentName}.css`), cssFileContent, 'utf-8');
  await fs.promises.writeFile(path.join(componentDirPath, 'index.js'), indexFileContent, 'utf-8');

  console.info(`${componentName} component successfully created in ${componentDirPath}`);
})();

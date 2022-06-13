#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
`import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import ${componentName} from './${componentName}';

describe('Tests for the ${componentName} component', () => {
  it('Renders the ${componentName} title', () => {
    render(<${componentName} />);
    const titleElement = screen.getByRole('heading', { level: 2, name: '${componentName}' });

    expect(titleElement).toBeInTheDocument();
  });
});
`;

const cssFileContent = '';

const componentDirPath = path.join(__dirname, '..', 'src', 'components', componentName);

await fs.mkdir(componentDirPath);
fs.writeFile(path.join(componentDirPath, `${componentName}.jsx`), jsFileContent, 'utf-8');
fs.writeFile(path.join(componentDirPath, `${componentName}.test.jsx`), testFileContent, 'utf-8');
fs.writeFile(path.join(componentDirPath, `${componentName}.css`), cssFileContent, 'utf-8');

console.info(`${componentName} component successfully created in ${componentDirPath}`);

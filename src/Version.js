import React from 'react';

const { version } = require('../package.json');

const link = `//github.com/istex/istex-dl/releases/tag/${version}`;

const VersionComponent = () => (
    <span>ISTEX DL <a href={link} target="_blank" rel="noopener noreferrer">{version}</a>
    </span>
);
export { VersionComponent as default };

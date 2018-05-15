import React from 'react';
import ReactDOM from 'react-dom';

const { version } = require('../package.json');

const link = `//github.com/istex/istex-dl/releases/tag/${version}`;

const VersionComponent = () => (
    <span>ISTEX DL <a href={link}>{version}</a>
    </span>
);
export { VersionComponent as default };

ReactDOM.render(<VersionComponent />, document.getElementById('version'));

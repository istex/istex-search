const withNextIntl = require('next-intl/plugin')('./src/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
module.exports = withNextIntl({
  output: 'standalone',
});

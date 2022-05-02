FROM nginx:stable-alpine

# nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the dist/ directory containing the pre-built application (HTML, CSS and JS files)
COPY ./dist /app/dist/

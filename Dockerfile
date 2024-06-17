FROM node:21

# Install necessary packages for installing the Datadog agent
RUN apt-get update && apt-get install -y curl apt-transport-https gnupg

# Add the Datadog APT key
RUN curl -s https://keys.datadoghq.com/DATADOG_APT_KEY_CURRENT.public | apt-key add -

# Add the Datadog APT repository
RUN sh -c "echo 'deb https://apt.datadoghq.com/ stable 7' > /etc/apt/sources.list.d/datadog.list"

# Install the Datadog agent
RUN apt-get update && apt-get install -y datadog-agent

ARG DD_API_KEY

ENV DD_API_KEY=${DD_API_KEY}
ENV DD_SITE="us5.datadoghq.com"

# Add application code to the image
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN yarn run build


# Ensure the Datadog configuration file exists and set it to debug mode
RUN touch /etc/datadog-agent/datadog.yaml && \
    sed -i 's/# log_level: info/log_level: debug/' /etc/datadog-agent/datadog.yaml

# Start the Datadog agent and your application
CMD datadog-agent run & npm run start

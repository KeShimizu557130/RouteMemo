FROM gitpod/workspace-full:latest

USER root

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.14.0

WORKDIR $NVM_DIR

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install -g expo-cli
RUN npm install react-native-modal
RUN npm install react-native-storage
RUN npm install react-navigation
RUN npm install react-navigation-stack
RUN npm install redux
RUN npm install react-redux
RUN expo install react-native-gesture-handler react-native-reanimated
RUN expo install react-native-safe-area-view react-native-safe-area-context
RUN expo install @react-native-community/masked-view
RUN expo install react-native-safe-area-context
RUN npm install react-native-elements
RUN npm install @reduxjs/toolkit
RUN expo install @react-native-community/datetimepicker
RUN expo install expo-mail-composer
RUN expo install expo-file-system
RUN npm install --save-exact native-base@2.13.8
RUN expo install expo-font
RUN rm -rf /home/gitpod/.expo


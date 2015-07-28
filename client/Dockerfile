# FROM neo9polska/nodejs-bower-gulp
#
#MAINTAINER Mattias Larsen
#
#RUN npm install -g node-sass
#
#CMD ['npm' ,'install']
#CMD ['bower' ,'install']
#
FROM node:0.10

# node-gyp needs python 2 to install & compile some dependencies
ENV PYTHON python2

# install git for bower dependencies and libfontconfig as phantomjs requirement
RUN apt-get -yq update && apt-get -yq install git libfontconfig imagemagick

#install bower and gulp, and local gulp
RUN npm install -g bower gulp
RUN npm install -g node-sass

# same for bower files
ADD bower.json /tmp/bower.json
RUN cd /tmp && bower install --allow-root --config.interactive=false
RUN mkdir -p /opt/app && cp -a /tmp/bower_components /opt/app/

WORKDIR /opt/apt

# default command to run gulp
CMD ['gulp']
#Customise this Dockerfile to provide install-specific stuff, e.g. enabling certain PHP extensions
FROM registry.gitlab.com/arg-tech/internal/lamp

FROM php:7.0-apache

RUN apt-get update && apt-get -y install wget


ADD docker-php.conf /etc/apache2/conf-available/docker-php.conf
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite


#RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
#RUN apt-get update
#RUN apt-get -y install wget

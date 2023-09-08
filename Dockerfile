FROM ubuntu:18.04
#osbase
RUN apt update
RUN apt install -y curl unzip zip bash
RUN apt install -y build-essential libz-dev zlib1g-dev 
RUN pwd
RUN useradd -d /home/wozza -m -s /bin/bash wozza
USER wozza
RUN curl -s "https://get.sdkman.io" | bash
SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN source "/home/wozza/.sdkman/bin/sdkman-init.sh"
#RUN sdk install maven 3.8.4
#can stall here
#RUN sdk install java 22.2.0.r11-grl
RUN sdk offline
#entrypoint bash 
RUN mkdir -p /home/wozza/.m2
USER root
RUN echo "Australia/Sydney" > /etc/timezone
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends tzdata \
    && rm -rf /var/lib/apt/lists/*
RUN ln -fs /usr/share/zoneinfo/Australia/Sydney /etc/localtime \
    && dpkg-reconfigure --frontend noninteractive tzdata
RUN apt-cache search bash-completion
USER wozza
RUN ldd --version
#ENTRYPOINT ["/bin/bash", "--login", "-x", "-i", "--"]
#CMD ["mvn -Ptest -U"]
#CMD ["mvn test -Dtest=SolTest"]
WORKDIR /app
ENTRYPOINT ["/bin/bash", "--login", "-i"]
CMD ["bin/build-native.sh"]
#
#sdk use java 22.2.r11-grl
# mvn -Pnative && target/jslee-js --host 172.24.0.2 < src/test/js/simple.js
#mvn -Pnative

FROM osbase
RUN apt update
RUN apt install -y curl unzip zip bash
RUN apt install -y build-essential libz-dev zlib1g-dev 
RUN pwd
RUN useradd -d /home/wozza -m -s /bin/bash wozza
USER wozza
RUN curl -s "https://get.sdkman.io" | bash
SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN source "/home/wozza/.sdkman/bin/sdkman-init.sh"
RUN sdk install maven 3.8.4
#can stall here
RUN sdk install java 21.3.0.r11-grl
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
USER wozza
ENTRYPOINT ["/bin/bash", "--login", "-i", "-c"]
#ENTRYPOINT ["/bin/bash", "--login", "-x", "-i", "--"]
#CMD ["mvn -Ptest -U"]
#CMD ["mvn test -Dtest=SolTest"]

WORKDIR /app

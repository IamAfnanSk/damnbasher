FROM ubuntu:latest

RUN apt update -y

RUN apt upgrade -y

RUN apt-get install -y ca-certificates curl gnupg

RUN mkdir -p /etc/apt/keyrings

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt update -y

RUN apt install nodejs -y

RUN apt install git -y

RUN apt install build-essential -y

RUN npm install -g pnpm

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm i -g static-server --unsafe-perm=true

COPY . /root/app

WORKDIR /root/app

RUN pnpm i

RUN pnpm run build

RUN adduser damner

USER damner

WORKDIR /home/damner

RUN git clone https://github.com/codedamn-classrooms/html-playground-starter.git app

USER root

WORKDIR /home/damner

RUN mkdir temp

WORKDIR /root/app

EXPOSE 1337
EXPOSE 80
EXPOSE 9080

CMD pnpm start

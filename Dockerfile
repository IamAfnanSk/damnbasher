FROM ubuntu

RUN apt update -y

RUN apt upgrade -y

RUN apt install nodejs -y

RUN apt install git -y

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

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

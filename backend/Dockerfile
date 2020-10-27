FROM python:3.7

COPY ./requirements.txt /requirements.txt
RUN apt-get update
RUN pip install -r /requirements.txt

RUN mkdir /src
COPY ./src /src
WORKDIR /src

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static

RUN python manage.py collectstatic
# RUN python manage.py migrate
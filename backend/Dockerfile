FROM python:3.7

# ENV PATH="/scripts:${PATH}"

COPY ./requirements.txt /requirements.txt
RUN apt-get update
RUN pip install -r /requirements.txt

RUN mkdir /src
COPY ./src /src
WORKDIR /src
# COPY ./scripts /scripts

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static

RUN python manage.py collectstatic

# COPY /src/media /vol/web/media

# CMD ["entrypoint.sh"]

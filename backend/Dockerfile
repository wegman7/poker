FROM python:3.7

WORKDIR /src
COPY ./src /src
COPY requirements.txt /
RUN pip install -r /requirements.txt

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static

# RUN python manage.py collectstatic
# RUN python manage.py migrate
FROM python:3.8-slim-buster

# Set lang
ENV LANG C.UTF-8
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# install psycopg2 dependencies
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
# Create and change to the app directory.
WORKDIR /
# Copy local code to the container image.
COPY . .
# Install production dependencies
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
RUN python manage.py loaddata subsidio.json
# Expose port
EXPOSE 8000

# CMD gunicorn -b :8000 rdp.wsgi.application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
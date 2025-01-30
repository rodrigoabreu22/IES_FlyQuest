FROM python:3.10-slim

WORKDIR /datagen

COPY requirements.txt ./
COPY inserts/ ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9010

CMD ["python", "-u", "app.py"]

#docker build -t data_gen .
#docker run --name data_gen -p 9010:9010 data_gen
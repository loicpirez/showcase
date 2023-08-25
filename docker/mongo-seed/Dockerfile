FROM mongo

RUN apt update && apt install curl -y

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt update && apt install nodejs git -y 

WORKDIR /app

COPY scripts/wait-for-it.sh /app/wait-for-it.sh

COPY scripts/init.sh /app/init.sh
COPY scripts/seed-elasticsearch.js /app/seed-elasticsearch.js

COPY dataset.csv /app/dataset.csv

RUN chmod +x /app/init.sh

CMD ["./wait-for-it.sh", "-t", "120", "mongodb:27017", "--", "bash", "/app/init.sh"]
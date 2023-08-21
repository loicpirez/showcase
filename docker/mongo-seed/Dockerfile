FROM mongo

COPY init.csv /init.csv
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

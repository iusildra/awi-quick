##################################
### Import data from SQL files ###
##################################

SQL_FILES_LOC="./sql"
SQL_FILES=$(exa --no-icons -1 $SQL_FILES_LOC)

for FILE in $SQL_FILES
do
    docker exec -it awi-quick-db  psql -U postgres -f home/$FILE
done

FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache curl

VOLUME /tmp
COPY target/*.war app.war

EXPOSE 8090

ENTRYPOINT ["java","-jar","/app.war"]


#build the image
#docker build -t ies_project_backend .

#run the image
#docker run --name=ies_backend --network=host -p 8090:8090 ies_project_backend

#mysql image
#docker run --name mySQL_ies_proj -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=ies_db -e MYSQL_USER=admin -e MYSQL_PASSWORD=admin -p 33060:3306 -d mysql/mysql-server:5.7
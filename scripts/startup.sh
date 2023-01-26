cd /home/ec2-user/secretsanta
sudo /usr/bin/java -jar -Dserver.port=80 \
    *.war > /dev/null 2> /dev/null < /dev/null &
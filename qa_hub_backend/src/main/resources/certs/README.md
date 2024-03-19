global-bundle.pem contains tls certificates required for connecting to the amazon hosted mongodb

Java mongodb library requires to create a truststore containing those certs. There is an officical guide:
https://docs.aws.amazon.com/documentdb/latest/developerguide/connect_programmatically.html

trustore.jks is a keystore obtained in result of executing actions in this guide.
password for keystore is 123456

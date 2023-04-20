#!/bin/bash
sudo apt-get update
sudo apt-get -y install git
rm -rf /home/bitnami/hbfl
git clone https://github.com/Zendrakk/hbfl.git /home/bitnami/hbfl
chown -R bitnami: /home/bitnami/hbfl
cd /home/bitnami/hbfl
sudo npm ci
sudo npm run start

# The above commands base64 encoded for entering into UserData
# IyEvYmluL2Jhc2gNCnN1ZG8gYXB0LWdldCB1cGRhdGUNCnN1ZG8gYXB0LWdldCAteSBpbnN0YWxsIGdpdA0Kcm0gLXJmIC9ob21lL2JpdG5hbWkvaGJmbA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9aZW5kcmFray9oYmZsLmdpdCAvaG9tZS9iaXRuYW1pL2hiZmwNCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbA0KY2QgL2hvbWUvYml0bmFtaS9oYmZsDQpzdWRvIG5wbSBjaQ0Kc3VkbyBucG0gcnVuIHN0YXJ0

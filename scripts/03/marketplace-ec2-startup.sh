#!/bin/bash
sudo apt-get update
sudo apt-get -y install git
rm -rf /home/bitnami/hbfl2
git clone https://github.com/Zendrakk/hbfl2.git /home/bitnami/hbfl2
chown -R bitnami: /home/bitnami/hbfl2
cd /home/bitnami/hbfl2
sudo npm ci
sudo npm run start

# The above commands base64 encoded for entering into UserData
# IyEvYmluL2Jhc2gNCnN1ZG8gYXB0LWdldCB1cGRhdGUNCnN1ZG8gYXB0LWdldCAteSBpbnN0YWxsIGdpdA0Kcm0gLXJmIC9ob21lL2JpdG5hbWkvaGJmbDINCmdpdCBjbG9uZSBodHRwczovL2dpdGh1Yi5jb20vWmVuZHJha2svaGJmbDIuZ2l0IC9ob21lL2JpdG5hbWkvaGJmbDINCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbDINCmNkIC9ob21lL2JpdG5hbWkvaGJmbDINCnN1ZG8gbnBtIGNpDQpzdWRvIG5wbSBydW4gc3RhcnQ=

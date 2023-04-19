#!/bin/bash
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y git
cd home/ec2-user
git clone https://github.com/Zendrakk/hbfl.git
cd hbfl
npm i
npm run start

# The above commands base64 encoded for entering into UserData
# IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xNi54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KY2QgaG9tZS9lYzItdXNlcg0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9aZW5kcmFray9oYmZsLmdpdA0KY2QgaGJmbA0KbnBtIGkNCm5wbSBydW4gc3RhcnQ=
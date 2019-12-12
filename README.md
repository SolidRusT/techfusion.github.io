# Technical Fusion Canada

## www.techfusion.ca

The `master` branch contains the code installed on [www.techfusion.ca](https://www.techfusion.ca).



### Manual host machine preparation steps

SSH to a brand new debian buster host
update repo cache
install basic tools
add user to sudoers
copy authorized keys
install docker
join the swarm
mkdir /mnt/registry


=========

# Debian minimal install with SSH and system tools
# Login as root
# Refresh repo cache and install some tools
apt update && apt install git sudo net-tools

# add yourself to sudo
visudo      # shaun         ALL=(ALL) NOPASSWD:ALL
exit

# Login as shaun
# scp your keys over
mkdir .ssh
mv authorized_keys .ssh/authorized_keys
chmod 600 .ssh/authorized_keys

# Install some required packages first
sudo apt update
sudo apt install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common

# Get the Docker signing key for packages
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -

# rasbian uses 'arch=armhf'
echo "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list

# Install Docker
# The aufs package, part of the "recommended" packages, won't install on Buster just yet, because of missing pre-compiled kernel modules.
# We can work around that issue by using "--no-install-recommends"
sudo apt update
sudo apt install -y --no-install-recommends \
    docker-ce \
    cgroupfs-mount

sudo systemctl enable docker
sudo systemctl start docker

# make yourself a member of the docker group
# logout
# login

# Install required packages
sudo apt update
sudo apt install -y python python-pip libffi-dev python-backports.ssl-match-hostname

# Install Docker Compose from pip
# This might take a while
sudo pip install docker-compose

## Slave Node
### Join the swarm
#docker swarm join --token SWMTKN-1-5nlp0hlpkg339r28gawpratr71nhhcirdh0dhuzcg2iqv7e0v1-byacri2ts9b1l8do1i1l3lras 10.2.5.201:2377
docker swarm join --token SWMTKN-1-5nlp0hlpkg339r28gawpratr71nhhcirdh0dhuzcg2iqv7e0v1-4607kovldin749eyuswqnhgy7 10.2.5.167:2377

## Master Node
### Initialize the swarm
docker swarm init

## References
- https://github.com/vegasbrianc/prometheus
- https://github.com/RiFi2k/dockerize-your-dev
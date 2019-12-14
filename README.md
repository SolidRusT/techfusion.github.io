## Technical Fusion Canada

### techfusion.ca core operations

The `master` branch contains the code installed on [www.techfusion.ca](https://www.techfusion.ca).

### Manual host machine preparation steps

- SSH to a brand new debian buster host
- update repo cache
- install basic tools
- add user to sudoers
- copy authorized keys
- install docker
- join the swarm
- mkdir /mnt/registry


=========

### Debian minimal install with SSH and system tools
### Login as root
### Refresh repo cache and install some tools
`apt update && apt install git sudo net-tools`

### add yourself to sudo

```
visudo      # shaun         ALL=(ALL) NOPASSWD:ALL
exit
```

### Login as shaun

### scp your keys over
```bash
mkdir .ssh
mv authorized_keys .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
```

### Install some required packages first

```bash
sudo apt update
sudo apt install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common
```

### Get the Docker signing key for packages
`curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -`

- most instances use 'arch=amd64'
- rasbian uses 'arch=armhf'

```bash
echo "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list
```

### Install Docker

#### The aufs package, part of the "recommended" packages, won't install on Buster just yet, because of missing pre-compiled kernel modules.

#### We can work around that issue by using "--no-install-recommends"

```bash
sudo apt update
sudo apt install -y --no-install-recommends \
    docker-ce \
    cgroupfs-mount
```

`sudo systemctl enable docker`
`sudo systemctl start docker`

### make yourself a member of the docker group

### logout

### login

### Install required packages

```bash
sudo apt update && \
  sudo apt install -y python python-pip libffi-dev python-backports.ssl-match-hostname
```

### Install Docker Compose from pip
#### This might take a while

`sudo pip install docker-compose`

### Slave Node
#### Join the swarm


### Master Node
#### Initialize the swarm
`docker swarm init --advertise-addr <IP>:<PORT>`

## References
- https://github.com/vegasbrianc/prometheus
- https://github.com/RiFi2k/dockerize-your-dev
- https://thenewstack.io/how-firecracker-is-going-to-set-modern-infrastructure-on-fire/
- https://docs.gluster.org/en/latest/Install-Guide/Install/
- http://cowlet.org/2018/05/21/accessing-gpus-from-a-docker-swarm-service.html
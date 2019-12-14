## TODO - setup ansible

### Cheaty little function until we do Ansible

```bash
FRIENDS=(blaze kolvicy godberry poseidon hades)

function friend {
  for friend in ${FRIENDS[@]}; do
    echo "Chatting with: $friend, about $1"
    ssh -tq $friend "$1"
  done
  echo "Chatting with: $(hostname), about $1"
  $1
}

alias src='cd /media/source'
```


## Debian Buster steps

text net-install with SSH and system tools only

### Manual host machine preparation steps

- SSH to a brand new debian buster host
- update repo cache
- install basic tools
- add user to sudoers
- copy authorized keys
- install docker
- join the swarm
- configure shared storage

## Prepare host environment

### set permissions and install tools

`apt update && apt install -y git sudo net-tools`

#### add yourself to sudo

```bash
# visudo
shaun         ALL=(ALL) NOPASSWD:ALL
```

Grab the host IP and logout from root

```bash
ifconfig    # Get the new IP
exit
```

#### scp your keys over

SCP over the public SSH key to the new host

```bash
ssh -tq <new_host> "mkdir .ssh"
scp ~/.ssh/authorized_keys <new_host>:~/.ssh/`
```
### Configure SSH keys
`scp ~/.ssh/authorized_keys <new_host>:~/.ssh`

```bash
mkdir -p ~/.ssh
chmod 600 .ssh/authorized_keys
```

### Set the timezone (not required for official images)

`sudo ln -s /usr/share/zoneinfo/America/Vancouver /etc/localtime`

## Install Docker

### Configure dependencies

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

#### The aufs package, part of the "recommended" packages, won't install on Buster just yet, because of missing pre-compiled kernel modules.

#### We can work around that issue by using "--no-install-recommends"

```bash
sudo apt update
sudo apt install -y --no-install-recommends \
    docker-ce \
    cgroupfs-mount
```

#### Start it up

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

### Install Docker Compose from pip
#### This might take a while

```bash
sudo apt update && \
  sudo apt install -y python python-pip libffi-dev python-backports.ssl-match-hostname && \
  sudo pip install docker-compose
```

### make yourself a member of the docker group

```bash
sudo sed -i.bak '/docker/d' /etc/group
echo "docker:x:998:shaun" | sudo tee -a /etc/group
```

### logout, then log back in

## Shared filesystem

create some network file shares somewhere; we will use a samba-server host in this example

#### Network shares - example
```
\\poseidon\certs
\\poseidon\docker
\\poseidon\monitoring
\\poseidon\registry
\\poseidon\source
```

#### mount desired shares across the desired worker and manager nodes

`sudo apt install cifs-utils`

```bash
# it is lazy security, to mount everything everywhere
sudo mkdir \
  /media/certs \
  /media/docker \
  /media/monitoring \
  /media/registry \
  /media/source \
  /media/Completed \
  /media/Shared \
  /media/temp
```

```bash
sudo sed -i.bak '/poseidon/d' /etc/hosts
echo "10.2.5.22 poseidon" | sudo tee -a /etc/hosts
```

```bash
#sudo sed -i.bak '/certs/d' /etc/fstab
#sudo sed -i.bak '/Completed/d' /etc/fstab

#//poseidon/techfusion/certs /media/certs cifs uid=0,username=guest,password="",iocharset=utf8,vers=3.0,noperm 0 0
#//poseidon/Completed /media/Completed cifs uid=0,credentials=/home/shaun/.smb,uid=root,gid=root 0 0
#//poseidon/Completed /media/Completed cifs username=Guest,password=""   0       0
#//poseidon/Completed /media/Completed cifs guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0

# Clear out existing entries
sudo sed -i.bak '/shared/d' /etc/fstab
sudo sed -i.bak '/poseidon/d' /etc/fstab

# Update fstab
echo " \
# Local shared filesystem (poseidon)
//poseidon/techfusion/certs /media/certs  cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/techfusion/docker  /media/docker cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/techfusion/monitoring  /media/monitoring cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/techfusion/registry  /media/registry cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/techfusion/source  /media/source cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/Completed  /media/Completed  cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/Shared  /media/Shared  cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
//poseidon/temp  /media/temp  cifs  guest,username=Guest,iocharset=utf8,uid=shaun,gid=docker   0 0
" | \
sudo tee -a /etc/fstab

# Automount like a boss
sudo apt install cifs-utils
sudo umount -a
sudo mount -a
```

`friend "echo \"*  *    * * *   root    mount -a\" | sudo tee -a /etc/crontab"`

## Vbox tools

### Install build tools and kernel headers

`sudo apt install build-essential linux-headers-$(uname -r) pkg-config`

### Mount the guest additions ISO from VirtualBox console (VirtualBox only)

Then mount the `cdrom` and install the tools

```bash
sudo su -
mkdir /mnt/cdrom
mount /dev/cdrom /mnt/cdrom
/mnt/cdrom/VBoxLinuxAdditions.run
eject /dev/cdrom
reboot
```

## Configure Docker swarm
### Slave Node
#### Join the swarm

from a `manager` node, run on of the following:

```bash
docker swarm join-token worker
docker swarm join-token manager
```

### Master Node
#### Initialize the swarm
`docker swarm init --advertise-addr <IP>:<PORT>`

### Color prompt

ninja the `.bashrc` on debian, to uncomment `force_color_prompt=yes`

do this in `/etc/skel` to apply for newly created users


### fake DNS

10.2.5.201      haze monitoring.techfusion.ca registry.techfusion.ca
10.2.5.205      godberry-1
10.2.5.122      poseidon-1
10.2.5.22       poseidon

10.2.5.129      kolvicy-1
10.2.5.175      blaze
10.2.5.167      hades-1
10.2.5.61       kush
10.2.5.43       sativa


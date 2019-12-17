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

text-based net-install with SSH and system tools only

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

### Configure SSH keys

SCP over the public SSH key to the new host

```bash
ssh -tq <new_host> "mkdir .ssh"
scp ~/.ssh/authorized_keys <new_host>:~/.ssh/`
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

## Shell customizations

Enable banners and color outputs

`sudo apt install -y figlet lolcat`

Based on what was mounted in the previous step, add something like this to your local `.bashrc`

`source /media/source/techfusion.ca/ansible/.bashrc`

This will enable you to control the swarm host shell defaults from a single place.

do this in `/etc/skel` to automatically apply for newly created users

```bash
sed -i.bak '/media/d' ~/.bashrc && \
echo "source /media/source/techfusion.ca/ansible/.bashrc"  >> ~/.bashrc
```

## Fake DNS

### Wipe existing manual entries (optional)

For example, to wipe all the `10.2.5.x` IP addresses, use:

`sudo sed -i.bak '/10.2.5/d' /etc/hosts`

### Create a global hosts file (optional - only for lazy / temporary DNS)

Modify the provided `hosts` file and add in a list of hosts with a unique comment, so that `sed` can hook into it for easy updates later

```bash
cat "
10.2.5.22       poseidon                  # techfusion managed
10.2.5.201      monitoring.techfusion.ca  # techfusion managed
10.2.5.201      registry.techfusion.ca    # techfusion managed
" > /media/source/hosts
```

### Push the changes

```text
sudo sed -i.bak '/10.2.5/d' /etc/hosts && \
sudo sed -i.bak '/poseidon/d' /etc/hosts && \
sudo sed -i.bak '/techfusion/d' /etc/hosts && \
cat /media/source/techfusion.ca/ansible/hosts | sudo tee -a /etc/hosts && \
cat -s /etc/hosts | sudo tee /etc/hosts
```

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
sudo sed -i.bak '/techfusion/d' /etc/fstab && \
sudo sed -i.bak '/poseidon/d' /etc/fstab && \
cat -s /etc/fstab | sort | uniq | sudo tee /etc/fstab && \
cat /media/source/techfusion.ca/ansible/fstab | sudo tee -a /etc/fstab
```

```bash
# Automount like a boss
sudo umount -a
sudo mount -a
```

`friend "echo \"*  *    * * *   root    mount -a\" | sudo tee -a /etc/crontab"`

## VirtualBox Guest Addtitions (OPTIONAL)

If you are doing this in a VirtualBox guest only

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

## NVIDIA Swarm hosts configuration

follow the NVIDIA build doc: ./nvidia-docker/README.md



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


## Troubleshooting

### Emergency shell

 ```bash
 # notice how this is not alpine linux
 docker pull debian:buster-slim
 docker run --name shit_test --rm -i -t debian:buster-slim bash
 ```

### Restoring BASH Debian defaults

```bash
cat /dev/null > ~/.bashrc && \
cp /etc/skel/.bashrc ~ && \
echo "source /media/source/techfusion.ca/ansible/.bashrc"  >> ~/.bashrc
```
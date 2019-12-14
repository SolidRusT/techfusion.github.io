## TODO - setup ansible

### Cheaty little function until we do Ansible

```bash
function friend {
  FRIENDS=(blaze kolvicy godberry poseidon hades)
  for friend in ${FRIENDS[@]}; do
    echo "Chatting with: $friend, about $1"
    ssh -tq $friend "$1"
  done
  echo "Chatting with: $(hostname), about $1"
  $1
}
```

### Configure SSH keys

```bash
mkdir -p ~/.ssh
scp /home/shaun/.ssh/authorized_keys $friend:~/.ssh
chmod 600 .ssh/authorized_keys
```

### Set the timezone

`sudo ln -s /usr/share/zoneinfo/America/Vancouver /etc/localtime`

### Configure application storage
```bash
sudo mkdir -p /mnt/registry
sudo mkdir -p /mnt/redis
sudo apt -y install samba-client
```

```bash
sudo mkdir -p /home/docker && \
sudo mv registry.* /home/docker && \
sudo chown root:docker -R /home/docker
```

### IP of 'gateway' service
#### /etc/hosts
```bash
sudo sed -i.bak '/registry/d' /etc/hosts
echo "10.2.5.201 haze registry.techfusion.ca" | sudo tee -a /etc/hosts
# echo \"10.2.5.201 haze registry.techfusion.ca\" | sudo tee -a /etc/hosts
```

`scp haze:~/techfusion.ca/registry/certs/registry.* .`



## Vbox tools

### Install build tools and kernel headers

`sudo apt install build-essential linux-headers-$(uname -r) pkg-config`

### mount the guest additions ISO from VirtualBox console

mount the virtual cdrom and copy contents to your home

```bash
mkdir /mnt/cdrom
sudo mount /dev/cdrom /mnt/cdrom
cp -R /mnt/cdrom ~/vbox-additions
```

### Color prompt

ninja the `.bashrc` on debian, to uncomment `force_color_prompt=yes`

do this in `/etc/skel` to apply for newly created users


## Troubleshooting

Read the helpful ouput, like the below example

```
irtualBox Guest Additions: To build modules for other installed kernels, run
VirtualBox Guest Additions:   /sbin/rcvboxadd quicksetup <version>
VirtualBox Guest Additions: or
VirtualBox Guest Additions:   /sbin/rcvboxadd quicksetup all
VirtualBox Guest Additions: Kernel headers not found for target kernel
4.19.0-6-amd64. Please install them and execute
  /sbin/rcvboxadd setup
VirtualBox Guest Additions: Running kernel modules will not be replaced until
the system is restarted
```

### Shared filesystem

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
  /media/Completed
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
#//poseidon/Completed /media/Completed cifs guest,username=Guest,iocharset=utf8   0 0

# /ect/fstab:
echo " \
# local shared filesystem
//poseidon/techfusion/certs /media/certs  cifs  guest,username=Guest,iocharset=utf8   0 0
//poseidon/techfusion/docker  /media/docker cifs  guest,username=Guest,iocharset=utf8   0 0
//poseidon/techfusion/monitoring  /media/monitoring cifs  guest,username=Guest,iocharset=utf8   0 0
//poseidon/techfusion/registry  /media/registry cifs  guest,username=Guest,iocharset=utf8   0 0
//poseidon/techfusion/source  /media/source cifs  guest,username=Guest,iocharset=utf8   0 0
//poseidon/Completed  /media/Completed  cifs  guest,username=Guest,iocharset=utf8   0 0
" | \
sudo tee -a /etc/fstab
```

`sudo mount -a`
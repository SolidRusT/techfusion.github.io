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




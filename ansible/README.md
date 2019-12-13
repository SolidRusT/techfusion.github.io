## TODO - setup ansible

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

sudo mkdir -p /mnt/registry
sudo apt -y install samba-client

# /etc/hosts # IP of 'gateway' service
```bash
sudo sed -i.bak '/registry/d' /etc/hosts
echo "10.2.5.201 haze registry.techfusion.ca" | sudo tee -a /etc/hosts
# echo \"10.2.5.201 haze registry.techfusion.ca\" | sudo tee -a /etc/hosts
```

`scp haze:~/techfusion.ca/registry/certs/registry.* .`

```bash
sudo mkdir -p /home/docker && \
sudo mv registry.* /home/docker && \
sudo chown root:docker -R /home/docker
```


# Debian Buster GPU Docker Host configuration

## Installing Docker

Debian minimal install with SSH and system tools
```
Login as root
```
### Refresh repo cache and install some tools
apt update && apt install git sudo net-tools

### add yourself to sudo
```
visudo      # shaun         ALL=(ALL) NOPASSWD:ALL
exit
```

```
Login as a user
```

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
```

## Slave Node

### Join the swarm
```
#docker swarm join --token SWMTKN-1-5nlp0hlpkg339r28gawpratr71nhhcirdh0dhuzcg2iqv7e0v1-byacri2ts9b1l8do1i1l3lras 10.2.5.201:2377
docker swarm join --token SWMTKN-1-5nlp0hlpkg339r28gawpratr71nhhcirdh0dhuzcg2iqv7e0v1-4607kovldin749eyuswqnhgy7 10.2.5.167:2377
```

## Master Node

### Initialize the swarm
`docker swarm init`

#### References
- https://github.com/vegasbrianc/prometheus
- https://github.com/RiFi2k/dockerize-your-dev


## Installing NVIDIA support for Docker

### Install some packages

```bash
sudo dpkg --add-architecture i386
sudo apt-get update && sudo apt-get dist-upgrade
sudo apt install build-essential libc6:i386 git wget curl net-tools
```

### generate link from http://www.nvidia.com/Download/index.aspx

`wget http://us.download.nvidia.com/XFree86/Linux-x86_64/440.44/NVIDIA-Linux-x86_64-440.44.run`

### Disable the nouveu driver and reboot

```bash
sudo bash -c "echo blacklist nouveau > /etc/modprobe.d/blacklist-nvidia-nouveau.conf"
sudo bash -c "echo options nouveau modeset=0 >> /etc/modprobe.d/blacklist-nvidia-nouveau.conf"
sudo update-initramfs -u
sudo reboot
```

### Shutdown running X servers by changing to console mode
```
sudo telinit 3
```
### Running the installer script

Install the currently running kernel's headers

`sudo apt install linux-headers-$(uname -r)`

### install the core X server, for GPU clock and power management

`sudo apt install pkg-config xorg libgtk-3-0`

#### Install for systems with Secure Boot disabled in UEFI BIOS, or if not using UEFI
```
sudo bash NVIDIA-Linux-x86_64-440.44.run
```
Choose "No" for signing the kernel module

#### Install for systems with Secure Boot enabled in UEFI BIOS.
```
sudo bash NVIDIA-Linux-x86_64-440.44.run
```
"Continue Installation" -> "Sign the kernel module" -> "Generate a new key pair" -> "No" (don't delete the key

Take note of the cert file name and path, ie: `/usr/share/nvidia/nvidia-modsign-crt-65E0FA91.der`.
press "OK"

Take note of the private key filename and path, ie: `/usr/share/nvidia/nvidia-modsign-key-65E0FA91.key`.
"Install signed kernel module" -> "OK" -> "Install and overwrite existing files" -> "Yes" -> "OK".

##### Import your new public cert to the trusted kernel keystore
```
sudo mokutil --import /usr/share/nvidia/nvidia-modsign-crt-65E0FA91.der
```

##### reboot and when promted by the UEFI BIOS to install the new key, chose "Yes" or "OK".
```
sudo reboot

```

## Testing the NVIDIA installation
### Run the NVIDIA SMI tool to query a list of available GPUs
```
nvidia-smi
```
#### the output should resemble the following:
```
Thu Jan 24 18:59:30 2019
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 415.13       Driver Version: 415.13       CUDA Version: 10.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 00000000:02:00.0 Off |                  N/A |
| 37%   26C    P8     9W / 180W |     40MiB /  8119MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
```

Notice how there is nothing running on X:
```
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+

```

### let's configure some fake screens and start X

### lets make this run on boot
add this to the bottom of your `/etc/rc.local`
```
X :0 &
sleep 10
export DISPLAY=:0

nvidia-smi -pm ENABLED | sed "s/^/  /gi"

exit 0
```
### Make sure it is executable
`sudo chmod +x /etc/rc.local`
### Reboot and test
`sudo reboot`
wait a bit and SSH back in
`nvidia-smi`

```
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0       908      G   /usr/lib/xorg/Xorg                            32MiB |
|    0      1353      G   /usr/bin/gnome-shell                           6MiB |
+-----------------------------------------------------------------------------+
```
this means you have successfully setup the nvidia drivers and have them available to the system

## Install nvidia-docker

### Clone the repo

`git clone https://github.com/NVIDIA/nvidia-docker.git`

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## Test GPU access from inside a container

`docker run --gpus all nvidia/cuda:9.0-base nvidia-smi`

You should see all your GPUs in the SMI output. This is from inside the docker container.

### Compatability update

```bash
echo "deb http://security.debian.org/debian-security stretch/updates main" | sudo tee -a /etc/apt/sources.list.d/old-stable.list
sudo apt update && sudo apt-get install libssl1.0.2 screen linux-headers-$(uname -r)
```


# Setup a registry
## Configure SSL
### Recycle the cert from our NGINX gateway
```bash
mkdir -p certs
sudo cp -r /etc/letsencrypt/archive/monitoring.techfusion.ca certs/
sudo chown shaun:docker -R certs
cp certs/monitoring.techfusion.ca/privkey1.pem certs/registry.key && \
cat certs/monitoring.techfusion.ca/cert1.pem certs/monitoring.techfusion.ca/chain1.pem > certs/registry.crt
```
### distribute the cert and key to each host
`scp haze:~/techfusion.ca/registry/certs/registry.* .`
### Create /home/docker on each host
```bash
sudo mkdir -p /home/docker
sudo mv registry.* /home/docker && \
sudo chown root:docker -R /home/docker
```
### Set a password to the registry
```bash
sudo mkdir -p /mnt/registry
sudo touch /mnt/registry/passfile
sudo chown -R shaun:docker /mnt/registry
```
### Generate the password hash
`docker run --entrypoint htpasswd registry:latest -Bbn techadmin techsite > /mnt/registry/passfile`

scp haze:/mnt/registry/passfile . && sudo mv passfile /mnt/registry/passfile && sudo chown -R root:docker /mnt/registry

## Create the Registry service
### Create on a swarm manager node
```bash
docker service create \
  --name registry \
  --replicas-max-per-node 1 \
  --publish published=5000,target=5000 \
  --mount type=bind,source=/mnt/registry,destination=/var/lib/registry \
  --mount=type=bind,src=/home/docker,dst=/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registry.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/registry.key \
  -e REGISTRY_AUTH=htpasswd \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/var/lib/registry/passfile \
  registry:latest
```

### Change the number of replicas:

```bash
docker service update \
  --replicas 3 \
  registry
```



# TODO

$ mkdir auth
$ docker run \
  --entrypoint htpasswd \
  registry:2 -Bbn testuser testpassword > auth/htpasswd

docker container stop registry

docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v "$(pwd)"/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry:2

docker login registry.techfusion.ca

## TODO - Example using compose
registry:
  restart: always
  image: registry:2
  ports:
    - 5000:5000
  environment:
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - /path/data:/var/lib/registry


### Using the registry

```bash
docker pull debian
docker tag debian registry.techfusion.ca/debian
docker push registry.techfusion.ca/debian
docker image remove debian
```


# S3 Permissions
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "arn:aws:s3:::S3_BUCKET_NAME"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
      ],
      "Resource": "arn:aws:s3:::S3_BUCKET_NAME/*"
    }
  ]
}


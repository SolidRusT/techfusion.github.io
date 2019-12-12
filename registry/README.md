### Setup a registry

From a manager node of the docker swarm:

```bash
docker service create \
  --name registry \
  --replicas-max-per-node 1 \
  --publish published=5000,target=5000 \
  --mount type=bind,source=/mnt/registry,destination=/var/lib/registry \
  --replicas 2 \
  registry:2
```
#  --constraint 'node.labels.registry==true' \

Change the number of replicas:

```bash
docker service update \
  --replicas 2 \
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


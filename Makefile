
imagename = ztests/hello
imageversion = v1
localport = 80
all: clean build

clean:
	rm -rf target

build:
	mkdir target
	cp -r src/nodejs/*.js target/.
	cp -r src/nodejs/*.json target/.
	cp -r src/docker/Dockerfile target/.
	cd target && docker build -t $(imagename):$(imageversion) .

rundocker:
	docker run -d -p $(localport):8080/tcp $(shell docker images $(imagename):$(imageversion) -q)
#imageid = `docker images ztests/hello:v1 -q`
#docker run -p $(localport):8080/tcp `docker images ztests/hello:v1 -q`

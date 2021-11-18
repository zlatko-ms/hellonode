.SILENT: clean dockerbuild rundocker testdocker stopdocker build pause test

imagename = zlatkoa/hellonode
imageversion = main
localport = 80

build: clean dockerbuild
test: rundocker pause testdocker stopdocker
all: build test

clean:
	echo "> removing target directory"
	rm -rf target

dockerbuild:
	echo "> building app docker container"
	mkdir target
	cp -r src/nodejs/*.js target/.
	cp -r src/nodejs/*.json target/.
	cp -r src/docker/Dockerfile target/.
	cd target && docker build -q -t $(imagename):$(imageversion) .
	echo "> docker image $(imagename):$(imageversion) is available in your local repo"

rundocker:
	echo "> starting container from image $(imagename):$(imageversion) in background"
	docker run -d -p $(localport):8080/tcp $(shell docker images $(imagename):$(imageversion) -q)
	$(shell sleep 5)

pause:
# just to give some air to the container to start
	$(shell sleep 10)

testdocker:
	echo "> sending 10 request to running container, reply is the following :"
	echo $(shell curl -s http://localhost/hello)

stopdocker:
	$(eval TMPID := $(shell docker ps -l -q))
	echo "> stopping last started docker container" $(TMPID)
	docker rm -f $(TMPID)


# HelloNode

This is a simple nodejs/express application that I use as baseline for testing various Azure cloud infrastructures.

I ended up by storing it on github in order to be able to fetch it from any (connected) environnement.

The app is trivial and aims to provide : 

- a simple HTTP responder with a logger facility, mainly intended for testing the LB infra
- a bouncing HTTP responder, it calls the github api before returning the response, mainly intenfed for testing security issues (public exposition and round trip to SaaS services)

It is very easy to extend/override the code in order to mock or test any backend side deployement.

## Invoking the App

### Simple HTTP responder

The app responds to an HTTP GET on the /hello URI via a json payload that contains : 
* the id and number of the app ( handy for __clustering__ tests)
* the source ip of the request ( handy for __NAT-ing and LB__ testing)
* the response date and id ( in order to change the response payloads when bursting the requests )

### Bouncing HTTP responder

The app responds to an HTTP GET on the /github/repos?username=**github_username** and will return the repos for the given github user.

## Docker

The docker image is available on the [Docker hub](https://hub.docker.com/repository/docker/zlatkoa/hellonode )





# HelloNode

This is a simple nodejs/express application that I use as baseline for testing various Azure cloud infrastructures.

I ended up by storing it on github in order to be able to fetch it from any (connected) environnement.

The app is trivial and aims to provide a simple HTTP responder with a logger facility.

It is very easy to extend/override the code in order to mock or test any backend side deployement.

The Makefile is here to simplify the app dockerization process.

## Invoking the App

The app responds to an HTTP GET on the /hello URI via a json payload that contains : 
* the id and number of the app ( handy for __clustering__ tests)
* the source ip of the request ( handy for __NAT-ing and LB__ testing)
* the response date and id ( in order to change the response payloads when bursting the requests )

## Usage

You'll need the GNU make and a bash shell to play with the makefile.

If you are on Windows, I'd advise using the WSL ;).

To build the container issue the following command : 

```bash 
make build
```
To test your container issue the following command : 

```bash 
make test
```

And to do a full pass with build & tests simply issue : 
```bash 
make all
```





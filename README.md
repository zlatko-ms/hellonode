# HelloNode

This is a simple nodejs/express application that I use as baseline for testing various Azure cloud infrastructures.

The app provides a simple HTTP GET handler and embeds a logger.

The Makefile is here to simplify the app dockerization process.

## Usage

Make sure that you use Linux (or WSL on windows) when invoking the make process.

To build the container issue the following : 

```bash 
make build
```
To test your container issue the follwing command : 

```bash 
make test
```

And to do a full pass with build & tests simply issue : 
```bash 
make all
```





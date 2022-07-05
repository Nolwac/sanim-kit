# Welcome to Sanim-Kit Contributing Guide
First, I appreciated you for thinking of contributing to this project.
As you must have known, this project is a tool for scientific simulation and animation on the web. It's meant to be lightweight and easy to get started with.
This means that contributions should not involve an external library except if absolutely neccessary.

## Setting up project development environment
To start contributing, you will first need to *fork* the project to your own account. Then clone the fork to your machine.
Once the project is on your machine, you don't need to do anything else to get started making your contributions as the project currently does not use any external library.
### Contributing to the documentation
If you wish to contribute to the documentation, then you need to checkout to *website* branch of the project. On that branch, navigate to the directory *website* and run `npm install` to install the documentation project dependencies. Once that is done, you can start contributing and be able to visualize the changes locally by running `npm run start` on the same *website* directory.

## Changes that will be strongly appreciated.
 * Currently the project does not includes tests, and we know the benefits of tests in development and production. Such contribution will be strongly appreciated.
 * Typescript incorperation. If you can incorperate Typescript into the project and create type interfaces for the project, it will be strongly appreciated.
 * Optimize Algorithms and simulation frames rendering method. The flow used for rendering animations on the project is not well optimized as it doesn't perform too well on very deep iterations and recursions. Your contributions on this will be strongly appreciated. 

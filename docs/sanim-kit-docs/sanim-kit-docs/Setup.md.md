# Setup Sanim-kit and run your first animation in seconds.

## INSTALLATION

### 1. Using npm

With your data connection ON simply type the  command.

```shell
npm install --save sanim-kit
```

Note: to install globally, use;

```shell
npm install --global sanim-kit
```

### 2. Using CDN
You can use the CDN version of sanim-kit by simply copying the below script ta g to the head of your HTML web document.

### 3. Using the source file locally
You can download the source file from sanim-kit website and link to it as you would do with your other JavaScript files.
[show how it is done]

## RUN YOUR FIRST ANIMATION

### 1. With NPM
Initialize your npm project in a new  folder.

```shell
npm init

npm install --save sanim-kit.
```

Create  your index.js and your index.html files inside your project folder.

Link your index.js file to your index.htnl file by putting the below script tag at the head of your index.html file.

Inside your index.js file write the following lines of code:

```javascript
import Sanim from "sanim-kit";

 [
Put whatever code that needs to be run here.
Sanim.makeFun("Your Name");
]
```

Using your favourite task runner(e.g parcel, webpack, e.t.c) run the example animation.

Example with parcel:
In the project directory run the following command on your command line interface.

```shell
npm install parcel
parcel index.html
```
### 2. Using CDN or source files

Create your project folder and, give it any name of your choice.

Create your Javascript file (index.js).

Create your HTML file ( index.html). 

Link your javascript file to the HTML file. In the example example you will have to copy the below script tag and put it below the Sanim kit tag script tag as shown below

[Show the way it should be linked]

Next copy the below code snippet to your Javascript file (index.js).

Then use your favourite browser to open your HTML file (index.html in this case)
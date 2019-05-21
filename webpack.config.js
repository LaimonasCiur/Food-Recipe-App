const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//in the webpack there are 4 core concepts: entry point, the output, loaders and plugins.
//we will do a simple config:
module.exports = {
    entry: ['babel-polyfill', //adding entry point for polyfill. And Webpack will automatically figure out where this code is located and will then bundle ir together with this code that we have below. We have one huge bundle, which has both all the polyfills for ES6 code as well as our own code in index.js
    './src/js/index.js'], //where webpack will start the budling. it is the file where it will start looking for all the dependencies which it should bundle together;
    //in here we can specify one or more entry files;
    output: { //defining the output property which will tell webpack exactly where to save our bundle file. So we specify the output property and now in here we pass an object; And in this object we put the path to the folder and then file name;
        path: path.resolve(__dirname, 'dist'), //this needs to be an absolute path here. And in order to have access to that absolute path we need to use a build in node package. We use a method which is in the path package and we use the dirname variable that node gives us access to. So this dirname variable is the current absolute path. And so we use path resolve to now join this current path so that working directory with the one what we want our bundle to be in which is dist
        filename: 'bundle.js' 
    },
    //in webpack we have something called 'production' and 'development' mode. development mode simply builds our bundler without minifying our code in order to be fast as possible. But the production mode will automatically enable all kinds of optimization in order to reduce the final bundle size. 

    ////mode: 'development' //so not it will be as fast as possible and not compress or cut because that is not necessary during develpment;

    //to test this out we need to create a new JS file. Now we have index.js which is our entry point, lets say we want to include a new module in here so that we can actually test if the other module is included so if they are bundled together;
    //once we are ready, then we want to set it back to production,  but its not perfect having to come back to this configuratipn file here in order to change this. so we can move it here out of the config and into our npm script. 
    devServer: { //in order to configure this dev server 
        contentBase: 'dist' //specify a folder from which webpack should serve our files and in this case that is distribution folder and that is because this is here the code that we are going to ship to the client. So our app, all of the final code of that app is inside of this distribution folder. SO we will always have an index file with the html then the JS, image and CSS. Src folder here is only for our development purposes so all our soure code basically goes here which then gets compiled or bundled into this distrubution folder as bundle.js and so what we really want to serve is only what is in this dist folder. 
        //devServer simulates a real environment with a real http server. We dont need to reload anything it does it automatically injected into index.html
        //we can actually even delete this bundle.js and it will still keep working. 
    },
    //also we want to copy src/js/index.html file into out dist folder. We want to do is to copy src/index.html file automatically inside of the dist folder and then inject the script tag into it automatically and webpack allows us to do that. In order to do that we use plugins
    //plug-ins allow us to do complex processing of our input files, and in this case of our index.html file, so want to use a plug-in called html webpack plug-in and we have to require this package.
    plugins: [ //receives an array of all the plugins that we are using.
        new HtmlWebpackPlugin({ //this is like function costructorm, like a new class. And then in here we pass a couple of options using an object. This is very common pattern in modern JS is to always pass options using an object like this. 
            //What we must to do? So we want to copy each time that we are bundling our JS files and we also want to copy our source html into the dist folder and include the script to our JS bundle
            //so this out src and this index here will then be our final and ready to go to production html file. We specift the file name
            filename: 'index.html',
            //here we use the template which is our starting html file and this one is located at src
            template: './src/index.html'
            //now we can also use plug-in to actually create a new html file from scratch automatically without providing any template.
            //and it works, we have our app, because webpack already copied index.html file from src folder to dist folder. And it's not really visible right now because it's not saving this data on the disk. So when we are using the dev server it will not save the files on disk, it will simply 'stream' them to the server
            //now if you wanted actually see these files here on disk we have to run dev or build commands. These wil do the bundeling and save it on disk. 
        }) 
    ], //loaders in Webpack allow us to import or to load all kinds of different files. And more importantly to also process them. Like converting SASS to CSS code or ES6 code to ES5 JS. So for that we need a Bable loader.
    module: { //we use module, pass an object and then in there, we need to specify the rules property, and rules then receives an array of all of the loader that we want to use and for each loader we need an object; For each loader we need test property. For this we use something called regular expression /ssss/ two slashes;
        rules: [
            {
                test: /\.js$/,//here we want to say is that we want to test all JS files and if it JS file than it will apply the babel loader;
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader' 
                    //this is step 1. Step 2 is that we also need a babel config file. '.babelrc'
                }
            }
        ]
    }

};

 
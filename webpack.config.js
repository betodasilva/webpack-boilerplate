const path = require('path'),
      HTMLPlugin = require('html-webpack-plugin'),
      CSSPlugin = require('mini-css-extract-plugin'),
      glob = require('glob');

const entry = glob.sync("./src/components/**/*.js")
    .reduce((x, y) => Object.assign(x, {
        [y.split("").slice(5, y.length+1).join("")]: y,
    }), {});


console.log( entry );
module.exports = {
    entry,
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
				test: /\.scss$/,
				use: [
					CSSPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			}
        ]
    },
    plugins: Object.keys(entry).map( entry => {
        let name = entry.split("/")[2];
        let path = entry.split("/").slice(1, entry.split("/").length - 1 ).join("/");
        return new HTMLPlugin({
            template: `!!html-webpack-plugin/lib/loader.js!./src/${path}/${name}.html`,
            inject: true,
            chunks: [entry],
            filename: `${path}/${[name]}.html`
        })
            
    } ).concat([
        new CSSPlugin({
            filename: "[name].scss",
            chunkFilename: "[name].scss"
        })
    ])
        
    
    
}
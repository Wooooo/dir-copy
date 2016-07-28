const
    readline    = require('readline'),
    path        = require('path'),
    fs          = require('fs'),
    walk        = require('walk'),
    rename      = require('rename'),
    copydir     = require('copy-dir');

var rl = readline.createInterface(process.stdin, process.stdout);

var dest, src;

rl.prompt();

//dest = '/Users/gimtaeu/WebstormProjects/file/test/a';
//src = '/Users/gimtaeu/WebstormProjects/file/test/b';

//move(dest,src);
function move(src, dest) {

    copydir.sync(src, dest, function(stat, filepath, filename) {
        var extname = path.extname(filename);

        if( stat === 'file' && ['.cpp', '.java', '.in', '.out', '.vcxproj'].indexOf(extname) === -1 ) {
            return false;
        }

        return true;
    }, function(err) {
        if(err) console.error(err);
        else console.log('ok');
    });


    var walker = walk.walk(dest);

    walker.on('directory', (root, fileStats, next) => {
        var dirname = fileStats.name;

        var q = dirname.split(' ')[0];

        q *= 1;

        if( !isNaN(q) ) {
            console.log(path.join(root, q+''));
            fs.rename(path.join(root, fileStats.name), path.join(root, q+''));
        }

        next();
    })
}

rl.on('line', (line) => {
    if( src === undefined ) {
        src = path.normalize(line);
    }
    else {
        dest = path.normalize(line);
        rl.close();

        move(src, dest);
    }

});
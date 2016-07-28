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

dest = '/Users/gimtaeu/WebstormProjects/file/test/a';
src = '/Users/gimtaeu/WebstormProjects/file/test/b';

//move(dest,src);
function move(src, dest) {

    copydir.sync(src, dest, function(stat, filepath, filename) {
        var extname = path.extname(filename);

        if( stat === 'file' && ['.cpp', '.java', '.in', '.out'].indexOf(extname) === -1 ) {
            return false;
        }

        return true;
    }, function(err) {
        if(err) console.error(err);
        else console.log('ok');
    });


    var walker = walk.walk(dest);

    walker.on('file', (root, fileStats, next) => {
        var extname = path.extname(fileStats.name);
        var filename = path.basename(fileStats.name, extname);

        if( extname === '.cpp' ) {
            fs.rename(path.join(root, fileStats.name), path.join(root, filename.split(' ')[0]+extname));
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
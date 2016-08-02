var child = require('child_process').spawn;

loop();

function loop() {
    var proc = child('node', ['src/Main.js']);

    console.log('\n\n\n');

    proc.stdout.on('data', (data) => {
        if(data != null)
        console.log(data.toString('utf8'));
    });
    
    proc.on('close', (code) => {
        console.log('Pulling changes from git');
        
        var git = child('git', ['pull']);

        console.log('\n\n\n');

        git.stdout.on('data', (data) => {
            if(data != null)
            console.log(data.toString('utf8'));
        });

        git.on('close', (code) => {
            loop();
        });
    });
}
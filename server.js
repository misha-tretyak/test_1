const net = require('net');
const crypto = require('crypto');
const password = 'PasswordForGenerateKey';
const algorithm = 'aes-192-cbc';
const key = crypto.scryptSync(password, 'salt', 24);
const cipher = crypto.createCipher(algorithm, key);
const decipher = crypto.createDecipher(algorithm, key);

net.createServer( socket => {

    let encrypted = '';
    cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
            encrypted += chunk.toString('hex');
        }
    });

    cipher.on('end', () => {
        socket.write(encrypted);
    });
    cipher.write('This is message from server!');
    cipher.end();

    socket.on('data', data => {
        let decrypted = '';
        decipher.on('readable', () => {
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });
        decipher.on('end', () => {
            console.log(decrypted);
        });
        const text = data.toString('utf8');
        decipher.write(text, 'hex');
        decipher.end();
    });
}).listen(3000);
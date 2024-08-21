function runLengthEncode(input) {
    let compressed = '';
    let count = 1;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            compressed += input[i] + (count > 1 ? count : '');
            count = 1;
        }
    }

    return compressed;
}

function runLengthDecode(input) {
    let decompressed = '';
    let count = '';

    for (let i = 0; i < input.length; i++) {
        if (isNaN(input[i])) {
            decompressed += input[i].repeat(count ? parseInt(count) : 1);
            count = '';
        } else {
            count += input[i];
        }
    }

    return decompressed;
}

function encodeBase64(input) {
    const compressed = runLengthEncode(input);
    return Buffer.from(compressed).toString('base64');
}

function decodeBase64(encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    return runLengthDecode(decoded);
}

module.exports = {
    encodeBase64,
    decodeBase64,
};

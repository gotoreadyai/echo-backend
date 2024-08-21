function RLE_compressString(input) {
    let compressed = '';
    let count = 1;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            compressed += input[i] + count;
            count = 1;
        }
    }

    return compressed;
}

function RLE_decompressString(input) {
    let decompressed = '';
    
    for (let i = 0; i < input.length; i += 2) {
        let char = input[i];
        let count = parseInt(input[i + 1]);

        decompressed += char.repeat(count);
    }

    return decompressed;
}
module.exports = {
    RLE_compressString,
    RLE_decompressString
};
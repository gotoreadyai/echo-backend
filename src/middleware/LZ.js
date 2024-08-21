const  LZ_compressString = (input) => {
    let compressed = '';
    let i = 0;

    while (i < input.length) {
        let matchLength = 0;
        let matchDistance = 0;

        for (let j = Math.max(0, i - 255); j < i; j++) {
            let length = 0;

            while (input[j + length] === input[i + length] && length < 255) {
                length++;
            }

            if (length > matchLength) {
                matchLength = length;
                matchDistance = i - j;
            }
        }

        if (matchLength > 2) {
            compressed += `(${matchDistance},${matchLength})`;
            i += matchLength;
        } else {
            compressed += input[i];
            i++;
        }
    }

    return compressed;
}

const LZ_decompressString = (input) => {
    let decompressed = '';
    let i = 0;

    while (i < input.length) {
        if (input[i] === '(') {
            i++;
            let commaIndex = input.indexOf(',', i);
            let closeBracketIndex = input.indexOf(')', i);

            let matchDistance = parseInt(input.slice(i, commaIndex));
            let matchLength = parseInt(input.slice(commaIndex + 1, closeBracketIndex));

            let start = decompressed.length - matchDistance;
            let end = start + matchLength;

            decompressed += decompressed.slice(start, end);

            i = closeBracketIndex + 1;
        } else {
            decompressed += input[i];
            i++;
        }
    }

    return decompressed;
}
module.exports = {
    LZ_compressString,
    LZ_decompressString
};
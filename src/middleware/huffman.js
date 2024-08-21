class HuffmanNode {
    constructor(character, frequency) {
        this.character = character;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

function buildFrequencyTable(input) {
    const frequencyTable = {};
    for (const char of input) {
        if (!frequencyTable[char]) {
            frequencyTable[char] = 0;
        }
        frequencyTable[char]++;
    }
    return frequencyTable;
}

function buildHuffmanTree(frequencyTable) {
    const nodes = Object.keys(frequencyTable).map(
        char => new HuffmanNode(char, frequencyTable[char])
    );

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.frequency - b.frequency);
        const left = nodes.shift();
        const right = nodes.shift();

        const newNode = new HuffmanNode(null, left.frequency + right.frequency);
        newNode.left = left;
        newNode.right = right;
        nodes.push(newNode);
    }

    return nodes[0];
}

function generateHuffmanCodes(node, code = '', codes = {}) {
    if (node.character) {
        codes[node.character] = code;
    } else {
        generateHuffmanCodes(node.left, code + '0', codes);
        generateHuffmanCodes(node.right, code + '1', codes);
    }
    return codes;
}

function compressString(input) {
    const frequencyTable = buildFrequencyTable(input);
    const huffmanTree = buildHuffmanTree(frequencyTable);
    const huffmanCodes = generateHuffmanCodes(huffmanTree);

    let compressed = '';
    for (const char of input) {
        compressed += huffmanCodes[char];
    }

    return { compressed, huffmanCodes, huffmanTree };
}

function decompressString(compressed, huffmanTree) {
    let node = huffmanTree;
    let decompressed = '';

    for (const bit of compressed) {
        node = bit === '0' ? node.left : node.right;

        if (node.character) {
            decompressed += node.character;
            node = huffmanTree;
        }
    }

    return decompressed;
}

module.exports = {
    compressString,
    decompressString,
};

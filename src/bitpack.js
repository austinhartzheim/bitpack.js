function BitPack(data) {
    this.data = data || "";
}

BitPack.prototype.byteAt = function(index) {
    if (index >= this.len())
        throw new RangeError();
    return this.data.charCodeAt(index) & 0xff;
};

BitPack.prototype.bitAt = function(index, bitIndex) {
    if (bitIndex == undefined) {
        bitIndex = index % 8;
        index = Math.floor(index / 8);
    }

    if (this.byteAt(index) & (0x80 >> bitIndex)) {
        return true;
    }

    return false;
};

BitPack.prototype.len = function() {
    return this.data.length;
};

BitPack.prototype.or = function(pack, index) {
    index = index | 0;

    // oring with an empty pack should always return true.
    if (pack.len() == 0) {
        return true;
    }

    // if this check reads past the end of our data, return false
    if (index + pack.len() > this.len()) {
        return false;
    }

    
    for (var i = 0; i < pack.len(); i++) {
        if (this.byteAt(index + i) | pack.byteAt(i)) {
            return true;
        }
    }
    return false;
};

BitPack.prototype.and = function(pack, index) {
    index = index | 0;

    // anding with an empty pack should always return true.
    if (pack.len() == 0) {
        return true;
    }

    // if this check reads past the end of our data, return false
    if (index + pack.len() > this.len()) {
        return false;
    }
    
    for (var i = 0; i < pack.len(); i++) {
        if (this.byteAt(index + i) != pack.byteAt(i)) {
            return false;
        }
    }
    return true;
};

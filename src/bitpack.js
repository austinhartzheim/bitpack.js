function BitPack(data) {
    this.data = data;
}

BitPack.prototype.byteAt = function(index) {
    return this.data.charAt(index) & 0xff;
};

BitPack.prototype.len = function() {
    return this.data.length;
};

BitPack.prototype.or = function(pack, index) {
    index = index | 0;
    for (var i = 0; i < pack.len(); i++) {
        if (this.byteAt(index + i) | pack.byteAt(i)) {
            return true;
        }
    }
    return false;
};

BitPack.prototype.and = function(pack, index) {
    index = index | 0;
    for (var i = 0; i < pack.len(); i++) {
        if (!(this.byteAt(index + i) & pack.byteAt(i))) {
            return false;
        }
    }
    return true;
};

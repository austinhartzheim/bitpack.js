function BitPack(data) {
    this.data = data || "";
}

BitPack.prototype.byteAt = function(index) {
    if (index >= this.len())
        throw new RangeError();
    return this.data.charCodeAt(index) & 0xff;
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

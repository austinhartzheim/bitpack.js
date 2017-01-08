describe('BitPack.len()', () => {
    it('should return 0 when BitPack was created without data', () => {
        var bp = new BitPack();
        expect(bp.len()).toEqual(0);
    });
    
    it('should return the length of the provided data', () => {
        var bp = new BitPack("");
        expect(bp.len()).toEqual(0);
    });

    it('shold return the length of the initializing string', () => {
        var bp = new BitPack(btoa('1'));
        expect(bp.len()).toEqual(1);

        bp = new BitPack(btoa('12'));
        expect(bp.len()).toEqual(2);

        bp = new BitPack(btoa('123'));
        expect(bp.len()).toEqual(3);
    });
});

describe('BitPack.byteAt()', () => {
    it('should return a numeric byte from a given index', () => {
        var bp = new BitPack(btoa('\x00\x01\x02\x03\xff\xab'));
        expect(bp.byteAt(0)).toBe(0);
        expect(bp.byteAt(1)).toBe(1);
        expect(bp.byteAt(2)).toBe(2);
        expect(bp.byteAt(3)).toBe(3);
        expect(bp.byteAt(4)).toBe(0xff);
        expect(bp.byteAt(5)).toBe(0xab);
    });

    it('should throw an error when the index is past the data bounds', () => {
        var bp = new BitPack(btoa('\x00'));
        var readPastDataBounds = () => {
            bp.byteAt(1);
        };
        expect(readPastDataBounds).toThrowError(RangeError);
    });
});

describe('BitPack.or()', () => {
    it('should return the or of the two bitpacks', () => {
        var bp1 = new BitPack(btoa('\x00\xff\xab'));
        var bp2 = new BitPack(btoa('\x01\x00\xb5'));

        var res = bp1.or(bp2);
        expect(res.constructor).toBe(BitPack);
        expect(res.byteAt(0)).toBe(0x01);
        expect(res.byteAt(1)).toBe(0xff);
        expect(res.byteAt(2)).toBe(0xbf);

        res = bp2.or(bp1);
        expect(res.constructor).toBe(BitPack);
        expect(res.byteAt(0)).toBe(0x01);
        expect(res.byteAt(1)).toBe(0xff);
        expect(res.byteAt(2)).toBe(0xbf);
    });

    it('should return a BitPack of the specified length', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02\x03'));
        var bp2 = new BitPack(btoa('\x00\x00'));

        expect(bp1.or(bp2).len()).toBe(2);
    });

    it('should return an empty BitPack if the second pack is empty', () => {
        var bp1 = new BitPack('\x00\x01\x02');
        var emptyPack = new BitPack();

        expect(bp1.or(emptyPack).len()).toBe(0);
    });

    it('should throw a RangeError for ors beyond pack bounds', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02'));
        var bp2 = new BitPack(btoa('\x00\x01\x02\x03'));
        var bp3 = new BitPack(btoa('\x00\x01'));

        var readPastDataBounds = () => {
            bp1.or(bp2);
        };
        var readPastDataBoundsWithIndex = () => {
            bp1.or(bp3, 2);
        };

        expect(readPastDataBounds).toThrowError(RangeError);
        expect(readPastDataBoundsWithIndex).toThrowError(RangeError);
    });
});

describe('BitPack.boolOr()', () => {
    it('should return true when either pack contains a 1 bit', () => {
        var bpAllZeros = new BitPack(btoa('\x00\x00\x00'));
        var bp1 = new BitPack(btoa('\x00\x01\x02'));

        expect(bpAllZeros.boolOr(bp1)).toBe(true);
        expect(bp1.boolOr(bpAllZeros)).toBe(true);
    });

    it('should return false when both packs contain only zero bits', () => {
        var bpAllZeros1 = new BitPack(btoa('\x00\x00\x00'));
        var bpAllZeros2 = new BitPack(btoa('\x00\x00\x00'));

        expect(bpAllZeros1.boolOr(bpAllZeros2)).toBe(false);
        expect(bpAllZeros2.boolOr(bpAllZeros1)).toBe(false);
    });

    it('should return true when the packs contain a 1 bit by offset', () => {
        var bp1 = new BitPack(btoa('\x00\x00\x01\x00'));
        var bp2 = new BitPack(btoa('\x00\x00'));

        expect(bp1.boolOr(bp2, 1)).toBe(true);
    });
    
    it('should return true when comparing with an empty pack', () => {
        var bp = new BitPack(btoa('\x00\x01\x02'));
        var emptyPack = new BitPack();

        expect(bp.boolOr(emptyPack)).toBe(true);
        expect(bp.boolOr(emptyPack, 1)).toBe(true);
    });

    it('should return false when the source is empty', () => {
        var bp = new BitPack(btoa('\x00\x01\x02'));
        var emptyPack = new BitPack();

        expect(emptyPack.boolOr(bp)).toBe(false);
        expect(emptyPack.boolOr(bp, 1)).toBe(false);
    });

    it('should return false if an or reads past the data boundary', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02'));
        var bp2 = new BitPack(btoa('\x00\x01\x02\x04'));
        var bp3 = new BitPack(btoa('\x00\x01\x02'));

        expect(bp1.boolOr(bp2)).toBe(false);
        expect(bp1.boolOr(bp3, 1)).toBe(false);
    });
});

describe('BitPack.and()', () => {
    it('should return the and of the two bitpacks', () => {
        var bp1 = new BitPack(btoa('\x00\xff\xab'));
        var bp2 = new BitPack(btoa('\xff\x8b\xb5'));

        var res = bp1.and(bp2);
        expect(res.constructor).toBe(BitPack);
        expect(res.byteAt(0)).toBe(0x00);
        expect(res.byteAt(1)).toBe(0x8b);
        expect(res.byteAt(2)).toBe(0xa1);

        res = bp2.and(bp1);
        expect(res.constructor).toBe(BitPack);
        expect(res.byteAt(0)).toBe(0x00);
        expect(res.byteAt(1)).toBe(0x8b);
        expect(res.byteAt(2)).toBe(0xa1);
    });

    it('should return a BitPack of the specified length', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x03\x03'));
        var bp2 = new BitPack(btoa('\x05\x02'));

        expect(bp1.and(bp2).len()).toBe(2);
    });

    it('should return an empty BitPack if the second pack is empty', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02'));
        var emptyPack = new BitPack();

        expect(bp1.and(emptyPack).len()).toBe(0);
    });

    it('should throw a RangeError for ands beyond pack bounds', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02'));
        var bp2 = new BitPack(btoa('\x00\x01\x02\x03'));
        var bp3 = new BitPack(btoa('\x00\x01'));

        var readPastDataBounds = () => {
            bp1.and(bp2);
        };
        var readPastDataBoundsWithIndex = () => {
            bp1.and(bp3, 2);
        };

        expect(readPastDataBounds).toThrowError(RangeError);
        expect(readPastDataBoundsWithIndex).toThrowError(RangeError);
    });
});

describe('BitPack.boolAnd()', () => {
    it('should return true when there is a common bit', () => {
        var bp1 = new BitPack(btoa('\x00\x00\x80'));
        var bp2 = new BitPack(btoa('\x00\x01\x80'));

        expect(bp1.boolAnd(bp2)).toBe(true);
        expect(bp2.boolAnd(bp1)).toBe(true);

    });

    it('should return true when the packs match by index offset', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02\x03'));
        var bp2 = new BitPack(btoa('\x01\x02\x03'));

        expect(bp1.boolAnd(bp2, 1)).toBe(true);
    });

    it('should return true when comparing with an empty pack', () => {
        var bp = new BitPack(btoa('\x00\x01\x02'));
        var emptyPack = new BitPack();

        expect(bp.boolAnd(emptyPack)).toBe(true);
        expect(bp.boolAnd(emptyPack, 1)).toBe(true);
    });

    it('should throw a RangeError when the source is empty', () => {
        var bp = new BitPack(btoa('\x00\x01\x02'));
        var emptyPack = new BitPack();

        var readPastDataBounds = () => {
            emptyPack.boolAnd(bp);
        };
        var readPastDataBoundsWithIndex = () => {
            emptyPack.boolAnd(bp, 1);
        };
        
        expect(readPastDataBounds).toThrowError(RangeError);
        expect(readPastDataBoundsWithIndex).toThrowError(RangeError);
    });

    it('should throw a RangeError for checks beyond pack bounds', () => {
        var bp1 = new BitPack(btoa('\x00\x01\x02'));
        var bp2 = new BitPack(btoa('\x00\x01\x02\x04'));
        var bp3 = new BitPack(btoa('\x01\x02\x03'));

        var readPastDataBounds = () => {
            bp1.boolAnd(bp2);
        };
        var readPastDataBoundsWithIndex = () => {
            bp1.boolAnd(bp3, 1);
        };

        expect(readPastDataBounds).toThrowError(RangeError);
        expect(readPastDataBoundsWithIndex).toThrowError(RangeError);
    });
});

describe('BitMask.bitAt()', () => {
    it('should return a boolean representation of the index bit', () => {
        var bp = new BitPack(btoa('\x00\xf0'));

        expect(bp.bitAt(0)).toBe(false);
        expect(bp.bitAt(0, 0)).toBe(false);

        expect(bp.bitAt(8)).toBe(true);
        expect(bp.bitAt(1, 0)).toBe(true);

        expect(bp.bitAt(12)).toBe(false);
        expect(bp.bitAt(1, 4)).toBe(false);
    });

    it('should throw a RangeError if index is beyond the data range', () => {
        var bp = new BitPack(btoa('\x00\xff'));

        var readBitPastDataRange = () => {
            bp.bitAt(16);
        };
        var readByteBitPastDataRange = () => {
            bp.bitAt(2, 0);
        };

        expect(readBitPastDataRange).toThrowError(RangeError);
        expect(readByteBitPastDataRange).toThrowError(RangeError);
    });
});

describe('BitMask.slice()', () => {
    it('should return a BitPack with the sliced data', () => {
        var bp = new BitPack(btoa('\x00\x01\x02\x03'));

        var slice1 = bp.slice(1, 3);
        expect(slice1.constructor).toBe(BitPack);
        expect(slice1.len()).toBe(2);
        expect(bp.boolAnd(slice1, 1)).toBe(true);

        var slice2 = bp.slice(1);
        expect(slice2.constructor).toBe(BitPack);
        expect(slice2.len()).toBe(3);
        expect(bp.boolAnd(slice2, 1)).toBe(true);
    });
});

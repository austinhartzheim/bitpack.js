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
        var bp = new BitPack("1");
        expect(bp.len()).toEqual(1);

        bp = new BitPack("12");
        expect(bp.len()).toEqual(2);

        bp = new BitPack("123");
        expect(bp.len()).toEqual(3);
    });
});

describe('BitPack.byteAt()', () => {
    it('should return a numeric byte from a given index', () => {
        var bp = new BitPack('\x00\x01\x02\x03\xff\xab');
        expect(bp.byteAt(0)).toBe(0);
        expect(bp.byteAt(1)).toBe(1);
        expect(bp.byteAt(2)).toBe(2);
        expect(bp.byteAt(3)).toBe(3);
        expect(bp.byteAt(4)).toBe(0xff);
        expect(bp.byteAt(5)).toBe(0xab);
    });

    it('should throw an error when the index is past the data bounds', () => {
        var bp = new BitPack('\x00');
        var readPastDataBounds = () => {
            bp.byteAt(1);
        };
        expect(readPastDataBounds).toThrowError(RangeError);
    });
});

describe('BitPack.or()', () => {
    it('should return true when either pack contains a 1 bit', () => {
        var bpAllZeros = new BitPack('\x00\x00\x00');
        var bp1 = new BitPack('\x00\x01\x02');

        expect(bpAllZeros.or(bp1)).toBe(true);
        expect(bp1.or(bpAllZeros)).toBe(true);
    });

    it('should return false when both packs contain only zero bits', () => {
        var bpAllZeros1 = new BitPack('\x00\x00\x00');
        var bpAllZeros2 = new BitPack('\x00\x00\x00');

        expect(bpAllZeros1.or(bpAllZeros2)).toBe(false);
        expect(bpAllZeros2.or(bpAllZeros1)).toBe(false);
    });

    it('should return true when the packs contain a 1 bit by offset', () => {
        var bp1 = new BitPack('\x00\x00\x01\x00');
        var bp2 = new BitPack('\x00\x00');

        expect(bp1.or(bp2, 1)).toBe(true);
    });
    
    it('should return true when comparing with an empty pack', () => {
        var bp = new BitPack('\x00\x01\x02');
        var emptyPack = new BitPack();

        expect(bp.or(emptyPack)).toBe(true);
        expect(bp.or(emptyPack, 1)).toBe(true);
    });

    it('should return false when the source is empty', () => {
        var bp = new BitPack('\x00\x01\x02');
        var emptyPack = new BitPack();

        expect(emptyPack.or(bp)).toBe(false);
        expect(emptyPack.or(bp, 1)).toBe(false);
    });

    it('should return false if an or reads past the data boundary', () => {
        var bp1 = new BitPack('\x00\x01\x02');
        var bp2 = new BitPack('\x00\x01\x02\x04');
        var bp3 = new BitPack('\x00\x01\x02');

        expect(bp1.or(bp2)).toBe(false);
        expect(bp1.or(bp3, 1)).toBe(false);
    });
});

describe('BitPack.and()', () => {
    it('should return true with both packs are bitwise idential', () => {
        var bp1 = new BitPack('\x00\x01\x02');
        var bp2 = new BitPack('\x00\x01\x02');

        expect(bp1.and(bp2)).toBe(true);
        expect(bp2.and(bp1)).toBe(true);
    });

    it('should return false when any bit is different', () => {
        var bp1 = new BitPack('\x00\x00');
        var bp2 = new BitPack('\x00\x01');

        expect(bp1.and(bp2)).toBe(false);
        expect(bp2.and(bp1)).toBe(false);

        bp1 = new BitPack('\xff\xff\x00\xff');
        bp2 = new BitPack('\xff\xff\xff\xff');

        expect(bp1.and(bp2)).toBe(false);
        expect(bp2.and(bp1)).toBe(false);
    });

    it('should return true when the packs match by index offset', () => {
        var bp1 = new BitPack('\x00\x01\x02\x03');
        var bp2 = new BitPack('\x01\x02\x03');

        expect(bp1.and(bp2, 1)).toBe(true);
    });

    it('should return true when comparing with an empty pack', () => {
        var bp = new BitPack('\x00\x01\x02');
        var emptyPack = new BitPack();

        expect(bp.and(emptyPack)).toBe(true);
        expect(bp.and(emptyPack, 1)).toBe(true);
    });

    it('should return false when the source is empty', () => {
        var bp = new BitPack('\x00\x01\x02');
        var emptyPack = new BitPack();

        expect(emptyPack.and(bp)).toBe(false);
        expect(emptyPack.and(bp, 1)).toBe(false);
    });

    it('should return false if an or reads past the data boundary', () => {
        var bp1 = new BitPack('\x00\x01\x02');
        var bp2 = new BitPack('\x00\x01\x02\x04');
        var bp3 = new BitPack('\\x01\x02\x03');

        expect(bp1.and(bp2)).toBe(false);
        expect(bp1.and(bp3, 1)).toBe(false);
    });
});

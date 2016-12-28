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

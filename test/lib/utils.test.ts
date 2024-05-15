import * as Module from "@/lib/utils";

describe("Utility functions", () => {
  describe("clamp", () => {
    const min = 5;
    const max = 10;

    it("should return min when value is smaller than min", () => {
      expect(Module.clamp(3, min, max)).toBe(min);
    });

    it("should return value when it's between min and max", () => {
      expect(Module.clamp(7, min, max)).toBe(7);
    });

    it("should return max when value is greater than max", () => {
      expect(Module.clamp(12, min, max)).toBe(max);
    });
  });

  describe("closest", () => {
    const values = [10, 20, 30];

    it("should return the closest value from values", () => {
      expect(Module.closest(10, values)).toBe(10);
      expect(Module.closest(20, values)).toBe(20);
      expect(Module.closest(30, values)).toBe(30);
      expect(Module.closest(2, values)).toBe(10);
      expect(Module.closest(15, values)).toBe(10);
      expect(Module.closest(17, values)).toBe(20);
      expect(Module.closest(22, values)).toBe(20);
      expect(Module.closest(37, values)).toBe(30);
    });
  });

  describe("isValidMd5", () => {
    it("should return true if md5 is valid", () => {
      const validMd5 = "0123456789ABCDEF0123456789ABCDEF";
      expect(Module.isValidMd5(validMd5)).toBe(true);
    });

    it("should return false if md5 is not valid", () => {
      const lessThan32Characters = "0123456789ABCDEF";
      const moreThan32Characters = "0123456789ABCDEF0123456789ABCDEF1234";
      const nonHexaCharacters = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";

      expect(Module.isValidMd5(lessThan32Characters)).toBe(false);
      expect(Module.isValidMd5(moreThan32Characters)).toBe(false);
      expect(Module.isValidMd5(nonHexaCharacters)).toBe(false);
    });
  });

  describe("isValidDoi", () => {
    it("should return true if doi is valid", () => {
      const validDoi =
        "10.1002/(SICI)1522-2594(199911)42:5<952::AID-MRM16>3.0.CO;2-S";
      expect(Module.isValidDoi(validDoi)).toBe(true);
    });

    it("should return false if doi is not valid", () => {
      const invalidDoi = "abc";
      expect(Module.isValidDoi(invalidDoi)).toBe(false);
    });
  });

  describe("isValidArk", () => {
    it("should return true if ark is valid", () => {
      const validArk = "ark:/67375/NVC-Z7G9LN4W-1";
      expect(Module.isValidArk(validArk)).toBe(true);
    });

    it("should return false if ark is not valid", () => {
      const invalidArk = "abc";
      expect(Module.isValidArk(invalidArk)).toBe(false);
    });
  });

  describe("isValidIstexId", () => {
    it("should return true if istexId is valid", () => {
      const validIstexId = "59E080581FC0350BC92AD9975484E4127E8803A0";
      expect(Module.isValidIstexId(validIstexId)).toBe(true);
    });

    it("should return false if istexId is not valid", () => {
      const invalidIstexId = "abc";
      expect(Module.isValidIstexId(invalidIstexId)).toBe(false);
    });
  });

  describe("unique", () => {
    it("should deduplicate an array with duplicates", () => {
      const array = [1, 2, 3, 3, 4, 5];
      const deduplicatedArray = [1, 2, 3, 4, 5];

      expect(Module.unique(array)).toEqual(deduplicatedArray);
    });

    it("shouldn't change an array without duplicates", () => {
      const array = [1, 2, 3, 4, 5];

      expect(Module.unique(array)).toEqual(array);
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it("calls the internal function once when calling the debounced function twice rapidly", () => {
      const internal = jest.fn();
      const debounced = Module.debounce(internal);

      debounced();
      debounced("hello", 1);
      jest.runAllTimers();

      expect(internal).toHaveBeenCalledTimes(1);
      expect(internal).toHaveBeenNthCalledWith(1, "hello", 1);
    });

    it("calls the internal function twice when calling the debounced function twice with delay", () => {
      const internal = jest.fn();
      const debounced = Module.debounce(internal);

      debounced("foo", 1);
      jest.runAllTimers();
      debounced("bar", 2);
      jest.runAllTimers();

      expect(internal).toHaveBeenCalledTimes(2);
      expect(internal).toHaveBeenNthCalledWith(1, "foo", 1);
      expect(internal).toHaveBeenNthCalledWith(2, "bar", 2);
    });

    it("doesn't call the internal function when cancelling the debounced function", () => {
      const internal = jest.fn();
      const debounced = Module.debounce(internal);

      debounced();
      debounced.cancel();
      jest.runAllTimers();

      expect(internal).not.toHaveBeenCalled();
    });
  });
});

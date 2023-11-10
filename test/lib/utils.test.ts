import * as Module from "@/lib/utils";

describe("Utility functions", () => {
  it("clamp", () => {
    const min = 5;
    const max = 10;

    expect(Module.clamp(3, min, max)).toBe(min);
    expect(Module.clamp(7, min, max)).toBe(7);
    expect(Module.clamp(12, min, max)).toBe(max);
  });

  it("closest", () => {
    const values = [10, 20, 30];

    expect(Module.closest(10, values)).toBe(10);
    expect(Module.closest(20, values)).toBe(20);
    expect(Module.closest(30, values)).toBe(30);
    expect(Module.closest(2, values)).toBe(10);
    expect(Module.closest(15, values)).toBe(10);
    expect(Module.closest(17, values)).toBe(20);
    expect(Module.closest(22, values)).toBe(20);
    expect(Module.closest(37, values)).toBe(30);
  });

  it("isValidMd5", () => {
    const valid = "0123456789ABCDEF0123456789ABCDEF";
    const lessThan32Characters = "0123456789ABCDEF";
    const moreThan32Characters = "0123456789ABCDEF0123456789ABCDEF1234";
    const nonHexaCharacters = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";

    expect(Module.isValidMd5(valid)).toBe(true);
    expect(Module.isValidMd5(lessThan32Characters)).toBe(false);
    expect(Module.isValidMd5(moreThan32Characters)).toBe(false);
    expect(Module.isValidMd5(nonHexaCharacters)).toBe(false);
  });
});

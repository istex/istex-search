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
});

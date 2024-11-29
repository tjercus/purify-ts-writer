import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { Writer } from "./main.ts";

describe("Writer", () => {
  describe("of", () => {
    it("should create a new Writer with an empty log and a value", () => {
      const writer = Writer.of(42, []);
      expect(writer.value).toEqual(42);
      expect(writer.log).toEqual([]);
    });
  });
  describe("map", () => {
    it("should create a new Writer with the value holding the result of mapping the given fn", () => {
      const writer = Writer.of(42, []);
      const mappedWriter = writer.map((x) => x * 2);
      expect(mappedWriter.value).toEqual(84);
      expect(mappedWriter.log).toEqual([]);
    });
  });
  describe("chain", () => {
    it("should chain calling fns on the value and add to the log when appropriate", () => {
      const aPerson = { age: 16, height: 183 };
      type Person = typeof aPerson;
      const isAdult = (p: Person) => p.age > 17;
      const isAdultW = (input: Person): Writer<Array<string>, Person> =>
        Writer.of(input, isAdult(input) ? [] : [`You are not an adult`]);
      const isTall = (p: Person) => p.height > 190;
      const isTallW = (input: Person): Writer<Array<string>, Person> =>
        Writer.of(input, isTall(input) ? [] : [`You are not tall`]);
      //
      const writer = Writer.of(aPerson, [] as Array<string>);
      const chainedWriter = writer.chain(isAdultW).chain(isTallW);
      //
      expect(chainedWriter.value).toEqual(aPerson);
      expect(chainedWriter.log).toEqual([
        "You are not an adult",
        "You are not tall",
      ]);
    });
  });
  describe("bimap", () => {
    it("should create a new Writer with the value and log transformed by the given fns", () => {
      const writer = Writer.of(42, "log");
      const bimappedWriter = writer.bimap(
        (log: string) => log.toUpperCase(),
        (value: number) => value * 2,
      );
      expect(bimappedWriter.value).toEqual(84);
      expect(bimappedWriter.log).toEqual("LOG");
    });
  });
  describe("ap", () => {
    it("should apply the function in the given Writer to the value in this Writer", () => {
      const writer = Writer.of(42, "log");
      const functionWriter = Writer.of((x: number) => x * 2, "log");
      const apWriter = writer.ap(functionWriter);
      expect(apWriter.value).toEqual(84);
      expect(apWriter.log).toEqual("loglog");
    });
  });
});

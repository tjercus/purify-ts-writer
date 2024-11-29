import { Writer } from "./main.ts";

type ValidationLog = Array<string>;

// Validation functions
const validateNotEmpty = (input: string): Writer<ValidationLog, string> => {
  const isValid = input.trim().length > 0;
  return Writer.of(input, isValid ? [] : ["Input cannot be empty"]);
};

// curried fn
const validateMinLength = (
  minLength: number,
) =>
(
  input: string,
): Writer<ValidationLog, string> => {
  const isValid = input.length >= minLength;
  return Writer.of(
    input,
    isValid ? [] : [`Input must be at least ${minLength} characters long`],
  );
};

const validateEmail = (input: string): Writer<ValidationLog, string> => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  return Writer.of(input, isValid ? [] : ["Input must be a valid email"]);
};

// run it!
const input = "t#m.nl"; // expect 2 validation errors in the log
const result = Writer.of(input, [] as ValidationLog) // Start with an empty log
  .chain(validateNotEmpty)
  .chain(validateMinLength(8))
  .chain(validateEmail);

console.log("Value:", result.value); // Final value (input in this case)
console.log("Log:", result.log); // Accumulated validation messages

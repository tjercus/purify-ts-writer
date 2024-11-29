export type Writer<W, A> = {
  value: A;
  log: W;
  map: <B>(fn: (a: A) => B) => Writer<W, B>;
  chain: <B>(fn: (a: A) => Writer<W, B>) => Writer<W, B>;
  bimap: <W2, B>(
    mapLog: (log: W) => W2,
    mapValue: (value: A) => B,
  ) => Writer<W2, B>;
  ap: <B>(writer: Writer<W, (a: A) => B>) => Writer<W, B>;
  // fantasy-land versions for compliance with other libraries
  'fantasy-land/map': <B>(fn: (a: A) => B) => Writer<W, B>;
  'fantasy-land/chain': <B>(fn: (a: A) => Writer<W, B>) => Writer<W, B>;
  'fantasy-land/bimap': <W2, B>(
    mapLog: (log: W) => W2,
    mapValue: (value: A) => B,
  ) => Writer<W2, B>;
  'fantasy-land/ap': <B>(writer: Writer<W, (a: A) => B>) => Writer<W, B>;
  'fantasy-land/of': <W, A>(value: A, log: W) => Writer<W, A>;
};

// Shared implementations
const mapImpl = <W, A, B>(writer: Writer<W, A>, fn: (a: A) => B): Writer<W, B> =>
  Writer.of(fn(writer.value), writer.log);

const chainImpl = <W, A, B>(
  writer: Writer<W, A>,
  fn: (a: A) => Writer<W, B>
): Writer<W, B> => {
  const next = fn(writer.value);
  return Writer.of(next.value, combineLogs(writer.log, next.log));
};

const bimapImpl = <W, W2, A, B>(
  writer: Writer<W, A>,
  mapLog: (log: W) => W2,
  mapValue: (value: A) => B
): Writer<W2, B> => Writer.of(mapValue(writer.value), mapLog(writer.log));

// Writer Monad
export const Writer = {
  of: <W, A>(value: A, log: W): Writer<W, A> => ({
    value,
    log,

    map<B>(fn: (a: A) => B): Writer<W, B> {
      return mapImpl(this, fn);
    },

    chain<B>(fn: (a: A) => Writer<W, B>): Writer<W, B> {
      return chainImpl(this, fn);
    },

    bimap<W2, B>(
      mapLog: (log: W) => W2,
      mapValue: (value: A) => B
    ): Writer<W2, B> {
      return bimapImpl(this, mapLog, mapValue);
    },

    ap<B>(fab: Writer<W, (a: A) => B>): Writer<W, B> {
      return Writer.of(fab.value(this.value), combineLogs(this.log, fab.log));
    },

    // Fantasy Land methods
    "fantasy-land/map": function <B>(fn: (a: A) => B): Writer<W, B> {
      return mapImpl(this, fn);
    },
    "fantasy-land/chain": function <B>(fn: (a: A) => Writer<W, B>): Writer<W, B> {
      return chainImpl(this, fn);
    },
    "fantasy-land/bimap": function <W2, B>(
      mapLog: (log: W) => W2,
      mapValue: (value: A) => B
    ): Writer<W2, B> {
      return bimapImpl(this, mapLog, mapValue);
    },
    "fantasy-land/ap": function <B>(fab: Writer<W, (a: A) => B>): Writer<W, B> {
      return Writer.of(fab.value(this.value), combineLogs(this.log, fab.log));
    },
    "fantasy-land/of": <W, A>(value: A, log: W): Writer<W, A> => Writer.of(value, log),
  }),
};


/* -------------------------------- helpers ------------------------------------------- */

// Helper to combine logs (assumes logs are arrays or otherwise strings)
const combineLogs = <W>(log1: W, log2: W): W =>
  (Array.isArray(log1) && Array.isArray(log2))
    ? log1.concat(log2) as Array<unknown> as W
    : log1 as string + log2 as string as W;

import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from "@standard-schema/spec";

export type ChunkComponentElement = {
  id: string;
  component: string;
  op: "root" | "child";
  type: "element";
  props?: ValueExpr;
  deps?: string[];
  defaults?: AssignableExpr[];
  hidden?: ValueExpr;
  callbacks?: Record<string, AssignableWithConfirmExpr[]>;
  children?: string[];
};

export type ChunkComponentList = {
  id: string;
  component: string;
  op: "child";
  type: "list";
  idKey?: (string & {}) | "_index" | "_item";
  itemScope: string;
  itemsSource: string;
  props?: ValueExpr;
  deps?: string[];
  defaults?: AssignableExpr[];
  hidden?: ValueExpr;
  callbacks?: Record<string, AssignableWithConfirmExpr[]>;
  children?: string[];
};

export type ChunkComponent = ChunkComponentElement | ChunkComponentList;

export type ValueExpr = { expr?: string; literal?: unknown };
export type AssignableExpr = { set: string } & ValueExpr;
export type AssignableWithConfirmExpr = { confirm?: string } & AssignableExpr;

export interface CombinedProps<Input = unknown, Output = Input>
  extends
    StandardSchemaV1.Props<Input, Output>,
    StandardJSONSchemaV1.Props<Input, Output> {}

/**
 * An interface that combines StandardJSONSchema and StandardSchema.
 * */
export interface CombinedSpec<Input = unknown, Output = Input> {
  "~standard": CombinedProps<Input, Output>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CombinedSpec {
  export type Target = StandardJSONSchemaV1.Target;
  export type InferInput<T extends StandardSchemaV1> =
    StandardSchemaV1.InferInput<T>;
  export type InferOutput<T extends StandardSchemaV1> =
    StandardSchemaV1.InferOutput<T>;
  export type SuccessResult<T> = StandardSchemaV1.SuccessResult<T>;
}

// props: expr, literal
// itemsSource: string (scope reference like scopes.root.myItems)
// callbacks: set, expr, literal, async
// defaults: set, expr, literal, async

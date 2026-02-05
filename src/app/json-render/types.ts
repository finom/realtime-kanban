export type ChunkComponentElement = {
  id: string;
  component: string;
  op: "root" | "child";
  type: "element"
  props?: string;
  deps?: string[];
  defaults?: SetExpr[];
  callbacks?: Record<string, SetExpr[]>;
  children?: string[];
};

export type ChunkComponentList = {
  id: string;
  component: string;
  op: "child";
  type: "list";
  idKey?: string & {} | '_index' | '_item';
  itemScope: string;
  items: string;
  props?: string;
  deps?: string[];
  defaults?: SetExpr[];
  callbacks?: Record<string, SetExpr[]>;
  children?: string[];
};

export type ChunkComponent = ChunkComponentElement | ChunkComponentList;

export type SetExpr = { set?: string; expr?: string; literal?: unknown };

import z from "zod";

export type ComponentSchema = z.ZodType<Record<string, unknown>>;

export interface ComponentDefinition<
  TProps extends ComponentSchema = ComponentSchema,
  TCallbacks extends Record<string, ComponentSchema> = Record<string, ComponentSchema>,
> {
  /** Zod schema for component props */
  propDefs: TProps;
  /** Whether this component can have children */
  callbackDefs?: TCallbacks;
  /** Description for AI generation */
  description?: string;
}

export interface CatalogConfig<
  TComponents extends Record<string, ComponentDefinition> = Record<
    string,
    ComponentDefinition
  >,
> {
  /** Catalog name */
  name?: string;
  /** Component definitions */
  components: TComponents;
}

export interface Catalog<
  TComponents extends Record<string, ComponentDefinition> = Record<
    string,
    ComponentDefinition
  >,
> {
  /** Catalog name */
  readonly name: string;
  /** Component names */
  readonly componentNames: (keyof TComponents)[];
  /** Component definitions */
  readonly components: TComponents;
}

export function createCatalog<
  TComponents extends Record<string, ComponentDefinition>,
>(
  config: CatalogConfig<TComponents>,
): Catalog<TComponents> {
  const {
    name = "unnamed",
    components,
  } = config;

  const componentNames = Object.keys(components) as (keyof TComponents)[];

  return {        
    name,
    componentNames,
    components,
  };
}
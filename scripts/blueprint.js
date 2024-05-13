// import packageJson from "../package.json" assert { type: "json" };
import plutusJson from '../plutus.json' assert { type: 'json' };

import fs from 'fs'

function main() {
    const plutusVersion =
  "Plutus" + plutusJson.preamble.plutusVersion.toUpperCase();

    const definitions = plutusJson.definitions;

    const imports = `
        import { applyParamsToScript, Data, Validator } from "lucid-cardano"
    `

    const validators = plutusJson.validators.map((validator) => {
        const title = validator.title;
        const name = (() => {
        const [a, b] = title.split(".");
        return upperFirst(snakeToCamel(a)) + upperFirst(snakeToCamel(b));
        })();
        const datum = validator.datum;
        const datumTitle = datum ? snakeToCamel(datum.title) : null;
        const datumSchema = datum ? resolveSchema(datum.schema, definitions) : null;
    
        const redeemer = validator.redeemer;
        const redeemerTitle = snakeToCamel(redeemer.title);
        const redeemerSchema = resolveSchema(redeemer.schema, definitions);
    
        const params = validator.parameters || [];
        const paramsSchema = {
        dataType: "list",
        items: params.map((param) => resolveSchema(param.schema, definitions)),
        };
        const paramsArgs = params.map((param, index) => [
        snakeToCamel(param.title),
        schemaToType(paramsSchema.items[index]),
        ]);
    
        const script = validator.compiledCode;
    
        return `export interface ${name} {
        new (${paramsArgs.map((param) => param.join(":")).join(",")}): Validator;${
        datum ? `\n${datumTitle}: ${schemaToType(datumSchema)};` : ""
        }
        ${redeemerTitle}: ${schemaToType(redeemerSchema)};
        };
    
        export const ${name} = Object.assign(
        function (${paramsArgs.map((param) => param.join(":")).join(",")}) {${
        paramsArgs.length > 0
            ? `return { type: "${plutusVersion}", script: applyParamsToScript("${script}", [${paramsArgs
                .map((param) => param[0])
                .join(",")}], ${JSON.stringify(paramsSchema)} as any) };`
            : `return {type: "${plutusVersion}", script: "${script}"};`
        }},
        ${datum ? `{${datumTitle}: ${JSON.stringify(datumSchema)}},` : ""}
        {${redeemerTitle}: ${JSON.stringify(redeemerSchema)}},
        ) as unknown as ${name};`;
    });

    const plutus = imports + "\n\n" + validators.join("\n\n");

    fs.writeFileSync('plutus.ts', plutus)

    console.log(
        "%cGenerated %cplutus.ts",
        "color: green; font-weight: bold",
        "font-weight: bold"
    );
}

main()


/** 
 * Utils
 **/
function resolveSchema(schema, definitions) {
    if (schema.items) {
      if (schema.items instanceof Array) {
        return {
          ...schema,
          items: schema.items.map((item) =>
            resolveSchema(item, definitions)
          ),
        };
      } else {
        return {
          ...schema,
          items: resolveSchema(schema.items, definitions),
        };
      }
    } else if (schema.anyOf) {
      return {
        ...schema,
        anyOf: schema.anyOf.map((a) => ({
          ...a,
          fields: a.fields.map((field) => ({
            ...resolveSchema(field, definitions),
            title: field.title ? snakeToCamel(field.title) : undefined,
          })),
        })),
      };
    } else if (schema.keys && schema.values) {
      return {
        ...schema,
        keys: resolveSchema(schema.keys, definitions),
        values: resolveSchema(schema.values, definitions),
      };
    } else {
      if (schema["$ref"]) {
        const refKey = schema["$ref"]
          .replaceAll("~1", "/")
          .split("#/definitions/")[1];
        return resolveSchema(definitions[refKey], definitions);
      } else {
        return schema;
      }
    }
}

function schemaToType(schema) {
    if (!schema) throw new Error("Could not generate type.");
    const shapeType = (schema.anyOf ? "enum" : "") || schema.dataType;
  
    switch (shapeType) {
      case "integer": {
        return "bigint";
      }
      case "bytes": {
        return "string";
      }
      case "constructor": {
        if (isVoid(schema)) {
          return "undefined";
        } else {
          return `{${schema.fields
            .map(
              (field) => `${field.title || "wrapper"}:${schemaToType(field)}`
            )
            .join(";")}}`;
        }
      }
      case "enum": {
        // When enum has only one entry it's a single constructor/record object
        if (schema.anyOf.length === 1) {
          return schemaToType(schema.anyOf[0]);
        }
        if (isBoolean(schema)) {
          return "boolean";
        }
        if (isNullable(schema)) {
          return `${schemaToType(schema.anyOf[0].fields[0])} | null`;
        }
        return schema.anyOf
          .map((entry) =>
            entry.fields.length === 0
              ? `"${entry.title}"`
              : `{${entry.title}: ${
                  entry.fields[0].title
                    ? `{${entry.fields
                        .map((field) =>
                          [field.title, schemaToType(field)].join(":")
                        )
                        .join(",")}}}`
                    : `[${entry.fields
                        .map((field) => schemaToType(field))
                        .join(",")}]}`
                }`
          )
          .join(" | ");
      }
      case "list": {
        if (schema.items instanceof Array) {
          return `[${schema.items
            .map((item) => schemaToType(item))
            .join(",")}]`;
        } else {
          return `Array<${schemaToType(schema.items)}>`;
        }
      }
      case "map": {
        return `Map<${schemaToType(schema.keys)}, ${schemaToType(
          schema.values
        )}>`;
      }
      case undefined: {
        return "Data";
      }
    }
    throw new Error("Could not type cast data.");
  }
  
  function isBoolean(shape) {
    return (
      shape.anyOf &&
      shape.anyOf[0]?.title === "False" &&
      shape.anyOf[1]?.title === "True"
    );
  }
  
  function isVoid(shape) {
    return shape.index === 0 && shape.fields.length === 0;
  }
  
  function isNullable(shape) {
    return (
      shape.anyOf &&
      shape.anyOf[0]?.title === "Some" &&
      shape.anyOf[1]?.title === "None"
    );
  }
  
  function snakeToCamel(s) {
    const withUnderscore = s.charAt(0) === "_" ? s.charAt(0) : "";
    return (
      withUnderscore +
      (withUnderscore ? s.slice(1) : s)
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace("-", "").replace("_", "")
        )
    );
  }
  
  function upperFirst(s) {
    const withUnderscore = s.charAt(0) === "_" ? s.charAt(0) : "";
    return (
      withUnderscore +
      s.charAt(withUnderscore ? 1 : 0).toUpperCase() +
      s.slice((withUnderscore ? 1 : 0) + 1)
    );
  }
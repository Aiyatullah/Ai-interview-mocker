import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_Qtd7BvegDb3T@ep-lingering-pine-a526254u-pooler.us-east-2.aws.neon.tech/ai-database-mocker?sslmode=require",
  },
  out: "./drizzle",
});







// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   out: "./drizzle",
//   dialect: "postgresql",  // Ensure you're using the correct dialect for PostgreSQL
//   schema: "./utils/schema.js",

//   driver: "postgresql",  // Change this to 'postgresql' if using a PostgreSQL database
//   dbCredentials: {
//     url: "postgresql://neondb_owner:npg_Qtd7BvegDb3T@ep-lingering-pine-a526254u-pooler.us-east-2.aws.neon.tech/ai-database-mocker?sslmode=require",
//   },

//   extensionsFilters: ["postgis"],
//   schemaFilter: "public",
//   tablesFilter: "*",

//   introspect: {
//     casing: "camel",
//   },

//   migrations: {
//     prefix: "timestamp",
//     table: "__drizzle_migrations__",
//     schema: "public",
//   },

//   entities: {
//     roles: {
//       provider: '',
//       exclude: [],
//       include: []
//     }
//   }

//   // breakpoints: true,
//   // strict: true,
//   // verbose: true,
// });

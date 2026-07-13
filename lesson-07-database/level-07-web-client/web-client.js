var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/bson.js
var require_bson = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/bson.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isObjectId = exports.ObjectIdCtor = void 0;
    exports.mongo = mongo;
    var _m;
    function mongo() {
      if (!_m) {
        try {
          _m = __require("mongodb");
        } catch {
          throw new Error("[forge] the 'mongodb' driver is required for Mongo operations but is not installed.\n  Install:  npm install mongodb");
        }
      }
      return _m;
    }
    var ObjectIdCtor = () => mongo().ObjectId;
    exports.ObjectIdCtor = ObjectIdCtor;
    var isObjectId = (v2) => !!v2 && typeof v2 === "object" && v2._bsontype === "ObjectId";
    exports.isObjectId = isObjectId;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/client.js
var require_client = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dbClient = void 0;
    var bson_1 = require_bson();
    var DatabaseClient = class {
      // Lazily created at first `connect()`. Reading `process.env.DATABASE_URL`
      // and instantiating MongoClient is deferred to runtime — Nest's
      // ConfigModule loads `.env` *after* module-import side-effects, so an
      // eager constructor would throw "DATABASE_URL is not set" before the
      // env var has been populated.
      _client;
      _db;
      _connecting;
      // Throws a clear error if anything tries to use the client/db before
      // connect() resolves (instead of an opaque "Cannot read properties of
      // undefined").
      get client() {
        if (!this._client) {
          throw new Error("[Database] client accessed before connect() resolved");
        }
        return this._client;
      }
      get db() {
        if (!this._db) {
          throw new Error("[Database] db accessed before connect() resolved");
        }
        return this._db;
      }
      // Adopt a caller-supplied MongoClient (createDb({ driver: mongoDriver(...) }))
      // instead of building one from DATABASE_URL. connect() is idempotent on the
      // mongodb driver, so it's safe whether or not the client is already connected.
      async adopt(client, dbName) {
        if (this._db)
          return;
        this._client = client;
        this._connecting = (async () => {
          await client.connect();
          this._db = dbName ? client.db(dbName) : client.db();
          console.log(`[Database] connected to ${this._db.databaseName} (injected client)`);
        })();
        return this._connecting;
      }
      async connect() {
        if (this._db)
          return;
        if (this._connecting)
          return this._connecting;
        const uri = process.env.DATABASE_URL;
        if (!uri) {
          throw new Error("[Database] DATABASE_URL is not set \u2014 make sure ConfigModule has loaded .env before connect()");
        }
        this._client = new ((0, bson_1.mongo)()).MongoClient(uri, {
          maxPoolSize: 50,
          minPoolSize: 5,
          connectTimeoutMS: 1e4,
          serverSelectionTimeoutMS: 1e4,
          retryWrites: true,
          retryReads: true
        });
        this._connecting = (async () => {
          await this._client.connect();
          this._db = this._client.db();
          if (this._db.databaseName === "test" && !uri.includes("/test")) {
            console.warn('[Database] connected to default "test" db \u2014 check DATABASE_URL');
          }
          console.log(`[Database] connected to ${this._db.databaseName}`);
        })();
        return this._connecting;
      }
      async transaction(fn) {
        const session = this.client.startSession();
        try {
          let result;
          await session.withTransaction(async () => {
            result = await fn(session);
          });
          return result;
        } finally {
          await session.endSession();
        }
      }
      async close() {
        if (!this._client)
          return;
        await this._client.close();
        this._client = void 0;
        this._db = void 0;
        this._connecting = void 0;
      }
    };
    exports.dbClient = new DatabaseClient();
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/core.js
var require_core = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rel = exports.model = exports.embed = exports.enums = exports.f = exports.Field = void 0;
    var Field = class _Field {
      // Phantom carriers for the JS-side type AND the field-kind literal. `_k` is
      // essential for input-type narrowing: without a structural property carrying
      // K, TypeScript collapses Field<X, 'json'> and Field<X, 'dateTime'> into the
      // same shape and checks like `[X] extends [Field<Date, 'dateTime'>]` match
      // unintentionally.
      _t;
      _k;
      def;
      constructor(def) {
        this.def = def;
      }
      optional() {
        return new _Field({ ...this.def, optional: true });
      }
      unique() {
        return new _Field({ ...this.def, unique: true });
      }
      default(value) {
        let d2;
        if (value === "now")
          d2 = { kind: "now" };
        else if (value === "autoId")
          d2 = { kind: "autoId" };
        else
          d2 = { kind: "literal", value };
        return new _Field({ ...this.def, default: d2 });
      }
      updatedAt() {
        return new _Field({ ...this.def, updatedAt: true });
      }
      // Opt the field into auto-FTS-index emission via forge:push. Querying works
      // on any column regardless; `.searchable()` just guarantees the backing index
      // exists.
      searchable() {
        return new _Field({ ...this.def, searchable: true });
      }
      // Mark this field as the model's soft-delete column. Only one per model.
      // Forced optional (null until soft-deleted). The wrapper then:
      //   • adds `WHERE <col> IS NULL` to reads (suppress with `where: { _withDeleted: true }`)
      //   • rewrites `.delete()` / `.deleteMany()` to `UPDATE … SET <col> = now()`
      softDeleteAt() {
        return new _Field({ ...this.def, optional: true, softDeleteAt: true });
      }
      // Mark this column as database-generated. `expr` is the SQL expression (e.g.
      // `"price" * "qty"`). The wrapper never writes it; the DB computes it. Emitted
      // as GENERATED ALWAYS AS (<expr>) STORED on PG/MySQL/SQLite; ignored (warned)
      // on Mongo.
      dbgenerated(expr) {
        return new _Field({ ...this.def, dbGenerated: expr });
      }
    };
    exports.Field = Field;
    var make = (kind) => new Field({
      kind,
      optional: false,
      unique: false,
      updatedAt: false
    });
    exports.f = {
      // Primary key. Default: string in app, ObjectId in db, mapped to/from `_id`,
      // auto-generated at create when no value is supplied.
      //   `{ type: 'uuid' }`      → DB-side default (PG gen_random_uuid(), MySQL
      //                             UUID()); SQLite + Mongo fall back to app-side autogen.
      //   `{ type: 'bigserial' }` → auto-incrementing integer key (PG BIGSERIAL,
      //                             MySQL BIGINT AUTO_INCREMENT, SQLite INTEGER PRIMARY
      //                             KEY AUTOINCREMENT). JS type becomes `number`, DB
      //                             assigns on insert. Throws at push on Mongo (no
      //                             auto-incrementing scalar id concept).
      id: ((opts) => {
        const idType = opts?.type ?? "auto";
        return new Field({
          kind: "id",
          optional: false,
          unique: true,
          updatedAt: false,
          // bigserial is DB-assigned — no app-side default.
          ...idType === "bigserial" ? {} : { default: { kind: "autoId" } },
          idType
        });
      }),
      // Foreign key style — string in app, ObjectId in db.
      objectId: () => make("objectId"),
      string: () => make("string"),
      // Unbounded string. Like f.string() except on MySQL: `string` → VARCHAR(255)
      // (indexable), `text` → TEXT (can't be UNIQUE without a key length).
      text: () => make("text"),
      int: () => make("int"),
      float: () => make("float"),
      // Exact numeric. JS type is `string` to avoid float-precision loss (e.g.
      // money). PG numeric(p,s) / MySQL DECIMAL(p,s) / SQLite NUMERIC / Mongo Decimal128.
      decimal: (opts = {}) => new Field({
        kind: "decimal",
        optional: false,
        unique: false,
        updatedAt: false,
        precision: opts.precision,
        scale: opts.scale
      }),
      // UUID. JS type `string`. Pass `{ default: 'gen_random_uuid' }` to emit a
      // DB-side default (PG gen_random_uuid(), MySQL UUID()).
      uuid: (opts = {}) => new Field({
        kind: "uuid",
        optional: false,
        unique: false,
        updatedAt: false,
        uuidDefault: opts.default === "gen_random_uuid"
      }),
      // 64-bit integer. JS type `bigint` (use BigInt literals: 1n).
      // PG bigint / MySQL BIGINT / SQLite INTEGER / Mongo Long.
      bigint: () => make("bigint"),
      bool: () => make("bool"),
      dateTime: () => make("dateTime"),
      json: () => make("json"),
      enumOf: (values) => new Field({
        kind: "enum",
        optional: false,
        unique: false,
        updatedAt: false,
        enumValues: values
      }),
      // Embedded composite types — Prisma `type Foo {}`. The embed is itself a tiny
      // model reusing the same Field map shape.
      embed: (embedDef) => new Field({
        kind: "embed",
        optional: false,
        unique: false,
        updatedAt: false,
        embedOf: embedDef
      }),
      embedMany: (embedDef) => new Field({
        kind: "embedMany",
        optional: false,
        unique: false,
        updatedAt: false,
        embedOf: embedDef
      }),
      stringArray: () => make("stringArray"),
      intArray: () => make("intArray"),
      /**
       * 2D geographic point — always WGS84 (SRID 4326) unless overridden. The
       * JS-side shape is `{ lng: number; lat: number }`. Per-dialect storage:
       *
       *   • Mongo  — GeoJSON in a JSON field (auto-coerced to/from { lng, lat }).
       *   • PG     — geography(Point, 4326) when PostGIS is installed. With
       *              `{ fallback: true }`, JSON storage + Haversine queries.
       *   • MySQL  — POINT NOT NULL SRID 4326 (8.0+). Built-in, no extension.
       *   • SQLite — SpatiaLite geometry when the extension loads. Otherwise
       *              JSON storage when `{ fallback: true }`.
       *   • DuckDB — GEOMETRY (spatial extension auto-loaded since 0.9).
       *   • MSSQL  — GEOGRAPHY (built-in since SQL Server 2008).
       *
       * Pair with `indexes: [{ keys: { col: 1 }, method: 'spatial' }]` to opt
       * into the dialect's spatial index family.
       */
      geoPoint: (opts = {}) => {
        const dims = opts.dims ?? 2;
        if (dims !== 2 && dims !== 3) {
          throw new Error(`[forge] f.geoPoint({ dims }): dims must be 2 or 3, got ${dims}`);
        }
        const fld = dims === 3 ? make("geoPoint") : make("geoPoint");
        fld.def.geo = {
          srid: opts.srid ?? 4326,
          fallback: !!opts.fallback,
          dims
        };
        return fld;
      },
      /**
       * Dense numeric vector — embedding storage. Pair with
       * `indexes: [{ keys: { col: 1 }, method: 'vector' }]` to opt into the
       * dialect's vector index family (HNSW where available).
       *
       *   const Doc = model('docs', {
       *     id: f.id(),
       *     embedding: f.vector(1536, { metric: 'cosine' }),
       *   });
       */
      vector: (dims, opts = {}) => {
        if (!Number.isInteger(dims) || dims <= 0) {
          throw new Error(`[forge] f.vector(dims): dims must be a positive integer, got ${dims}`);
        }
        const fld = make("vector");
        fld.def.vector = { dims, metric: opts.metric ?? "cosine" };
        return fld;
      }
    };
    var enums = (values) => {
      const out = { values };
      for (const v2 of values)
        out[v2] = v2;
      return out;
    };
    exports.enums = enums;
    var embed = (embedName, fields) => ({
      embedName,
      fields: mapFieldDefs(fields)
    });
    exports.embed = embed;
    var model3 = (collection, fields, options = {}) => {
      const def = {
        collection,
        fields: mapFieldDefs(fields),
        relations: options.relations || (() => ({})),
        indexes: options.indexes || [],
        uniques: options.uniques || []
      };
      def.relate = function(rels) {
        this.relations = rels;
        return this;
      };
      def.asView = function(spec) {
        this.view = spec;
        return this;
      };
      return def;
    };
    exports.model = model3;
    exports.rel = {
      one: (target, opts) => ({
        kind: "one",
        target,
        on: opts.on,
        refs: opts.refs,
        onDelete: opts.onDelete
      }),
      many: (target, opts) => ({
        kind: "many",
        target,
        on: opts.on,
        refs: opts.refs,
        onDelete: opts.onDelete,
        inverse: true
      })
    };
    function mapFieldDefs(fields) {
      const out = {};
      for (const k of Object.keys(fields))
        out[k] = fields[k].def;
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/active.js
var require_active = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/active.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setActiveSchema = setActiveSchema;
    exports.getActiveSchema = getActiveSchema;
    var _active;
    function setActiveSchema(s) {
      _active = s;
    }
    function getActiveSchema() {
      if (!_active) {
        throw new Error("[forge] no active schema set. Import forge's schema module, or call createDb({ schema }) with your model map before querying.");
      }
      return _active;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/index.js
var require_schema = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/schema/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.schema = exports.sampleSchema = exports.PostStats = exports.PublishedPosts = exports.AuditLog = exports.Like = exports.PostTag = exports.Tag = exports.Comment = exports.Post = exports.Profile = exports.User = exports.RevisionEmbed = exports.SocialLinkEmbed = exports.AddressEmbed = exports.LikeKind = exports.PostStatus = exports.Role = void 0;
    var core_1 = require_core();
    var core_2 = require_core();
    var active_1 = require_active();
    var rel = core_1.rel;
    exports.Role = (0, core_1.enums)(["USER", "EDITOR", "ADMIN"]);
    exports.PostStatus = (0, core_1.enums)(["DRAFT", "PUBLISHED", "ARCHIVED"]);
    exports.LikeKind = (0, core_1.enums)(["LIKE", "BOOKMARK"]);
    var AddressEmbed = () => (0, core_1.embed)("Address", {
      street: core_1.f.string(),
      city: core_1.f.string(),
      zip: core_1.f.string(),
      country: core_1.f.string()
    });
    exports.AddressEmbed = AddressEmbed;
    var SocialLinkEmbed = () => (0, core_1.embed)("SocialLink", {
      platform: core_1.f.string(),
      url: core_1.f.string()
    });
    exports.SocialLinkEmbed = SocialLinkEmbed;
    var RevisionEmbed = () => (0, core_1.embed)("Revision", {
      title: core_1.f.string(),
      body: core_1.f.string(),
      edited_at: core_1.f.dateTime().default("now")
    });
    exports.RevisionEmbed = RevisionEmbed;
    exports.User = (0, core_2.model)("users", {
      id: core_1.f.id(),
      email: core_1.f.string().unique(),
      name: core_1.f.string(),
      role: core_1.f.enumOf(exports.Role.values).default("USER"),
      address: core_1.f.embed(exports.AddressEmbed).optional(),
      active: core_1.f.bool().default(true),
      created_at: core_1.f.dateTime().default("now"),
      updated_at: core_1.f.dateTime().default("now").updatedAt()
    }, {
      indexes: [{ keys: { role: 1 } }]
    }).relate(() => ({
      // Inverse-one: Profile.user_id is the actual FK (declared on Profile below).
      // We use rel.many here so it's clearly the inverse side; callers fetch
      // via `db.profile.findFirst({ where: { user_id } })` for the singleton.
      profiles: rel.many("profile", { on: "user_id", refs: "id" }),
      posts: rel.many("post", { on: "author_id", refs: "id" }),
      comments: rel.many("comment", { on: "author_id", refs: "id" }),
      likes: rel.many("like", { on: "user_id", refs: "id" }),
      audit_logs: rel.many("auditLog", { on: "actor_id", refs: "id" })
    }));
    exports.Profile = (0, core_2.model)("profiles", {
      id: core_1.f.id(),
      user_id: core_1.f.objectId().unique(),
      bio: core_1.f.text().optional(),
      avatar: core_1.f.string().optional(),
      social_links: core_1.f.embedMany(exports.SocialLinkEmbed),
      created_at: core_1.f.dateTime().default("now")
    }).relate(() => ({
      user: rel.one("user", { on: "user_id", refs: "id", onDelete: "Cascade" })
    }));
    exports.Post = (0, core_2.model)("posts", {
      id: core_1.f.id(),
      author_id: core_1.f.objectId(),
      title: core_1.f.string(),
      slug: core_1.f.string().unique(),
      body: core_1.f.text().searchable(),
      status: core_1.f.enumOf(exports.PostStatus.values).default("DRAFT"),
      tag_names: core_1.f.stringArray().optional(),
      view_count: core_1.f.int().default(0),
      meta: core_1.f.json().optional(),
      revisions: core_1.f.embedMany(exports.RevisionEmbed),
      published_at: core_1.f.dateTime().optional(),
      created_at: core_1.f.dateTime().default("now"),
      updated_at: core_1.f.dateTime().default("now").updatedAt()
    }, {
      indexes: [
        { keys: { author_id: 1, status: 1 } },
        { keys: { slug: 1 } }
      ]
    }).relate(() => ({
      author: rel.one("user", { on: "author_id", refs: "id", onDelete: "Cascade" }),
      comments: rel.many("comment", { on: "post_id", refs: "id" }),
      likes: rel.many("like", { on: "post_id", refs: "id" }),
      post_tags: rel.many("postTag", { on: "post_id", refs: "id" })
    }));
    exports.Comment = (0, core_2.model)("comments", {
      id: core_1.f.id(),
      post_id: core_1.f.objectId(),
      author_id: core_1.f.objectId().optional(),
      parent_id: core_1.f.objectId().optional(),
      body: core_1.f.text(),
      like_count: core_1.f.int().default(0),
      is_deleted: core_1.f.bool().default(false),
      created_at: core_1.f.dateTime().default("now")
    }, {
      indexes: [
        { keys: { post_id: 1, created_at: 1 } },
        { keys: { parent_id: 1 } }
      ]
    }).relate(() => ({
      post: rel.one("post", { on: "post_id", refs: "id", onDelete: "Cascade" }),
      author: rel.one("user", { on: "author_id", refs: "id", onDelete: "SetNull" }),
      parent: rel.one("comment", { on: "parent_id", refs: "id", onDelete: "NoAction" }),
      replies: rel.many("comment", { on: "parent_id", refs: "id" })
    }));
    exports.Tag = (0, core_2.model)("tags", {
      id: core_1.f.id(),
      name: core_1.f.string().unique(),
      description: core_1.f.text().optional(),
      created_at: core_1.f.dateTime().default("now")
    }).relate(() => ({
      post_tags: rel.many("postTag", { on: "tag_id", refs: "id" })
    }));
    exports.PostTag = (0, core_2.model)("post_tags", {
      id: core_1.f.id(),
      post_id: core_1.f.objectId(),
      tag_id: core_1.f.objectId(),
      created_at: core_1.f.dateTime().default("now")
    }, {
      uniques: [["post_id", "tag_id"]]
    }).relate(() => ({
      post: rel.one("post", { on: "post_id", refs: "id", onDelete: "Cascade" }),
      tag: rel.one("tag", { on: "tag_id", refs: "id", onDelete: "Cascade" })
    }));
    exports.Like = (0, core_2.model)("likes", {
      id: core_1.f.id(),
      user_id: core_1.f.objectId(),
      post_id: core_1.f.objectId(),
      kind: core_1.f.enumOf(exports.LikeKind.values).default("LIKE"),
      created_at: core_1.f.dateTime().default("now")
    }, {
      uniques: [["user_id", "post_id", "kind"]]
    }).relate(() => ({
      user: rel.one("user", { on: "user_id", refs: "id", onDelete: "Cascade" }),
      post: rel.one("post", { on: "post_id", refs: "id", onDelete: "Cascade" })
    }));
    exports.AuditLog = (0, core_2.model)("audit_logs", {
      id: core_1.f.id(),
      actor_id: core_1.f.objectId().optional(),
      event: core_1.f.string(),
      payload: core_1.f.json().optional(),
      created_at: core_1.f.dateTime().default("now"),
      deleted_at: core_1.f.dateTime().softDeleteAt()
    }, {
      indexes: [{ keys: { actor_id: 1, created_at: -1 } }]
    }).relate(() => ({
      actor: rel.one("user", { on: "actor_id", refs: "id", onDelete: "SetNull" })
    }));
    exports.PublishedPosts = (0, core_2.model)("published_posts", {
      id: core_1.f.id(),
      title: core_1.f.string(),
      slug: core_1.f.string(),
      author_id: core_1.f.objectId(),
      view_count: core_1.f.int(),
      published_at: core_1.f.dateTime().optional()
    }).asView({
      sql: `SELECT id, title, slug, author_id, view_count, published_at FROM posts WHERE status = 'PUBLISHED'`,
      sourceCollection: "posts",
      pipeline: [
        { $match: { status: "PUBLISHED" } },
        { $project: { _id: 1, title: 1, slug: 1, author_id: 1, view_count: 1, published_at: 1 } }
      ]
    });
    exports.PostStats = (0, core_2.model)("post_stats", {
      author_id: core_1.f.objectId(),
      post_count: core_1.f.bigint(),
      total_views: core_1.f.bigint()
    }).asView({
      materialised: true,
      sql: `SELECT author_id, COUNT(*) AS post_count, COALESCE(SUM(view_count), 0) AS total_views FROM posts GROUP BY author_id`,
      sourceCollection: "posts",
      pipeline: [
        { $group: { _id: "$author_id", post_count: { $sum: 1 }, total_views: { $sum: "$view_count" } } },
        { $project: { _id: 0, author_id: "$_id", post_count: 1, total_views: 1 } },
        { $out: "post_stats" }
      ]
    });
    exports.sampleSchema = {
      user: exports.User,
      profile: exports.Profile,
      post: exports.Post,
      comment: exports.Comment,
      tag: exports.Tag,
      postTag: exports.PostTag,
      like: exports.Like,
      auditLog: exports.AuditLog,
      publishedPosts: exports.PublishedPosts,
      postStats: exports.PostStats
    };
    (0, active_1.setActiveSchema)(exports.sampleSchema);
    exports.schema = new Proxy({}, {
      get: (_t3, k) => (0, active_1.getActiveSchema)()[k],
      has: (_t3, k) => k in (0, active_1.getActiveSchema)(),
      ownKeys: () => Reflect.ownKeys((0, active_1.getActiveSchema)()),
      getOwnPropertyDescriptor: (_t3, k) => {
        const a2 = (0, active_1.getActiveSchema)();
        if (!(k in a2))
          return void 0;
        return { enumerable: true, configurable: true, writable: false, value: a2[k] };
      }
    });
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/coerce.js
var require_coerce = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/coerce.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coerceFieldValue = coerceFieldValue;
    exports.appKeyToDbKey = appKeyToDbKey;
    exports.dbKeyToAppKey = dbKeyToAppKey;
    exports.getFieldDef = getFieldDef;
    exports.applyCreateDefaults = applyCreateDefaults;
    exports.applyUpdateTimestamps = applyUpdateTimestamps;
    exports.coerceCreatePayload = coerceCreatePayload;
    exports.decodeRow = decodeRow;
    exports.coerceExtendedJSON = coerceExtendedJSON;
    var bson_1 = require_bson();
    var idStringToObjectId = (v2) => {
      if (v2 == null)
        return v2;
      if (v2 instanceof (0, bson_1.mongo)().ObjectId)
        return v2;
      if (typeof v2 === "string" && (0, bson_1.mongo)().ObjectId.isValid(v2))
        return new ((0, bson_1.mongo)()).ObjectId(v2);
      return v2;
    };
    var dateInToDate = (v2) => {
      if (v2 == null)
        return v2;
      if (v2 instanceof Date)
        return v2;
      if (typeof v2 === "string" || typeof v2 === "number") {
        const d2 = new Date(v2);
        return isNaN(d2.getTime()) ? v2 : d2;
      }
      return v2;
    };
    function coerceFieldValue(field, value) {
      if (value == null || field == null)
        return value;
      if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof (0, bson_1.mongo)().ObjectId)) {
        const out = {};
        let isOp = false;
        for (const k of Object.keys(value)) {
          if (k.startsWith("$")) {
            isOp = true;
            const sub = value[k];
            if (Array.isArray(sub))
              out[k] = sub.map((x2) => coerceFieldValue(field, x2));
            else
              out[k] = coerceFieldValue(field, sub);
          } else if (isOp) {
            out[k] = value[k];
          }
        }
        if (isOp)
          return out;
      }
      if (Array.isArray(value)) {
        return value.map((v2) => coerceFieldValue(field, v2));
      }
      switch (field.kind) {
        case "id":
        case "objectId":
          return idStringToObjectId(value);
        case "dateTime":
          return dateInToDate(value);
        case "embed":
        case "embedMany": {
          const embed = field.embedOf?.();
          if (!embed)
            return value;
          if (field.kind === "embedMany" && Array.isArray(value)) {
            return value.map((v2) => coerceEmbed(v2, embed.fields));
          }
          return coerceEmbed(value, embed.fields);
        }
        default:
          return value;
      }
    }
    function coerceEmbed(value, fields) {
      if (value == null || typeof value !== "object")
        return value;
      const out = { ...value };
      for (const k of Object.keys(out)) {
        const f3 = fields[k];
        if (f3)
          out[k] = coerceFieldValue(f3, out[k]);
      }
      return out;
    }
    function appKeyToDbKey(key) {
      return key === "id" ? "_id" : key;
    }
    function dbKeyToAppKey(key) {
      return key === "_id" ? "id" : key;
    }
    function getFieldDef(model3, appKey) {
      if (appKey === "_id")
        return model3.fields["id"];
      return model3.fields[appKey];
    }
    function applyCreateDefaults(model3, data) {
      const out = { ...data };
      const entries = Object.entries(model3.fields);
      for (const [name, def] of entries) {
        if (out[name] !== void 0)
          continue;
        if (def.default) {
          if (def.default.kind === "now")
            out[name] = /* @__PURE__ */ new Date();
          else if (def.default.kind === "autoId")
            out[name] = new ((0, bson_1.mongo)()).ObjectId();
          else
            out[name] = def.default.value;
        }
      }
      return out;
    }
    function applyUpdateTimestamps(model3, data) {
      const out = { ...data };
      const entries = Object.entries(model3.fields);
      for (const [name, def] of entries) {
        if (def.updatedAt && out[name] === void 0) {
          out[name] = /* @__PURE__ */ new Date();
        }
      }
      return out;
    }
    function coerceCreatePayload(model3, data) {
      const withDefaults = applyCreateDefaults(model3, data);
      const out = {};
      for (const k of Object.keys(withDefaults)) {
        const dbKey = appKeyToDbKey(k);
        const def = getFieldDef(model3, k);
        out[dbKey] = coerceFieldValue(def, withDefaults[k]);
      }
      return out;
    }
    function decodeRow(model3, doc) {
      if (doc == null)
        return doc;
      const out = {};
      for (const k of Object.keys(doc)) {
        const appKey = dbKeyToAppKey(k);
        const def = getFieldDef(model3, appKey);
        out[appKey] = decodeValue(def, doc[k]);
      }
      return out;
    }
    function decodeValue(field, value) {
      if (value == null)
        return value;
      if (value instanceof (0, bson_1.mongo)().ObjectId)
        return value.toString();
      if (Array.isArray(value))
        return value.map((v2) => decodeValue(field, v2));
      if (field?.kind === "embed" || field?.kind === "embedMany") {
        const embed = field.embedOf?.();
        if (!embed)
          return value;
        if (Array.isArray(value)) {
          return value.map((v2) => decodeEmbed(v2, embed.fields));
        }
        return decodeEmbed(value, embed.fields);
      }
      return value;
    }
    function decodeEmbed(value, fields) {
      if (value == null || typeof value !== "object")
        return value;
      const out = {};
      for (const k of Object.keys(value)) {
        const def = fields[k];
        out[k] = decodeValue(def, value[k]);
      }
      return out;
    }
    function coerceExtendedJSON(value) {
      if (value == null)
        return value;
      if (typeof value !== "object")
        return value;
      if (value instanceof Date)
        return value;
      if (typeof value === "object" && value._bsontype === "ObjectId") {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map(coerceExtendedJSON);
      }
      const obj = value;
      const keys = Object.keys(obj);
      if (keys.length === 1) {
        const k = keys[0];
        if (k === "$oid" && typeof obj.$oid === "string") {
          if ((0, bson_1.mongo)().ObjectId.isValid(obj.$oid)) {
            return new ((0, bson_1.mongo)()).ObjectId(obj.$oid);
          }
        }
        if (k === "$date") {
          const v2 = obj.$date;
          const d2 = typeof v2 === "string" || typeof v2 === "number" ? new Date(v2) : v2;
          if (d2 instanceof Date && !isNaN(d2.getTime()))
            return d2;
        }
      }
      const out = {};
      for (const k of keys)
        out[k] = coerceExtendedJSON(obj[k]);
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowMongoError = rethrowMongoError;
    exports.notFoundError = notFoundError;
    var DbKnownError = class extends Error {
      code;
      meta;
      constructor(code, message, meta) {
        super(message);
        this.name = "DbKnownError";
        this.code = code;
        this.meta = meta;
      }
    };
    exports.DbKnownError = DbKnownError;
    var DUP_KEY_MONGO = 11e3;
    var DUP_KEY_INDEX_RE = /index:\s+([^\s]+)\s+dup key/;
    function rethrowMongoError(err, model3) {
      if (err && (err.code === DUP_KEY_MONGO || err.code === "11000")) {
        const m2 = String(err.message || "").match(DUP_KEY_INDEX_RE);
        throw new DbKnownError("P2002", `Unique constraint failed on ${model3}`, {
          target: m2 ? [m2[1]] : void 0,
          modelName: model3
        });
      }
      throw err;
    }
    function notFoundError(model3, where) {
      return new DbKnownError("P2025", `No ${model3} found matching the given criteria`, { modelName: model3, cause: where });
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/cursor.js
var require_cursor = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/cursor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildCursor = buildCursor;
    function buildCursor(cursor) {
      if (!cursor || typeof cursor !== "object")
        return void 0;
      const fields = {};
      for (const key of Object.keys(cursor)) {
        const v2 = cursor[key];
        if (v2 == null)
          continue;
        if (typeof v2 === "object" && !(v2 instanceof Date) && !Array.isArray(v2)) {
          for (const inner of Object.keys(v2))
            fields[inner] = v2[inner];
        } else {
          fields[key] = v2;
        }
      }
      return Object.keys(fields).length ? { fields } : void 0;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/orderby.js
var require_orderby = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/orderby.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildOrderBy = buildOrderBy;
    function buildOrderBy(orderBy) {
      if (orderBy == null)
        return void 0;
      const arr = Array.isArray(orderBy) ? orderBy : [orderBy];
      const out = [];
      for (const entry of arr) {
        if (!entry || typeof entry !== "object")
          continue;
        for (const key of Object.keys(entry)) {
          const v2 = entry[key];
          if (v2 == null)
            continue;
          if (typeof v2 === "string") {
            out.push({ field: key, direction: v2 === "desc" ? "desc" : "asc" });
            continue;
          }
          if (typeof v2 === "object") {
            if (v2.nearTo) {
              if (Array.isArray(v2.nearTo)) {
                out.push({
                  field: key,
                  direction: v2.direction === "desc" ? "desc" : "asc",
                  nearTo: { vector: v2.nearTo }
                });
                continue;
              }
              if (typeof v2.nearTo === "object" && typeof v2.nearTo.lng === "number" && typeof v2.nearTo.lat === "number") {
                out.push({
                  field: key,
                  direction: v2.direction === "desc" ? "desc" : "asc",
                  nearTo: { lng: v2.nearTo.lng, lat: v2.nearTo.lat }
                });
                continue;
              }
            }
            if (typeof v2.sort === "string") {
              const entry2 = {
                field: key,
                direction: v2.sort === "desc" ? "desc" : "asc"
              };
              if (v2.nulls === "first" || v2.nulls === "last")
                entry2.nulls = v2.nulls;
              out.push(entry2);
            }
          }
        }
      }
      return out.length ? out : void 0;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/projection.js
var require_projection = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/projection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildProjection = buildProjection;
    function buildProjection(model3, args, schema) {
      const relations = model3.relations();
      if (args.omit && !args.select && !args.include) {
        const drop = [];
        for (const k of Object.keys(args.omit)) {
          if (args.omit[k])
            drop.push(k);
        }
        if (drop.length === 0)
          return {};
        return { projection: { fields: [], omit: drop, counts: [], exclusive: false } };
      }
      if (args.include) {
        const hydration = [];
        const counts = [];
        for (const key of Object.keys(args.include)) {
          const v2 = args.include[key];
          if (v2 === false || v2 == null)
            continue;
          if (key === "_count") {
            if (v2 && typeof v2 === "object" && v2.select) {
              for (const rk of Object.keys(v2.select))
                if (v2.select[rk])
                  counts.push(rk);
            }
            continue;
          }
          const rel = relations[key];
          if (!rel)
            continue;
          hydration.push(toRelationPlan(key, rel, v2 === true ? {} : v2, schema));
        }
        const omitFields = args.omit ? Object.keys(args.omit).filter((k) => args.omit[k]) : void 0;
        return {
          projection: counts.length || omitFields?.length ? { fields: [], omit: omitFields, counts, exclusive: false } : void 0,
          hydration: hydration.length ? hydration : void 0
        };
      }
      if (args.select) {
        const fields = [];
        const hydration = [];
        const counts = [];
        for (const key of Object.keys(args.select)) {
          const v2 = args.select[key];
          if (v2 === false || v2 == null)
            continue;
          if (key === "_count") {
            if (v2 && typeof v2 === "object" && v2.select) {
              for (const rk of Object.keys(v2.select))
                if (v2.select[rk])
                  counts.push(rk);
            }
            continue;
          }
          const rel = relations[key];
          if (rel) {
            hydration.push(toRelationPlan(key, rel, v2 === true ? {} : v2, schema));
            continue;
          }
          fields.push(key);
        }
        return {
          projection: { fields, counts, exclusive: true },
          hydration: hydration.length ? hydration : void 0
        };
      }
      return {};
    }
    function toRelationPlan(name, rel, nestedArgs, schema) {
      const plan = {
        name,
        kind: rel.kind,
        target: rel.target,
        on: rel.on,
        refs: rel.refs
      };
      if (!nestedArgs)
        return plan;
      const hasNested = nestedArgs.select || nestedArgs.include || nestedArgs.omit || nestedArgs.where || nestedArgs.orderBy || nestedArgs.take !== void 0 || nestedArgs.skip !== void 0 || nestedArgs.limit !== void 0 || nestedArgs.offset !== void 0 || nestedArgs.distinct;
      if (!hasNested)
        return plan;
      const targetModel = schema?.[rel.target];
      if (targetModel) {
        plan.nested = {
          cardinality: rel.kind === "one" ? "one" : "many",
          limit: nestedArgs.take ?? nestedArgs.limit,
          offset: nestedArgs.skip ?? nestedArgs.offset,
          ...{ __rawArgs: nestedArgs, __target: rel.target }
        };
      } else {
        plan.nested = {
          cardinality: rel.kind === "one" ? "one" : "many",
          limit: nestedArgs.take ?? nestedArgs.limit,
          offset: nestedArgs.skip ?? nestedArgs.offset,
          ...{ __rawArgs: nestedArgs }
        };
      }
      return plan;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/data.js
var require_data = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/data.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildUpdateData = buildUpdateData;
    function buildUpdateData(_model, data) {
      const out = {};
      if (!data || typeof data !== "object")
        return out;
      for (const key of Object.keys(data)) {
        const v2 = data[key];
        if (v2 === void 0)
          continue;
        if (v2 && typeof v2 === "object" && !Array.isArray(v2) && !(v2 instanceof Date)) {
          if ("set" in v2) {
            (out.set ??= {})[key] = v2.set;
            continue;
          }
          if ("increment" in v2) {
            (out.increment ??= {})[key] = Number(v2.increment);
            continue;
          }
          if ("decrement" in v2) {
            (out.increment ??= {})[key] = -Number(v2.decrement);
            continue;
          }
          if ("multiply" in v2) {
            (out.multiply ??= {})[key] = Number(v2.multiply);
            continue;
          }
          if ("divide" in v2) {
            (out.multiply ??= {})[key] = 1 / Number(v2.divide);
            continue;
          }
          if ("push" in v2) {
            (out.push ??= {})[key] = v2.push;
            continue;
          }
          if ("unset" in v2 && v2.unset === true) {
            (out.unset ??= []).push(key);
            continue;
          }
        }
        (out.set ??= {})[key] = v2;
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/col.js
var require_col = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/col.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FORGE_COL = void 0;
    exports.col = col;
    exports.isColRef = isColRef;
    exports.colRefField = colRefField;
    exports.FORGE_COL = /* @__PURE__ */ Symbol.for("forge.orm.col");
    function col(field) {
      if (typeof field !== "string" || field.length === 0) {
        throw new Error("[forge] col() requires a non-empty field name");
      }
      return { [exports.FORGE_COL]: field };
    }
    function isColRef(v2) {
      return typeof v2 === "object" && v2 !== null && typeof v2[exports.FORGE_COL] === "string";
    }
    function colRefField(v2) {
      return v2[exports.FORGE_COL];
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/where.js
var require_where = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/where.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildWhereTree = buildWhereTree;
    var col_1 = require_col();
    var SCALAR_OPS = {
      equals: "eq",
      not: "ne",
      in: "in",
      notIn: "nin",
      lt: "lt",
      lte: "lte",
      gt: "gt",
      gte: "gte",
      contains: "contains",
      startsWith: "startsWith",
      endsWith: "endsWith",
      has: "has",
      hasSome: "hasSome",
      hasEvery: "hasEvery",
      isEmpty: "isEmpty",
      search: "search"
    };
    var COL_REF_OPS = /* @__PURE__ */ new Set([
      "eq",
      "ne",
      "lt",
      "lte",
      "gt",
      "gte"
    ]);
    function resolveColRef(model3, op, ref) {
      if (!COL_REF_OPS.has(op)) {
        throw new Error(`[forge] col() can only be used with equals/not/lt/lte/gt/gte (got operator '${op}' on '${model3.collection}').`);
      }
      const field = (0, col_1.colRefField)(ref);
      const fieldDef = model3.fields?.[field];
      if (!fieldDef) {
        throw new Error(`[forge] col('${field}') references a field that does not exist on '${model3.collection}'.`);
      }
      if (fieldDef.kind === "relation") {
        throw new Error(`[forge] col('${field}') must reference a scalar field, not a relation, on '${model3.collection}'.`);
      }
      return field;
    }
    function buildWhereTree(model3, where, schema) {
      if (!where || typeof where !== "object")
        return void 0;
      const children = [];
      const relations = model3.relations();
      for (const key of Object.keys(where)) {
        const value = where[key];
        if (value === void 0)
          continue;
        if (key === "AND") {
          const arr = Array.isArray(value) ? value : [value];
          const inner = arr.map((v2) => buildWhereTree(model3, v2, schema)).filter(notUndef);
          if (inner.length)
            children.push({ kind: "and", children: inner });
          continue;
        }
        if (key === "OR") {
          const arr = Array.isArray(value) ? value : [value];
          const inner = arr.map((v2) => buildWhereTree(model3, v2, schema)).filter(notUndef);
          if (inner.length)
            children.push({ kind: "or", children: inner });
          continue;
        }
        if (key === "NOT") {
          const arr = Array.isArray(value) ? value : [value];
          const inner = arr.map((v2) => buildWhereTree(model3, v2, schema)).filter(notUndef);
          if (inner.length === 1)
            children.push({ kind: "not", child: inner[0] });
          else if (inner.length > 1)
            children.push({ kind: "not", child: { kind: "and", children: inner } });
          continue;
        }
        const rel = relations[key];
        if (rel && value && typeof value === "object") {
          const targetModel = schema?.[rel.target] ?? model3;
          for (const mode of ["is", "isNot", "some", "every", "none"]) {
            if (mode in value) {
              const nested = buildWhereTree(targetModel, value[mode], schema) ?? null;
              children.push({ kind: "relation", relation: key, mode, nested });
            }
          }
          continue;
        }
        if ((0, col_1.isColRef)(value)) {
          children.push({
            kind: "leaf",
            field: key,
            op: "eq",
            value: void 0,
            rhsField: resolveColRef(model3, "eq", value)
          });
        } else if (value && typeof value === "object" && !Array.isArray(value) && !isDate(value)) {
          const insensitive = value.mode === "insensitive";
          if ("near" in value && value.near && typeof value.near === "object") {
            const fdef = model3.fields?.[key];
            if (fdef?.kind === "vector") {
              const n2 = value.near;
              if (!Array.isArray(n2.vector) || n2.vector.length === 0) {
                throw new Error(`[forge] where.${key}.near.vector must be a non-empty number[].`);
              }
              if (fdef.vector?.dims && n2.vector.length !== fdef.vector.dims) {
                throw new Error(`[forge] where.${key}.near.vector length ${n2.vector.length} does not match the column dims ${fdef.vector.dims}.`);
              }
              children.push({
                kind: "leaf",
                field: key,
                op: "near",
                value: { vector: n2.vector, withinDistance: n2.withinDistance }
              });
              continue;
            }
            const n = value.near;
            if (typeof n.lng !== "number" || typeof n.lat !== "number") {
              throw new Error(`[forge] where.${key}.near requires numeric { lng, lat } for geo OR { vector: [...] } for vector fields.`);
            }
            children.push({
              kind: "leaf",
              field: key,
              op: "near",
              value: { lng: n.lng, lat: n.lat, withinMeters: n.withinMeters }
            });
            continue;
          }
          if ("path" in value && (typeof value.path === "string" || Array.isArray(value.path))) {
            const fdef = model3.fields?.[key];
            if (!fdef || !["json", "embed", "embedMany", "stringArray", "intArray"].includes(fdef.kind)) {
              throw new Error(`[forge] where.${key}.path can only be used on json / embed / array fields. '${key}' is kind=${fdef?.kind ?? "unknown"}.`);
            }
            const pathArr = typeof value.path === "string" ? parseJsonPath(value.path) : value.path.map(String);
            let subOp = "eq";
            let subValue = null;
            const subOpKeys = ["eq", "ne", "lt", "lte", "gt", "gte", "contains", "in", "has"];
            for (const k of subOpKeys) {
              if (k in value) {
                subOp = k;
                subValue = value[k];
                break;
              }
            }
            children.push({
              kind: "leaf",
              field: key,
              op: "jsonPath",
              value: subValue,
              jsonPath: { path: pathArr, subOp }
            });
            continue;
          }
          if ("withinPolygon" in value && value.withinPolygon != null) {
            const normalised = normaliseWithinPolygon(key, value.withinPolygon);
            children.push({
              kind: "leaf",
              field: key,
              op: "withinPolygon",
              value: { multiPolygon: normalised }
            });
            continue;
          }
          for (const op of Object.keys(value)) {
            if (op === "mode")
              continue;
            if (op === "near")
              continue;
            if (op === "withinPolygon")
              continue;
            if (op === "path")
              continue;
            const irOp = SCALAR_OPS[op];
            if (!irOp)
              continue;
            const operand = value[op];
            if ((0, col_1.isColRef)(operand)) {
              children.push({
                kind: "leaf",
                field: key,
                op: irOp,
                value: void 0,
                rhsField: resolveColRef(model3, irOp, operand)
              });
              continue;
            }
            children.push({
              kind: "leaf",
              field: key,
              op: irOp,
              value: operand,
              caseInsensitive: insensitive || void 0
            });
          }
        } else {
          children.push({ kind: "leaf", field: key, op: "eq", value });
        }
      }
      if (children.length === 0)
        return void 0;
      if (children.length === 1)
        return children[0];
      return { kind: "and", children };
    }
    function notUndef(v2) {
      return v2 !== void 0;
    }
    function isDate(v2) {
      return v2 instanceof Date;
    }
    function normaliseWithinPolygon(key, raw) {
      if (Array.isArray(raw)) {
        return [[validateAndCloseRing(key, raw)]];
      }
      if (!raw || typeof raw !== "object") {
        throw new Error(`[forge] where.${key}.withinPolygon must be a ring, Polygon, MultiPolygon, or GeometryCollection.`);
      }
      const obj = raw;
      if (obj.type === "Polygon") {
        if (!Array.isArray(obj.rings) || obj.rings.length === 0) {
          throw new Error(`[forge] where.${key}.withinPolygon: Polygon needs at least one ring in 'rings'.`);
        }
        return [obj.rings.map((r) => validateAndCloseRing(key, r))];
      }
      if (obj.type === "MultiPolygon") {
        if (!Array.isArray(obj.polygons) || obj.polygons.length === 0) {
          throw new Error(`[forge] where.${key}.withinPolygon: MultiPolygon needs at least one polygon in 'polygons'.`);
        }
        return obj.polygons.map((p2) => {
          if (!Array.isArray(p2) || p2.length === 0) {
            throw new Error(`[forge] where.${key}.withinPolygon: each MultiPolygon entry needs at least one ring.`);
          }
          return p2.map((r) => validateAndCloseRing(key, r));
        });
      }
      if (obj.type === "GeometryCollection") {
        if (!Array.isArray(obj.geometries) || obj.geometries.length === 0) {
          throw new Error(`[forge] where.${key}.withinPolygon: GeometryCollection needs entries in 'geometries'.`);
        }
        const out = [];
        for (const g of obj.geometries) {
          out.push(...normaliseWithinPolygon(key, g));
        }
        return out;
      }
      throw new Error(`[forge] where.${key}.withinPolygon: unsupported type '${String(obj.type)}'.`);
    }
    function validateAndCloseRing(key, ring) {
      if (!Array.isArray(ring) || ring.length < 3) {
        throw new Error(`[forge] where.${key}.withinPolygon: each ring needs at least 3 vertices.`);
      }
      const pts = [];
      for (const v2 of ring) {
        if (typeof v2?.lng !== "number" || typeof v2?.lat !== "number") {
          throw new Error(`[forge] where.${key}.withinPolygon vertex requires numeric { lng, lat }.`);
        }
        pts.push({ lng: v2.lng, lat: v2.lat });
      }
      const first = pts[0], last = pts[pts.length - 1];
      if (first.lng !== last.lng || first.lat !== last.lat)
        pts.push({ lng: first.lng, lat: first.lat });
      return pts;
    }
    function parseJsonPath(s) {
      const out = [];
      const tokens = s.split(".");
      for (const t of tokens) {
        const match = t.match(/^([^[\]]+)((?:\[\d+\])*)$/);
        if (!match) {
          throw new Error(`[forge] invalid JSON path segment: '${t}' in '${s}'`);
        }
        if (match[1])
          out.push(match[1]);
        if (match[2]) {
          const idxs = match[2].match(/\[(\d+)\]/g) ?? [];
          for (const idx of idxs)
            out.push(idx.slice(1, -1));
        }
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/index.js
var require_build = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/ir/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildCursor = exports.buildUpdateData = exports.buildProjection = exports.buildOrderBy = exports.buildWhereTree = void 0;
    exports.buildSelect = buildSelect;
    exports.buildCount = buildCount;
    exports.buildInsert = buildInsert;
    exports.buildUpdate = buildUpdate;
    exports.buildDelete = buildDelete;
    exports.buildGroupBy = buildGroupBy;
    var cursor_1 = require_cursor();
    Object.defineProperty(exports, "buildCursor", { enumerable: true, get: function() {
      return cursor_1.buildCursor;
    } });
    var orderby_1 = require_orderby();
    Object.defineProperty(exports, "buildOrderBy", { enumerable: true, get: function() {
      return orderby_1.buildOrderBy;
    } });
    var projection_1 = require_projection();
    Object.defineProperty(exports, "buildProjection", { enumerable: true, get: function() {
      return projection_1.buildProjection;
    } });
    var data_1 = require_data();
    Object.defineProperty(exports, "buildUpdateData", { enumerable: true, get: function() {
      return data_1.buildUpdateData;
    } });
    var where_1 = require_where();
    Object.defineProperty(exports, "buildWhereTree", { enumerable: true, get: function() {
      return where_1.buildWhereTree;
    } });
    function buildSelect(modelKey, model3, args, cardinality, schema) {
      const a2 = args ?? {};
      const { projection, hydration } = (0, projection_1.buildProjection)(model3, a2, schema);
      const node = {
        kind: "select",
        model: modelKey,
        cardinality,
        where: (0, where_1.buildWhereTree)(model3, a2.where, schema),
        projection,
        hydration: hydration ? materialiseHydration(hydration, schema) : void 0,
        orderBy: (0, orderby_1.buildOrderBy)(a2.orderBy),
        limit: a2.take ?? a2.limit,
        offset: a2.skip ?? a2.offset,
        cursor: (0, cursor_1.buildCursor)(a2.cursor),
        distinct: a2.distinct?.length ? a2.distinct : void 0
      };
      return node;
    }
    function materialiseHydration(hydration, schema) {
      if (!schema)
        return hydration;
      return hydration.map((rp) => {
        if (!rp.nested)
          return rp;
        const raw = rp.nested.__rawArgs;
        const target = rp.nested.__target ?? rp.target;
        if (!raw)
          return rp;
        const targetModel = schema[target];
        if (!targetModel)
          return rp;
        const sub = buildSelect(target, targetModel, raw, rp.kind === "one" ? "one" : "many", schema);
        const { kind: _k, model: _m, cardinality, ...rest } = sub;
        return {
          ...rp,
          nested: { ...rest, cardinality }
        };
      });
    }
    function buildCount(modelKey, model3, args, schema) {
      const a2 = args ?? {};
      return {
        kind: "count",
        model: modelKey,
        where: (0, where_1.buildWhereTree)(model3, a2.where, schema),
        distinct: a2.distinct?.length ? a2.distinct : void 0
      };
    }
    function buildInsert(modelKey, model3, args, schema) {
      const { projection, hydration } = args.returning ? (0, projection_1.buildProjection)(model3, args.returning, schema) : {};
      return {
        kind: "insert",
        model: modelKey,
        rows: args.rows,
        skipDuplicates: args.skipDuplicates,
        returning: projection,
        hydration: hydration ? materialiseHydration(hydration, schema) : void 0
      };
    }
    function buildUpdate(modelKey, model3, args, schema) {
      const frag = (0, data_1.buildUpdateData)(model3, args.data);
      const { projection, hydration } = args.returning ? (0, projection_1.buildProjection)(model3, args.returning, schema) : {};
      return {
        kind: "update",
        model: modelKey,
        where: (0, where_1.buildWhereTree)(model3, args.where, schema) ?? { kind: "and", children: [] },
        set: frag.set,
        increment: frag.increment,
        multiply: frag.multiply,
        push: frag.push,
        unset: frag.unset,
        many: !!args.many,
        upsertCreate: args.upsertCreate,
        returning: projection,
        hydration: hydration ? materialiseHydration(hydration, schema) : void 0,
        semantic: args.semantic
      };
    }
    function buildDelete(modelKey, model3, args, schema) {
      const { projection } = args.returning ? (0, projection_1.buildProjection)(model3, args.returning, schema) : {};
      return {
        kind: "delete",
        model: modelKey,
        where: (0, where_1.buildWhereTree)(model3, args.where, schema) ?? { kind: "and", children: [] },
        many: !!args.many,
        returning: projection
      };
    }
    var AGG_BUCKETS = /* @__PURE__ */ new Set(["_count", "_avg", "_sum", "_min", "_max"]);
    function normalizeHaving(having) {
      if (!having || typeof having !== "object")
        return having;
      const out = {};
      for (const [key, val] of Object.entries(having)) {
        if (!val || typeof val !== "object")
          continue;
        if (AGG_BUCKETS.has(key)) {
          out[key] = { ...out[key] ?? {}, ...val };
        } else {
          for (const [bucket, opObj] of Object.entries(val)) {
            if (!AGG_BUCKETS.has(bucket))
              continue;
            (out[bucket] ??= {})[key] = opObj;
          }
        }
      }
      return out;
    }
    function buildGroupBy(modelKey, model3, args, schema) {
      return {
        kind: "groupBy",
        model: modelKey,
        by: args.by,
        where: (0, where_1.buildWhereTree)(model3, args.where, schema),
        having: normalizeHaving(args.having),
        _count: args._count,
        _avg: args._avg,
        _sum: args._sum,
        _min: args._min,
        _max: args._max,
        orderBy: (0, orderby_1.buildOrderBy)(args.orderBy),
        limit: args.take ?? args.limit,
        offset: args.skip ?? args.offset
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/wkt.js
var require_wkt = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/wkt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toMultiPolygonWKT = toMultiPolygonWKT;
    exports.toPolygonWKT = toPolygonWKT;
    exports.toGeoWKT = toGeoWKT;
    exports.multiPolygonBbox = multiPolygonBbox;
    exports.toGeoJson = toGeoJson;
    function ringWKT(ring, axis) {
      return ring.map((p2) => axis === "lat-lng" ? `${p2.lat} ${p2.lng}` : `${p2.lng} ${p2.lat}`).join(", ");
    }
    function polygonWKTBody(polygon, axis) {
      return polygon.map((r) => `(${ringWKT(r, axis)})`).join(", ");
    }
    function toMultiPolygonWKT(mp, axis = "lng-lat") {
      if (mp.length === 0)
        throw new Error("[forge:wkt] empty MultiPolygon");
      return `MULTIPOLYGON(${mp.map((p2) => `(${polygonWKTBody(p2, axis)})`).join(", ")})`;
    }
    function toPolygonWKT(polygon, axis = "lng-lat") {
      return `POLYGON(${polygonWKTBody(polygon, axis)})`;
    }
    function toGeoWKT(mp, axis = "lng-lat") {
      if (mp.length === 1)
        return toPolygonWKT(mp[0], axis);
      return toMultiPolygonWKT(mp, axis);
    }
    function multiPolygonBbox(mp) {
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const polygon of mp) {
        for (const ring of polygon) {
          for (const p2 of ring) {
            if (p2.lng < minLng)
              minLng = p2.lng;
            if (p2.lng > maxLng)
              maxLng = p2.lng;
            if (p2.lat < minLat)
              minLat = p2.lat;
            if (p2.lat > maxLat)
              maxLat = p2.lat;
          }
        }
      }
      return { minLng, maxLng, minLat, maxLat };
    }
    function toGeoJson(mp) {
      if (mp.length === 1) {
        return {
          type: "Polygon",
          coordinates: mp[0].map((ring) => ring.map((p2) => [p2.lng, p2.lat]))
        };
      }
      return {
        type: "MultiPolygon",
        coordinates: mp.map((polygon) => polygon.map((ring) => ring.map((p2) => [p2.lng, p2.lat])))
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/compile-from-ir.js
var require_compile_from_ir = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    exports.compileGroupBy = compileGroupBy;
    var schema_1 = require_schema();
    var coerce_1 = require_coerce();
    var wkt_1 = require_wkt();
    var ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;
    var escapeRegex = (s) => String(s).replace(ESCAPE_REGEX, "\\$&");
    function modelDef(modelKey, override) {
      if (override)
        return override;
      const m2 = schema_1.schema[modelKey];
      if (!m2)
        throw new Error(`[forge] unknown model '${modelKey}' in IR`);
      return m2;
    }
    function compileWhere(model3, tree) {
      if (!tree)
        return {};
      return compileWhereNode(model3, tree);
    }
    function compileWhereNode(model3, tree) {
      switch (tree.kind) {
        case "and": {
          const parts = tree.children.map((c) => compileWhereNode(model3, c)).filter(nonEmpty);
          if (parts.length === 0)
            return {};
          if (parts.length === 1)
            return parts[0];
          return { $and: parts };
        }
        case "or":
          return { $or: tree.children.map((c) => compileWhereNode(model3, c)) };
        case "not":
          return { $nor: [compileWhereNode(model3, tree.child)] };
        case "relation":
          return {};
        case "leaf":
          return compileLeaf(model3, tree);
      }
    }
    var EXPR_OPS = {
      eq: "$eq",
      ne: "$ne",
      lt: "$lt",
      lte: "$lte",
      gt: "$gt",
      gte: "$gte"
    };
    function compileLeaf(model3, leaf) {
      const dbKey = (0, coerce_1.appKeyToDbKey)(leaf.field);
      if (leaf.rhsField !== void 0) {
        const exprOp = EXPR_OPS[leaf.op];
        if (!exprOp) {
          throw new Error(`[forge] col() comparison not supported for op '${leaf.op}'`);
        }
        return {
          $expr: { [exprOp]: ["$" + dbKey, "$" + (0, coerce_1.appKeyToDbKey)(leaf.rhsField)] }
        };
      }
      const def = (0, coerce_1.getFieldDef)(model3, leaf.field);
      const coerce = (v2) => def ? (0, coerce_1.coerceFieldValue)(def, v2) : v2;
      const out = {};
      switch (leaf.op) {
        case "eq":
          out[dbKey] = coerce(leaf.value);
          return out;
        case "ne":
          out[dbKey] = { $ne: coerce(leaf.value) };
          return out;
        case "in":
          out[dbKey] = { $in: leaf.value.map(coerce) };
          return out;
        case "nin":
          out[dbKey] = { $nin: leaf.value.map(coerce) };
          return out;
        case "lt":
          out[dbKey] = { $lt: coerce(leaf.value) };
          return out;
        case "lte":
          out[dbKey] = { $lte: coerce(leaf.value) };
          return out;
        case "gt":
          out[dbKey] = { $gt: coerce(leaf.value) };
          return out;
        case "gte":
          out[dbKey] = { $gte: coerce(leaf.value) };
          return out;
        case "contains":
          out[dbKey] = leaf.caseInsensitive ? { $regex: escapeRegex(leaf.value), $options: "i" } : { $regex: escapeRegex(leaf.value) };
          return out;
        case "startsWith":
          out[dbKey] = leaf.caseInsensitive ? { $regex: "^" + escapeRegex(leaf.value), $options: "i" } : { $regex: "^" + escapeRegex(leaf.value) };
          return out;
        case "endsWith":
          out[dbKey] = leaf.caseInsensitive ? { $regex: escapeRegex(leaf.value) + "$", $options: "i" } : { $regex: escapeRegex(leaf.value) + "$" };
          return out;
        case "has":
          out[dbKey] = coerce(leaf.value);
          return out;
        case "hasSome":
          out[dbKey] = { $in: leaf.value.map(coerce) };
          return out;
        case "hasEvery":
          out[dbKey] = { $all: leaf.value.map(coerce) };
          return out;
        case "isEmpty":
          out[dbKey] = leaf.value ? { $size: 0 } : { $not: { $size: 0 } };
          return out;
        case "search": {
          out.$text = { $search: String(leaf.value) };
          return out;
        }
        case "jsonPath": {
          if (!leaf.jsonPath)
            return out;
          const dotted = [dbKey, ...leaf.jsonPath.path].join(".");
          const op = leaf.jsonPath.subOp;
          const v2 = leaf.value;
          if (op === "eq")
            out[dotted] = v2;
          else if (op === "ne")
            out[dotted] = { $ne: v2 };
          else if (op === "lt")
            out[dotted] = { $lt: v2 };
          else if (op === "lte")
            out[dotted] = { $lte: v2 };
          else if (op === "gt")
            out[dotted] = { $gt: v2 };
          else if (op === "gte")
            out[dotted] = { $gte: v2 };
          else if (op === "in")
            out[dotted] = { $in: v2 };
          else if (op === "contains")
            out[dotted] = { $regex: escapeRegex(String(v2)) };
          else if (op === "has")
            out[dotted] = v2;
          return out;
        }
        case "near": {
          const point = leaf.value;
          const nearQuery = {
            $geometry: { type: "Point", coordinates: [point.lng, point.lat] }
          };
          if (point.withinMeters !== void 0) {
            nearQuery.$maxDistance = point.withinMeters;
          }
          out[dbKey] = { $near: nearQuery };
          return out;
        }
        case "withinPolygon": {
          const v2 = leaf.value;
          const multiPolygon = v2.multiPolygon ?? (v2.polygon ? [[v2.polygon]] : []);
          out[dbKey] = {
            $geoWithin: {
              $geometry: (0, wkt_1.toGeoJson)(multiPolygon)
            }
          };
          return out;
        }
      }
    }
    function nonEmpty(o) {
      return Object.keys(o).length > 0;
    }
    function compileProjection(plan) {
      if (!plan)
        return void 0;
      if (plan.omit?.length && plan.fields.length === 0) {
        const out = {};
        for (const f3 of plan.omit)
          out[(0, coerce_1.appKeyToDbKey)(f3)] = 0;
        return out;
      }
      if (plan.exclusive && plan.fields.length) {
        const out = {};
        for (const f3 of plan.fields)
          out[(0, coerce_1.appKeyToDbKey)(f3)] = 1;
        out._id = 1;
        return out;
      }
      return void 0;
    }
    function compileOrderBy(orderBy) {
      if (!orderBy?.length)
        return void 0;
      return orderBy.map((e) => [(0, coerce_1.appKeyToDbKey)(e.field), e.direction === "desc" ? -1 : 1]);
    }
    function compileCursor(model3, cursor) {
      if (!cursor?.fields)
        return void 0;
      const out = {};
      for (const key of Object.keys(cursor.fields)) {
        const def = (0, coerce_1.getFieldDef)(model3, key);
        const v2 = def ? (0, coerce_1.coerceFieldValue)(def, cursor.fields[key]) : cursor.fields[key];
        out[(0, coerce_1.appKeyToDbKey)(key)] = { $gt: v2 };
      }
      if (Object.keys(out).length === 1)
        return out;
      return { $and: Object.entries(out).map(([k, v2]) => ({ [k]: v2 })) };
    }
    function compileSelect(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const filter = compileWhere(m2, node.where);
      const cursorFilter = compileCursor(m2, node.cursor);
      const combined = cursorFilter ? Object.keys(filter).length ? { $and: [filter, cursorFilter] } : cursorFilter : filter;
      const projection = compileProjection(node.projection);
      const sort = compileOrderBy(node.orderBy);
      const op = node.cardinality === "one" ? "findOne" : "find";
      return {
        kind: "mongo",
        collection: m2.collection,
        op,
        args: {
          filter: combined,
          options: {
            projection,
            sort,
            limit: node.cardinality === "many" ? node.limit : void 0,
            skip: node.offset
          }
        },
        hydration: node.hydration?.map((r) => ({
          relation: r.name,
          via: r.kind,
          target: r.target,
          on: r.on,
          refs: r.refs
        }))
      };
    }
    function compileCount(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      return {
        kind: "mongo",
        collection: m2.collection,
        op: "countDocuments",
        args: { filter: compileWhere(m2, node.where) }
      };
    }
    function compileInsert(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const documents = node.rows;
      if (documents.length === 1) {
        return {
          kind: "mongo",
          collection: m2.collection,
          op: "insertOne",
          args: { document: documents[0] }
        };
      }
      return {
        kind: "mongo",
        collection: m2.collection,
        op: "insertMany",
        args: { documents, options: { ordered: !node.skipDuplicates } }
      };
    }
    function compileUpdate(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const update = {};
      if (node.set && Object.keys(node.set).length) {
        update.$set = remapKeys(m2, node.set);
      }
      if (node.increment && Object.keys(node.increment).length) {
        update.$inc = remapKeys(m2, node.increment);
      }
      if (node.multiply && Object.keys(node.multiply).length) {
        update.$mul = remapKeys(m2, node.multiply);
      }
      if (node.push && Object.keys(node.push).length) {
        update.$push = remapKeys(m2, node.push);
      }
      if (node.unset?.length) {
        update.$unset = Object.fromEntries(node.unset.map((k) => [(0, coerce_1.appKeyToDbKey)(k), ""]));
      }
      if (node.upsertCreate) {
        const writtenPaths = [
          ...Object.keys(update.$set || {}),
          ...Object.keys(update.$inc || {}),
          ...Object.keys(update.$mul || {}),
          ...Object.keys(update.$push || {}),
          ...Object.keys(update.$unset || {})
        ];
        const conflicts = (a2, b2) => a2 === b2 || a2.startsWith(b2 + ".") || b2.startsWith(a2 + ".");
        const setOnInsert = {};
        for (const [k, v2] of Object.entries(node.upsertCreate)) {
          if (!writtenPaths.some((w) => conflicts(k, w)))
            setOnInsert[k] = v2;
        }
        if (Object.keys(setOnInsert).length)
          update.$setOnInsert = setOnInsert;
      }
      const filter = compileWhere(m2, node.where);
      if (node.upsertCreate) {
        return {
          kind: "mongo",
          collection: m2.collection,
          op: "findOneAndUpdate",
          args: { filter, update, options: { upsert: true, returnDocument: "after" } }
        };
      }
      if (node.many) {
        return { kind: "mongo", collection: m2.collection, op: "updateMany", args: { filter, update } };
      }
      return {
        kind: "mongo",
        collection: m2.collection,
        op: "findOneAndUpdate",
        args: { filter, update, options: { returnDocument: "after" } }
      };
    }
    function compileDelete(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const filter = compileWhere(m2, node.where);
      if (node.many) {
        return { kind: "mongo", collection: m2.collection, op: "deleteMany", args: { filter } };
      }
      return { kind: "mongo", collection: m2.collection, op: "findOneAndDelete", args: { filter } };
    }
    function remapKeys(_m, obj) {
      const out = {};
      for (const k of Object.keys(obj))
        out[(0, coerce_1.appKeyToDbKey)(k)] = obj[k];
      return out;
    }
    function compileGroupBy(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const pipeline = [];
      if (node.where) {
        const f3 = compileWhere(m2, node.where);
        if (Object.keys(f3).length)
          pipeline.push({ $match: f3 });
      }
      const groupId = {};
      for (const f3 of node.by)
        groupId[f3] = `$${(0, coerce_1.appKeyToDbKey)(f3)}`;
      const groupStage = { _id: groupId };
      const addAgg = (bucket, field, mongoOp) => {
        const alias = `__agg_${bucket.slice(1)}_${field}`;
        if (field === "_all")
          groupStage[alias] = { $sum: 1 };
        else
          groupStage[alias] = { [mongoOp]: `$${(0, coerce_1.appKeyToDbKey)(field)}` };
      };
      if (node._count) {
        for (const [k, v2] of Object.entries(node._count))
          if (v2)
            addAgg("_count", k, "$sum");
      }
      if (node._avg) {
        for (const [k, v2] of Object.entries(node._avg))
          if (v2)
            addAgg("_avg", k, "$avg");
      }
      if (node._sum) {
        for (const [k, v2] of Object.entries(node._sum))
          if (v2)
            addAgg("_sum", k, "$sum");
      }
      if (node._min) {
        for (const [k, v2] of Object.entries(node._min))
          if (v2)
            addAgg("_min", k, "$min");
      }
      if (node._max) {
        for (const [k, v2] of Object.entries(node._max))
          if (v2)
            addAgg("_max", k, "$max");
      }
      pipeline.push({ $group: groupStage });
      if (node.having && typeof node.having === "object") {
        const havingMatch = {};
        for (const [bucket, inner] of Object.entries(node.having)) {
          if (!inner || typeof inner !== "object")
            continue;
          for (const [field, opObj] of Object.entries(inner)) {
            if (!opObj || typeof opObj !== "object")
              continue;
            const alias = `__agg_${bucket.replace(/^_/, "")}_${field}`;
            const cmp = {};
            for (const [op, val] of Object.entries(opObj)) {
              const mongoOp = { gt: "$gt", gte: "$gte", lt: "$lt", lte: "$lte", equals: "$eq", not: "$ne" }[op];
              if (mongoOp)
                cmp[mongoOp] = val;
            }
            if (Object.keys(cmp).length)
              havingMatch[alias] = cmp;
          }
        }
        if (Object.keys(havingMatch).length)
          pipeline.push({ $match: havingMatch });
      }
      if (node.orderBy?.length) {
        const sort = {};
        for (const e of node.orderBy) {
          const path = node.by.includes(e.field) ? `_id.${e.field}` : (0, coerce_1.appKeyToDbKey)(e.field);
          sort[path] = e.direction === "desc" ? -1 : 1;
        }
        pipeline.push({ $sort: sort });
      }
      if (node.offset != null)
        pipeline.push({ $skip: node.offset });
      if (node.limit != null)
        pipeline.push({ $limit: node.limit });
      return {
        kind: "mongo",
        collection: m2.collection,
        op: "aggregate",
        args: { pipeline }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/compile.js
var require_compile = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildMongoCompileApi = buildMongoCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir();
    var coerce_1 = require_coerce();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'. Use compile.delete()/compile.deleteMany() for hard deletes.`);
      }
      return sd;
    }
    function buildMongoCompileApi(model3) {
      const mk = modelKeyFor(model3);
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => {
          const row = (0, coerce_1.coerceCreatePayload)(model3, args.data);
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [row], returning: args }), model3);
        },
        createMany: (args) => {
          const rows = (args.data ?? []).map((d2) => (0, coerce_1.coerceCreatePayload)(model3, d2));
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, {
            rows,
            skipDuplicates: !!args.skipDuplicates
          }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: false,
          returning: args
        }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: true
        }), model3),
        upsert: (args) => {
          const upsertCreate = (0, coerce_1.coerceCreatePayload)(model3, args.create);
          return (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: args.update,
            many: false,
            upsertCreate,
            returning: args
          }), model3);
        },
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args.where,
          many: false,
          returning: args
        }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args?.where,
          many: true
        }), model3),
        // Soft delete / restore compile to update IRs that set/clear the
        // `.softDeleteAt()` column. Same shape as the runtime collection
        // wrapper (collection.softDelete → this.update with data:{<sd>: new Date()}),
        // just compiled instead of executed.
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        },
        aggregate: (args) => ({
          kind: "mongo",
          collection: model3.collection,
          op: "aggregate",
          args: { pipeline: (0, coerce_1.coerceExtendedJSON)(args.pipeline ?? []), options: args.options }
        })
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/dialect.js
var require_dialect = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/dialect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgresDialect = void 0;
    var wkt_1 = require_wkt();
    exports.PostgresDialect = {
      name: "postgres",
      quoteIdent(name) {
        if (/["\0]/.test(name)) {
          throw new Error(`[forge:postgres] invalid identifier: ${JSON.stringify(name)}`);
        }
        return `"${name}"`;
      },
      placeholder(params, value) {
        params.push(value);
        return `$${params.length}`;
      },
      columnType(field) {
        switch (field.kind) {
          case "id":
            if (field.idType === "bigserial")
              return "bigserial";
            if (field.idType === "uuid")
              return "uuid";
            return "text";
          case "objectId":
            return "text";
          // FK to a Mongo-style id is text; pure-PG schemas would use uuid
          case "string":
            return "text";
          case "text":
            return "text";
          case "int":
            return "integer";
          case "float":
            return "double precision";
          case "decimal":
            return field.precision != null ? `numeric(${field.precision}${field.scale != null ? `,${field.scale}` : ""})` : "numeric";
          case "uuid":
            return "uuid";
          case "bigint":
            return "bigint";
          case "bool":
            return "boolean";
          case "dateTime":
            return "timestamptz";
          case "json":
            return "jsonb";
          case "enum":
            return "text";
          // + CHECK constraint applied at DDL time
          case "embed":
            return "jsonb";
          case "embedMany":
            return "jsonb";
          case "stringArray":
            return "text[]";
          case "intArray":
            return "integer[]";
          case "geoPoint": {
            if (field.geo?.fallback)
              return "jsonb";
            const srid = field.geo?.srid ?? 4326;
            const pointType = field.geo?.dims === 3 ? "PointZ" : "Point";
            if (srid !== 4326)
              return `geometry(${pointType}, ${srid})`;
            return `geography(${pointType}, ${srid})`;
          }
          case "vector": {
            const dims = field.vector?.dims;
            if (!dims)
              throw new Error(`[forge:pg] vector field requires { dims }`);
            return `vector(${dims})`;
          }
        }
      },
      orderClause(column, direction, nulls) {
        const dir = direction === "desc" ? "DESC" : "ASC";
        const nullsClause = nulls ? ` NULLS ${nulls.toUpperCase()}` : "";
        return `${column} ${dir}${nullsClause}`;
      },
      upsertConflictClause(conflictCols, setAssignments) {
        const cols = conflictCols.join(", ");
        return `ON CONFLICT (${cols}) DO UPDATE SET ${setAssignments}`;
      },
      searchClause(quotedColumn, paramExpr, _ctx) {
        return `to_tsvector('simple', ${quotedColumn}) @@ plainto_tsquery('simple', ${paramExpr})`;
      },
      valueExpr(field, params, value) {
        if (field.kind === "geoPoint" && !field.geo?.fallback && value && typeof value === "object") {
          const v2 = value;
          const srid = field.geo?.srid ?? 4326;
          const wkt = field.geo?.dims === 3 && typeof v2.alt === "number" ? `SRID=${srid};POINT Z(${v2.lng} ${v2.lat} ${v2.alt})` : `SRID=${srid};POINT(${v2.lng} ${v2.lat})`;
          const ph = this.placeholder(params, wkt);
          return `ST_GeogFromText(${ph})`;
        }
        if (field.kind === "vector" && Array.isArray(value)) {
          const ph = this.placeholder(params, `[${value.join(",")}]`);
          return `${ph}::vector`;
        }
        return this.placeholder(params, value);
      },
      geoNearClause(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const ewkt = `SRID=${srid};POINT(${point.lng} ${point.lat})`;
        const pp = this.placeholder(params, ewkt);
        if (point.withinMeters === void 0)
          return "TRUE";
        const wm = this.placeholder(params, point.withinMeters);
        return `ST_DWithin(${quotedCol}, ST_GeogFromText(${pp}), ${wm})`;
      },
      geoDistanceExpr(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const ewkt = `SRID=${srid};POINT(${point.lng} ${point.lat})`;
        const pp = this.placeholder(params, ewkt);
        return `ST_Distance(${quotedCol}, ST_GeogFromText(${pp}))`;
      },
      vectorDistanceClause(quotedCol, field, query, params) {
        const metric = field.vector?.metric ?? "cosine";
        const op = metric === "cosine" ? "<=>" : metric === "l2" ? "<->" : "<#>";
        const ph = this.placeholder(params, `[${query.vector.join(",")}]`);
        if (query.withinDistance === void 0)
          return "TRUE";
        const wd = this.placeholder(params, query.withinDistance);
        return `(${quotedCol} ${op} ${ph}::vector) < ${wd}`;
      },
      vectorDistanceExpr(quotedCol, field, vector, params) {
        const metric = field.vector?.metric ?? "cosine";
        const op = metric === "cosine" ? "<=>" : metric === "l2" ? "<->" : "<#>";
        const ph = this.placeholder(params, `[${vector.join(",")}]`);
        return `(${quotedCol} ${op} ${ph}::vector)`;
      },
      geoWithinPolygonClause(quotedCol, field, multiPolygon, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = (0, wkt_1.toGeoWKT)(multiPolygon, "lng-lat");
        const ewkt = `SRID=${srid};${wkt}`;
        const pp = this.placeholder(params, ewkt);
        return `ST_Within(${quotedCol}::geometry, ST_GeogFromText(${pp})::geometry)`;
      }
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/compile-from-ir.js
var require_compile_from_ir2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    exports.compileGroupBy = compileGroupBy;
    var schema_1 = require_schema();
    var dialect_1 = require_dialect();
    var wkt_1 = require_wkt();
    var escapeForLike = (s) => String(s).replace(/[%_\\]/g, (m2) => "\\" + m2);
    function modelDef(modelKey, override) {
      if (override)
        return override;
      const m2 = schema_1.schema[modelKey];
      if (!m2)
        throw new Error(`[forge:postgres] unknown model '${modelKey}' in IR`);
      return m2;
    }
    function compileWhere(ctx, tree) {
      if (!tree)
        return "";
      return compileWhereNode(ctx, tree);
    }
    function compileWhereNode(ctx, tree) {
      switch (tree.kind) {
        case "and": {
          const parts = tree.children.map((c) => compileWhereNode(ctx, c)).filter(notEmpty);
          if (parts.length === 0)
            return "";
          if (parts.length === 1)
            return parts[0];
          return `(${parts.join(" AND ")})`;
        }
        case "or": {
          const parts = tree.children.map((c) => compileWhereNode(ctx, c)).filter(notEmpty);
          if (parts.length === 0)
            return "";
          if (parts.length === 1)
            return parts[0];
          return `(${parts.join(" OR ")})`;
        }
        case "not": {
          const inner = compileWhereNode(ctx, tree.child);
          return inner ? `NOT (${inner})` : "";
        }
        case "relation":
          return compileRelationFilter(ctx, tree);
        case "leaf":
          return compileLeaf(ctx, tree);
      }
    }
    var SQL_CMP_OPS = {
      eq: "=",
      ne: "<>",
      lt: "<",
      lte: "<=",
      gt: ">",
      gte: ">="
    };
    function compileLeaf(ctx, leaf) {
      const col = `${ctx.table}.${ctx.d.quoteIdent(leaf.field)}`;
      const ph = (v2) => ctx.d.placeholder(ctx.params, v2);
      if (leaf.rhsField !== void 0) {
        const sqlOp = SQL_CMP_OPS[leaf.op];
        if (!sqlOp) {
          throw new Error(`[forge] col() comparison not supported for op '${leaf.op}'`);
        }
        const rhsCol = `${ctx.table}.${ctx.d.quoteIdent(leaf.rhsField)}`;
        return `${col} ${sqlOp} ${rhsCol}`;
      }
      switch (leaf.op) {
        case "eq":
          return leaf.value === null ? `${col} IS NULL` : `${col} = ${ph(leaf.value)}`;
        case "ne":
          return leaf.value === null ? `${col} IS NOT NULL` : `${col} <> ${ph(leaf.value)}`;
        case "in": {
          const arr = leaf.value;
          if (!arr.length)
            return "FALSE";
          return `${col} IN (${arr.map(ph).join(", ")})`;
        }
        case "nin": {
          const arr = leaf.value;
          if (!arr.length)
            return "TRUE";
          return `${col} NOT IN (${arr.map(ph).join(", ")})`;
        }
        case "lt":
          return `${col} < ${ph(leaf.value)}`;
        case "lte":
          return `${col} <= ${ph(leaf.value)}`;
        case "gt":
          return `${col} > ${ph(leaf.value)}`;
        case "gte":
          return `${col} >= ${ph(leaf.value)}`;
        case "contains":
          return likeOp(ctx, col, `%${escapeForLike(String(leaf.value))}%`, !!leaf.caseInsensitive);
        case "startsWith":
          return likeOp(ctx, col, `${escapeForLike(String(leaf.value))}%`, !!leaf.caseInsensitive);
        case "endsWith":
          return likeOp(ctx, col, `%${escapeForLike(String(leaf.value))}`, !!leaf.caseInsensitive);
        case "has":
          return `${ph(leaf.value)} = ANY(${col})`;
        case "hasSome": {
          const arr = leaf.value;
          if (!arr.length)
            return "FALSE";
          return `${col} && ARRAY[${arr.map(ph).join(", ")}]`;
        }
        case "hasEvery": {
          const arr = leaf.value;
          if (!arr.length)
            return "TRUE";
          return `${col} @> ARRAY[${arr.map(ph).join(", ")}]`;
        }
        case "isEmpty":
          return leaf.value ? `coalesce(array_length(${col}, 1), 0) = 0` : `coalesce(array_length(${col}, 1), 0) > 0`;
        case "search":
          return ctx.d.searchClause(col, ph(String(leaf.value)), {
            rawColumn: leaf.field,
            baseTable: ctx.model.collection,
            quoteIdent: (s) => ctx.d.quoteIdent(s)
          });
        case "jsonPath": {
          if (!leaf.jsonPath)
            return "TRUE";
          const { path, subOp } = leaf.jsonPath;
          const rawCol = `${ctx.table}.${ctx.d.quoteIdent(leaf.field)}`;
          const rendered = ctx.d.jsonPathExpr ? ctx.d.jsonPathExpr(rawCol, path, leaf.value) : pgJsonPath(rawCol, path, leaf.value);
          const ph2 = (v2) => ctx.d.placeholder(ctx.params, v2);
          switch (subOp) {
            case "eq":
              return leaf.value === null ? `${rendered} IS NULL` : `${rendered} = ${ph2(coerceJsonOperand(leaf.value))}`;
            case "ne":
              return leaf.value === null ? `${rendered} IS NOT NULL` : `${rendered} <> ${ph2(coerceJsonOperand(leaf.value))}`;
            case "lt":
              return `${rendered} < ${ph2(coerceJsonOperand(leaf.value))}`;
            case "lte":
              return `${rendered} <= ${ph2(coerceJsonOperand(leaf.value))}`;
            case "gt":
              return `${rendered} > ${ph2(coerceJsonOperand(leaf.value))}`;
            case "gte":
              return `${rendered} >= ${ph2(coerceJsonOperand(leaf.value))}`;
            case "contains": {
              const v2 = String(leaf.value);
              return `${rendered} LIKE ${ph2("%" + escapeForLike(v2) + "%")}`;
            }
            case "in": {
              const arr = leaf.value;
              if (!arr.length)
                return "FALSE";
              return `${rendered} IN (${arr.map((v2) => ph2(coerceJsonOperand(v2))).join(", ")})`;
            }
            case "has": {
              return `${rendered}::text LIKE ${ph2("%" + JSON.stringify(leaf.value) + "%")}`;
            }
          }
          return "TRUE";
        }
        case "near": {
          const fld = ctx.model.fields[leaf.field];
          if (!fld)
            throw new Error(`[forge] where.${leaf.field}.near: unknown field.`);
          if (fld.kind === "vector") {
            const v2 = leaf.value;
            if (!ctx.d.vectorDistanceClause) {
              throw new Error(`[forge] dialect '${ctx.d.name}' does not implement vectorDistanceClause`);
            }
            return ctx.d.vectorDistanceClause(col, fld, v2, ctx.params);
          }
          if (fld.kind !== "geoPoint") {
            throw new Error(`[forge] where.${leaf.field}.near requires a geoPoint or vector field.`);
          }
          const point = leaf.value;
          if (fld.geo?.fallback) {
            return haversineBboxPrefilter(ctx, leaf.field, point);
          }
          if (!ctx.d.geoNearClause) {
            throw new Error(`[forge] dialect '${ctx.d.name}' does not implement geoNearClause`);
          }
          return ctx.d.geoNearClause(col, fld, point, ctx.params);
        }
        case "withinPolygon": {
          const fld = ctx.model.fields[leaf.field];
          if (!fld || fld.kind !== "geoPoint") {
            throw new Error(`[forge] where.${leaf.field}.withinPolygon requires a geoPoint field.`);
          }
          const v2 = leaf.value;
          const multiPolygon = v2.multiPolygon ?? (v2.polygon ? [[v2.polygon]] : []);
          if (multiPolygon.length === 0) {
            throw new Error(`[forge] where.${leaf.field}.withinPolygon: empty polygon set.`);
          }
          if (fld.geo?.fallback) {
            return polygonBboxPrefilter(ctx, leaf.field, multiPolygon);
          }
          if (!ctx.d.geoWithinPolygonClause) {
            throw new Error(`[forge] dialect '${ctx.d.name}' does not implement geoWithinPolygonClause`);
          }
          return ctx.d.geoWithinPolygonClause(col, fld, multiPolygon, ctx.params);
        }
      }
    }
    function pgJsonPath(rawCol, path, operand) {
      if (path.length === 0)
        return rawCol;
      let expr = rawCol;
      for (let i = 0; i < path.length - 1; i++) {
        const seg = path[i];
        expr = /^\d+$/.test(seg) ? `${expr}->${Number(seg)}` : `${expr}->'${seg.replace(/'/g, "''")}'`;
      }
      const last = path[path.length - 1];
      expr = /^\d+$/.test(last) ? `${expr}->>${Number(last)}` : `${expr}->>'${last.replace(/'/g, "''")}'`;
      if (typeof operand === "number")
        return `(${expr})::numeric`;
      if (typeof operand === "boolean")
        return `(${expr})::boolean`;
      if (operand instanceof Date)
        return `(${expr})::timestamptz`;
      return expr;
    }
    function coerceJsonOperand(v2) {
      if (v2 === null || v2 === void 0)
        return null;
      if (typeof v2 === "string" || typeof v2 === "number" || typeof v2 === "boolean")
        return v2;
      if (v2 instanceof Date)
        return v2.toISOString();
      return JSON.stringify(v2);
    }
    function polygonBboxPrefilter(ctx, field, multiPolygon) {
      const { minLng, maxLng, minLat, maxLat } = (0, wkt_1.multiPolygonBbox)(multiPolygon);
      const ph = (v2) => ctx.d.placeholder(ctx.params, v2);
      const lngCol = `(${ctx.table}.${ctx.d.quoteIdent(field)}->>'lng')::float8`;
      const latCol = `(${ctx.table}.${ctx.d.quoteIdent(field)}->>'lat')::float8`;
      return `(${lngCol} BETWEEN ${ph(minLng)} AND ${ph(maxLng)} AND ${latCol} BETWEEN ${ph(minLat)} AND ${ph(maxLat)})`;
    }
    function haversineBboxPrefilter(ctx, field, point) {
      const radiusM = point.withinMeters ?? 1e9;
      const latDeg = radiusM / 111320;
      const lngDeg = radiusM / (111320 * Math.cos(point.lat * Math.PI / 180) || 1e-9);
      const ph = (v2) => ctx.d.placeholder(ctx.params, v2);
      const lngCol = `(${ctx.table}.${ctx.d.quoteIdent(field)}->>'lng')::float8`;
      const latCol = `(${ctx.table}.${ctx.d.quoteIdent(field)}->>'lat')::float8`;
      return `(${lngCol} BETWEEN ${ph(point.lng - lngDeg)} AND ${ph(point.lng + lngDeg)} AND ${latCol} BETWEEN ${ph(point.lat - latDeg)} AND ${ph(point.lat + latDeg)})`;
    }
    function likeOp(ctx, col, pattern, ci) {
      const ph = ctx.d.placeholder(ctx.params, pattern);
      return ci ? `${col} ILIKE ${ph}` : `${col} LIKE ${ph}`;
    }
    function compileRelationFilter(ctx, tree) {
      const relations = ctx.model.relations();
      const rel = relations[tree.relation];
      if (!rel)
        return "TRUE";
      const targetModel = ctx.schemaOverride?.[rel.target] ?? schema_1.schema[rel.target];
      if (!targetModel)
        return "TRUE";
      ctx.aliasCount.n += 1;
      const alias = `t${ctx.aliasCount.n}`;
      const aliasQ = ctx.d.quoteIdent(alias);
      const subTable = ctx.d.quoteIdent(targetModel.collection);
      const isOwning = ctx.model.fields[rel.on] != null;
      const parentCol = isOwning ? rel.on : rel.refs;
      const targetCol = isOwning ? rel.refs : rel.on;
      const joinCondition = `${aliasQ}.${ctx.d.quoteIdent(targetCol)} = ${ctx.table}.${ctx.d.quoteIdent(parentCol)}`;
      const inner = tree.nested ? compileWhereNode({
        d: ctx.d,
        model: targetModel,
        table: aliasQ,
        params: ctx.params,
        aliasCount: ctx.aliasCount,
        schemaOverride: ctx.schemaOverride
      }, tree.nested) : "";
      const innerClause = inner ? ` AND ${inner}` : "";
      const baseExists = `EXISTS (SELECT 1 FROM ${subTable} ${aliasQ} WHERE ${joinCondition}${innerClause})`;
      switch (tree.mode) {
        case "is":
        case "some":
          return baseExists;
        case "isNot":
        case "none":
          return `NOT ${baseExists}`;
        case "every": {
          if (!inner)
            return baseExists;
          const notInner = `NOT (${inner})`;
          return `NOT EXISTS (SELECT 1 FROM ${subTable} ${aliasQ} WHERE ${joinCondition} AND ${notInner})`;
        }
      }
    }
    function notEmpty(s) {
      return s.length > 0;
    }
    function compileProjectionCols(d2, table, model3, plan) {
      if (!plan) {
        const cols = Object.keys(model3.fields).map((f3) => `${table}.${d2.quoteIdent(f3)}`);
        return cols.join(", ");
      }
      if (plan.exclusive && plan.fields.length) {
        return plan.fields.map((f3) => `${table}.${d2.quoteIdent(f3)}`).join(", ");
      }
      if (plan.omit?.length) {
        const drop = new Set(plan.omit);
        const cols = Object.keys(model3.fields).filter((f3) => !drop.has(f3)).map((f3) => `${table}.${d2.quoteIdent(f3)}`);
        return cols.join(", ");
      }
      return Object.keys(model3.fields).map((f3) => `${table}.${d2.quoteIdent(f3)}`).join(", ");
    }
    function compileOrder(d2, table, orderBy, model3) {
      if (!orderBy?.length)
        return "";
      const parts = orderBy.map((e) => {
        if (e.nearTo) {
          const fld = model3?.fields?.[e.field];
          const alias = fld?.kind === "vector" ? "_distance" : "_distanceMeters";
          return d2.orderClause(d2.quoteIdent(alias), e.direction);
        }
        return d2.orderClause(`${table}.${d2.quoteIdent(e.field)}`, e.direction, e.nulls);
      });
      return `ORDER BY ${parts.join(", ")}`;
    }
    function compileCursor(d2, table, params, cursor) {
      if (!cursor?.fields)
        return "";
      const keys = Object.keys(cursor.fields);
      if (keys.length === 0)
        return "";
      if (keys.length === 1) {
        const k = keys[0];
        return `${table}.${d2.quoteIdent(k)} > ${d2.placeholder(params, cursor.fields[k])}`;
      }
      const cols = keys.map((k) => `${table}.${d2.quoteIdent(k)}`).join(", ");
      const vals = keys.map((k) => d2.placeholder(params, cursor.fields[k])).join(", ");
      return `(${cols}) > (${vals})`;
    }
    function compileSelect(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      const ctx = { d: dialect, model: m2, table, params, aliasCount: { n: 0 }, schemaOverride };
      let cols = compileProjectionCols(dialect, table, m2, node.projection);
      const distinctClause = node.distinct?.length ? `DISTINCT ON (${node.distinct.map((f3) => `${table}.${dialect.quoteIdent(f3)}`).join(", ")}) ` : "";
      const nearToEntry = node.orderBy?.find((e) => e.nearTo);
      if (nearToEntry?.nearTo) {
        const fld = m2.fields[nearToEntry.field];
        if (!fld) {
          throw new Error(`[forge] orderBy.${nearToEntry.field}.nearTo: unknown field.`);
        }
        if (fld.kind === "vector") {
          const nt2 = nearToEntry.nearTo;
          if (!Array.isArray(nt2.vector)) {
            throw new Error(`[forge] orderBy.${nearToEntry.field}.nearTo for vector fields requires a vector array.`);
          }
          if (!dialect.vectorDistanceExpr) {
            throw new Error(`[forge] dialect '${dialect.name}' does not implement vectorDistanceExpr`);
          }
          const distExpr = dialect.vectorDistanceExpr(`${table}.${dialect.quoteIdent(nearToEntry.field)}`, fld, nt2.vector, params);
          cols = `${cols}, ${distExpr} AS _distance`;
        } else if (fld.kind === "geoPoint") {
          if (!dialect.geoDistanceExpr) {
            throw new Error(`[forge] dialect '${dialect.name}' does not implement geoDistanceExpr`);
          }
          const distExpr = dialect.geoDistanceExpr(`${table}.${dialect.quoteIdent(nearToEntry.field)}`, fld, nearToEntry.nearTo, params);
          cols = `${cols}, ${distExpr} AS _distanceMeters`;
        } else {
          throw new Error(`[forge] orderBy.${nearToEntry.field}.nearTo requires a geoPoint or vector field.`);
        }
      }
      const whereParts = [];
      const w = compileWhere(ctx, node.where);
      if (w)
        whereParts.push(w);
      const c = compileCursor(dialect, table, params, node.cursor);
      if (c)
        whereParts.push(c);
      const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
      const orderClause = compileOrder(dialect, table, node.orderBy, m2);
      const limit = node.limit != null ? `LIMIT ${Number(node.limit)}` : "";
      const offset = node.offset != null ? `OFFSET ${Number(node.offset)}` : "";
      const sql = [
        `SELECT ${distinctClause}${cols} FROM ${table}`,
        whereClause,
        orderClause,
        limit,
        offset
      ].filter(Boolean).join(" ");
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
    function compileCount(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      const ctx = { d: dialect, model: m2, table, params, aliasCount: { n: 0 }, schemaOverride };
      const where = compileWhere(ctx, node.where);
      const distinctClause = node.distinct?.length ? `COUNT(DISTINCT (${node.distinct.map((f3) => `${table}.${dialect.quoteIdent(f3)}`).join(", ")}))` : "COUNT(*)";
      const sql = [
        `SELECT ${distinctClause} AS count FROM ${table}`,
        where ? `WHERE ${where}` : ""
      ].filter(Boolean).join(" ");
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
    function compileInsert(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      if (node.rows.length === 0) {
        return { kind: "sql", dialect: dialect.name, sql: `SELECT 0 WHERE FALSE`, params };
      }
      const allKeys = /* @__PURE__ */ new Set();
      for (const r of node.rows)
        for (const k of Object.keys(r))
          allKeys.add(k);
      const cols = Object.keys(m2.fields).filter((f3) => allKeys.has(f3));
      for (const k of allKeys)
        if (!cols.includes(k))
          cols.push(k);
      const colList = cols.map((c) => dialect.quoteIdent(c)).join(", ");
      const valueRows = node.rows.map((row) => {
        const vals = cols.map((c) => {
          const fld = m2.fields[c];
          if (fld && dialect.valueExpr)
            return dialect.valueExpr(fld, params, row[c] ?? null);
          return dialect.placeholder(params, row[c] ?? null);
        });
        return `(${vals.join(", ")})`;
      }).join(", ");
      const onConflict = node.skipDuplicates ? " ON CONFLICT DO NOTHING" : "";
      const returning = node.returning?.exclusive && node.returning.fields.length ? ` RETURNING ${node.returning.fields.map((f3) => dialect.quoteIdent(f3)).join(", ")}` : " RETURNING *";
      const sql = `INSERT INTO ${table} (${colList}) VALUES ${valueRows}${onConflict}${returning}`;
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
    function compileUpdate(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      const ctx = { d: dialect, model: m2, table, params, aliasCount: { n: 0 }, schemaOverride };
      const buildSet = () => {
        const parts = [];
        const valExpr = (col, v2) => {
          const fld = m2.fields[col];
          if (fld && dialect.valueExpr)
            return dialect.valueExpr(fld, params, v2);
          return dialect.placeholder(params, v2);
        };
        if (node.set) {
          for (const [k, v2] of Object.entries(node.set)) {
            parts.push(`${dialect.quoteIdent(k)} = ${valExpr(k, v2)}`);
          }
        }
        if (node.increment) {
          for (const [k, v2] of Object.entries(node.increment)) {
            parts.push(`${dialect.quoteIdent(k)} = ${table}.${dialect.quoteIdent(k)} + ${dialect.placeholder(params, v2)}`);
          }
        }
        if (node.multiply) {
          for (const [k, v2] of Object.entries(node.multiply)) {
            parts.push(`${dialect.quoteIdent(k)} = ${table}.${dialect.quoteIdent(k)} * ${dialect.placeholder(params, v2)}`);
          }
        }
        if (node.push) {
          for (const [k, v2] of Object.entries(node.push)) {
            parts.push(`${dialect.quoteIdent(k)} = array_append(${table}.${dialect.quoteIdent(k)}, ${dialect.placeholder(params, v2)})`);
          }
        }
        if (node.unset?.length) {
          for (const k of node.unset) {
            parts.push(`${dialect.quoteIdent(k)} = NULL`);
          }
        }
        return parts;
      };
      if (node.upsertCreate) {
        const cols = Object.keys(node.upsertCreate);
        const colList = cols.map((c) => dialect.quoteIdent(c)).join(", ");
        const valList = cols.map((c) => dialect.placeholder(params, node.upsertCreate[c])).join(", ");
        const setParts2 = buildSet();
        const conflictCols = whereLeafColumns(node.where).map((c) => dialect.quoteIdent(c));
        const conflictClause = conflictCols.length ? dialect.upsertConflictClause(conflictCols, setParts2.join(", ")) : "ON CONFLICT DO NOTHING";
        const sql2 = `INSERT INTO ${table} (${colList}) VALUES (${valList}) ${conflictClause} RETURNING *`;
        return { kind: "sql", dialect: dialect.name, sql: sql2, params };
      }
      const setParts = buildSet();
      const where = compileWhere(ctx, node.where);
      const whereClause = where ? `WHERE ${where}` : "";
      const limitClause = node.many ? "" : "WHERE ctid = (SELECT ctid FROM " + table + (where ? " WHERE " + where : "") + " LIMIT 1)";
      const finalWhere = node.many ? whereClause : limitClause;
      const returning = node.returning?.exclusive && node.returning.fields.length ? ` RETURNING ${node.returning.fields.map((f3) => dialect.quoteIdent(f3)).join(", ")}` : " RETURNING *";
      const sql = `UPDATE ${table} SET ${setParts.join(", ")} ${finalWhere}${returning}`;
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
    function compileDelete(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      const ctx = { d: dialect, model: m2, table, params, aliasCount: { n: 0 }, schemaOverride };
      const where = compileWhere(ctx, node.where);
      const whereClause = where ? `WHERE ${where}` : "";
      const limitClause = node.many ? whereClause : `WHERE ctid = (SELECT ctid FROM ${table}${where ? " WHERE " + where : ""} LIMIT 1)`;
      const finalWhere = node.many ? whereClause : limitClause;
      const sql = `DELETE FROM ${table} ${finalWhere} RETURNING *`;
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
    function whereLeafColumns(tree) {
      if (!tree)
        return [];
      if (tree.kind === "leaf" && tree.op === "eq")
        return [tree.field];
      if (tree.kind === "and")
        return tree.children.flatMap(whereLeafColumns);
      return [];
    }
    function compileGroupBy(node, modelOverride, dialect = dialect_1.PostgresDialect, schemaOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const params = [];
      const table = dialect.quoteIdent(m2.collection);
      const ctx = { d: dialect, model: m2, table, params, aliasCount: { n: 0 }, schemaOverride };
      const byCols = node.by.map((f3) => `${table}.${dialect.quoteIdent(f3)}`);
      const aggSelect = [];
      const pushAgg = (bucket, field, fn) => {
        const colExpr = field === "_all" ? "*" : `${table}.${dialect.quoteIdent(field)}`;
        const alias = `__agg_${bucket.slice(1)}_${field}`;
        aggSelect.push(`${fn}(${colExpr}) AS ${dialect.quoteIdent(alias)}`);
      };
      if (node._count) {
        for (const [k, v2] of Object.entries(node._count))
          if (v2)
            pushAgg("_count", k, "COUNT");
      }
      if (node._avg) {
        for (const [k, v2] of Object.entries(node._avg))
          if (v2)
            pushAgg("_avg", k, "AVG");
      }
      if (node._sum) {
        for (const [k, v2] of Object.entries(node._sum))
          if (v2)
            pushAgg("_sum", k, "SUM");
      }
      if (node._min) {
        for (const [k, v2] of Object.entries(node._min))
          if (v2)
            pushAgg("_min", k, "MIN");
      }
      if (node._max) {
        for (const [k, v2] of Object.entries(node._max))
          if (v2)
            pushAgg("_max", k, "MAX");
      }
      const selectList = [...byCols, ...aggSelect].join(", ");
      const where = compileWhere(ctx, node.where);
      const groupByClause = node.by.length ? `GROUP BY ${byCols.join(", ")}` : "";
      const havingParts = [];
      if (node.having && typeof node.having === "object") {
        for (const [bucket, inner] of Object.entries(node.having)) {
          const fnName = { _count: "COUNT", _avg: "AVG", _sum: "SUM", _min: "MIN", _max: "MAX" }[bucket];
          if (!fnName || !inner || typeof inner !== "object")
            continue;
          for (const [field, opObj] of Object.entries(inner)) {
            if (!opObj || typeof opObj !== "object")
              continue;
            const colExpr = field === "_all" ? "*" : `${table}.${dialect.quoteIdent(field)}`;
            for (const [op, val] of Object.entries(opObj)) {
              const cmp = { gt: ">", gte: ">=", lt: "<", lte: "<=", equals: "=", not: "<>" }[op];
              if (!cmp)
                continue;
              havingParts.push(`${fnName}(${colExpr}) ${cmp} ${dialect.placeholder(params, val)}`);
            }
          }
        }
      }
      const havingClause = havingParts.length ? `HAVING ${havingParts.join(" AND ")}` : "";
      const orderClause = (() => {
        if (!node.orderBy?.length)
          return "";
        return `ORDER BY ${node.orderBy.map((e) => dialect.orderClause(`${table}.${dialect.quoteIdent(e.field)}`, e.direction, e.nulls)).join(", ")}`;
      })();
      const limit = node.limit != null ? `LIMIT ${Number(node.limit)}` : "";
      const offset = node.offset != null ? `OFFSET ${Number(node.offset)}` : "";
      const sql = [
        `SELECT ${selectList} FROM ${table}`,
        where ? `WHERE ${where}` : "",
        groupByClause,
        havingClause,
        orderClause,
        limit,
        offset
      ].filter(Boolean).join(" ");
      return { kind: "sql", dialect: dialect.name, sql, params };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/compile.js
var require_compile2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildPostgresCompileApi = buildPostgresCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir2();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'. Use compile.delete()/compile.deleteMany() for hard deletes.`);
      }
      return sd;
    }
    function buildPostgresCompileApi(model3) {
      const mk = modelKeyFor(model3);
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => {
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [args.data], returning: args }), model3);
        },
        createMany: (args) => {
          const rows = args.data ?? [];
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, {
            rows,
            skipDuplicates: !!args.skipDuplicates
          }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: false,
          returning: args
        }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: true
        }), model3),
        upsert: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.update,
          many: false,
          upsertCreate: args.create,
          returning: args
        }), model3),
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args.where,
          many: false,
          returning: args
        }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args?.where,
          many: true
        }), model3),
        // Soft delete / restore compile to update IRs that set/clear the
        // `.softDeleteAt()` column — same surface as the runtime collection
        // wrapper (which dispatches softDelete to update with data:{<sd>: now}).
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/dialect.js
var require_dialect2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/dialect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MysqlDialect = void 0;
    var wkt_1 = require_wkt();
    exports.MysqlDialect = {
      name: "mysql",
      quoteIdent(name) {
        if (/[`\0]/.test(name)) {
          throw new Error(`[forge:mysql] invalid identifier: ${JSON.stringify(name)}`);
        }
        return "`" + name + "`";
      },
      placeholder(params, value) {
        params.push(value);
        return "?";
      },
      columnType(field) {
        switch (field.kind) {
          case "id":
            if (field.idType === "bigserial")
              return "BIGINT";
            if (field.idType === "uuid")
              return "CHAR(36)";
            return "VARCHAR(64)";
          case "objectId":
            return "VARCHAR(64)";
          case "string":
            return "VARCHAR(255)";
          // can be UNIQUE / indexed without a key-length prefix
          case "text":
            return "TEXT";
          // unbounded; can't be UNIQUE without a (n) prefix
          case "int":
            return "INT";
          case "float":
            return "DOUBLE PRECISION";
          case "decimal":
            return field.precision != null ? `DECIMAL(${field.precision}${field.scale != null ? `,${field.scale}` : ""})` : "DECIMAL(10,0)";
          case "uuid":
            return "CHAR(36)";
          case "bigint":
            return "BIGINT";
          case "bool":
            return "TINYINT(1)";
          case "dateTime":
            return "DATETIME(3)";
          // millisecond precision
          case "json":
            return "JSON";
          case "enum":
            return "VARCHAR(64)";
          // + CHECK
          case "embed":
            return "JSON";
          case "embedMany":
            return "JSON";
          case "stringArray":
            return "JSON";
          case "intArray":
            return "JSON";
          case "geoPoint": {
            if (field.geo?.fallback)
              return "JSON";
            const srid = field.geo?.srid ?? 4326;
            return `POINT NOT NULL SRID ${srid}`;
          }
          case "vector": {
            const dims = field.vector?.dims;
            if (!dims)
              throw new Error(`[forge:mysql] vector field requires { dims }`);
            return `VECTOR(${dims})`;
          }
        }
      },
      orderClause(column, direction, _nulls) {
        return `${column} ${direction === "desc" ? "DESC" : "ASC"}`;
      },
      upsertConflictClause(_conflictCols, setAssignments) {
        return `ON DUPLICATE KEY UPDATE ${setAssignments}`;
      },
      searchClause(quotedColumn, paramExpr, _ctx) {
        return `MATCH(${quotedColumn}) AGAINST (${paramExpr} IN NATURAL LANGUAGE MODE)`;
      },
      valueExpr(field, params, value) {
        if (field.kind === "geoPoint" && !field.geo?.fallback && value && typeof value === "object") {
          const v2 = value;
          const srid = field.geo?.srid ?? 4326;
          const wkt = field.geo?.dims === 3 && typeof v2.alt === "number" ? `POINT(${v2.lat} ${v2.lng})` : `POINT(${v2.lat} ${v2.lng})`;
          const ph = this.placeholder(params, wkt);
          return `ST_GeomFromText(${ph}, ${srid})`;
        }
        if (field.kind === "vector" && Array.isArray(value)) {
          const ph = this.placeholder(params, `[${value.join(",")}]`);
          return `STRING_TO_VECTOR(${ph})`;
        }
        return this.placeholder(params, value);
      },
      geoNearClause(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = `POINT(${point.lat} ${point.lng})`;
        const pp = this.placeholder(params, wkt);
        const ref = `ST_GeomFromText(${pp}, ${srid})`;
        if (point.withinMeters === void 0)
          return "TRUE";
        const wm = this.placeholder(params, point.withinMeters);
        return `ST_Distance_Sphere(${quotedCol}, ${ref}) < ${wm}`;
      },
      geoDistanceExpr(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = `POINT(${point.lat} ${point.lng})`;
        const pp = this.placeholder(params, wkt);
        return `ST_Distance_Sphere(${quotedCol}, ST_GeomFromText(${pp}, ${srid}))`;
      },
      vectorDistanceClause(quotedCol, field, query, params) {
        const metric = (field.vector?.metric ?? "cosine").toUpperCase();
        const ph = this.placeholder(params, `[${query.vector.join(",")}]`);
        if (query.withinDistance === void 0)
          return "TRUE";
        const wd = this.placeholder(params, query.withinDistance);
        return `DISTANCE(${quotedCol}, STRING_TO_VECTOR(${ph}), '${metric}') < ${wd}`;
      },
      vectorDistanceExpr(quotedCol, field, vector, params) {
        const metric = (field.vector?.metric ?? "cosine").toUpperCase();
        const ph = this.placeholder(params, `[${vector.join(",")}]`);
        return `DISTANCE(${quotedCol}, STRING_TO_VECTOR(${ph}), '${metric}')`;
      },
      jsonPathExpr(quotedCol, path) {
        const pathSpec = "$" + path.map((s) => /^\d+$/.test(s) ? `[${s}]` : `.${s.replace(/[`'"\\]/g, "\\$&")}`).join("");
        return `JSON_UNQUOTE(JSON_EXTRACT(${quotedCol}, '${pathSpec.replace(/'/g, "''")}'))`;
      },
      geoWithinPolygonClause(quotedCol, field, multiPolygon, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = (0, wkt_1.toGeoWKT)(multiPolygon, "lat-lng");
        const pp = this.placeholder(params, wkt);
        return `ST_Within(${quotedCol}, ST_GeomFromText(${pp}, ${srid}))`;
      }
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/compile-from-ir.js
var require_compile_from_ir3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    exports.compileGroupBy = compileGroupBy;
    exports.modelDef = modelDef;
    var schema_1 = require_schema();
    var dialect_1 = require_dialect2();
    var compile_from_ir_1 = require_compile_from_ir2();
    function modelDef(modelKey, override) {
      if (override)
        return override;
      const m2 = schema_1.schema[modelKey];
      if (!m2)
        throw new Error(`[forge:mysql] unknown model '${modelKey}' in IR`);
      return m2;
    }
    function coerceParams(params) {
      return params.map((v2) => {
        if (typeof v2 === "boolean")
          return v2 ? 1 : 0;
        if (v2 instanceof Date)
          return v2;
        if (Array.isArray(v2) || typeof v2 === "object" && v2 !== null && !(v2 instanceof Date)) {
          return JSON.stringify(v2);
        }
        return v2;
      });
    }
    function strip(s, re) {
      return s.replace(re, "");
    }
    function post(a2) {
      return { kind: "sql", dialect: "mysql", sql: a2.sql, params: coerceParams(a2.params) };
    }
    function compileSelect(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileSelect)(node, modelOverride, dialect_1.MysqlDialect);
      const sql = a2.sql.replace(/^SELECT DISTINCT ON \([^)]+\) /, "SELECT DISTINCT ");
      return post({ ...a2, sql });
    }
    function compileCount(node, modelOverride) {
      return post((0, compile_from_ir_1.compileCount)(node, modelOverride, dialect_1.MysqlDialect));
    }
    function compileInsert(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileInsert)(node, modelOverride, dialect_1.MysqlDialect);
      const sql = strip(a2.sql, / RETURNING (?:\*|"[^"]+"(?:,\s*"[^"]+")*)\s*$/);
      return post({ ...a2, sql });
    }
    function compileUpdate(node, modelOverride) {
      let a2 = (0, compile_from_ir_1.compileUpdate)(node, modelOverride, dialect_1.MysqlDialect);
      let sql = a2.sql;
      sql = strip(sql, / RETURNING (?:\*|`[^`]+`(?:,\s*`[^`]+`)*)\s*$/);
      sql = sql.replace(/UPDATE (`[^`]+`) SET (.+?) WHERE ctid = \(SELECT ctid FROM \1 WHERE (.+?) LIMIT 1\)/, "UPDATE $1 SET $2 WHERE $3 LIMIT 1");
      if (node.upsertCreate && sql.includes("ON DUPLICATE KEY UPDATE")) {
        const m2 = sql.match(/ON DUPLICATE KEY UPDATE (.+?)$/);
        if (m2) {
          const rewritten = m2[1].split(",").map((assign) => {
            const eq = assign.indexOf("=");
            if (eq < 0)
              return assign;
            const lhs = assign.slice(0, eq).trim();
            return ` ${lhs} = VALUES(${lhs})`;
          }).join(",").trim();
          sql = sql.replace(/ON DUPLICATE KEY UPDATE .+$/, `ON DUPLICATE KEY UPDATE ${rewritten}`);
          const keep = Object.keys(node.upsertCreate).length;
          return post({ ...a2, sql, params: a2.params.slice(0, keep) });
        }
      }
      return post({ ...a2, sql });
    }
    function compileDelete(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileDelete)(node, modelOverride, dialect_1.MysqlDialect);
      let sql = a2.sql;
      sql = strip(sql, / RETURNING (?:\*|`[^`]+`(?:,\s*`[^`]+`)*)\s*$/);
      sql = sql.replace(/DELETE FROM (`[^`]+`) WHERE ctid = \(SELECT ctid FROM \1 WHERE (.+?) LIMIT 1\)/, "DELETE FROM $1 WHERE $2 LIMIT 1");
      return post({ ...a2, sql });
    }
    function compileGroupBy(node, modelOverride) {
      return post((0, compile_from_ir_1.compileGroupBy)(node, modelOverride, dialect_1.MysqlDialect));
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/compile.js
var require_compile3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildMysqlCompileApi = buildMysqlCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir3();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'. Use compile.delete()/compile.deleteMany() for hard deletes.`);
      }
      return sd;
    }
    function buildMysqlCompileApi(model3) {
      const mk = modelKeyFor(model3);
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [args.data], returning: args }), model3),
        createMany: (args) => {
          const rows = args.data ?? [];
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, {
            rows,
            skipDuplicates: !!args.skipDuplicates
          }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: false,
          returning: args
        }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: true
        }), model3),
        upsert: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.update,
          many: false,
          upsertCreate: args.create,
          returning: args
        }), model3),
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args.where,
          many: false,
          returning: args
        }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args?.where,
          many: true
        }), model3),
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/dialect.js
var require_dialect3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/dialect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SqliteDialect = void 0;
    var wkt_1 = require_wkt();
    exports.SqliteDialect = {
      name: "sqlite",
      quoteIdent(name) {
        if (/["\0]/.test(name)) {
          throw new Error(`[forge:sqlite] invalid identifier: ${JSON.stringify(name)}`);
        }
        return `"${name}"`;
      },
      placeholder(params, value) {
        params.push(value);
        return "?";
      },
      columnType(field) {
        switch (field.kind) {
          case "id":
            if (field.idType === "bigserial")
              return "INTEGER";
            return "TEXT";
          case "objectId":
            return "TEXT";
          case "string":
            return "TEXT";
          case "text":
            return "TEXT";
          case "int":
            return "INTEGER";
          case "float":
            return "REAL";
          case "decimal":
            return "NUMERIC";
          // SQLite has dynamic typing; NUMERIC affinity
          case "uuid":
            return "TEXT";
          case "bigint":
            return "INTEGER";
          // 64-bit; better-sqlite3 returns bigint when safeIntegers
          case "bool":
            return "INTEGER";
          // 0 / 1
          case "dateTime":
            return "TEXT";
          // ISO 8601 string
          case "json":
            return "TEXT";
          // JSON-encoded
          case "enum":
            return "TEXT";
          // + CHECK
          case "embed":
            return "TEXT";
          // JSON
          case "embedMany":
            return "TEXT";
          // JSON array
          case "stringArray":
            return "TEXT";
          // JSON array
          case "intArray":
            return "TEXT";
          // JSON array
          case "geoPoint":
            return field.geo?.fallback ? "TEXT" : "BLOB";
          case "vector":
            return "TEXT";
        }
      },
      orderClause(column, direction, nulls) {
        const dir = direction === "desc" ? "DESC" : "ASC";
        const nullsClause = nulls ? ` NULLS ${nulls.toUpperCase()}` : "";
        return `${column} ${dir}${nullsClause}`;
      },
      upsertConflictClause(conflictCols, setAssignments) {
        const cols = conflictCols.join(", ");
        return `ON CONFLICT (${cols}) DO UPDATE SET ${setAssignments}`;
      },
      searchClause(_quotedColumn, paramExpr, ctx) {
        const ftsTable = ctx.quoteIdent(`${ctx.baseTable}_fts`);
        const baseTable = ctx.quoteIdent(ctx.baseTable);
        return `${baseTable}.rowid IN (SELECT rowid FROM ${ftsTable} WHERE ${ftsTable} MATCH ${paramExpr})`;
      },
      valueExpr(field, params, value) {
        if (field.kind === "geoPoint" && !field.geo?.fallback && value && typeof value === "object") {
          const v2 = value;
          const srid = field.geo?.srid ?? 4326;
          const wkt = field.geo?.dims === 3 && typeof v2.alt === "number" ? `POINT Z(${v2.lng} ${v2.lat} ${v2.alt})` : `POINT(${v2.lng} ${v2.lat})`;
          const ph = this.placeholder(params, wkt);
          return `GeomFromText(${ph}, ${srid})`;
        }
        if (field.kind === "vector" && Array.isArray(value)) {
          return this.placeholder(params, JSON.stringify(value));
        }
        return this.placeholder(params, value);
      },
      geoNearClause(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const lngP = this.placeholder(params, point.lng);
        const latP = this.placeholder(params, point.lat);
        if (point.withinMeters === void 0)
          return "TRUE";
        const wm = this.placeholder(params, point.withinMeters);
        return `Distance(${quotedCol}, MakePoint(${lngP}, ${latP}, ${srid}), 1) < ${wm}`;
      },
      geoDistanceExpr(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const lngP = this.placeholder(params, point.lng);
        const latP = this.placeholder(params, point.lat);
        return `Distance(${quotedCol}, MakePoint(${lngP}, ${latP}, ${srid}), 1)`;
      },
      vectorDistanceClause(quotedCol, field, query, params) {
        void quotedCol;
        void field;
        void query;
        void params;
        return "TRUE";
      },
      vectorDistanceExpr() {
        return "0";
      },
      jsonPathExpr(quotedCol, path) {
        const pathSpec = "$" + path.map((s) => /^\d+$/.test(s) ? `[${s}]` : `.${s}`).join("");
        return `json_extract(${quotedCol}, '${pathSpec.replace(/'/g, "''")}')`;
      },
      geoWithinPolygonClause(quotedCol, field, multiPolygon, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = (0, wkt_1.toGeoWKT)(multiPolygon, "lng-lat");
        const pp = this.placeholder(params, wkt);
        return `Within(${quotedCol}, GeomFromText(${pp}, ${srid}))`;
      }
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/compile-from-ir.js
var require_compile_from_ir4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    exports.compileGroupBy = compileGroupBy;
    var schema_1 = require_schema();
    var dialect_1 = require_dialect3();
    var compile_from_ir_1 = require_compile_from_ir2();
    function coerceParams(params) {
      return params.map((v2) => {
        if (typeof v2 === "boolean")
          return v2 ? 1 : 0;
        if (v2 instanceof Date)
          return v2.toISOString();
        return v2;
      });
    }
    function postProcess(artifact) {
      return {
        kind: "sql",
        dialect: "sqlite",
        sql: artifact.sql,
        params: coerceParams(artifact.params)
      };
    }
    function compileSelect(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileSelect)(node, modelOverride, dialect_1.SqliteDialect);
      let sql = a2.sql;
      if (node.distinct?.length) {
        sql = sql.replace(/^SELECT DISTINCT ON \([^)]+\) /, "SELECT DISTINCT ");
      }
      return postProcess({ ...a2, sql });
    }
    function compileCount(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileCount)(node, modelOverride, dialect_1.SqliteDialect);
      let sql = a2.sql;
      if (node.distinct && node.distinct.length > 1) {
        const m2 = modelDef(node.model, modelOverride);
        const table = dialect_1.SqliteDialect.quoteIdent(m2.collection);
        const cols = node.distinct.map((f3) => `${table}.${dialect_1.SqliteDialect.quoteIdent(f3)}`).join(", ");
        const wherePart = sql.split("WHERE")[1] ? "WHERE" + sql.split("WHERE").slice(1).join("WHERE") : "";
        sql = `SELECT COUNT(*) AS count FROM (SELECT 1 FROM ${table} ${wherePart} GROUP BY ${cols})`;
      }
      return postProcess({ ...a2, sql });
    }
    function compileInsert(node, modelOverride) {
      return postProcess((0, compile_from_ir_1.compileInsert)(node, modelOverride, dialect_1.SqliteDialect));
    }
    function compileUpdate(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileUpdate)(node, modelOverride, dialect_1.SqliteDialect);
      let sql = a2.sql.replace(/ctid = \(SELECT ctid FROM/g, "rowid = (SELECT rowid FROM");
      return postProcess({ ...a2, sql });
    }
    function compileDelete(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileDelete)(node, modelOverride, dialect_1.SqliteDialect);
      let sql = a2.sql.replace(/ctid = \(SELECT ctid FROM/g, "rowid = (SELECT rowid FROM");
      return postProcess({ ...a2, sql });
    }
    function compileGroupBy(node, modelOverride) {
      return postProcess((0, compile_from_ir_1.compileGroupBy)(node, modelOverride, dialect_1.SqliteDialect));
    }
    function modelDef(modelKey, override) {
      if (override)
        return override;
      const m2 = schema_1.schema[modelKey];
      if (!m2)
        throw new Error(`[forge:sqlite] unknown model '${modelKey}' in IR`);
      return m2;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/compile.js
var require_compile4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildSqliteCompileApi = buildSqliteCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir4();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'. Use compile.delete()/compile.deleteMany() for hard deletes.`);
      }
      return sd;
    }
    function buildSqliteCompileApi(model3) {
      const mk = modelKeyFor(model3);
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [args.data], returning: args }), model3),
        createMany: (args) => {
          const rows = args.data ?? [];
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, {
            rows,
            skipDuplicates: !!args.skipDuplicates
          }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: false,
          returning: args
        }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: true
        }), model3),
        upsert: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.update,
          many: false,
          upsertCreate: args.create,
          returning: args
        }), model3),
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args.where,
          many: false,
          returning: args
        }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args?.where,
          many: true
        }), model3),
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/dialect.js
var require_dialect4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/dialect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DuckdbDialect = void 0;
    var wkt_1 = require_wkt();
    exports.DuckdbDialect = {
      name: "duckdb",
      quoteIdent(name) {
        if (/["\0]/.test(name)) {
          throw new Error(`[forge:duckdb] invalid identifier: ${JSON.stringify(name)}`);
        }
        return `"${name}"`;
      },
      placeholder(params, value) {
        params.push(value);
        return `$${params.length}`;
      },
      columnType(field) {
        switch (field.kind) {
          case "id":
            if (field.idType === "bigserial")
              return "BIGINT";
            if (field.idType === "uuid")
              return "UUID";
            return "VARCHAR";
          case "objectId":
            return "VARCHAR";
          case "string":
            return "VARCHAR";
          case "text":
            return "VARCHAR";
          case "int":
            return "INTEGER";
          case "float":
            return "DOUBLE";
          case "decimal":
            return field.precision != null ? `DECIMAL(${field.precision}${field.scale != null ? `,${field.scale}` : ""})` : "DECIMAL";
          case "uuid":
            return "UUID";
          case "bigint":
            return "BIGINT";
          case "bool":
            return "BOOLEAN";
          // TIMESTAMP WITH TIME ZONE in DuckDB. Stored UTC; surface as JS Date.
          case "dateTime":
            return "TIMESTAMPTZ";
          // Native JSON type. DuckDB's JSON extension is autoloaded since v0.9.
          case "json":
            return "JSON";
          case "enum":
            return "VARCHAR";
          // + CHECK constraint applied at DDL time
          case "embed":
            return "JSON";
          case "embedMany":
            return "JSON";
          // DuckDB supports native arrays: VARCHAR[], INTEGER[], etc.
          case "stringArray":
            return "VARCHAR[]";
          case "intArray":
            return "INTEGER[]";
          case "geoPoint":
            return field.geo?.fallback ? "JSON" : "GEOMETRY";
          case "vector": {
            const dims = field.vector?.dims;
            if (!dims)
              throw new Error(`[forge:duckdb] vector field requires { dims }`);
            return `FLOAT[${dims}]`;
          }
        }
      },
      orderClause(column, direction, nulls) {
        const dir = direction === "desc" ? "DESC" : "ASC";
        const nullsClause = nulls ? ` NULLS ${nulls.toUpperCase()}` : "";
        return `${column} ${dir}${nullsClause}`;
      },
      upsertConflictClause(conflictCols, setAssignments) {
        const cols = conflictCols.join(", ");
        return `ON CONFLICT (${cols}) DO UPDATE SET ${setAssignments}`;
      },
      searchClause(quotedColumn, paramExpr, _ctx) {
        return `${quotedColumn} ILIKE '%' || ${paramExpr} || '%'`;
      },
      valueExpr(field, params, value) {
        if (field.kind === "geoPoint" && !field.geo?.fallback && value && typeof value === "object") {
          const v2 = value;
          const lngP = this.placeholder(params, v2.lng);
          const latP = this.placeholder(params, v2.lat);
          if (field.geo?.dims === 3 && typeof v2.alt === "number") {
            const altP = this.placeholder(params, v2.alt);
            return `ST_Point3D(${lngP}, ${latP}, ${altP})`;
          }
          return `ST_Point(${lngP}, ${latP})`;
        }
        if (field.kind === "vector" && Array.isArray(value)) {
          const dims = field.vector?.dims;
          return `[${value.join(",")}]::FLOAT[${dims}]`;
        }
        return this.placeholder(params, value);
      },
      geoNearClause(quotedCol, _field, point, params) {
        const lngP = this.placeholder(params, point.lng);
        const latP = this.placeholder(params, point.lat);
        if (point.withinMeters === void 0)
          return "TRUE";
        const wm = this.placeholder(params, point.withinMeters);
        return `ST_Distance_Sphere(${quotedCol}, ST_Point(${lngP}, ${latP})) < ${wm}`;
      },
      geoDistanceExpr(quotedCol, _field, point, params) {
        const lngP = this.placeholder(params, point.lng);
        const latP = this.placeholder(params, point.lat);
        return `ST_Distance_Sphere(${quotedCol}, ST_Point(${lngP}, ${latP}))`;
      },
      vectorDistanceClause(quotedCol, field, query, params) {
        const metric = field.vector?.metric ?? "cosine";
        const fn = metric === "cosine" ? "array_cosine_distance" : metric === "l2" ? "array_distance" : (
          /* dot */
          "array_inner_product"
        );
        const dims = field.vector?.dims;
        const literal = `[${query.vector.join(",")}]::FLOAT[${dims}]`;
        if (query.withinDistance === void 0)
          return "TRUE";
        const wd = this.placeholder(params, query.withinDistance);
        return `${fn}(${quotedCol}, ${literal}) < ${wd}`;
      },
      vectorDistanceExpr(quotedCol, field, vector, _params) {
        const metric = field.vector?.metric ?? "cosine";
        const fn = metric === "cosine" ? "array_cosine_distance" : metric === "l2" ? "array_distance" : (
          /* dot */
          "array_inner_product"
        );
        const dims = field.vector?.dims;
        return `${fn}(${quotedCol}, [${vector.join(",")}]::FLOAT[${dims}])`;
      },
      jsonPathExpr(quotedCol, path) {
        const pathSpec = "$" + path.map((s) => /^\d+$/.test(s) ? `[${s}]` : `.${s}`).join("");
        return `json_extract(${quotedCol}, '${pathSpec.replace(/'/g, "''")}')`;
      },
      geoWithinPolygonClause(quotedCol, _field, multiPolygon, params) {
        const wkt = (0, wkt_1.toGeoWKT)(multiPolygon, "lng-lat");
        const pp = this.placeholder(params, wkt);
        return `ST_Within(${quotedCol}, ST_GeomFromText(${pp}::VARCHAR))`;
      }
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/compile-from-ir.js
var require_compile_from_ir5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    exports.compileGroupBy = compileGroupBy;
    var compile_from_ir_1 = require_compile_from_ir2();
    var dialect_1 = require_dialect4();
    function toDuckdb(a2) {
      let sql = a2.sql.replace(/\bctid\b/g, "rowid");
      return { ...a2, dialect: "duckdb", sql };
    }
    function compileSelect(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileSelect)(node, model3, dialect_1.DuckdbDialect));
    }
    function compileCount(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileCount)(node, model3, dialect_1.DuckdbDialect));
    }
    function compileInsert(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileInsert)(node, model3, dialect_1.DuckdbDialect));
    }
    function compileUpdate(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileUpdate)(node, model3, dialect_1.DuckdbDialect));
    }
    function compileDelete(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileDelete)(node, model3, dialect_1.DuckdbDialect));
    }
    function compileGroupBy(node, model3) {
      return toDuckdb((0, compile_from_ir_1.compileGroupBy)(node, model3, dialect_1.DuckdbDialect));
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/compile.js
var require_compile5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildDuckdbCompileApi = buildDuckdbCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir5();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'. Use compile.delete()/compile.deleteMany() for hard deletes.`);
      }
      return sd;
    }
    function buildDuckdbCompileApi(model3) {
      const mk = modelKeyFor(model3);
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [args.data], returning: args }), model3),
        createMany: (args) => {
          const rows = args.data ?? [];
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows, skipDuplicates: !!args.skipDuplicates }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: false,
          returning: args
        }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.data,
          many: true
        }), model3),
        upsert: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
          where: args.where,
          data: args.update,
          many: false,
          upsertCreate: args.create,
          returning: args
        }), model3),
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args.where,
          many: false,
          returning: args
        }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, {
          where: args?.where,
          many: true
        }), model3),
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/dialect.js
var require_dialect5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/dialect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MssqlDialect = void 0;
    var wkt_1 = require_wkt();
    exports.MssqlDialect = {
      name: "mssql",
      quoteIdent(name) {
        if (/[\]\0]/.test(name)) {
          throw new Error(`[forge:mssql] invalid identifier: ${JSON.stringify(name)}`);
        }
        return `[${name}]`;
      },
      placeholder(params, value) {
        params.push(value);
        return `@p${params.length}`;
      },
      columnType(field) {
        switch (field.kind) {
          case "id":
            if (field.idType === "bigserial")
              return "BIGINT IDENTITY(1,1)";
            if (field.idType === "uuid")
              return "UNIQUEIDENTIFIER";
            return "NVARCHAR(255)";
          case "objectId":
            return "NVARCHAR(255)";
          case "string":
            return "NVARCHAR(255)";
          // T-SQL TEXT is deprecated; NVARCHAR(MAX) is the modern equivalent.
          case "text":
            return "NVARCHAR(MAX)";
          case "int":
            return "INT";
          case "float":
            return "FLOAT";
          case "decimal":
            return field.precision != null ? `DECIMAL(${field.precision}${field.scale != null ? `,${field.scale}` : ""})` : "DECIMAL";
          case "uuid":
            return "UNIQUEIDENTIFIER";
          case "bigint":
            return "BIGINT";
          // T-SQL booleans are BIT; the driver coerces JS true/false to 1/0.
          case "bool":
            return "BIT";
          // DATETIMEOFFSET preserves tz; DATETIME2 doesn't.
          case "dateTime":
            return "DATETIMEOFFSET";
          // JSON lives in NVARCHAR(MAX); SQL Server 2025 adds a real JSON type,
          // but NVARCHAR(MAX) is the portable choice for now.
          case "json":
            return "NVARCHAR(MAX)";
          case "enum":
            return "NVARCHAR(255)";
          // + CHECK constraint applied at DDL time
          case "embed":
            return "NVARCHAR(MAX)";
          case "embedMany":
            return "NVARCHAR(MAX)";
          // T-SQL has no native array. Serialize as JSON; consumers use
          // JSON_VALUE / OPENJSON to read.
          case "stringArray":
            return "NVARCHAR(MAX)";
          case "intArray":
            return "NVARCHAR(MAX)";
          case "geoPoint":
            return field.geo?.fallback ? "NVARCHAR(MAX)" : "GEOGRAPHY";
          case "vector": {
            const dims = field.vector?.dims;
            if (!dims)
              throw new Error(`[forge:mssql] vector field requires { dims }`);
            return `VECTOR(${dims})`;
          }
        }
      },
      orderClause(column, direction, nulls) {
        const dir = direction === "desc" ? "DESC" : "ASC";
        if (!nulls)
          return `${column} ${dir}`;
        const nullsFirst = nulls === "first";
        return `CASE WHEN ${column} IS NULL THEN ${nullsFirst ? 0 : 1} ELSE ${nullsFirst ? 1 : 0} END ASC, ${column} ${dir}`;
      },
      upsertConflictClause(_conflictCols, _setAssignments) {
        return `/* __MSSQL_UPSERT__ */`;
      },
      searchClause(quotedColumn, paramExpr, _ctx) {
        return `${quotedColumn} LIKE '%' + ${paramExpr} + '%'`;
      },
      valueExpr(field, params, value) {
        if (field.kind === "geoPoint" && !field.geo?.fallback && value && typeof value === "object") {
          const v2 = value;
          const srid = field.geo?.srid ?? 4326;
          const wkt = field.geo?.dims === 3 && typeof v2.alt === "number" ? `POINT(${v2.lng} ${v2.lat} ${v2.alt})` : `POINT(${v2.lng} ${v2.lat})`;
          const ph = this.placeholder(params, wkt);
          return `geography::STGeomFromText(${ph}, ${srid})`;
        }
        if (field.kind === "vector" && Array.isArray(value)) {
          const dims = field.vector?.dims;
          const ph = this.placeholder(params, `[${value.join(",")}]`);
          return `CAST(${ph} AS VECTOR(${dims}))`;
        }
        return this.placeholder(params, value);
      },
      geoNearClause(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = `POINT(${point.lng} ${point.lat})`;
        const pp = this.placeholder(params, wkt);
        const ref = `geography::STGeomFromText(${pp}, ${srid})`;
        if (point.withinMeters === void 0)
          return "TRUE";
        const wm = this.placeholder(params, point.withinMeters);
        return `${quotedCol}.STDistance(${ref}) < ${wm}`;
      },
      geoDistanceExpr(quotedCol, field, point, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = `POINT(${point.lng} ${point.lat})`;
        const pp = this.placeholder(params, wkt);
        return `${quotedCol}.STDistance(geography::STGeomFromText(${pp}, ${srid}))`;
      },
      vectorDistanceClause(quotedCol, field, query, params) {
        const metric = field.vector?.metric ?? "cosine";
        const dims = field.vector?.dims;
        const ph = this.placeholder(params, `[${query.vector.join(",")}]`);
        const ref = `CAST(${ph} AS VECTOR(${dims}))`;
        if (query.withinDistance === void 0)
          return "TRUE";
        const wd = this.placeholder(params, query.withinDistance);
        return `VECTOR_DISTANCE('${metric}', ${quotedCol}, ${ref}) < ${wd}`;
      },
      vectorDistanceExpr(quotedCol, field, vector, params) {
        const metric = field.vector?.metric ?? "cosine";
        const dims = field.vector?.dims;
        const ph = this.placeholder(params, `[${vector.join(",")}]`);
        return `VECTOR_DISTANCE('${metric}', ${quotedCol}, CAST(${ph} AS VECTOR(${dims})))`;
      },
      jsonPathExpr(quotedCol, path) {
        const pathSpec = "$" + path.map((s) => /^\d+$/.test(s) ? `[${s}]` : `.${s}`).join("");
        return `JSON_VALUE(${quotedCol}, '${pathSpec.replace(/'/g, "''")}')`;
      },
      geoWithinPolygonClause(quotedCol, field, multiPolygon, params) {
        const srid = field.geo?.srid ?? 4326;
        const wkt = (0, wkt_1.toGeoWKT)(multiPolygon, "lng-lat");
        const pp = this.placeholder(params, wkt);
        return `geography::STGeomFromText(${pp}, ${srid}).STContains(${quotedCol}) = 1`;
      }
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/compile-from-ir.js
var require_compile_from_ir6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/compile-from-ir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileSelect = compileSelect;
    exports.compileCount = compileCount;
    exports.compileGroupBy = compileGroupBy;
    exports.compileInsert = compileInsert;
    exports.compileUpdate = compileUpdate;
    exports.compileDelete = compileDelete;
    var schema_1 = require_schema();
    var dialect_1 = require_dialect5();
    var compile_from_ir_1 = require_compile_from_ir2();
    function modelDef(modelKey, override) {
      if (override)
        return override;
      const m2 = schema_1.schema[modelKey];
      if (!m2)
        throw new Error(`[forge:mssql] unknown model '${modelKey}' in IR`);
      return m2;
    }
    function primaryKeyOf(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.kind === "id")
          return name;
      }
      return "id";
    }
    function coerceParams(params) {
      return params.map((v2) => {
        if (v2 === true || v2 === false)
          return v2 ? 1 : 0;
        if (Array.isArray(v2) || typeof v2 === "object" && v2 !== null && !(v2 instanceof Date)) {
          return JSON.stringify(v2);
        }
        return v2;
      });
    }
    function post(a2) {
      return { kind: "sql", dialect: "mssql", sql: a2.sql, params: coerceParams(a2.params) };
    }
    function rewriteLimitOffset(sql) {
      const limitMatch = sql.match(/\sLIMIT\s+(\d+)/i);
      const offsetMatch = sql.match(/\sOFFSET\s+(\d+)(?!\s+ROWS)/i);
      if (!limitMatch && !offsetMatch)
        return sql;
      let out = sql;
      if (limitMatch)
        out = out.replace(limitMatch[0], "");
      if (offsetMatch)
        out = out.replace(offsetMatch[0], "");
      const offset = offsetMatch ? Number(offsetMatch[1]) : 0;
      const limit = limitMatch ? Number(limitMatch[1]) : void 0;
      let tail = ` OFFSET ${offset} ROWS`;
      if (limit !== void 0)
        tail += ` FETCH NEXT ${limit} ROWS ONLY`;
      return out.trimEnd() + tail;
    }
    function rewriteCtidSingleRow(sql, table, pk) {
      const re = new RegExp(`WHERE ctid = \\(SELECT ctid FROM ${escapeReg(table)}(?:\\s+WHERE\\s+(.+?))?\\s+LIMIT\\s+1\\)`, "gi");
      return sql.replace(re, (_match, whereExpr) => {
        const whereClause = whereExpr ? `WHERE ${whereExpr}` : "";
        return `WHERE [${pk}] IN (SELECT TOP 1 [${pk}] FROM ${table} ${whereClause})`.trim();
      });
    }
    function escapeReg(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function rewriteReturningForInsert(sql) {
      const returning = sql.match(/\sRETURNING\s+(?:\*|(?:\[[^\]]+\]|"[^"]+"|`[^`]+`)(?:,\s*(?:\[[^\]]+\]|"[^"]+"|`[^`]+`))*)\s*$/i);
      if (!returning)
        return sql;
      const head = sql.slice(0, returning.index);
      const m2 = head.match(/^(INSERT INTO\s+\[[^\]]+\]\s*\([^)]+\))\s+(VALUES\s+)/i);
      if (m2) {
        return `${m2[1]} OUTPUT INSERTED.* ${m2[2]}${head.slice(m2[0].length)}`;
      }
      return head;
    }
    function rewriteReturningForUpdate(sql) {
      const returning = sql.match(/\sRETURNING\s+(?:\*|(?:\[[^\]]+\]|"[^"]+")(?:,\s*(?:\[[^\]]+\]|"[^"]+"))*)\s*$/i);
      if (!returning)
        return sql;
      const head = sql.slice(0, returning.index);
      const setEnd = head.search(/\s+WHERE\s+/i);
      if (setEnd >= 0) {
        return `${head.slice(0, setEnd)} OUTPUT INSERTED.*${head.slice(setEnd)}`;
      }
      return `${head} OUTPUT INSERTED.*`;
    }
    function rewriteReturningForDelete(sql) {
      const returning = sql.match(/\sRETURNING\s+(?:\*|(?:\[[^\]]+\]|"[^"]+")(?:,\s*(?:\[[^\]]+\]|"[^"]+"))*)\s*$/i);
      if (!returning)
        return sql;
      const head = sql.slice(0, returning.index);
      const whereIdx = head.search(/\s+WHERE\s+/i);
      if (whereIdx >= 0) {
        return `${head.slice(0, whereIdx)} OUTPUT DELETED.*${head.slice(whereIdx)}`;
      }
      return `${head} OUTPUT DELETED.*`;
    }
    function compileSelect(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileSelect)(node, modelOverride, dialect_1.MssqlDialect);
      let sql = a2.sql;
      sql = sql.replace(/^SELECT DISTINCT ON \([^)]+\) /, "SELECT DISTINCT ");
      sql = rewriteLimitOffset(sql);
      return post({ ...a2, sql });
    }
    function compileCount(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileCount)(node, modelOverride, dialect_1.MssqlDialect);
      return post({ ...a2, sql: rewriteLimitOffset(a2.sql) });
    }
    function compileGroupBy(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileGroupBy)(node, modelOverride, dialect_1.MssqlDialect);
      return post({ ...a2, sql: rewriteLimitOffset(a2.sql) });
    }
    function compileInsert(node, modelOverride) {
      const a2 = (0, compile_from_ir_1.compileInsert)(node, modelOverride, dialect_1.MssqlDialect);
      let sql = a2.sql;
      sql = rewriteReturningForInsert(sql);
      return post({ ...a2, sql });
    }
    function compileUpdate(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      if (node.upsertCreate) {
        return post(compileMergeUpsert(node, m2));
      }
      const pk = primaryKeyOf(m2);
      const a2 = (0, compile_from_ir_1.compileUpdate)(node, modelOverride, dialect_1.MssqlDialect);
      let sql = a2.sql;
      const tableQ = `[${m2.collection}]`;
      sql = rewriteCtidSingleRow(sql, tableQ, pk);
      sql = rewriteReturningForUpdate(sql);
      return post({ ...a2, sql });
    }
    function compileMergeUpsert(node, m2) {
      const table = `[${m2.collection.replace(/]/g, "]]")}]`;
      const params = [];
      const ph = (v2) => dialect_1.MssqlDialect.placeholder(params, v2);
      const insertCols = Object.keys(node.upsertCreate);
      if (insertCols.length === 0) {
        throw new Error("[forge:mssql] upsert requires at least one field in create.");
      }
      const updateParts = [];
      if (node.set) {
        for (const [k, v2] of Object.entries(node.set)) {
          updateParts.push(`[${k}] = ${ph(v2)}`);
        }
      }
      if (node.increment) {
        for (const [k, v2] of Object.entries(node.increment)) {
          updateParts.push(`[${k}] = COALESCE(tgt.[${k}], 0) + ${ph(v2)}`);
        }
      }
      if (node.multiply) {
        for (const [k, v2] of Object.entries(node.multiply)) {
          updateParts.push(`[${k}] = COALESCE(tgt.[${k}], 0) * ${ph(v2)}`);
        }
      }
      if (node.unset?.length) {
        for (const k of node.unset)
          updateParts.push(`[${k}] = NULL`);
      }
      const conflictCols = whereEqLeafColumns(node.where);
      if (conflictCols.length === 0) {
        throw new Error(`[forge:mssql] upsert requires a conflict target. Use { where: { uniqueCol: value } } (or AND of eq leaves) so the MERGE knows which key identifies an existing row.`);
      }
      if (updateParts.length === 0) {
        updateParts.push(`[${conflictCols[0]}] = tgt.[${conflictCols[0]}]`);
      }
      const onClause = conflictCols.map((c) => `tgt.[${c}] = src.[${c}]`).join(" AND ");
      for (const c of conflictCols) {
        if (!insertCols.includes(c)) {
          const v2 = whereLeafEqValue(node.where, c);
          if (v2 === void 0) {
            throw new Error(`[forge:mssql] upsert conflict column '${c}' is in the where clause but not in create. Add it to create so MERGE can route it to the INSERT branch.`);
          }
          insertCols.push(c);
        }
      }
      const finalCols = insertCols.map((c) => `[${c}]`).join(", ");
      const finalVals = insertCols.map((c) => {
        if (c in node.upsertCreate)
          return ph(node.upsertCreate[c]);
        return ph(whereLeafEqValue(node.where, c));
      }).join(", ");
      const srcInsertValues = insertCols.map((c) => `src.[${c}]`).join(", ");
      const sql = `MERGE INTO ${table} AS tgt USING (VALUES (${finalVals})) AS src (${finalCols}) ON ${onClause} WHEN MATCHED THEN UPDATE SET ${updateParts.join(", ")} WHEN NOT MATCHED THEN INSERT (${finalCols}) VALUES (${srcInsertValues}) OUTPUT INSERTED.*;`;
      return { kind: "sql", dialect: "mssql", sql, params };
    }
    function whereEqLeafColumns(tree) {
      if (!tree)
        return [];
      if (tree.kind === "leaf" && tree.op === "eq")
        return [tree.field];
      if (tree.kind === "and")
        return tree.children.flatMap(whereEqLeafColumns);
      return [];
    }
    function whereLeafEqValue(tree, col) {
      if (!tree)
        return void 0;
      if (tree.kind === "leaf" && tree.op === "eq" && tree.field === col)
        return tree.value;
      if (tree.kind === "and") {
        for (const child of tree.children) {
          const v2 = whereLeafEqValue(child, col);
          if (v2 !== void 0)
            return v2;
        }
      }
      return void 0;
    }
    function compileDelete(node, modelOverride) {
      const m2 = modelDef(node.model, modelOverride);
      const pk = primaryKeyOf(m2);
      const a2 = (0, compile_from_ir_1.compileDelete)(node, modelOverride, dialect_1.MssqlDialect);
      let sql = a2.sql;
      const tableQ = `[${m2.collection}]`;
      sql = rewriteCtidSingleRow(sql, tableQ, pk);
      sql = rewriteReturningForDelete(sql);
      return post({ ...a2, sql });
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/compile.js
var require_compile6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/compile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildMssqlCompileApi = buildMssqlCompileApi;
    var build_1 = require_build();
    var compile_from_ir_1 = require_compile_from_ir6();
    var schema_1 = require_schema();
    function modelKeyFor(model3) {
      for (const key of Object.keys(schema_1.schema)) {
        if (schema_1.schema[key] === model3)
          return key;
      }
      return model3.collection;
    }
    function softDeleteField(model3) {
      for (const [name, fdef] of Object.entries(model3.fields)) {
        if (fdef?.softDeleteAt)
          return name;
      }
      return void 0;
    }
    function requireSoftDeleteField(model3, op) {
      const sd = softDeleteField(model3);
      if (!sd) {
        throw new Error(`[forge] compile.${op}() requires a field declared with .softDeleteAt() on model '${model3.collection}'.`);
      }
      return sd;
    }
    function buildMssqlCompileApi(model3) {
      const mk = modelKeyFor(model3);
      const upsertUnsupported = () => {
        throw new Error(`[forge:mssql] upsert / ON CONFLICT is not implemented in 2.3. The T-SQL equivalent (MERGE) lands in v2.4. Until then, use findFirst \u2192 update / create.`);
      };
      return {
        findFirst: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findUnique: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "one"), model3),
        findMany: (args) => (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(mk, model3, args, "many"), model3),
        count: (args) => (0, compile_from_ir_1.compileCount)((0, build_1.buildCount)(mk, model3, args), model3),
        create: (args) => (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows: [args.data], returning: args }), model3),
        createMany: (args) => {
          const rows = args.data ?? [];
          return (0, compile_from_ir_1.compileInsert)((0, build_1.buildInsert)(mk, model3, { rows, skipDuplicates: !!args.skipDuplicates }), model3);
        },
        update: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, { where: args.where, data: args.data, many: false, returning: args }), model3),
        updateMany: (args) => (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, { where: args.where, data: args.data, many: true }), model3),
        upsert: (_args) => upsertUnsupported(),
        delete: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, { where: args.where, many: false, returning: args }), model3),
        deleteMany: (args) => (0, compile_from_ir_1.compileDelete)((0, build_1.buildDelete)(mk, model3, { where: args?.where, many: true }), model3),
        softDelete: (args) => {
          const sd = requireSoftDeleteField(model3, "softDelete");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDelete",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "softDelete";
          return art;
        },
        softDeleteMany: (args) => {
          const sd = requireSoftDeleteField(model3, "softDeleteMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: /* @__PURE__ */ new Date() },
            semantic: "softDeleteMany",
            many: true
          }), model3);
          art.semanticOp = "softDeleteMany";
          return art;
        },
        restore: (args) => {
          const sd = requireSoftDeleteField(model3, "restore");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args.where,
            data: { [sd]: null },
            semantic: "restore",
            many: false,
            returning: args
          }), model3);
          art.semanticOp = "restore";
          return art;
        },
        restoreMany: (args) => {
          const sd = requireSoftDeleteField(model3, "restoreMany");
          const art = (0, compile_from_ir_1.compileUpdate)((0, build_1.buildUpdate)(mk, model3, {
            where: args?.where,
            data: { [sd]: null },
            semantic: "restoreMany",
            many: true
          }), model3);
          art.semanticOp = "restoreMany";
          return art;
        }
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/events.js
var require_events = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/events.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ForgeEmitter = void 0;
    var ForgeEmitter = class {
      queryListeners = [];
      errorListeners = [];
      on(event, cb) {
        if (event === "query") {
          this.queryListeners.push(cb);
          return () => {
            this.queryListeners = this.queryListeners.filter((l) => l !== cb);
          };
        }
        this.errorListeners.push(cb);
        return () => {
          this.errorListeners = this.errorListeners.filter((l) => l !== cb);
        };
      }
      off(event, cb) {
        if (event === "query")
          this.queryListeners = this.queryListeners.filter((l) => l !== cb);
        else
          this.errorListeners = this.errorListeners.filter((l) => l !== cb);
      }
      hasListeners(event) {
        if (event === "query")
          return this.queryListeners.length > 0;
        if (event === "error")
          return this.errorListeners.length > 0;
        return this.queryListeners.length > 0 || this.errorListeners.length > 0;
      }
      emitQuery(e) {
        for (const l of this.queryListeners) {
          try {
            void l(e);
          } catch {
          }
        }
      }
      emitError(e) {
        for (const l of this.errorListeners) {
          try {
            void l(e);
          } catch {
          }
        }
      }
      /** Helper for adapters: time an async op, emit query+error events. */
      async track(info, op, countRows = () => -1) {
        const startedAt = /* @__PURE__ */ new Date();
        const t0 = performance.now();
        try {
          const result = await op();
          this.emitQuery({
            ...info,
            duration_ms: performance.now() - t0,
            rowCount: countRows(result),
            startedAt
          });
          return result;
        } catch (err) {
          this.emitError({
            ...info,
            error: err,
            duration_ms: performance.now() - t0
          });
          throw err;
        }
      }
    };
    exports.ForgeEmitter = ForgeEmitter;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/detect.js
var require_detect = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/detect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DRIVER_PACKAGE_FOR = void 0;
    exports.detectAdapterKind = detectAdapterKind;
    var URL_PREFIX_TO_KIND = [
      [/^mongodb(\+srv)?:\/\//i, "mongo"],
      [/^postgres(ql)?:\/\//i, "postgres"],
      [/^(mysql|mariadb):\/\//i, "mysql"],
      [/^(sqlite:|file:)/i, "sqlite"],
      // Browser sqlite-wasm — OPFS persistent, OPFS SAH-pool (multi-tab safe),
      // and the bare `:memory:` ephemeral form. All resolve to the sqlite adapter
      // and route through the wasm driver injected by createDb({ driver }).
      [/^opfs(-sahpool)?:/i, "sqlite"],
      [/^:memory:$/i, "sqlite"],
      // Browser IndexedDB — zero-install browser tier. `idb:` is the canonical
      // prefix, `indexeddb:` the long-form alias. Both resolve to the indexeddb
      // adapter (a browser-only adapter with a server-safety guard).
      [/^(idb|indexeddb):/i, "indexeddb"],
      [/^duckdb:/i, "duckdb"],
      // mssql / sqlserver — both prefixes are in the wild.
      [/^(mssql|sqlserver):\/\//i, "mssql"]
    ];
    function detectAdapterKind(url) {
      for (const [re, kind] of URL_PREFIX_TO_KIND) {
        if (re.test(url))
          return kind;
      }
      if (/\.(db|sqlite|sqlite3)$/i.test(url))
        return "sqlite";
      if (/\.duckdb$/i.test(url))
        return "duckdb";
      return null;
    }
    exports.DRIVER_PACKAGE_FOR = {
      mongo: "mongodb",
      postgres: "pg",
      mysql: "mysql2",
      sqlite: "better-sqlite3",
      duckdb: "@duckdb/node-api",
      mssql: "mssql",
      indexeddb: "(none \u2014 browser built-in)"
    };
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/missing-driver.js
var require_missing_driver = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/missing-driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ForgeMissingDriverError = void 0;
    exports.loadDriver = loadDriver;
    exports.isDriverInstalled = isDriverInstalled;
    var detect_1 = require_detect();
    var ForgeMissingDriverError = class extends Error {
      kind;
      pkg;
      originalUrl;
      code = "FORGE_MISSING_DRIVER";
      constructor(kind, pkg, originalUrl) {
        super(buildMessage(kind, pkg, originalUrl));
        this.kind = kind;
        this.pkg = pkg;
        this.originalUrl = originalUrl;
        this.name = "ForgeMissingDriverError";
      }
    };
    exports.ForgeMissingDriverError = ForgeMissingDriverError;
    function buildMessage(kind, pkg, url) {
      const inferLine = url ? `
  Detected:    DATABASE_URL=${redactUrl(url)}  (inferred adapter: ${kind})` : `
  Adapter:     ${kind}`;
      return `[forge] ${kind} adapter needs the '${pkg}' driver, but it's not installed.${inferLine}
  Install:     npm install ${pkg}
  Or override: createDb({ type: 'mongo' | 'postgres' | 'mysql' | 'sqlite' | 'duckdb' | 'mssql', url: '...' })`;
    }
    function redactUrl(url) {
      return url.replace(/(:\/\/[^:@/]+):([^@/]+)@/, "$1:****@");
    }
    function loadDriver(kind, url) {
      const pkg = detect_1.DRIVER_PACKAGE_FOR[kind];
      try {
        return __require(pkg);
      } catch (err) {
        if (err?.code === "MODULE_NOT_FOUND") {
          throw new ForgeMissingDriverError(kind, pkg, url);
        }
        throw err;
      }
    }
    function isDriverInstalled(kind) {
      const pkg = detect_1.DRIVER_PACKAGE_FOR[kind];
      try {
        const mod = __require(`${pkg}/package.json`);
        return { installed: true, version: mod?.version };
      } catch {
        return { installed: false };
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/cascade.js
var require_cascade = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/cascade.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyCascadesForDelete = applyCascadesForDelete;
    var bson_1 = require_bson();
    var client_1 = require_client();
    var schema_1 = require_schema();
    var schemaKeyByModel = /* @__PURE__ */ new Map();
    for (const [key, model3] of Object.entries(schema_1.schema)) {
      schemaKeyByModel.set(model3, key);
    }
    var allModels = Object.values(schema_1.schema);
    function findChildRelations(parentModel) {
      const parentKey = schemaKeyByModel.get(parentModel);
      if (!parentKey)
        return [];
      const out = [];
      for (const childModel of allModels) {
        const rels = childModel.relations();
        for (const [relName, rel] of Object.entries(rels)) {
          const r = rel;
          if (r.kind !== "one" || r.inverse)
            continue;
          if (r.target !== parentKey)
            continue;
          out.push({ childModel, rel: r, childRelName: relName });
        }
      }
      return out;
    }
    async function applyCascadesForDelete(parentModel, parentDocs, ctx = { visited: /* @__PURE__ */ new Set() }) {
      if (parentDocs.length === 0)
        return;
      const children = findChildRelations(parentModel);
      if (children.length === 0)
        return;
      for (const { childModel, rel } of children) {
        const onDelete = rel.onDelete || "NoAction";
        if (onDelete === "NoAction" || onDelete === "Restrict")
          continue;
        const parentRefValues = unique(parentDocs.map((p2) => p2[rel.refs] ?? p2[rel.refs === "id" ? "_id" : rel.refs]).filter(notNull));
        if (parentRefValues.length === 0)
          continue;
        const childOnDef = childModel.fields[rel.on];
        const isObjectIdField = childOnDef?.kind === "id" || childOnDef?.kind === "objectId";
        const inValues = isObjectIdField ? parentRefValues.map((v2) => v2 instanceof (0, bson_1.mongo)().ObjectId ? v2 : typeof v2 === "string" && (0, bson_1.mongo)().ObjectId.isValid(v2) ? new ((0, bson_1.mongo)()).ObjectId(v2) : v2) : parentRefValues;
        const childCollection = client_1.dbClient.db.collection(childModel.collection);
        const filter = { [rel.on]: { $in: inValues } };
        if (onDelete === "SetNull") {
          await childCollection.updateMany(filter, { $unset: { [rel.on]: "" } });
          continue;
        }
        const childDocs = await childCollection.find(filter).toArray();
        if (childDocs.length === 0)
          continue;
        const fresh = childDocs.filter((d2) => {
          const key = `${childModel.collection}:${String(d2._id)}`;
          if (ctx.visited.has(key))
            return false;
          ctx.visited.add(key);
          return true;
        });
        if (fresh.length === 0)
          continue;
        await applyCascadesForDelete(childModel, fresh, ctx);
        const ids = fresh.map((d2) => d2._id);
        await childCollection.deleteMany({ _id: { $in: ids } });
      }
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = v2 instanceof (0, bson_1.mongo)().ObjectId ? v2.toString() : String(v2);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(v2);
        }
      }
      return out;
    }
    function notNull(v2) {
      return v2 != null;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/execute.js
var require_execute = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/execute.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeSelect = executeSelect;
    exports.executeInsert = executeInsert;
    exports.executeUpdate = executeUpdate;
    exports.executeDelete = executeDelete;
    exports.applyProjectionAndHydration = applyProjectionAndHydration;
    exports.executeGroupBy = executeGroupBy;
    exports.executeCount = executeCount;
    var client_1 = require_client();
    var schema_1 = require_schema();
    var coerce_1 = require_coerce();
    var compile_from_ir_1 = require_compile_from_ir();
    var cascade_1 = require_cascade();
    var errors_1 = require_errors();
    var bson_1 = require_bson();
    async function executeSelect(node, model3, opts = {}) {
      const nearToEntry = node.orderBy?.find((e) => e.nearTo);
      if (nearToEntry) {
        const fld = model3.fields?.[nearToEntry.field];
        if (fld?.kind === "vector") {
          return executeSelectWithVectorSearch(node, model3, nearToEntry, opts);
        }
        return executeSelectWithGeoNear(node, model3, nearToEntry, opts);
      }
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const filter = artifact.args.filter ?? {};
      const options = artifact.args.options ?? {};
      let rows;
      if (artifact.op === "findOne") {
        let cursor = coll.find(filter, opts.session ? { session: opts.session } : void 0);
        if (options.projection)
          cursor = cursor.project(options.projection);
        if (options.sort)
          cursor = cursor.sort(options.sort);
        if (options.skip)
          cursor = cursor.skip(options.skip);
        cursor = cursor.limit(1);
        rows = await cursor.toArray();
      } else {
        let cursor = coll.find(filter, opts.session ? { session: opts.session } : void 0);
        if (options.projection)
          cursor = cursor.project(options.projection);
        if (options.sort)
          cursor = cursor.sort(options.sort);
        if (options.skip)
          cursor = cursor.skip(options.skip);
        if (options.limit)
          cursor = cursor.limit(options.limit);
        rows = await cursor.toArray();
      }
      let out = rows.map((r) => (0, coerce_1.decodeRow)(model3, r));
      if (node.distinct?.length) {
        out = dedupeBy(out, node.distinct);
      }
      await applyProjectionAndHydration(out, model3, node, opts.session);
      return out;
    }
    async function executeSelectWithGeoNear(node, model3, nearToEntry, opts) {
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const filter = rewriteNearForGeoNear(artifact.args.filter ?? {}, nearToEntry.field);
      const dbField = nearToEntry.field;
      let maxDistance;
      if (filter.__sameFieldMaxDistance != null) {
        maxDistance = filter.__sameFieldMaxDistance;
        delete filter.__sameFieldMaxDistance;
      }
      const point = nearToEntry.nearTo;
      const geoNearStage = {
        $geoNear: {
          near: { type: "Point", coordinates: [point.lng, point.lat] },
          distanceField: "_distanceMeters",
          spherical: true,
          key: dbField
        }
      };
      if (maxDistance !== void 0)
        geoNearStage.$geoNear.maxDistance = maxDistance;
      if (Object.keys(filter).length > 0)
        geoNearStage.$geoNear.query = filter;
      const options = artifact.args.options ?? {};
      const pipeline = [geoNearStage];
      if (options.skip)
        pipeline.push({ $skip: options.skip });
      if (options.limit)
        pipeline.push({ $limit: options.limit });
      if (options.projection)
        pipeline.push({ $project: options.projection });
      const docs = await coll.aggregate(pipeline, sessOpt).toArray();
      const ascending = nearToEntry.direction !== "desc";
      if (!ascending)
        docs.reverse();
      let out = docs.map((r) => (0, coerce_1.decodeRow)(model3, r));
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      await applyProjectionAndHydration(out, model3, node, opts.session);
      return out;
    }
    var EARTH_RADIUS_METERS = 63710088e-1;
    function rewriteNearForGeoNear(filter, nearToField) {
      const out = {};
      for (const [k, v2] of Object.entries(filter)) {
        if (k === "$and" || k === "$or") {
          out[k] = v2.map((sub) => rewriteNearForGeoNear(sub, nearToField));
          continue;
        }
        if (k === "$nor") {
          out[k] = v2.map((sub) => rewriteNearForGeoNear(sub, nearToField));
          continue;
        }
        if (v2 && typeof v2 === "object" && "$near" in v2) {
          const n = v2.$near;
          if (k === nearToField) {
            if (typeof n.$maxDistance === "number") {
              out.__sameFieldMaxDistance = n.$maxDistance;
            }
            const rest = { ...v2 };
            delete rest.$near;
            if (Object.keys(rest).length > 0)
              out[k] = rest;
            continue;
          }
          const coords = n.$geometry?.coordinates;
          const meters = n.$maxDistance;
          if (Array.isArray(coords) && typeof meters === "number") {
            const rest = { ...v2 };
            delete rest.$near;
            rest.$geoWithin = { $centerSphere: [[coords[0], coords[1]], meters / EARTH_RADIUS_METERS] };
            out[k] = rest;
            continue;
          }
        }
        out[k] = v2;
      }
      return out;
    }
    async function executeSelectWithVectorSearch(node, model3, nearToEntry, opts) {
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const dbField = nearToEntry.field;
      const v2 = nearToEntry.nearTo;
      const limit = artifact.args.options?.limit ?? 100;
      const stage = {
        $vectorSearch: {
          index: `${dbField}_vector_index`,
          // Atlas search index name; configurable below
          path: dbField,
          queryVector: v2.vector,
          numCandidates: Math.max(limit * 10, 50),
          limit
        }
      };
      const filter = artifact.args.filter ?? {};
      if (Object.keys(filter).length > 0)
        stage.$vectorSearch.filter = filter;
      const pipeline = [
        stage,
        { $set: { _distance: { $meta: "vectorSearchScore" } } }
      ];
      const options = artifact.args.options ?? {};
      if (options.projection)
        pipeline.push({ $project: options.projection });
      const docs = await coll.aggregate(pipeline, sessOpt).toArray();
      let out = docs.map((r) => (0, coerce_1.decodeRow)(model3, r));
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      await applyProjectionAndHydration(out, model3, node, opts.session);
      return out;
    }
    async function applyProjectionAndHydration(rows, model3, node, session) {
      if (rows.length === 0)
        return;
      if (node.projection?.counts?.length) {
        await applyRelationCounts(rows, model3, node.projection.counts, session);
      }
      if (node.hydration?.length) {
        await hydrate(rows, model3, node.hydration, session);
      }
    }
    async function executeInsert(node, model3, opts = {}) {
      const artifact = (0, compile_from_ir_1.compileInsert)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      try {
        if (artifact.op === "insertOne") {
          const document2 = artifact.args.document;
          const r2 = await coll.insertOne(document2, sessOpt);
          document2._id = document2._id ?? r2.insertedId;
          return { docs: [document2], count: 1 };
        }
        const documents = artifact.args.documents;
        const insertManyOpts = { ...artifact.args.options ?? {}, ...sessOpt ?? {} };
        const r = await coll.insertMany(documents, insertManyOpts);
        return { docs: documents, count: r.insertedCount };
      } catch (err) {
        if (node.skipDuplicates && err?.writeErrors) {
          const inserted = err.result?.insertedCount ?? 0;
          return { docs: [], count: inserted };
        }
        (0, errors_1.rethrowMongoError)(err, model3.collection);
        throw err;
      }
    }
    async function executeUpdate(node, model3, opts = {}) {
      const artifact = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const filter = artifact.args.filter ?? {};
      const update = artifact.args.update;
      const options = artifact.args.options ?? {};
      try {
        if (artifact.op === "findOneAndUpdate") {
          const raw = await coll.findOneAndUpdate(filter, update, {
            ...options,
            ...sessOpt ?? {},
            includeResultMetadata: true
          });
          const doc = raw ? raw.value : null;
          if (!doc && !node.upsertCreate) {
            return { doc: void 0, count: 0 };
          }
          return { doc, count: 1 };
        }
        const r = await coll.updateMany(filter, update, sessOpt);
        return { count: r.modifiedCount };
      } catch (err) {
        (0, errors_1.rethrowMongoError)(err, model3.collection);
        throw err;
      }
    }
    async function executeDelete(node, model3, opts = {}) {
      const artifact = (0, compile_from_ir_1.compileDelete)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const filter = artifact.args.filter ?? {};
      if (artifact.op === "findOneAndDelete") {
        const target = await coll.findOne(filter, sessOpt);
        if (!target)
          return { doc: void 0, count: 0 };
        await coll.deleteOne({ _id: target._id }, sessOpt);
        await (0, cascade_1.applyCascadesForDelete)(model3, [target]);
        return { doc: target, count: 1 };
      }
      const targets = await coll.find(filter, sessOpt).toArray();
      if (targets.length === 0)
        return { count: 0 };
      const ids = targets.map((d2) => d2._id);
      const r = await coll.deleteMany({ _id: { $in: ids } }, sessOpt);
      await (0, cascade_1.applyCascadesForDelete)(model3, targets);
      return { count: r.deletedCount };
    }
    void errors_1.notFoundError;
    function reshapeMongoGroupByRow(doc, byCols) {
      const out = {};
      const id = doc._id ?? {};
      for (const c of byCols)
        out[c] = id[c];
      for (const k of Object.keys(doc)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        out[`_${m2[1]}`] ??= {};
        out[`_${m2[1]}`][m2[2]] = doc[k];
      }
      return out;
    }
    async function executeGroupBy(node, model3, opts = {}) {
      const artifact = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const docs = await coll.aggregate(artifact.args.pipeline, sessOpt).toArray();
      return docs.map((d2) => reshapeMongoGroupByRow(d2, node.by));
    }
    async function executeCount(node, model3, opts = {}) {
      const artifact = (0, compile_from_ir_1.compileCount)(node, model3);
      const coll = client_1.dbClient.db.collection(artifact.collection);
      const sessOpt = opts.session ? { session: opts.session } : void 0;
      const filter = artifact.args.filter ?? {};
      if (node.distinct?.length) {
        const groupId = {};
        for (const fieldName of node.distinct)
          groupId[fieldName] = "$" + (0, coerce_1.appKeyToDbKey)(fieldName);
        const pipeline = [];
        if (Object.keys(filter).length)
          pipeline.push({ $match: filter });
        pipeline.push({ $group: { _id: groupId } }, { $count: "n" });
        const res = await coll.aggregate(pipeline, sessOpt).toArray();
        return res.length ? res[0].n : 0;
      }
      return coll.countDocuments(filter, sessOpt);
    }
    async function hydrate(rows, parentModel, hydration, session) {
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && hasField(parentModel, rel.on);
        if (isOwningOne) {
          await hydrateOwningOne(rows, rel, parentModel, targetModel, session);
        } else if (rel.kind === "one") {
          await hydrateInverseOne(rows, rel, parentModel, targetModel, session);
        } else {
          await hydrateMany(rows, rel, parentModel, targetModel, session);
        }
      }
    }
    async function hydrateOwningOne(rows, rel, parentModel, targetModel, session) {
      const fks = unique(rows.map((r) => r[rel.on]).filter(notNull));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const coercedRefs = fks.map((v2) => (0, coerce_1.coerceFieldValue)((0, coerce_1.getFieldDef)(targetModel, rel.refs) ?? targetModel.fields.id, v2));
      const subNode = mergeNested(rel, {
        where: void 0,
        cardinality: "many"
      });
      const node = {
        ...subNode,
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.refs, op: "in", value: coercedRefs }
      };
      const found = await executeSelect(node, targetModel, { session });
      const byRef = /* @__PURE__ */ new Map();
      for (const t of found)
        byRef.set(stringKey(t[rel.refs]), t);
      for (const r of rows) {
        const k = r[rel.on];
        r[rel.name] = k == null ? null : byRef.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateInverseOne(rows, rel, parentModel, targetModel, session) {
      const parentRefs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (parentRefs.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const fkDef = (0, coerce_1.getFieldDef)(targetModel, rel.on);
      const coerced = parentRefs.map((v2) => (0, coerce_1.coerceFieldValue)(fkDef ?? targetModel.fields[rel.on] ?? { kind: "objectId" }, v2));
      const subNode = mergeNested(rel, { cardinality: "many" });
      const node = {
        ...subNode,
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.on, op: "in", value: coerced }
      };
      const found = await executeSelect(node, targetModel, { session });
      const byFk = /* @__PURE__ */ new Map();
      for (const t of found)
        byFk.set(stringKey(t[rel.on]), t);
      for (const r of rows) {
        const k = r[rel.refs];
        r[rel.name] = k == null ? null : byFk.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateMany(rows, rel, parentModel, targetModel, session) {
      const parentRefs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (parentRefs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const fkDef = (0, coerce_1.getFieldDef)(targetModel, rel.on);
      const coerced = parentRefs.map((v2) => (0, coerce_1.coerceFieldValue)(fkDef ?? targetModel.fields[rel.on] ?? { kind: "objectId" }, v2));
      const subNode = mergeNested(rel, { cardinality: "many" });
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: coerced };
      const where = subNode.where ? { kind: "and", children: [subNode.where, fkLeaf] } : fkLeaf;
      const node = {
        ...subNode,
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where
      };
      const found = await executeSelect(node, targetModel, { session });
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = stringKey(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows) {
        r[rel.name] = byParent.get(stringKey(r[rel.refs])) ?? [];
      }
    }
    function mergeNested(rel, fallback) {
      const nested = rel.nested ?? {};
      return {
        where: nested.where ?? fallback.where,
        projection: nested.projection,
        hydration: nested.hydration,
        orderBy: nested.orderBy,
        limit: nested.limit,
        offset: nested.offset,
        cursor: nested.cursor,
        distinct: nested.distinct
      };
    }
    async function applyRelationCounts(rows, parentModel, counts, session) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const coll = client_1.dbClient.db.collection(targetModel.collection);
        const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
        const fkDef = (0, coerce_1.getFieldDef)(targetModel, rel.on);
        const coerced = refs.map((v2) => (0, coerce_1.coerceFieldValue)(fkDef ?? targetModel.fields[rel.on] ?? { kind: "objectId" }, v2));
        if (coerced.length === 0) {
          for (const row of rows)
            row._count[relName] = 0;
          continue;
        }
        const grouped = await coll.aggregate([
          { $match: { [(0, coerce_1.appKeyToDbKey)(rel.on)]: { $in: coerced } } },
          { $group: { _id: `$${(0, coerce_1.appKeyToDbKey)(rel.on)}`, c: { $sum: 1 } } }
        ], session ? { session } : void 0).toArray();
        const byFk = /* @__PURE__ */ new Map();
        for (const g of grouped)
          byFk.set(stringKey(g._id), g.c);
        for (const row of rows)
          row._count[relName] = byFk.get(stringKey(row[rel.refs])) ?? 0;
      }
    }
    function hasField(model3, fieldName) {
      return model3.fields[fieldName] != null;
    }
    function notNull(v2) {
      return v2 != null;
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = stringKey(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function stringKey(v2) {
      if (v2 == null)
        return "\0";
      if (v2 instanceof (0, bson_1.mongo)().ObjectId)
        return v2.toHexString();
      if (typeof v2 === "object" && v2._bsontype === "ObjectId")
        return v2.toString();
      return String(v2);
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/adapter.js
var require_adapter = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MongoAdapter = void 0;
    exports.getDefaultMongoAdapter = getDefaultMongoAdapter;
    var client_1 = require_client();
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute();
    var coerce_1 = require_coerce();
    var cascade_1 = require_cascade();
    var CAPS = {
      nativeCascades: false,
      nativeUpsert: true,
      nullsOrdering: false,
      jsonPath: true,
      transactionsRequireReplicaSet: true
    };
    var MongoAdapter = class {
      _injected;
      kind = "mongo";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _url;
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          await client_1.dbClient.adopt(this._injected.client, this._injected.dbName);
          return;
        }
        if (!process.env.DATABASE_URL)
          process.env.DATABASE_URL = url;
        await client_1.dbClient.connect();
      }
      async close() {
        await client_1.dbClient.close();
      }
      async doctor() {
        const driver = (0, missing_driver_1.isDriverInstalled)("mongo");
        return {
          kind: "mongo",
          driverPackage: "mongodb",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            "Transactions require a replica set or mongos. Single-node instances throw on $transaction.",
            "Cascades enforced by the JS cascade walker, not the DB engine."
          ]
        };
      }
      mongoOpts(opts) {
        return opts?.session ? { session: opts.session } : {};
      }
      _track(op, node, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const collection = node.model ?? "";
        return this.emitter.track({ adapter: "mongo", model: collection, op, sql: `${collection}.${op}`, params: { node }, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, () => (0, execute_1.executeSelect)(node, model3, this.mongoOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, () => (0, execute_1.executeCount)(node, model3, this.mongoOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, () => (0, execute_1.executeInsert)(node, model3, this.mongoOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, () => (0, execute_1.executeUpdate)(node, model3, this.mongoOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, () => (0, execute_1.executeDelete)(node, model3, this.mongoOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, () => (0, execute_1.executeGroupBy)(node, model3, this.mongoOpts(opts)), (r) => r.length);
      }
      // Native streaming via Mongo's cursor.stream(): compile the IR SelectNode
      // into a cursor and yield each document, decoded via the row decoder.
      async *streamSelect(node, model3, opts) {
        const { compileSelect } = await Promise.resolve().then(() => __importStar(require_compile_from_ir()));
        const a2 = compileSelect(node, model3);
        const coll = client_1.dbClient.db.collection(model3.collection);
        const cursor = coll.find(a2.args.filter, {
          ...a2.args.options,
          session: this.mongoOpts(opts).session
        });
        for await (const raw of cursor.stream()) {
          yield (0, coerce_1.decodeRow)(model3, raw);
        }
      }
      applyProjectionAndHydration(rows, model3, node, opts) {
        return (0, execute_1.applyProjectionAndHydration)(rows, model3, node, opts?.session);
      }
      $transaction(fn) {
        return client_1.dbClient.transaction(async (session) => fn(session));
      }
      coerceInbound(model3, data, _opts) {
        return (0, coerce_1.coerceCreatePayload)(model3, data);
      }
      decodeOutbound(model3, row) {
        if (row == null)
          return row;
        return (0, coerce_1.decodeRow)(model3, row);
      }
      applyCascadesForDelete(model3, docs, _opts) {
        return (0, cascade_1.applyCascadesForDelete)(model3, docs);
      }
      // A Mongo "matview" is a normal collection populated by an aggregation
      // pipeline whose final stage is $merge or $out into that collection.
      // refresh() re-runs the pipeline.
      async refreshView(model3, _opts) {
        const view = model3?.view;
        const pipeline = Array.isArray(view?.pipeline) ? view.pipeline : [];
        const source = view?.sourceCollection;
        if (!source) {
          throw new Error(`[forge:mongo] materialised view '${model3?.collection}' needs a sourceCollection to refresh`);
        }
        const hasOutStage = pipeline.some((s) => s && (s.$merge || s.$out));
        const full = hasOutStage ? pipeline : [...pipeline, { $out: model3.collection }];
        await client_1.dbClient.db.collection(source).aggregate(full).toArray();
      }
      // Introspection: collections + their indexes. Mongo is schemaless, so there
      // are no columns/FKs to diff — collection + index level only.
      async introspect() {
        const colls = await client_1.dbClient.db.listCollections().toArray();
        const tables = [];
        const views = [];
        for (const c of colls) {
          if (c.type === "view") {
            views.push({ name: c.name, materialised: false });
            continue;
          }
          const idxs = await client_1.dbClient.db.collection(c.name).indexes().catch(() => []);
          tables.push({
            name: c.name,
            columns: [],
            foreignKeys: [],
            indexes: idxs.map((i) => ({
              name: i.name,
              columns: Object.keys(i.key ?? {}),
              unique: i.unique === true,
              // Carry the 2.1/2.2 fields back so the drift comparator can see
              // changes to partial filters, collation, wildcard projections,
              // and the per-key direction tokens (1, -1, 'text', '2dsphere',
              // '2d', 'hashed'). When listIndexes doesn't echo a field back,
              // we leave it undefined and diff treats it as "not declared".
              partialFilterExpression: i.partialFilterExpression,
              collation: i.collation,
              wildcardProjection: i.wildcardProjection,
              keySpec: i.key ?? void 0
            }))
          });
        }
        return { kind: "mongo", tables, views };
      }
      // Mongo doesn't speak SQL — its raw channel is the aggregation pipeline
      // (db.<model>.aggregate) or $runCommandRaw on the ForgeDb handle. Throwing
      // here matches Prisma's behavior on its Mongo connector.
      $queryRaw(_fragment, _opts) {
        return Promise.reject(new Error("[forge] $queryRaw is SQL-only. For Mongo, use db.<model>.aggregate({ pipeline }) or db.$runCommandRaw(command)."));
      }
      $executeRaw(_fragment, _opts) {
        return Promise.reject(new Error("[forge] $executeRaw is SQL-only. For Mongo, use db.$runCommandRaw(command)."));
      }
    };
    exports.MongoAdapter = MongoAdapter;
    var _defaultMongoAdapter;
    function getDefaultMongoAdapter() {
      if (!_defaultMongoAdapter)
        _defaultMongoAdapter = new MongoAdapter();
      return _defaultMongoAdapter;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/builder/collection.js
var require_collection = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/builder/collection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = exports.CollectionWrapper = void 0;
    exports.parseDuration = parseDuration;
    exports.__stringifyObjectIds = stringifyObjectIds;
    var randomUUID = () => {
      const c = globalThis.crypto;
      if (c?.randomUUID)
        return c.randomUUID();
      if (c?.getRandomValues) {
        const b2 = c.getRandomValues(new Uint8Array(16));
        b2[6] = b2[6] & 15 | 64;
        b2[8] = b2[8] & 63 | 128;
        const h = [...b2].map((x2) => x2.toString(16).padStart(2, "0")).join("");
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
      }
      let s = "";
      for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23)
          s += "-";
        else if (i === 14)
          s += "4";
        else if (i === 19)
          s += (Math.random() * 4 | 0 | 8).toString(16);
        else
          s += (Math.random() * 16 | 0).toString(16);
      }
      return s;
    };
    var client_1 = require_client();
    var schema_1 = require_schema();
    var coerce_1 = require_coerce();
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var compile_1 = require_compile();
    var compile_2 = require_compile2();
    var compile_3 = require_compile3();
    var compile_4 = require_compile4();
    var compile_5 = require_compile5();
    var compile_6 = require_compile6();
    var build_1 = require_build();
    var adapter_1 = require_adapter();
    var CollectionWrapper = class _CollectionWrapper {
      model;
      _session;
      _adapter;
      _strict;
      _collection;
      _compileApi;
      // Defaults to the lazily-built Mongo singleton so the default Mongo path works
      // without surgery. createDb() injects the active adapter explicitly for
      // Postgres / MySQL / SQLite.
      constructor(model3, _session, _adapter, _strict = false) {
        this.model = model3;
        this._session = _session;
        this._adapter = _adapter;
        this._strict = _strict;
      }
      get adapter() {
        return this._adapter ?? (0, adapter_1.getDefaultMongoAdapter)();
      }
      // Strict mode rejects any `where` key that isn't a real field, a known
      // synthetic composite-unique key, a relation name, or a recognised
      // logical/structural operator — closing the `[key: string]: any` escape hatch
      // on WhereInput so typos surface instead of silently matching nothing.
      static _whereOps = /* @__PURE__ */ new Set([
        "AND",
        "OR",
        "NOT",
        "_withDeleted"
      ]);
      _strictKeysCache;
      _allowedWhereKeys() {
        if (this._strictKeysCache)
          return this._strictKeysCache;
        const keys = new Set(_CollectionWrapper._whereOps);
        for (const fieldName of Object.keys(this.model.fields))
          keys.add(fieldName);
        for (const rel of Object.keys(this.model.relations()))
          keys.add(rel);
        for (const cols of this.model.uniques ?? [])
          keys.add(cols.join("_"));
        this._strictKeysCache = keys;
        return keys;
      }
      _assertStrictWhere(where) {
        if (!this._strict || !where || typeof where !== "object")
          return;
        const allowed = this._allowedWhereKeys();
        for (const key of Object.keys(where)) {
          if (allowed.has(key))
            continue;
          throw new Error(`[forge:strict] unknown where key '${key}' on '${this.model.collection}'.
  Known fields: ${Object.keys(this.model.fields).join(", ")}.
  (strict mode is on \u2014 disable with createDb({ strict: false }) to allow loose keys.)`);
        }
      }
      // Returns a session-bound wrapper for use inside $transaction(callback). The
      // adapter's session type (Mongo: ClientSession, PG: PoolClient) flows through
      // opaquely via _session.
      withSession(session) {
        return new _CollectionWrapper(this.model, session, this._adapter, this._strict);
      }
      // Compile namespace — same arg shape as the execute methods, but returns a
      // typed artifact instead of executing (for forwarding to a manually managed
      // driver, generating migration/seed scripts, debugging, replay/audit). Per-
      // adapter dispatch: Mongo returns MongoArtifact, SQL dialects return
      // SQLArtifact with the matching `dialect` field. Each adapter's IR-stage
      // emitter handles its own placeholder syntax + quoting.
      get compile() {
        if (!this._compileApi) {
          const kind = this._adapter?.kind;
          switch (kind) {
            case "postgres":
              this._compileApi = (0, compile_2.buildPostgresCompileApi)(this.model);
              break;
            case "mysql":
              this._compileApi = (0, compile_3.buildMysqlCompileApi)(this.model);
              break;
            case "sqlite":
              this._compileApi = (0, compile_4.buildSqliteCompileApi)(this.model);
              break;
            case "duckdb":
              this._compileApi = (0, compile_5.buildDuckdbCompileApi)(this.model);
              break;
            case "mssql":
              this._compileApi = (0, compile_6.buildMssqlCompileApi)(this.model);
              break;
            case "indexeddb":
              throw new Error("[forge] .compile is not implemented for the IndexedDB adapter yet (no SQL or aggregation pipeline shape \u2014 IDB is native). Use the model methods (findMany, create, \u2026) directly.");
            case "mongo":
            default:
              this._compileApi = (0, compile_1.buildMongoCompileApi)(this.model);
              break;
          }
        }
        return this._compileApi;
      }
      /**
       * Narrowed compile API for Mongo callers — same getter as `compile`, just
       * statically typed. Throws at access if the resolved adapter isn't Mongo
       * so the mismatched dialect surfaces loudly instead of silently returning
       * the wrong artifact shape. When no adapter has been injected the
       * resolved kind is Mongo (the default singleton), so the getter returns
       * the Mongo compile API.
       */
      get compileMongo() {
        const kind = this.adapter.kind;
        if (kind !== "mongo") {
          throw new Error(`[forge] .compileMongo is only available on a Mongo adapter (current adapter: ${kind}). Use .compile or .compileSql instead.`);
        }
        return this.compile;
      }
      /**
       * Narrowed compile API for SQL callers — returns SQLArtifact with the
       * correct dialect. Throws at access if the resolved adapter is Mongo
       * (including the default singleton when no adapter was injected).
       */
      get compileSql() {
        const kind = this.adapter.kind;
        if (kind === "mongo") {
          throw new Error(`[forge] .compileSql is not available on a Mongo adapter. Use .compile or .compileMongo instead.`);
        }
        return this.compile;
      }
      get collection() {
        if (!this._collection) {
          this._collection = client_1.dbClient.db.collection(this.model.collection);
        }
        return this._collection;
      }
      get sessOpt() {
        return this._session ? { session: this._session } : {};
      }
      async findFirst(args = {}) {
        const result = await this._find(args, 1);
        return result[0] ?? null;
      }
      async findUnique(args) {
        return this.findFirst(args);
      }
      async findFirstOrThrow(args = {}) {
        const r = await this.findFirst(args);
        if (!r)
          throw (0, errors_1.notFoundError)(this.model.collection, args.where);
        return r;
      }
      async findUniqueOrThrow(args) {
        const r = await this.findUnique(args);
        if (!r)
          throw (0, errors_1.notFoundError)(this.model.collection, args.where);
        return r;
      }
      async findMany(args = {}) {
        return this._find(args, void 0);
      }
      // Streaming reads. Yields rows one-by-one (or in driver-sized batches) without
      // buffering the full result set — for large exports/batch jobs.
      //
      // WARNING: only leaf rows are streamed; relation hydration is NOT batched
      // across the stream. If you need include, materialise the chunk first
      // (findMany on each chunk).
      async *findManyStream(args = {}) {
        if (typeof this.adapter.streamSelect === "function") {
          const mk = this._modelKey();
          const filtered = this._withSoftDeleteFilter(args);
          const node = (0, build_1.buildSelect)(mk, this.model, filtered ?? {}, "many", schema_1.schema);
          const iter = this.adapter.streamSelect(node, this.model, { session: this._session });
          for await (const row of iter)
            yield row;
          return;
        }
        const chunkSize = args.chunkSize ?? 1e3;
        let offset = 0;
        while (true) {
          const batch = await this._find({ ...args, take: chunkSize, skip: offset, chunkSize: void 0 }, void 0);
          if (!Array.isArray(batch) || batch.length === 0)
            return;
          for (const row of batch)
            yield row;
          if (batch.length < chunkSize)
            return;
          offset += batch.length;
        }
      }
      async count(args = {}) {
        this._assertStrictWhere(args?.where);
        const mk = this._modelKey();
        args = this._withSoftDeleteFilter(args);
        const node = (0, build_1.buildCount)(mk, this.model, args, schema_1.schema);
        return this.adapter.executeCount(node, this.model, { session: this._session });
      }
      // groupBy — typed aggregation. Each row of the result is shaped as
      //   `{ <by-col>: value, _count?: {...}, _avg?: {...}, _sum?: {...}, _min?: {...}, _max?: {...} }`
      // `_count._all` is the synthetic COUNT(*) bucket; per-column counts go in
      // `_count.<colName>`. `having` mirrors Prisma's post-aggregate filter shape.
      async groupBy(args) {
        const mk = this._modelKey();
        const node = (0, build_1.buildGroupBy)(mk, this.model, args, schema_1.schema);
        return this.adapter.executeGroupBy(node, this.model, { session: this._session });
      }
      // Lazily resolve the schema-side key for this model — IR builders and the
      // executor want a portable string key, not a collection name.
      _modelKey() {
        if (this._cachedKey)
          return this._cachedKey;
        for (const key of Object.keys(schema_1.schema)) {
          if (schema_1.schema[key] === this.model) {
            this._cachedKey = key;
            return key;
          }
        }
        this._cachedKey = this.model.collection;
        return this._cachedKey;
      }
      _cachedKey;
      // Block writes on read-only view models.
      _assertWritable(op) {
        if (this.model.view) {
          throw new Error(`[forge] ${op} is not allowed on '${this.model.collection}' \u2014 it's a read-only view.
  Use the underlying source model for writes, or drop .asView() from the schema.`);
        }
      }
      // Auto-generate the primary key when the caller didn't supply one. Mongo mints
      // an ObjectId in coerceInbound; SQL dialects have no server default for forge's
      // string id, so we generate a UUID here. Only fills when the id field has an
      // autoId default and no value was provided.
      _autoIdName;
      _fillAutoId(data) {
        if (this.adapter.kind === "mongo" || !data || typeof data !== "object")
          return data;
        if (this._autoIdName === void 0) {
          this._autoIdName = null;
          for (const [name, fd] of Object.entries(this.model.fields)) {
            if (fd.kind === "id" && fd.default?.kind === "autoId") {
              this._autoIdName = name;
              break;
            }
          }
        }
        if (this._autoIdName && data[this._autoIdName] == null) {
          return { ...data, [this._autoIdName]: randomUUID() };
        }
        return data;
      }
      // Auto-bump `.updatedAt()` fields on every update, on all databases. Sets the
      // field to the current time when the caller didn't set it explicitly. (Mongo
      // also handles this in coerce; setting it here makes it uniform across SQL too.)
      _updatedAtFields;
      _applyUpdatedAt(data) {
        if (!data || typeof data !== "object")
          return data;
        if (this._updatedAtFields === void 0) {
          this._updatedAtFields = Object.entries(this.model.fields).filter(([, fd]) => fd.updatedAt).map(([name]) => name);
        }
        if (this._updatedAtFields.length === 0)
          return data;
        const out = { ...data };
        for (const name of this._updatedAtFields) {
          if (out[name] === void 0)
            out[name] = /* @__PURE__ */ new Date();
        }
        return out;
      }
      async create(args) {
        this._assertWritable("create");
        const mk = this._modelKey();
        const { scalar, nested } = this._splitNestedWrites(
          args.data,
          /*forCreate*/
          true
        );
        const resolvedScalar = await this._resolveOwningConnectOrCreate(scalar, nested);
        const row = this.adapter.coerceInbound(this.model, this._fillAutoId(resolvedScalar));
        const node = (0, build_1.buildInsert)(mk, this.model, { rows: [row] }, schema_1.schema);
        const { docs } = await this.adapter.executeInsert(node, this.model, { session: this._session });
        const doc = docs[0];
        if (nested.length > 0)
          await this._applyNestedWrites(doc, nested);
        return this._returnOne(doc, args);
      }
      // Resolve owning-side `connectOrCreate` specs eagerly — sets the FK column
      // on `scalar` before insert. Mutates `nested` to remove processed specs so
      // _applyNestedWrites doesn't double-process them.
      async _resolveOwningConnectOrCreate(scalar, nested) {
        if (!nested.length)
          return scalar;
        const out = { ...scalar };
        for (let i = nested.length - 1; i >= 0; i--) {
          const spec = nested[i];
          if (spec.op !== "connectOrCreate" || spec.rel.inverse)
            continue;
          const target = schema_1.schema[spec.rel.target];
          if (!target)
            continue;
          const w = new _CollectionWrapper(target, this._session, this._adapter, this._strict);
          const items = Array.isArray(spec.data) ? spec.data : [spec.data];
          const it2 = items[0];
          if (!it2?.where)
            continue;
          let existing = await w.findFirst({ where: it2.where });
          if (!existing)
            existing = await w.create({ data: it2.create ?? {} });
          const tId = existing[spec.rel.refs] ?? existing.id ?? existing._id;
          out[spec.rel.on] = tId;
          nested.splice(i, 1);
        }
        return out;
      }
      async createMany(args) {
        this._assertWritable("createMany");
        if (!Array.isArray(args.data) || args.data.length === 0)
          return { count: 0 };
        const mk = this._modelKey();
        const rows = args.data.map((d2) => this.adapter.coerceInbound(this.model, this._fillAutoId(d2)));
        const node = (0, build_1.buildInsert)(mk, this.model, { rows, skipDuplicates: args.skipDuplicates }, schema_1.schema);
        const { count } = await this.adapter.executeInsert(node, this.model, { session: this._session });
        return { count };
      }
      async update(args, _internal) {
        this._assertWritable("update");
        this._assertStrictWhere(args.where);
        const mk = this._modelKey();
        const { scalar, nested } = this._splitNestedWrites(
          args.data,
          /*forCreate*/
          false
        );
        const node = (0, build_1.buildUpdate)(mk, this.model, {
          where: args.where,
          data: this._applyUpdatedAt(scalar),
          many: false,
          // Mirror the wrapper-level hint onto the IR so consumers can detect
          // soft-deletes from the compiled artifact alone.
          semantic: _internal?.semanticOp
        }, schema_1.schema);
        const { doc } = await this.adapter.executeUpdate(node, this.model, {
          session: this._session,
          semanticOp: _internal?.semanticOp
        });
        if (!doc)
          throw (0, errors_1.notFoundError)(this.model.collection, args.where);
        if (nested.length > 0)
          await this._applyNestedWrites(doc, nested);
        return this._returnOne(doc, args);
      }
      async updateMany(args, _internal) {
        this._assertWritable("updateMany");
        this._assertStrictWhere(args.where);
        const mk = this._modelKey();
        const node = (0, build_1.buildUpdate)(mk, this.model, {
          where: args.where,
          data: this._applyUpdatedAt(args.data),
          many: true,
          semantic: _internal?.semanticOp
        }, schema_1.schema);
        const r = await this.adapter.executeUpdate(node, this.model, {
          session: this._session,
          semanticOp: _internal?.semanticOp
        });
        return { count: r.count };
      }
      async upsert(args) {
        this._assertWritable("upsert");
        this._assertStrictWhere(args.where);
        const mk = this._modelKey();
        const createCoerced = this.adapter.coerceInbound(this.model, this._fillAutoId(args.create));
        const node = (0, build_1.buildUpdate)(mk, this.model, { where: args.where, data: this._applyUpdatedAt(args.update), many: false, upsertCreate: createCoerced }, schema_1.schema);
        const { doc } = await this.adapter.executeUpdate(node, this.model, { session: this._session });
        return this._returnOne(doc, args);
      }
      async delete(args) {
        this._assertWritable("delete");
        this._assertStrictWhere(args.where);
        const mk = this._modelKey();
        const node = (0, build_1.buildDelete)(mk, this.model, { where: args.where, many: false }, schema_1.schema);
        const { doc } = await this.adapter.executeDelete(node, this.model, { session: this._session });
        if (!doc)
          throw (0, errors_1.notFoundError)(this.model.collection, args.where);
        return this._returnOne(doc, args);
      }
      async deleteMany(args = {}) {
        this._assertWritable("deleteMany");
        this._assertStrictWhere(args?.where);
        const mk = this._modelKey();
        const node = (0, build_1.buildDelete)(mk, this.model, { where: args.where, many: true }, schema_1.schema);
        const r = await this.adapter.executeDelete(node, this.model, { session: this._session });
        return { count: r.count };
      }
      /**
       * Soft delete — set the model's `.softDeleteAt()` field to now() so the row
       * is hidden from reads (find/count auto-filter it) yet recoverable via
       * restore(). Returns the updated row, honouring the same select/include/omit
       * options as delete(). Throws if the model has no `.softDeleteAt()` field —
       * use delete() for a hard delete.
       */
      async softDelete(args) {
        this._assertWritable("softDelete");
        const sd = this._requireSoftDeleteField("softDelete");
        return this.update({ ...args, data: { [sd]: /* @__PURE__ */ new Date() } }, { semanticOp: "softDelete" });
      }
      /** Bulk soft delete — sets `.softDeleteAt()` on every matching row. */
      async softDeleteMany(args = {}) {
        this._assertWritable("softDeleteMany");
        const sd = this._requireSoftDeleteField("softDeleteMany");
        return this.updateMany({ where: args.where, data: { [sd]: /* @__PURE__ */ new Date() } }, { semanticOp: "softDeleteMany" });
      }
      /**
       * Restore a soft-deleted row — clears the `.softDeleteAt()` field so the row
       * is active (visible to reads) again. Reaches soft-deleted rows directly:
       * update() does not apply the soft-delete read filter. Throws if the model
       * has no `.softDeleteAt()` field.
       */
      async restore(args) {
        this._assertWritable("restore");
        const sd = this._requireSoftDeleteField("restore");
        return this.update({ ...args, data: { [sd]: null } }, { semanticOp: "restore" });
      }
      /** Bulk restore — clears `.softDeleteAt()` on every matching row. */
      async restoreMany(args = {}) {
        this._assertWritable("restoreMany");
        const sd = this._requireSoftDeleteField("restoreMany");
        return this.updateMany({ where: args.where, data: { [sd]: null } }, { semanticOp: "restoreMany" });
      }
      // Replaces Prisma's aggregateRaw — same signature, returns plain documents
      // with stringified ObjectIds for ergonomic parity.
      async aggregate(args) {
        const raw = Array.isArray(args.pipeline) ? args.pipeline : [];
        const pipeline = (0, coerce_1.coerceExtendedJSON)(raw);
        const docs = await this.collection.aggregate(pipeline, { ...args.options, ...this.sessOpt }).toArray();
        return docs.map(stringifyObjectIds);
      }
      // Recompute a materialised view's contents from its source definition.
      //   PG     → REFRESH MATERIALIZED VIEW [CONCURRENTLY]
      //   MySQL  → TRUNCATE + INSERT … SELECT from the view's `sql`
      //   SQLite → DELETE + INSERT … SELECT from the view's `sql`
      //   Mongo  → re-run the $merge/$out pipeline
      // No-ops (with a thrown error) on non-materialised models.
      async refresh(opts = {}) {
        const view = this.model.view;
        if (!view?.materialised) {
          throw new Error(`[forge] refresh() is only valid on a materialised view. '${this.model.collection}' is ${view ? "a plain view" : "a table"}. Declare it with .asView({ materialised: true, ... }).`);
        }
        if (typeof this.adapter.refreshView !== "function") {
          throw new Error(`[forge] adapter '${this.adapter.kind}' does not implement materialised-view refresh.`);
        }
        await this.adapter.refreshView(this.model, { ...opts, session: this._session });
      }
      // Auto-refresh on an interval. Returns a stop() that clears the timer — the
      // caller owns the lifecycle (no hidden leaked timers). Uses the model's
      // declared `.asView({ refreshEvery })` value, or pass one explicitly.
      scheduleRefresh(every) {
        const spec = every ?? this.model.view?.refreshEvery;
        const ms2 = parseDuration(spec);
        if (!ms2)
          throw new Error(`[forge] scheduleRefresh needs a duration like '30s' / '5m' / '1h' (got ${JSON.stringify(spec)})`);
        const timer = setInterval(() => {
          void this.refresh().catch(() => {
          });
        }, ms2);
        if (typeof timer.unref === "function")
          timer.unref();
        return () => clearInterval(timer);
      }
      // Return the soft-delete field name if the model has one.
      _softDeleteField() {
        for (const [name, f3] of Object.entries(this.model.fields)) {
          if (f3.softDeleteAt)
            return name;
        }
        return void 0;
      }
      // Resolve the soft-delete field or throw a clear error. Used by
      // softDelete/softDeleteMany/restore/restoreMany — operations that are
      // meaningless without a `.softDeleteAt()` field.
      _requireSoftDeleteField(op) {
        const sd = this._softDeleteField();
        if (!sd) {
          throw new Error(`[forge] ${op}() requires a field declared with .softDeleteAt() on '${this.model.collection}'. Either add one, or use delete() for a hard delete.`);
        }
        return sd;
      }
      // Augment a `where` object to exclude soft-deleted rows. Opt out by passing
      // `where: { ..., _withDeleted: true }` (deleted via the strip step before
      // building IR).
      _withSoftDeleteFilter(args) {
        const sd = this._softDeleteField();
        if (!sd || !args)
          return args;
        const where = args.where ?? {};
        if (where._withDeleted) {
          const { _withDeleted: _, ...rest } = where;
          return { ...args, where: rest };
        }
        if (Object.prototype.hasOwnProperty.call(where, sd))
          return args;
        return { ...args, where: { ...where, [sd]: null } };
      }
      async _find(args, hardLimit) {
        this._assertStrictWhere(args?.where);
        const mk = this._modelKey();
        args = this._withSoftDeleteFilter(args);
        const cardinality = hardLimit === 1 ? "one" : "many";
        const node = (0, build_1.buildSelect)(mk, this.model, args ?? {}, cardinality, schema_1.schema);
        if (hardLimit != null && (node.limit == null || node.limit > hardLimit)) {
          node.limit = hardLimit;
        }
        const rows = await this.adapter.executeSelect(node, this.model, { session: this._session });
        return rows;
      }
      async _returnOne(rawDoc, args) {
        if (!rawDoc)
          return rawDoc;
        const decoded = this.adapter.decodeOutbound(this.model, rawDoc);
        const rows = [decoded];
        const { projection, hydration } = (0, build_1.buildProjection)(this.model, args, schema_1.schema);
        await this.adapter.applyProjectionAndHydration(rows, this.model, { projection, hydration }, { session: this._session });
        if (projection?.exclusive && projection.fields.length) {
          const kept = new Set(projection.fields);
          if (hydration)
            for (const h of hydration)
              kept.add(h.name);
          if (projection.counts.length)
            kept.add("_count");
          const pruned = {};
          for (const k of Object.keys(rows[0]))
            if (kept.has(k))
              pruned[k] = rows[0][k];
          return pruned;
        }
        if (projection?.omit?.length) {
          const drop = new Set(projection.omit);
          const out = {};
          for (const k of Object.keys(rows[0]))
            if (!drop.has(k))
              out[k] = rows[0][k];
          return out;
        }
        return rows[0];
      }
      // Prisma lets you write `parent.create({ data: { ..., rel: { create: {...} } } })`.
      // We split this into a scalar payload (passed to insertOne/updateOne) and a
      // list of nested operations to apply post-write. Inverse-side many relations
      // get FK-injected child writes; owning one-side `connect` rewrites the FK on
      // the parent's scalar payload.
      _splitNestedWrites(data, forCreate) {
        const scalar = {};
        const nested = [];
        if (!data || typeof data !== "object")
          return { scalar: data ?? {}, nested };
        const rels = this.model.relations();
        for (const key of Object.keys(data)) {
          const rel = rels[key];
          const value = data[key];
          if (!rel) {
            scalar[key] = value;
            continue;
          }
          if (value == null)
            continue;
          if (rel.kind === "one" && !rel.inverse) {
            if (typeof value !== "object")
              continue;
            if ("connect" in value && value.connect) {
              const target = value.connect;
              const fk = target[rel.refs] ?? target.id ?? target._id;
              if (fk !== void 0)
                scalar[rel.on] = fk;
            } else if ("connectOrCreate" in value && value.connectOrCreate) {
              nested.push({ rel, op: "connectOrCreate", data: value.connectOrCreate });
            } else if ("disconnect" in value && value.disconnect === true) {
              scalar[rel.on] = null;
            } else if ("create" in value && value.create) {
              nested.push({ rel, op: "create", data: value.create });
            }
            continue;
          }
          if (typeof value !== "object")
            continue;
          if (value.create)
            nested.push({ rel, op: "create", data: value.create });
          if (value.createMany?.data)
            nested.push({ rel, op: "createMany", data: value.createMany.data });
          if (value.connect)
            nested.push({ rel, op: "connect", data: value.connect });
          if (value.connectOrCreate)
            nested.push({ rel, op: "connectOrCreate", data: value.connectOrCreate });
          if (value.disconnect)
            nested.push({ rel, op: "disconnect", data: value.disconnect });
          if (value.set)
            nested.push({ rel, op: "set", data: value.set });
          if (value.delete)
            nested.push({ rel, op: "delete", data: value.delete });
          if (value.deleteMany)
            nested.push({ rel, op: "deleteMany", data: value.deleteMany });
        }
        return { scalar, nested };
      }
      async _applyNestedWrites(parentDoc, nested) {
        for (const spec of nested) {
          const { rel, op } = spec;
          const target = schema_1.schema[rel.target];
          if (!target) {
            throw new Error(`[Database] nested write target '${rel.target}' is not in the schema map`);
          }
          const targetWrapper = new _CollectionWrapper(target, this._session, this._adapter, this._strict);
          const parentRef = rel.refs === "id" ? parentDoc._id ?? parentDoc.id : parentDoc[rel.refs];
          const fkValue = parentRef && typeof parentRef === "object" && "toString" in parentRef ? parentRef.toString() : parentRef;
          const childFkField = rel.on;
          if (op === "create") {
            const item = Array.isArray(spec.data) ? spec.data : [spec.data];
            for (const d2 of item) {
              await targetWrapper.create({ data: { ...d2, [childFkField]: fkValue } });
            }
            continue;
          }
          if (op === "createMany") {
            const items = spec.data.map((d2) => ({
              ...d2,
              [childFkField]: fkValue
            }));
            await targetWrapper.createMany({ data: items });
            continue;
          }
          if (op === "connect") {
            const targets = Array.isArray(spec.data) ? spec.data : [spec.data];
            for (const t of targets) {
              const tId = t[rel.refs] ?? t.id ?? t._id;
              if (tId == null)
                continue;
              await targetWrapper.update({
                where: { id: tId },
                data: { [childFkField]: fkValue }
              });
            }
            continue;
          }
          if (op === "disconnect") {
            const targets = Array.isArray(spec.data) ? spec.data : [spec.data];
            for (const t of targets) {
              const tId = t[rel.refs] ?? t.id ?? t._id;
              if (tId == null)
                continue;
              await targetWrapper.update({
                where: { id: tId },
                data: { [childFkField]: null }
              });
            }
            continue;
          }
          if (op === "delete") {
            const targets = Array.isArray(spec.data) ? spec.data : [spec.data];
            for (const t of targets) {
              await targetWrapper.delete({ where: t });
            }
            continue;
          }
          if (op === "deleteMany") {
            await targetWrapper.deleteMany({ where: spec.data });
            continue;
          }
          if (op === "connectOrCreate") {
            const items = Array.isArray(spec.data) ? spec.data : [spec.data];
            for (const it2 of items) {
              if (!it2?.where)
                continue;
              let existing = await targetWrapper.findFirst({ where: it2.where });
              if (!existing) {
                const createData = rel.inverse ? { ...it2.create ?? {}, [childFkField]: fkValue } : it2.create ?? {};
                existing = await targetWrapper.create({ data: createData });
              } else if (rel.inverse) {
                const tId = existing[rel.refs] ?? existing.id ?? existing._id;
                if (existing[childFkField] !== fkValue) {
                  await targetWrapper.update({
                    where: { id: tId },
                    data: { [childFkField]: fkValue }
                  });
                }
              } else {
                const tId = existing[rel.refs] ?? existing.id ?? existing._id;
                parentDoc[rel.on] = tId;
              }
            }
            if (!rel.inverse && parentDoc._id && parentDoc[rel.on] != null) {
              await this.update({
                where: { id: parentDoc._id ?? parentDoc.id },
                data: { [rel.on]: parentDoc[rel.on] }
              });
            }
            continue;
          }
        }
      }
    };
    exports.CollectionWrapper = CollectionWrapper;
    function parseDuration(spec) {
      if (!spec || typeof spec !== "string")
        return void 0;
      const m2 = /^(\d+)\s*(ms|s|m|h|d)$/.exec(spec.trim());
      if (!m2)
        return void 0;
      const n = Number(m2[1]);
      const unit = m2[2];
      const mult = unit === "ms" ? 1 : unit === "s" ? 1e3 : unit === "m" ? 6e4 : unit === "h" ? 36e5 : 864e5;
      return n * mult;
    }
    function stringifyObjectIds(doc) {
      if (doc == null || typeof doc !== "object")
        return doc;
      if (doc instanceof Date)
        return doc;
      if (doc._bsontype === "ObjectId")
        return doc.toString();
      if (doc._bsontype)
        return doc;
      const out = Array.isArray(doc) ? [] : {};
      for (const k of Object.keys(doc)) {
        const v2 = doc[k];
        const key = k === "_id" ? "id" : k;
        if (v2 && typeof v2 === "object" && v2._bsontype === "ObjectId") {
          out[key] = v2.toString();
        } else if (v2 instanceof Date) {
          out[key] = v2;
        } else if (v2 && typeof v2 === "object" && v2._bsontype) {
          out[key] = v2;
        } else if (v2 && typeof v2 === "object") {
          out[key] = stringifyObjectIds(v2);
        } else {
          out[key] = v2;
        }
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/client.js
var require_client2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dbClient = void 0;
    var client_1 = require_client();
    Object.defineProperty(exports, "dbClient", { enumerable: true, get: function() {
      return client_1.dbClient;
    } });
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/errors.js
var require_errors2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowPgError = rethrowPgError;
    exports.withPgErrors = withPgErrors;
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var MAP = {
      // 23xxx — integrity violations
      "23505": {
        code: "P2002",
        message: (e) => `Unique constraint failed${e.constraint ? ` on ${e.constraint}` : ""}`
      },
      "23503": {
        code: "P2003",
        message: (e) => `Foreign key constraint failed${e.constraint ? ` on ${e.constraint}` : ""}`
      },
      "23502": {
        code: "P2011",
        message: (e) => `Null constraint violation on ${e.column ?? "(unknown column)"}`
      },
      "23514": {
        code: "P2004",
        message: (e) => `Check constraint failed${e.constraint ? ` on ${e.constraint}` : ""}`
      },
      // 42xxx — schema / syntax
      "42P01": { code: "P2021", message: (e) => `Table does not exist: ${e.table ?? "(unknown)"}` },
      "42703": { code: "P2022", message: (e) => `Column does not exist: ${e.column ?? "(unknown)"}` },
      "42P02": { code: "P2022", message: (e) => `Parameter does not exist: ${e.message ?? ""}` },
      // 40xxx — transaction
      "40P01": { code: "P2034", message: () => "Transaction deadlock \u2014 please retry" },
      "40001": { code: "P2034", message: () => "Serialization failure \u2014 please retry" },
      // 57xxx — operator intervention
      "57014": { code: "P2024", message: () => "Query canceled (timeout)" },
      // 08xxx — connection
      "08000": { code: "P1001", message: (e) => `Connection error: ${e.message ?? ""}` },
      "08006": { code: "P1001", message: (e) => `Connection failure: ${e.message ?? ""}` },
      // 28xxx — auth
      "28P01": { code: "P1010", message: () => "Authentication failed for database user" },
      "28000": { code: "P1010", message: () => "Invalid authorization specification" }
    };
    function rethrowPgError(err) {
      if (!err || typeof err !== "object")
        throw err;
      const sqlstate = err.code ?? "";
      const mapping = MAP[sqlstate];
      if (!mapping) {
        if (err instanceof errors_1.DbKnownError)
          throw err;
        throw err;
      }
      const meta = { sqlstate };
      if (err.table)
        meta.modelName = err.table;
      if (err.column)
        meta.field_name = err.column;
      if (err.constraint)
        meta.target = [err.constraint];
      if (err.detail)
        meta.detail = err.detail;
      throw new errors_1.DbKnownError(mapping.code, mapping.message(err), meta);
    }
    async function withPgErrors(op) {
      try {
        return await op();
      } catch (err) {
        rethrowPgError(err);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/haversine.js
var require_haversine = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/haversine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pointInRing = pointInRing;
    exports.pointInMultiPolygon = pointInMultiPolygon;
    exports.pointInPolygon = pointInPolygon;
    exports.extractFallbackGeoOps = extractFallbackGeoOps;
    exports.haversineMeters = haversineMeters;
    exports.applyHaversinePostFilter = applyHaversinePostFilter;
    var EARTH_R_METERS = 63710088e-1;
    function pointInRing(point, ring) {
      let inside = false;
      const x2 = point.lng, y = point.lat;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi2 = ring[i].lng, yi2 = ring[i].lat;
        const xj = ring[j].lng, yj = ring[j].lat;
        const intersects = yi2 > y !== yj > y && x2 < (xj - xi2) * (y - yi2) / (yj - yi2) + xi2;
        if (intersects)
          inside = !inside;
      }
      return inside;
    }
    function pointInMultiPolygon(point, multiPolygon) {
      for (const polygon of multiPolygon) {
        if (polygon.length === 0)
          continue;
        const inOuter = pointInRing(point, polygon[0]);
        if (!inOuter)
          continue;
        let inHole = false;
        for (let i = 1; i < polygon.length; i++) {
          if (pointInRing(point, polygon[i])) {
            inHole = true;
            break;
          }
        }
        if (!inHole)
          return true;
      }
      return false;
    }
    function pointInPolygon(point, polygon) {
      return pointInRing(point, polygon);
    }
    function extractFallbackGeoOps(node, model3) {
      let near = null;
      let nearTo = null;
      let withinPolygon = null;
      walkWhere(node.where, (leaf) => {
        const fld = model3.fields[leaf.field];
        if (!(fld?.kind === "geoPoint" && fld.geo?.fallback))
          return;
        if (leaf.op === "near") {
          const v2 = leaf.value;
          near = { field: leaf.field, point: { lng: v2.lng, lat: v2.lat }, withinMeters: v2.withinMeters };
        } else if (leaf.op === "withinPolygon") {
          const v2 = leaf.value;
          const mp = v2.multiPolygon ?? (v2.polygon ? [[v2.polygon]] : []);
          withinPolygon = { field: leaf.field, multiPolygon: mp };
        }
      });
      const nt2 = node.orderBy?.find((e) => e.nearTo);
      if (nt2) {
        const fld = model3.fields[nt2.field];
        const ntVal = nt2.nearTo;
        if (fld?.kind === "geoPoint" && fld.geo?.fallback && ntVal && typeof ntVal.lng === "number" && typeof ntVal.lat === "number") {
          nearTo = { field: nt2.field, point: { lng: ntVal.lng, lat: ntVal.lat } };
        }
      }
      return { near, nearTo, withinPolygon };
    }
    function walkWhere(tree, cb) {
      if (!tree)
        return;
      if (tree.kind === "leaf")
        return cb(tree);
      if (tree.kind === "and" || tree.kind === "or")
        tree.children.forEach((c) => walkWhere(c, cb));
      if (tree.kind === "not")
        walkWhere(tree.child, cb);
    }
    function haversineMeters(a2, b2) {
      const toRad = (d2) => d2 * Math.PI / 180;
      const dLat = toRad(b2.lat - a2.lat);
      const dLng = toRad(b2.lng - a2.lng);
      const lat1 = toRad(a2.lat);
      const lat2 = toRad(b2.lat);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
      return 2 * EARTH_R_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
    }
    function applyHaversinePostFilter(rows, filter, orderBy, polygon = null) {
      if (!filter && !orderBy && !polygon)
        return rows;
      const ref = filter ?? orderBy;
      const radius = filter?.withinMeters;
      const out = [];
      for (const row of rows) {
        const fieldName = ref?.field ?? polygon?.field;
        if (!fieldName)
          continue;
        const raw = row[fieldName];
        const pt = parsePoint(raw);
        if (!pt) {
          if (orderBy)
            row._distanceMeters = null;
          if (!filter && !polygon)
            out.push(row);
          continue;
        }
        if (polygon && !pointInMultiPolygon(pt, polygon.multiPolygon))
          continue;
        if (ref) {
          const d2 = haversineMeters(pt, ref.point);
          if (filter && radius !== void 0 && d2 > radius)
            continue;
          if (orderBy)
            row._distanceMeters = d2;
        }
        out.push(row);
      }
      if (orderBy) {
        out.sort((a2, b2) => {
          const da2 = a2._distanceMeters ?? Number.POSITIVE_INFINITY;
          const db = b2._distanceMeters ?? Number.POSITIVE_INFINITY;
          return da2 - db;
        });
      }
      return out;
    }
    function parsePoint(v2) {
      if (v2 == null)
        return null;
      let obj = v2;
      if (typeof v2 === "string") {
        try {
          obj = JSON.parse(v2);
        } catch {
          return null;
        }
      }
      if (typeof obj !== "object")
        return null;
      if (typeof obj.lng === "number" && typeof obj.lat === "number")
        return { lng: obj.lng, lat: obj.lat };
      if (obj.type === "Point" && Array.isArray(obj.coordinates) && obj.coordinates.length >= 2) {
        return { lng: Number(obj.coordinates[0]), lat: Number(obj.coordinates[1]) };
      }
      return null;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/execute.js
var require_execute2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/execute.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executePgSelect = executePgSelect;
    exports.executePgGroupBy = executePgGroupBy;
    exports.executePgCount = executePgCount;
    exports.executePgInsert = executePgInsert;
    exports.executePgUpdate = executePgUpdate;
    exports.executePgDelete = executePgDelete;
    var schema_1 = require_schema();
    var compile_from_ir_1 = require_compile_from_ir2();
    var errors_1 = require_errors2();
    async function executePgSelect(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const { rows } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      let out = rows;
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      const { extractFallbackGeoOps, applyHaversinePostFilter } = await Promise.resolve().then(() => __importStar(require_haversine()));
      const ops = extractFallbackGeoOps(node, model3);
      if (ops.near || ops.nearTo || ops.withinPolygon) {
        out = applyHaversinePostFilter(out, ops.near, ops.nearTo, ops.withinPolygon);
      }
      if (node.projection?.counts?.length) {
        await applyRelationCounts(exec, out, model3, node.projection.counts);
      }
      if (node.hydration?.length) {
        await hydrate(exec, out, model3, node.hydration);
      }
      return out;
    }
    function reshapeGroupByRow(row, byCols) {
      const out = {};
      for (const c of byCols)
        out[c] = row[c];
      for (const k of Object.keys(row)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        const bucketKey = `_${m2[1]}`;
        const field = m2[2];
        out[bucketKey] ??= {};
        let val = row[k];
        if (val != null && typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val)) {
          val = Number(val);
        }
        out[bucketKey][field] = val;
      }
      return out;
    }
    async function executePgGroupBy(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const { rows } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      return rows.map((r) => reshapeGroupByRow(r, node.by));
    }
    async function executePgCount(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileCount)(node, model3);
      const { rows } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      return Number(rows[0]?.count ?? 0);
    }
    async function executePgInsert(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileInsert)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      return { docs: rows, count: rowCount ?? rows.length };
    }
    async function executePgUpdate(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function executePgDelete(pool, node, model3, opts = {}) {
      const exec = opts.client ?? pool;
      const artifact = (0, compile_from_ir_1.compileDelete)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withPgErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function hydrate(exec, rows, parentModel, hydration) {
      if (rows.length === 0)
        return;
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && parentModel.fields[rel.on] != null;
        if (isOwningOne)
          await hydrateOwningOne(exec, rows, rel, targetModel);
        else if (rel.kind === "one")
          await hydrateInverseOne(exec, rows, rel, targetModel);
        else
          await hydrateMany(exec, rows, rel, targetModel);
      }
    }
    async function hydrateOwningOne(exec, rows, rel, targetModel) {
      const fks = unique(rows.map((r) => r[rel.on]).filter(notNull));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.refs, op: "in", value: fks },
        ...rel.nested ?? {}
      };
      const found = await executePgSelect(exec, subNode, targetModel);
      const byRef = /* @__PURE__ */ new Map();
      for (const t of found)
        byRef.set(stringKey(t[rel.refs]), t);
      for (const r of rows) {
        const k = r[rel.on];
        r[rel.name] = k == null ? null : byRef.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateInverseOne(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.on, op: "in", value: refs },
        ...rel.nested ?? {}
      };
      const found = await executePgSelect(exec, subNode, targetModel);
      const byFk = /* @__PURE__ */ new Map();
      for (const t of found)
        byFk.set(stringKey(t[rel.on]), t);
      for (const r of rows) {
        const k = r[rel.refs];
        r[rel.name] = k == null ? null : byFk.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateMany(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const nestedWhere = rel.nested?.where;
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: refs };
      const where = nestedWhere ? { kind: "and", children: [nestedWhere, fkLeaf] } : fkLeaf;
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        ...rel.nested ?? {},
        where
      };
      const found = await executePgSelect(exec, subNode, targetModel);
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = stringKey(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows)
        r[rel.name] = byParent.get(stringKey(r[rel.refs])) ?? [];
    }
    async function applyRelationCounts(exec, rows, parentModel, counts) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
        if (refs.length === 0) {
          for (const row of rows)
            row._count[relName] = 0;
          continue;
        }
        const sql = `SELECT "${rel.on}" AS fk, COUNT(*)::bigint AS c FROM "${targetModel.collection}" WHERE "${rel.on}" = ANY($1) GROUP BY "${rel.on}"`;
        const { rows: groups } = await exec.query(sql, [refs]);
        const byFk = /* @__PURE__ */ new Map();
        for (const g of groups)
          byFk.set(stringKey(g.fk), Number(g.c));
        for (const row of rows)
          row._count[relName] = byFk.get(stringKey(row[rel.refs])) ?? 0;
      }
    }
    function notNull(v2) {
      return v2 != null;
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = stringKey(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function stringKey(v2) {
      if (v2 == null)
        return "\0";
      return String(v2);
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/driver.js
var require_driver = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pgDriver = pgDriver2;
    exports.postgresJsDriver = postgresJsDriver;
    exports.isPostgresDriver = isPostgresDriver;
    var _cursorSeq = 0;
    function pgDriver2(pool) {
      const norm = (r) => ({ rows: r.rows, rowCount: r.rowCount ?? r.rows.length });
      return {
        kind: "postgres",
        query: async (sql, params) => norm(await pool.query(sql, params)),
        transaction: async (fn) => {
          const client = await pool.connect();
          try {
            await client.query("BEGIN");
            const result = await fn({ query: async (s, p2) => norm(await client.query(s, p2)) });
            await client.query("COMMIT");
            return result;
          } catch (err) {
            try {
              await client.query("ROLLBACK");
            } catch {
            }
            throw err;
          } finally {
            if (typeof client.release === "function")
              client.release();
          }
        },
        stream: async function* (sql, params) {
          const client = await pool.connect();
          try {
            await client.query("BEGIN");
            const name = `forge_stream_${(_cursorSeq++).toString(36)}`;
            await client.query(`DECLARE ${name} CURSOR FOR ${sql}`, params);
            for (; ; ) {
              const { rows } = await client.query(`FETCH 200 FROM ${name}`);
              if (rows.length === 0)
                break;
              for (const r of rows)
                yield r;
              if (rows.length < 200)
                break;
            }
            await client.query(`CLOSE ${name}`);
            await client.query("COMMIT");
          } catch (err) {
            try {
              await client.query("ROLLBACK");
            } catch {
            }
            throw err;
          } finally {
            client.release();
          }
        },
        close: async () => {
          await pool.end();
        }
      };
    }
    function postgresJsDriver(sql) {
      const run = async (q, text, params) => {
        const r = await q.unsafe(text, params ?? []);
        const rows = Array.from(r);
        return { rows, rowCount: r.count ?? rows.length };
      };
      return {
        kind: "postgres",
        query: (text, params) => run(sql, text, params),
        transaction: (fn) => sql.begin((txSql) => fn({ query: (text, params) => run(txSql, text, params) })),
        close: async () => {
          await sql.end({ timeout: 5 });
        }
      };
    }
    function isPostgresDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "postgres" && typeof v2.query === "function" && typeof v2.transaction === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/introspect.js
var require_introspect = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspectPg = introspectPg;
    async function introspectPg(pool) {
      const cols = await pool.query(`SELECT table_name, column_name, data_type, udt_name, is_nullable,
            column_default, numeric_precision, numeric_scale, character_maximum_length
       FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position`);
      const baseTables = await pool.query(`SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`);
      const baseSet = new Set(baseTables.rows.map((r) => r.table_name));
      const idxMeta = await pool.query(`SELECT t.relname AS table_name, i.relname AS index_name,
            ix.indisunique AS is_unique,
            am.amname AS method,
            ix.indnatts AS key_col_count,
            pg_get_expr(ix.indpred, ix.indrelid) AS partial_pred,
            pg_get_expr(ix.indexprs, ix.indrelid) AS expression_body
       FROM pg_index ix
       JOIN pg_class i  ON i.oid = ix.indexrelid
       JOIN pg_class t  ON t.oid = ix.indrelid
       JOIN pg_am    am ON am.oid = i.relam
       JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = 'public'`);
      const idx = await pool.query(`SELECT t.relname AS table_name, i.relname AS index_name,
            ix.indisunique AS is_unique, a.attname AS column_name,
            array_position(ix.indkey, a.attnum) AS ord
       FROM pg_index ix
       JOIN pg_class i  ON i.oid = ix.indexrelid
       JOIN pg_class t  ON t.oid = ix.indrelid
       JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
       JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.relname, i.relname, ord`);
      const fks = await pool.query(`SELECT con.conname AS name, t.relname AS table_name,
            att.attname AS column_name, ft.relname AS ref_table,
            fatt.attname AS ref_column
       FROM pg_constraint con
       JOIN pg_class t   ON t.oid = con.conrelid
       JOIN pg_class ft  ON ft.oid = con.confrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
       JOIN pg_attribute att  ON att.attrelid = con.conrelid  AND att.attnum  = con.conkey[1]
       JOIN pg_attribute fatt ON fatt.attrelid = con.confrelid AND fatt.attnum = con.confkey[1]
      WHERE con.contype = 'f' AND n.nspname = 'public'`);
      const views = await pool.query(`SELECT table_name AS name FROM information_schema.views WHERE table_schema = 'public'`);
      const matviews = await pool.query(`SELECT matviewname AS name FROM pg_matviews WHERE schemaname = 'public'`);
      const tableMap = /* @__PURE__ */ new Map();
      const ensure = (name) => {
        let t = tableMap.get(name);
        if (!t) {
          t = { name, columns: [], indexes: [], foreignKeys: [] };
          tableMap.set(name, t);
        }
        return t;
      };
      for (const r of cols.rows) {
        if (!baseSet.has(r.table_name))
          continue;
        ensure(r.table_name).columns.push(normalizeColumn(r));
      }
      const metaByKey = /* @__PURE__ */ new Map();
      for (const r of idxMeta.rows) {
        metaByKey.set(`${r.table_name}::${r.index_name}`, r);
      }
      const idxAcc = /* @__PURE__ */ new Map();
      for (const r of idx.rows) {
        if (!baseSet.has(r.table_name))
          continue;
        const k = `${r.table_name}::${r.index_name}`;
        let i = idxAcc.get(k);
        if (!i) {
          const meta = metaByKey.get(k);
          i = {
            name: r.index_name,
            columns: [],
            unique: r.is_unique,
            method: meta?.method ? String(meta.method).toLowerCase() : void 0,
            where: meta?.partial_pred ?? void 0,
            expression: meta?.expression_body ?? void 0
          };
          idxAcc.set(k, i);
          ensure(r.table_name).indexes.push(i);
        }
        i.columns.push(r.column_name);
      }
      for (const [k, ix] of idxAcc) {
        const meta = metaByKey.get(k);
        const keyCount = Number(meta?.key_col_count ?? ix.columns.length);
        if (ix.columns.length > keyCount) {
          ix.include = ix.columns.slice(keyCount);
          ix.columns = ix.columns.slice(0, keyCount);
        }
      }
      for (const r of fks.rows) {
        if (!baseSet.has(r.table_name))
          continue;
        ensure(r.table_name).foreignKeys.push({
          name: r.name,
          column: r.column_name,
          refTable: r.ref_table,
          refColumn: r.ref_column
        });
      }
      return {
        kind: "postgres",
        tables: [...tableMap.values()],
        views: [
          ...views.rows.map((r) => ({ name: r.name, materialised: false })),
          ...matviews.rows.map((r) => ({ name: r.name, materialised: true }))
        ]
      };
    }
    function normalizeColumn(r) {
      let type = String(r.data_type).toLowerCase();
      if (type === "numeric" && r.numeric_precision != null) {
        type = `numeric(${r.numeric_precision}${r.numeric_scale != null ? `,${r.numeric_scale}` : ""})`;
      } else if (type === "character varying" && r.character_maximum_length != null) {
        type = `varchar(${r.character_maximum_length})`;
      } else if (type === "ARRAY".toLowerCase()) {
        type = String(r.udt_name).replace(/^_/, "") + "[]";
      }
      return {
        name: r.column_name,
        type,
        nullable: r.is_nullable === "YES",
        default: r.column_default ?? void 0
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/raw-sql.js
var require_raw_sql = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/raw-sql.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.forgeSql = void 0;
    exports.isSqlFragment = isSqlFragment;
    exports.compileSqlFragment = compileSqlFragment;
    function makeFragment(strings, values) {
      return { __forgeSql: true, strings, values };
    }
    function isSqlFragment(v2) {
      return !!v2 && typeof v2 === "object" && v2.__forgeSql === true;
    }
    exports.forgeSql = {
      // Tagged template: builds a SqlFragment with parameter placeholders.
      sql(strings, ...values) {
        return makeFragment(strings, values);
      },
      // Literal SQL passthrough. ⚠ Anything you pass here is interpolated as-is.
      // Use only for constants known at code-write time (column names, type
      // names). Never pass user input.
      raw(sql) {
        return makeFragment([sql], []);
      },
      // Join an array of SqlFragments with a separator. The separator is itself
      // a literal — use forge.raw(',') for typical list cases.
      join(parts, separator = ", ") {
        if (parts.length === 0)
          return exports.forgeSql.empty;
        const strings = [];
        const values = [];
        for (let i = 0; i < parts.length; i++) {
          const p2 = parts[i];
          if (i === 0)
            strings.push(p2.strings[0]);
          else
            strings[strings.length - 1] += separator + p2.strings[0];
          for (let j = 0; j < p2.values.length; j++) {
            values.push(p2.values[j]);
            strings.push(p2.strings[j + 1]);
          }
        }
        return makeFragment(strings, values);
      },
      // Empty fragment — useful for "no clause" branches in conditional composition.
      empty: makeFragment([""], [])
    };
    function compileSqlFragment(frag, dialect = "postgres") {
      const params = [];
      const sqlParts = [];
      appendFragment(frag, dialect, params, sqlParts);
      return { sql: sqlParts.join(""), params };
    }
    function appendFragment(frag, dialect, params, out) {
      const { strings, values } = frag;
      out.push(strings[0]);
      for (let i = 0; i < values.length; i++) {
        const v2 = values[i];
        if (isSqlFragment(v2)) {
          appendFragment(v2, dialect, params, out);
        } else {
          params.push(v2);
          const ph = dialect === "postgres" ? `$${params.length}` : "?";
          out.push(ph);
        }
        out.push(strings[i + 1]);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/adapter.js
var require_adapter2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/postgres/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgresAdapter = void 0;
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute2();
    var driver_1 = require_driver();
    var CAPS = {
      nativeCascades: true,
      nativeUpsert: true,
      nullsOrdering: true,
      jsonPath: true,
      transactionsRequireReplicaSet: false
    };
    var PostgresAdapter = class {
      _injected;
      kind = "postgres";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _driver;
      // The raw node-postgres Pool when we created one (default path) — kept so the
      // migration tooling, which needs pool.connect() for advisory locks, still has
      // a full pg handle via `.pool`. Undefined when a driver is injected.
      _rawPool;
      _url;
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          this._driver = this._injected;
        } else {
          const pg = (0, missing_driver_1.loadDriver)("postgres", url);
          const pool = new pg.Pool({
            connectionString: url,
            max: 50,
            idleTimeoutMillis: 1e4,
            connectionTimeoutMillis: 1e4
          });
          this._rawPool = pool;
          this._driver = (0, driver_1.pgDriver)(pool);
        }
        await this._driver.query("SELECT 1", []);
      }
      async close() {
        if (!this._driver)
          return;
        await this._driver.close();
        this._driver = void 0;
      }
      async doctor() {
        const injected = !!this._injected;
        const driver = injected ? { installed: true, version: void 0 } : (0, missing_driver_1.isDriverInstalled)("postgres");
        return {
          kind: "postgres",
          driverPackage: injected ? "(injected driver)" : "pg",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            injected ? "Custom driver injected via createDb({ driver }) \u2014 e.g. postgres.js." : "Driver: node-postgres (pg). Transactions native; cascades enforced by FK clauses.",
            "Queries route through a normalized driver port, so any Postgres client can back the adapter."
          ]
        };
      }
      get driver() {
        if (!this._driver)
          throw new Error("[forge:postgres] driver accessed before connect() resolved");
        return this._driver;
      }
      // The full node-postgres Pool (with .connect()) when forge created one — used
      // by the migration tooling. Falls back to the queryable port for injected
      // drivers (which don't expose a pool/connect).
      get pool() {
        return this._rawPool ?? this.driver;
      }
      pgOpts(opts) {
        return opts?.session ? { client: opts.session } : {};
      }
      async _track(op, node, model3, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const { compileSelect, compileCount, compileGroupBy, compileInsert, compileUpdate, compileDelete } = await Promise.resolve().then(() => __importStar(require_compile_from_ir2()));
        const artifact = op === "select" ? compileSelect(node, model3) : op === "count" ? compileCount(node, model3) : op === "groupBy" ? compileGroupBy(node, model3) : op === "insert" ? compileInsert(node, model3) : op === "update" ? compileUpdate(node, model3) : compileDelete(node, model3);
        return this.emitter.track({ adapter: "postgres", model: node.model ?? "", op, sql: artifact.sql, params: artifact.params, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, model3, () => (0, execute_1.executePgSelect)(this.handle(opts), node, model3, this.pgOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, model3, () => (0, execute_1.executePgCount)(this.handle(opts), node, model3, this.pgOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, model3, () => (0, execute_1.executePgInsert)(this.handle(opts), node, model3, this.pgOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, model3, () => (0, execute_1.executePgUpdate)(this.handle(opts), node, model3, this.pgOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, model3, () => (0, execute_1.executePgDelete)(this.handle(opts), node, model3, this.pgOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, model3, () => (0, execute_1.executePgGroupBy)(this.handle(opts), node, model3, this.pgOpts(opts)), (r) => r.length);
      }
      // The queryable the executor should use: the txn session if present, else the
      // driver itself (both implement `query`).
      handle(opts) {
        return opts?.session ?? this.driver;
      }
      async *streamSelect(node, model3, _opts) {
        const { compileSelect } = await Promise.resolve().then(() => __importStar(require_compile_from_ir2()));
        const a2 = compileSelect(node, model3);
        if (this.driver.stream) {
          yield* this.driver.stream(a2.sql, a2.params);
        } else {
          const { rows } = await this.driver.query(a2.sql, a2.params);
          for (const r of rows)
            yield r;
        }
      }
      async applyProjectionAndHydration() {
      }
      // jsonb / embed / json columns: pg expects a string for parameterised inserts.
      coerceInbound(model3, data, _opts) {
        if (!data || typeof data !== "object")
          return data;
        const out = {};
        for (const [k, v2] of Object.entries(data)) {
          const field = model3?.fields?.[k];
          if (field && (field.kind === "json" || field.kind === "embed" || field.kind === "embedMany") && v2 != null && typeof v2 === "object") {
            out[k] = JSON.stringify(v2);
          } else {
            out[k] = v2;
          }
        }
        return out;
      }
      decodeOutbound(_model, row) {
        return row;
      }
      async applyCascadesForDelete() {
      }
      // CONCURRENTLY needs a unique index on the matview, so it's opt-in.
      async refreshView(model3, opts) {
        const q = `"${String(model3.collection).replace(/"/g, '""')}"`;
        const concurrently = opts?.concurrently ? "CONCURRENTLY " : "";
        await this.handle(opts).query(`REFRESH MATERIALIZED VIEW ${concurrently}${q}`, []);
      }
      async introspect() {
        const { introspectPg } = await Promise.resolve().then(() => __importStar(require_introspect()));
        return introspectPg(this.driver);
      }
      async $queryRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withPgErrors } = await Promise.resolve().then(() => __importStar(require_errors2()));
        const { rows } = await withPgErrors(() => this.handle(opts).query(sql, params));
        return rows;
      }
      async $executeRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withPgErrors } = await Promise.resolve().then(() => __importStar(require_errors2()));
        const { rowCount } = await withPgErrors(() => this.handle(opts).query(sql, params));
        return rowCount ?? 0;
      }
      // Driver owns the transaction model (pg PoolClient / postgres.js sql.begin);
      // the session it yields is threaded back via ExecOpts.session.
      async $transaction(fn) {
        return this.driver.transaction((session) => fn(session));
      }
    };
    exports.PostgresAdapter = PostgresAdapter;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/errors.js
var require_errors3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowMysqlError = rethrowMysqlError;
    exports.withMysqlErrors = withMysqlErrors;
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var MAP = {
      1062: { code: "P2002", mk: (e) => `Unique constraint failed: ${e.sqlMessage ?? e.message ?? ""}` },
      // ER_DUP_ENTRY
      1452: { code: "P2003", mk: (e) => `Foreign key constraint failed: ${e.sqlMessage ?? e.message ?? ""}` },
      // ER_NO_REFERENCED_ROW_2
      1451: { code: "P2003", mk: (e) => `Foreign key constraint failed (delete blocked): ${e.sqlMessage ?? ""}` },
      // ER_ROW_IS_REFERENCED_2
      1048: { code: "P2011", mk: (e) => `Null constraint violation: ${e.sqlMessage ?? ""}` },
      // ER_BAD_NULL_ERROR
      3819: { code: "P2004", mk: (e) => `Check constraint failed: ${e.sqlMessage ?? ""}` },
      // ER_CHECK_CONSTRAINT_VIOLATED
      1146: { code: "P2021", mk: (e) => `Table does not exist: ${e.sqlMessage ?? ""}` },
      // ER_NO_SUCH_TABLE
      1054: { code: "P2022", mk: (e) => `Column does not exist: ${e.sqlMessage ?? ""}` },
      // ER_BAD_FIELD_ERROR
      1213: { code: "P2034", mk: () => "Transaction deadlock \u2014 please retry" },
      // ER_LOCK_DEADLOCK
      1205: { code: "P2034", mk: () => "Lock wait timeout \u2014 please retry" },
      // ER_LOCK_WAIT_TIMEOUT
      1317: { code: "P2024", mk: () => "Query interrupted (timeout)" },
      // ER_QUERY_INTERRUPTED
      2002: { code: "P1001", mk: () => "Connection refused" },
      // CR_CONNECTION_ERROR
      2003: { code: "P1001", mk: () => "Can't connect to MySQL server" },
      // CR_CONN_HOST_ERROR
      2006: { code: "P1001", mk: () => "MySQL server has gone away" },
      // CR_SERVER_GONE_ERROR
      1045: { code: "P1010", mk: () => "Access denied \u2014 authentication failed" }
      // ER_ACCESS_DENIED_ERROR
    };
    function rethrowMysqlError(err) {
      if (!err || typeof err !== "object")
        throw err;
      if (err instanceof errors_1.DbKnownError)
        throw err;
      const errno = err.errno ?? 0;
      const mapping = MAP[errno];
      if (!mapping)
        throw err;
      throw new errors_1.DbKnownError(mapping.code, mapping.mk(err), {
        errno,
        sqlState: err.sqlState,
        detail: err.sqlMessage ?? err.message
      });
    }
    async function withMysqlErrors(op) {
      try {
        return await op();
      } catch (err) {
        rethrowMysqlError(err);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/execute.js
var require_execute3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/execute.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeMysqlSelect = executeMysqlSelect;
    exports.executeMysqlCount = executeMysqlCount;
    exports.executeMysqlGroupBy = executeMysqlGroupBy;
    exports.executeMysqlInsert = executeMysqlInsert;
    exports.executeMysqlUpdate = executeMysqlUpdate;
    exports.executeMysqlDelete = executeMysqlDelete;
    var schema_1 = require_schema();
    var compile_from_ir_1 = require_compile_from_ir3();
    var errors_1 = require_errors3();
    var build_1 = require_build();
    function decodeRow(model3, row) {
      if (!row || typeof row !== "object")
        return row;
      const out = {};
      for (const k of Object.keys(row)) {
        const field = model3.fields[k];
        const v2 = row[k];
        if (!field || v2 == null) {
          out[k] = v2;
          continue;
        }
        switch (field.kind) {
          case "bool":
            out[k] = v2 === 1 || v2 === true;
            break;
          case "json":
          case "embed":
          case "embedMany":
          case "stringArray":
          case "intArray":
            out[k] = typeof v2 === "string" ? safeParse(v2) : v2;
            break;
          default:
            out[k] = v2;
        }
      }
      return out;
    }
    function safeParse(s) {
      try {
        return JSON.parse(s);
      } catch {
        return s;
      }
    }
    async function executeMysqlSelect(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      const a2 = (0, compile_from_ir_1.compileSelect)(node, model3);
      const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(a2.sql, a2.params));
      let out = rows.map((r) => decodeRow(model3, r));
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      const { extractFallbackGeoOps, applyHaversinePostFilter } = await Promise.resolve().then(() => __importStar(require_haversine()));
      const geoOps = extractFallbackGeoOps(node, model3);
      if (geoOps.near || geoOps.nearTo || geoOps.withinPolygon) {
        out = applyHaversinePostFilter(out, geoOps.near, geoOps.nearTo, geoOps.withinPolygon);
      }
      if (node.projection?.counts?.length)
        await applyRelationCounts(exec, out, model3, node.projection.counts);
      if (node.hydration?.length)
        await hydrate(pool, opts, out, model3, node.hydration);
      return out;
    }
    async function executeMysqlCount(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      const a2 = (0, compile_from_ir_1.compileCount)(node, model3);
      const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(a2.sql, a2.params));
      return Number(rows[0]?.count ?? 0);
    }
    async function executeMysqlGroupBy(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      const a2 = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(a2.sql, a2.params));
      return rows.map((r) => reshapeGroupByRow(r, node.by));
    }
    function reshapeGroupByRow(row, byCols) {
      const out = {};
      for (const c of byCols)
        out[c] = row[c];
      for (const k of Object.keys(row)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        out[`_${m2[1]}`] ??= {};
        out[`_${m2[1]}`][m2[2]] = row[k];
      }
      return out;
    }
    async function executeMysqlInsert(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      const a2 = (0, compile_from_ir_1.compileInsert)(node, model3);
      const [result] = await (0, errors_1.withMysqlErrors)(() => exec.execute(a2.sql, a2.params));
      const ids = node.rows.map((r) => r.id).filter((id) => id != null);
      if (ids.length === 0) {
        if (result.insertId != null && result.affectedRows > 0) {
          const placeholders2 = Array.from({ length: result.affectedRows }, () => "?").join(",");
          const ranged = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i);
          const [docs2] = await (0, errors_1.withMysqlErrors)(() => exec.query(`SELECT * FROM \`${model3.collection}\` WHERE \`id\` IN (${placeholders2})`, ranged));
          return { docs: docs2.map((r) => decodeRow(model3, r)), count: result.affectedRows };
        }
        return { docs: [], count: result.affectedRows };
      }
      const placeholders = ids.map(() => "?").join(",");
      const [docs] = await (0, errors_1.withMysqlErrors)(() => exec.query(`SELECT * FROM \`${model3.collection}\` WHERE \`id\` IN (${placeholders})`, ids));
      return { docs: docs.map((r) => decodeRow(model3, r)), count: result.affectedRows };
    }
    async function executeMysqlUpdate(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      const a2 = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const [result] = await (0, errors_1.withMysqlErrors)(() => exec.execute(a2.sql, a2.params));
      if (node.many)
        return { count: result.affectedRows };
      if (whereHasNonEq(node.where) && result.affectedRows === 0)
        return { doc: void 0, count: 0 };
      const selectArtifact = (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(node.model, model3, { where: irWhereToObject(node.where), take: 1 }, "one"), model3);
      const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(selectArtifact.sql, selectArtifact.params));
      const doc = rows[0];
      return { doc: doc ? decodeRow(model3, doc) : void 0, count: result.affectedRows };
    }
    async function executeMysqlDelete(pool, node, model3, opts = {}) {
      const exec = opts.conn ?? pool;
      if (node.many) {
        const a3 = (0, compile_from_ir_1.compileDelete)(node, model3);
        const [result2] = await (0, errors_1.withMysqlErrors)(() => exec.execute(a3.sql, a3.params));
        return { count: result2.affectedRows };
      }
      const selectArtifact = (0, compile_from_ir_1.compileSelect)((0, build_1.buildSelect)(node.model, model3, { where: irWhereToObject(node.where), take: 1 }, "one"), model3);
      const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(selectArtifact.sql, selectArtifact.params));
      const doc = rows[0];
      if (!doc)
        return { doc: void 0, count: 0 };
      const a2 = (0, compile_from_ir_1.compileDelete)(node, model3);
      const [result] = await (0, errors_1.withMysqlErrors)(() => exec.execute(a2.sql, a2.params));
      if (whereHasNonEq(node.where) && result.affectedRows === 0)
        return { doc: void 0, count: 0 };
      return { doc: decodeRow(model3, doc), count: result.affectedRows };
    }
    function irWhereToObject(tree) {
      if (!tree)
        return void 0;
      if (tree.kind === "leaf") {
        return tree.op === "eq" && tree.rhsField === void 0 ? { [tree.field]: tree.value } : {};
      }
      if (tree.kind === "and") {
        const out = {};
        for (const c of tree.children)
          Object.assign(out, irWhereToObject(c) ?? {});
        return out;
      }
      return {};
    }
    function whereHasNonEq(tree) {
      if (!tree)
        return false;
      if (tree.kind === "leaf")
        return tree.op !== "eq" || tree.rhsField !== void 0;
      if (tree.kind === "and" || tree.kind === "or")
        return tree.children.some(whereHasNonEq);
      if (tree.kind === "not")
        return whereHasNonEq(tree.child);
      return true;
    }
    async function hydrate(pool, opts, rows, parentModel, hydration) {
      if (rows.length === 0)
        return;
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && parentModel.fields[rel.on] != null;
        if (isOwningOne)
          await hydrateOne(pool, opts, rows, rel, targetModel, true);
        else if (rel.kind === "one")
          await hydrateOne(pool, opts, rows, rel, targetModel, false);
        else
          await hydrateMany(pool, opts, rows, rel, targetModel);
      }
    }
    async function hydrateOne(pool, opts, rows, rel, targetModel, owning) {
      const fromField = owning ? rel.on : rel.refs;
      const toField = owning ? rel.refs : rel.on;
      const fks = unique(rows.map((r) => r[fromField]).filter((v2) => v2 != null));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: toField, op: "in", value: fks },
        ...rel.nested ?? {}
      };
      const found = await executeMysqlSelect(pool, subNode, targetModel, opts);
      const byKey = /* @__PURE__ */ new Map();
      for (const t of found)
        byKey.set(String(t[toField]), t);
      for (const r of rows) {
        const k = r[fromField];
        r[rel.name] = k == null ? null : byKey.get(String(k)) ?? null;
      }
    }
    async function hydrateMany(pool, opts, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter((v2) => v2 != null));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const nestedWhere = rel.nested?.where;
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: refs };
      const where = nestedWhere ? { kind: "and", children: [nestedWhere, fkLeaf] } : fkLeaf;
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        ...rel.nested ?? {},
        where
      };
      const found = await executeMysqlSelect(pool, subNode, targetModel, opts);
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = String(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows)
        r[rel.name] = byParent.get(String(r[rel.refs])) ?? [];
    }
    async function applyRelationCounts(exec, rows, parentModel, counts) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const refs = unique(rows.map((r) => r[rel.refs]).filter((v2) => v2 != null));
        if (refs.length === 0) {
          for (const r of rows)
            r._count[relName] = 0;
          continue;
        }
        const placeholders = refs.map(() => "?").join(",");
        const sql = `SELECT \`${rel.on}\` AS fk, COUNT(*) AS c FROM \`${targetModel.collection}\` WHERE \`${rel.on}\` IN (${placeholders}) GROUP BY \`${rel.on}\``;
        const [groups] = await (0, errors_1.withMysqlErrors)(() => exec.query(sql, refs));
        const byFk = /* @__PURE__ */ new Map();
        for (const g of groups)
          byFk.set(String(g.fk), Number(g.c));
        for (const r of rows)
          r._count[relName] = byFk.get(String(r[rel.refs])) ?? 0;
      }
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = String(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/driver.js
var require_driver2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mysql2Driver = mysql2Driver;
    exports.mariadbDriver = mariadbDriver;
    exports.planetscaleDriver = planetscaleDriver;
    exports.isMysqlDriver = isMysqlDriver;
    function mysql2Driver(pool) {
      return {
        kind: "mysql",
        query: (sql, params) => pool.query(sql, params),
        execute: (sql, params) => pool.execute(sql, params),
        transaction: async (fn) => {
          const conn = await pool.getConnection();
          try {
            await conn.query("START TRANSACTION");
            const result = await fn(conn);
            await conn.query("COMMIT");
            return result;
          } catch (err) {
            try {
              await conn.query("ROLLBACK");
            } catch {
            }
            throw err;
          } finally {
            if (typeof conn.release === "function")
              conn.release();
          }
        },
        stream: async function* (sql, params) {
          const conn = await pool.getConnection();
          try {
            const raw = conn.connection ?? conn;
            const s = raw.query({ sql, values: params }).stream({ highWaterMark: 200 });
            for await (const row of s)
              yield row;
          } finally {
            if (typeof conn.release === "function")
              conn.release();
          }
        },
        close: async () => {
          if (pool.end)
            await pool.end();
        }
      };
    }
    function mariadbDriver(pool) {
      const asTuple = (r) => [r, (r && r.meta) ?? void 0];
      const writeTuple = (r) => [{ affectedRows: r?.affectedRows ?? 0, insertId: r?.insertId != null ? Number(r.insertId) : void 0 }, void 0];
      const sess = (conn) => ({
        query: async (sql, params) => asTuple(await conn.query(sql, params)),
        execute: async (sql, params) => writeTuple(await conn.query(sql, params))
      });
      return {
        kind: "mysql",
        query: async (sql, params) => asTuple(await pool.query(sql, params)),
        execute: async (sql, params) => writeTuple(await pool.query(sql, params)),
        transaction: async (fn) => {
          const conn = await pool.getConnection();
          try {
            await conn.beginTransaction();
            const result = await fn(sess(conn));
            await conn.commit();
            return result;
          } catch (err) {
            try {
              await conn.rollback();
            } catch {
            }
            throw err;
          } finally {
            if (typeof conn.release === "function")
              conn.release();
          }
        },
        close: async () => {
          if (pool.end)
            await pool.end();
        }
      };
    }
    function planetscaleDriver(conn) {
      const readTuple = (r) => [r.rows ?? [], r.fields];
      const writeTuple = (r) => [{ affectedRows: Number(r.rowsAffected ?? 0), insertId: r.insertId != null ? Number(r.insertId) : void 0 }, r.fields];
      const sess = (tx) => ({
        query: async (sql, params) => readTuple(await tx.execute(sql, params)),
        execute: async (sql, params) => writeTuple(await tx.execute(sql, params))
      });
      return {
        kind: "mysql",
        query: async (sql, params) => readTuple(await conn.execute(sql, params)),
        execute: async (sql, params) => writeTuple(await conn.execute(sql, params)),
        transaction: (fn) => conn.transaction((tx) => fn(sess(tx))),
        close: async () => {
        }
      };
    }
    function isMysqlDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "mysql" && typeof v2.query === "function" && typeof v2.transaction === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/introspect.js
var require_introspect2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspectMysql = introspectMysql;
    async function introspectMysql(pool) {
      const [tables] = await pool.query(`SELECT TABLE_NAME AS name, TABLE_TYPE AS type
       FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`);
      const [cols] = await pool.query(`SELECT TABLE_NAME AS t, COLUMN_NAME AS name, COLUMN_TYPE AS type,
            IS_NULLABLE AS nullable, COLUMN_DEFAULT AS dflt
       FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME, ORDINAL_POSITION`);
      let idxRows;
      try {
        const [r] = await pool.query(`SELECT TABLE_NAME AS t, INDEX_NAME AS name, NON_UNIQUE AS nonUnique,
              COLUMN_NAME AS col, SEQ_IN_INDEX AS seq,
              INDEX_TYPE AS indexType, EXPRESSION AS expr
         FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`);
        idxRows = r;
      } catch {
        const [r] = await pool.query(`SELECT TABLE_NAME AS t, INDEX_NAME AS name, NON_UNIQUE AS nonUnique,
              COLUMN_NAME AS col, SEQ_IN_INDEX AS seq,
              INDEX_TYPE AS indexType, NULL AS expr
         FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`);
        idxRows = r;
      }
      const [fks] = await pool.query(`SELECT CONSTRAINT_NAME AS name, TABLE_NAME AS t, COLUMN_NAME AS col,
            REFERENCED_TABLE_NAME AS refTable, REFERENCED_COLUMN_NAME AS refColumn
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL`);
      const baseTables = new Set(tables.filter((r) => r.type === "BASE TABLE").map((r) => r.name));
      const tableMap = /* @__PURE__ */ new Map();
      const ensure = (name) => {
        let t = tableMap.get(name);
        if (!t) {
          t = { name, columns: [], indexes: [], foreignKeys: [] };
          tableMap.set(name, t);
        }
        return t;
      };
      for (const r of cols) {
        if (!baseTables.has(r.t))
          continue;
        ensure(r.t).columns.push({
          name: r.name,
          type: String(r.type).toLowerCase(),
          nullable: r.nullable === "YES",
          default: r.dflt ?? void 0
        });
      }
      const idxAcc = /* @__PURE__ */ new Map();
      for (const r of idxRows) {
        if (!baseTables.has(r.t))
          continue;
        const k = `${r.t}::${r.name}`;
        let i = idxAcc.get(k);
        if (!i) {
          const it2 = String(r.indexType ?? "btree").toLowerCase();
          i = {
            name: r.name,
            columns: [],
            unique: Number(r.nonUnique) === 0,
            method: it2 !== "btree" ? it2 : void 0
          };
          idxAcc.set(k, i);
          ensure(r.t).indexes.push(i);
        }
        if (r.expr != null) {
          i.expression = String(r.expr);
        } else if (r.col != null) {
          i.columns.push(r.col);
        }
      }
      for (const r of fks) {
        if (!baseTables.has(r.t))
          continue;
        ensure(r.t).foreignKeys.push({ name: r.name, column: r.col, refTable: r.refTable, refColumn: r.refColumn });
      }
      return {
        kind: "mysql",
        tables: [...tableMap.values()],
        views: tables.filter((r) => r.type === "VIEW").map((r) => ({ name: r.name, materialised: false }))
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/adapter.js
var require_adapter3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mysql/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MysqlAdapter = void 0;
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute3();
    var errors_1 = require_errors3();
    var driver_1 = require_driver2();
    var CAPS = {
      nativeCascades: true,
      nativeUpsert: true,
      nullsOrdering: false,
      jsonPath: true,
      transactionsRequireReplicaSet: false
    };
    var MysqlAdapter = class {
      _injected;
      kind = "mysql";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _driver;
      // Raw mysql2 promise pool when we created one — kept so the migration tooling
      // (which calls getConnection) still has a full handle via `.pool`.
      _rawPool;
      _url;
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          this._driver = this._injected;
        } else {
          const mysql = (0, missing_driver_1.loadDriver)("mysql", url);
          const rawPool = mysql.createPool({ uri: url, connectionLimit: 50 });
          this._rawPool = rawPool.promise ? rawPool.promise() : rawPool;
          this._driver = (0, driver_1.mysql2Driver)(this._rawPool);
        }
        await this._driver.query("SELECT 1", []);
      }
      async close() {
        if (this._driver)
          await this._driver.close();
        this._driver = void 0;
      }
      async doctor() {
        const injected = !!this._injected;
        const driver = injected ? { installed: true, version: void 0 } : (0, missing_driver_1.isDriverInstalled)("mysql");
        return {
          kind: "mysql",
          driverPackage: injected ? "(injected driver)" : "mysql2",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            injected ? "Custom driver injected via createDb({ driver }) \u2014 e.g. mariadb, PlanetScale." : "Driver: mysql2. No RETURNING \u2014 writes that return rows do a follow-up SELECT.",
            "Queries route through a normalized driver port."
          ]
        };
      }
      get driver() {
        if (!this._driver)
          throw new Error("[forge:mysql] driver accessed before connect() resolved");
        return this._driver;
      }
      // The full mysql2 pool (with getConnection) when forge created one — used by
      // the migration tooling. Falls back to the queryable port for injected drivers.
      get pool() {
        return this._rawPool ?? this.driver;
      }
      mysqlOpts(opts) {
        return opts?.session ? { conn: opts.session } : {};
      }
      // Handle the executor should use: the txn session if present, else the driver.
      handle(opts) {
        return opts?.session ?? this.driver;
      }
      async _track(op, node, model3, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const c = await Promise.resolve().then(() => __importStar(require_compile_from_ir3()));
        const a2 = op === "select" ? c.compileSelect(node, model3) : op === "count" ? c.compileCount(node, model3) : op === "groupBy" ? c.compileGroupBy(node, model3) : op === "insert" ? c.compileInsert(node, model3) : op === "update" ? c.compileUpdate(node, model3) : c.compileDelete(node, model3);
        return this.emitter.track({ adapter: "mysql", model: node.model ?? "", op, sql: a2.sql, params: a2.params, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, model3, () => (0, execute_1.executeMysqlSelect)(this.handle(opts), node, model3, this.mysqlOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, model3, () => (0, execute_1.executeMysqlCount)(this.handle(opts), node, model3, this.mysqlOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, model3, () => (0, execute_1.executeMysqlInsert)(this.handle(opts), node, model3, this.mysqlOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, model3, () => (0, execute_1.executeMysqlUpdate)(this.handle(opts), node, model3, this.mysqlOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, model3, () => (0, execute_1.executeMysqlDelete)(this.handle(opts), node, model3, this.mysqlOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, model3, () => (0, execute_1.executeMysqlGroupBy)(this.handle(opts), node, model3, this.mysqlOpts(opts)), (r) => r.length);
      }
      async *streamSelect(node, model3, _opts) {
        const { compileSelect } = await Promise.resolve().then(() => __importStar(require_compile_from_ir3()));
        const a2 = compileSelect(node, model3);
        if (this.driver.stream) {
          yield* this.driver.stream(a2.sql, a2.params);
        } else {
          const [rows] = await this.driver.query(a2.sql, a2.params);
          for (const row of rows)
            yield row;
        }
      }
      async applyProjectionAndHydration() {
      }
      async $queryRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "mysql");
        const exec = this.handle(opts);
        const [rows] = await (0, errors_1.withMysqlErrors)(() => exec.query(sql, params));
        return rows;
      }
      async $executeRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "mysql");
        const exec = this.handle(opts);
        const [result] = await (0, errors_1.withMysqlErrors)(() => exec.execute(sql, params));
        return result.affectedRows ?? 0;
      }
      async $transaction(fn) {
        return this.driver.transaction((session) => fn(session));
      }
      coerceInbound(model3, data, _opts) {
        if (!data || typeof data !== "object")
          return data;
        const out = {};
        for (const [k, v2] of Object.entries(data)) {
          const field = model3?.fields?.[k];
          if (!field || v2 == null) {
            out[k] = v2;
            continue;
          }
          switch (field.kind) {
            case "bool":
              out[k] = v2 ? 1 : 0;
              break;
            case "json":
            case "embed":
            case "embedMany":
            case "stringArray":
            case "intArray":
              out[k] = typeof v2 === "object" ? JSON.stringify(v2) : v2;
              break;
            default:
              out[k] = v2;
          }
        }
        return out;
      }
      decodeOutbound(_model, row) {
        return row;
      }
      async applyCascadesForDelete() {
      }
      async refreshView(model3, opts) {
        const sql = model3?.view?.sql;
        if (!sql)
          throw new Error(`[forge:mysql] '${model3?.collection}' has no view SQL to refresh`);
        const q = "`" + String(model3.collection).replace(/`/g, "``") + "`";
        const run = async (c) => {
          await c.query(`DELETE FROM ${q}`);
          await c.query(`INSERT INTO ${q} ${sql}`);
        };
        if (opts?.session) {
          await run(opts.session);
          return;
        }
        await this.$transaction((s) => run(s));
      }
      async introspect() {
        const { introspectMysql } = await Promise.resolve().then(() => __importStar(require_introspect2()));
        return introspectMysql(this.pool);
      }
    };
    exports.MysqlAdapter = MysqlAdapter;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/errors.js
var require_errors4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowSqliteError = rethrowSqliteError;
    exports.withSqliteErrors = withSqliteErrors;
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var STRING_MAP = {
      // 23xxx-equivalent constraint failures — surfaced by SQLite as SQLITE_CONSTRAINT_*
      SQLITE_CONSTRAINT_UNIQUE: { code: "P2002", mk: (e) => `Unique constraint failed: ${e.message ?? ""}` },
      SQLITE_CONSTRAINT_PRIMARYKEY: { code: "P2002", mk: (e) => `Primary key constraint failed: ${e.message ?? ""}` },
      SQLITE_CONSTRAINT_FOREIGNKEY: { code: "P2003", mk: (e) => `Foreign key constraint failed: ${e.message ?? ""}` },
      SQLITE_CONSTRAINT_NOTNULL: { code: "P2011", mk: (e) => `Null constraint violation: ${e.message ?? ""}` },
      SQLITE_CONSTRAINT_CHECK: { code: "P2004", mk: (e) => `Check constraint failed: ${e.message ?? ""}` },
      SQLITE_CONSTRAINT_TRIGGER: { code: "P2004", mk: (e) => `Trigger constraint failed: ${e.message ?? ""}` },
      // schema / no such table or column
      SQLITE_ERROR: { code: "P2010", mk: (e) => e.message ?? "SQL error" },
      // database busy / locked → treat as deadlock-equivalent (caller should retry)
      SQLITE_BUSY: { code: "P2034", mk: () => "Database busy \u2014 please retry" },
      SQLITE_LOCKED: { code: "P2034", mk: () => "Database locked \u2014 please retry" },
      // i/o / connection
      SQLITE_IOERR: { code: "P1001", mk: (e) => `IO error: ${e.message ?? ""}` },
      SQLITE_CANTOPEN: { code: "P1001", mk: (e) => `Cannot open database file: ${e.message ?? ""}` }
    };
    function rethrowSqliteError(err) {
      if (!err || typeof err !== "object")
        throw err;
      if (err instanceof errors_1.DbKnownError)
        throw err;
      const code = err.code;
      if (!code)
        throw err;
      for (const k of Object.keys(STRING_MAP)) {
        if (code === k || code.startsWith(k + "_")) {
          const m2 = STRING_MAP[k];
          throw new errors_1.DbKnownError(m2.code, m2.mk(err), { sqliteCode: code, detail: err.message });
        }
      }
      throw err;
    }
    async function withSqliteErrors(op) {
      try {
        return await op();
      } catch (err) {
        rethrowSqliteError(err);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/execute.js
var require_execute4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/execute.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeRow = decodeRow;
    exports.executeSqliteSelect = executeSqliteSelect;
    exports.executeSqliteCount = executeSqliteCount;
    exports.executeSqliteGroupBy = executeSqliteGroupBy;
    exports.executeSqliteInsert = executeSqliteInsert;
    exports.executeSqliteUpdate = executeSqliteUpdate;
    exports.executeSqliteDelete = executeSqliteDelete;
    var schema_1 = require_schema();
    var compile_from_ir_1 = require_compile_from_ir4();
    var errors_1 = require_errors4();
    function decodeRow(model3, row) {
      if (!row || typeof row !== "object")
        return row;
      const out = {};
      for (const k of Object.keys(row)) {
        const field = model3.fields[k];
        if (!field) {
          out[k] = row[k];
          continue;
        }
        const v2 = row[k];
        if (v2 == null) {
          out[k] = v2;
          continue;
        }
        switch (field.kind) {
          case "bool":
            out[k] = v2 === 1 || v2 === true;
            break;
          case "dateTime":
            out[k] = typeof v2 === "string" ? new Date(v2) : v2;
            break;
          case "json":
          case "embed":
          case "embedMany":
          case "stringArray":
          case "intArray":
            out[k] = typeof v2 === "string" ? safeParse(v2) : v2;
            break;
          default:
            out[k] = v2;
        }
      }
      return out;
    }
    function safeParse(s) {
      try {
        return JSON.parse(s);
      } catch {
        return s;
      }
    }
    function encodeParams(params) {
      return params.map((v2) => {
        if (v2 == null)
          return v2;
        if (v2 instanceof Date)
          return v2.toISOString();
        if (typeof v2 === "boolean")
          return v2 ? 1 : 0;
        if (typeof v2 === "object" && !isBufferLike(v2) && !Array.isArray(v2)) {
          return JSON.stringify(v2);
        }
        if (Array.isArray(v2))
          return JSON.stringify(v2);
        return v2;
      });
    }
    function isBufferLike(v2) {
      if (v2 instanceof Uint8Array)
        return true;
      const B = globalThis.Buffer;
      return !!B && typeof B.isBuffer === "function" && B.isBuffer(v2);
    }
    async function executeSqliteSelect(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const raw = await (0, errors_1.withSqliteErrors)(() => exec.all(artifact.sql, encodeParams(artifact.params)));
      let rows = raw.map((r) => decodeRow(model3, r));
      if (node.distinct?.length)
        rows = dedupeBy(rows, node.distinct);
      const { extractFallbackGeoOps, applyHaversinePostFilter } = await Promise.resolve().then(() => __importStar(require_haversine()));
      const geoOps = extractFallbackGeoOps(node, model3);
      if (geoOps.near || geoOps.nearTo || geoOps.withinPolygon) {
        rows = applyHaversinePostFilter(rows, geoOps.near, geoOps.nearTo, geoOps.withinPolygon);
      }
      if (node.projection?.counts?.length)
        await applyRelationCounts(exec, rows, model3, node.projection.counts);
      if (node.hydration?.length)
        await hydrate(exec, rows, model3, node.hydration);
      return rows;
    }
    async function executeSqliteCount(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileCount)(node, model3);
      const r = await (0, errors_1.withSqliteErrors)(() => exec.get(artifact.sql, encodeParams(artifact.params)));
      return Number(r?.count ?? 0);
    }
    async function executeSqliteGroupBy(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const rows = await (0, errors_1.withSqliteErrors)(() => exec.all(artifact.sql, encodeParams(artifact.params)));
      return rows.map((r) => reshapeGroupByRow(r, node.by));
    }
    function reshapeGroupByRow(row, byCols) {
      const out = {};
      for (const c of byCols)
        out[c] = row[c];
      for (const k of Object.keys(row)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        out[`_${m2[1]}`] ??= {};
        out[`_${m2[1]}`][m2[2]] = row[k];
      }
      return out;
    }
    async function executeSqliteInsert(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileInsert)(node, model3);
      const raw = await (0, errors_1.withSqliteErrors)(() => exec.all(artifact.sql, encodeParams(artifact.params)));
      const docs = raw.map((r) => decodeRow(model3, r));
      return { docs, count: docs.length };
    }
    async function executeSqliteUpdate(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const raw = await (0, errors_1.withSqliteErrors)(() => exec.all(artifact.sql, encodeParams(artifact.params)));
      const decoded = raw.map((r) => decodeRow(model3, r));
      if (node.many)
        return { count: decoded.length };
      return { doc: decoded[0], count: decoded.length };
    }
    async function executeSqliteDelete(db, node, model3, opts = {}) {
      const exec = opts.db ?? db;
      const artifact = (0, compile_from_ir_1.compileDelete)(node, model3);
      const raw = await (0, errors_1.withSqliteErrors)(() => exec.all(artifact.sql, encodeParams(artifact.params)));
      const decoded = raw.map((r) => decodeRow(model3, r));
      if (node.many)
        return { count: decoded.length };
      return { doc: decoded[0], count: decoded.length };
    }
    async function hydrate(db, rows, parentModel, hydration) {
      if (rows.length === 0)
        return;
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && parentModel.fields[rel.on] != null;
        if (isOwningOne)
          await hydrateOne(
            db,
            rows,
            rel,
            targetModel,
            /*owning*/
            true
          );
        else if (rel.kind === "one")
          await hydrateOne(
            db,
            rows,
            rel,
            targetModel,
            /*owning*/
            false
          );
        else
          await hydrateMany(db, rows, rel, targetModel);
      }
    }
    async function hydrateOne(db, rows, rel, targetModel, owning) {
      const fromField = owning ? rel.on : rel.refs;
      const toField = owning ? rel.refs : rel.on;
      const fks = unique(rows.map((r) => r[fromField]).filter((v2) => v2 != null));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: toField, op: "in", value: fks },
        ...rel.nested ?? {}
      };
      const found = await executeSqliteSelect(db, subNode, targetModel);
      const byKey = /* @__PURE__ */ new Map();
      for (const t of found)
        byKey.set(String(t[toField]), t);
      for (const r of rows) {
        const k = r[fromField];
        r[rel.name] = k == null ? null : byKey.get(String(k)) ?? null;
      }
    }
    async function hydrateMany(db, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter((v2) => v2 != null));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const nestedWhere = rel.nested?.where;
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: refs };
      const where = nestedWhere ? { kind: "and", children: [nestedWhere, fkLeaf] } : fkLeaf;
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        ...rel.nested ?? {},
        where
      };
      const found = await executeSqliteSelect(db, subNode, targetModel);
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = String(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows)
        r[rel.name] = byParent.get(String(r[rel.refs])) ?? [];
    }
    async function applyRelationCounts(db, rows, parentModel, counts) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const refs = unique(rows.map((r) => r[rel.refs]).filter((v2) => v2 != null));
        if (refs.length === 0) {
          for (const r of rows)
            r._count[relName] = 0;
          continue;
        }
        const placeholders = refs.map(() => "?").join(", ");
        const sql = `SELECT "${rel.on}" AS fk, COUNT(*) AS c FROM "${targetModel.collection}" WHERE "${rel.on}" IN (${placeholders}) GROUP BY "${rel.on}"`;
        const groups = await (0, errors_1.withSqliteErrors)(() => db.all(sql, encodeParams(refs)));
        const byFk = /* @__PURE__ */ new Map();
        for (const g of groups)
          byFk.set(String(g.fk), Number(g.c));
        for (const r of rows)
          r._count[relName] = byFk.get(String(r[rel.refs])) ?? 0;
      }
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = String(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/driver.js
var require_driver3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.betterSqlite3Driver = betterSqlite3Driver;
    exports.expoSqliteDriver = expoSqliteDriver;
    exports.opSqliteDriver = opSqliteDriver;
    exports.libsqlDriver = libsqlDriver;
    exports.tauriSqlDriver = tauriSqlDriver;
    exports.isSqliteDriver = isSqliteDriver;
    function betterSqlite3Driver(db) {
      return {
        kind: "sqlite",
        all: async (sql, params) => db.prepare(sql).all(...params),
        get: async (sql, params) => db.prepare(sql).get(...params),
        run: async (sql, params) => {
          const r = db.prepare(sql).run(...params);
          return { changes: r.changes, lastInsertRowid: r.lastInsertRowid };
        },
        exec: async (sql) => {
          db.exec(sql);
        },
        close: async () => {
          db.close?.();
        },
        iterate: (sql, params) => db.prepare(sql).iterate(...params)
      };
    }
    function expoSqliteDriver(db) {
      return {
        kind: "sqlite",
        all: async (sql, params) => db.getAllAsync(sql, params),
        get: async (sql, params) => db.getFirstAsync(sql, params),
        run: async (sql, params) => {
          const r = await db.runAsync(sql, params);
          return { changes: r?.changes ?? 0, lastInsertRowid: r?.lastInsertRowId };
        },
        exec: async (sql) => {
          await db.execAsync(sql);
        },
        close: async () => {
          await db.closeAsync?.();
        }
      };
    }
    function opSqliteDriver(db) {
      const exec = async (sql, params) => {
        const r = await db.execute(sql, params);
        const rows = r?.rows?._array ?? r?.rows ?? [];
        return { rows, rowsAffected: r?.rowsAffected ?? 0, insertId: r?.insertId };
      };
      return {
        kind: "sqlite",
        all: async (sql, params) => (await exec(sql, params)).rows,
        get: async (sql, params) => (await exec(sql, params)).rows[0],
        run: async (sql, params) => {
          const r = await exec(sql, params);
          return { changes: r.rowsAffected, lastInsertRowid: r.insertId };
        },
        exec: async (sql) => {
          await db.execute(sql, []);
        },
        close: async () => {
          db.close?.();
        }
      };
    }
    function fromColumns(columns, row) {
      if (!columns)
        return row;
      const out = {};
      for (let i = 0; i < columns.length; i++)
        out[columns[i]] = row[i];
      return out;
    }
    function libsqlDriver(client) {
      const run = (sql, params) => client.execute(params.length ? { sql, args: params } : sql);
      return {
        kind: "sqlite",
        all: async (sql, params) => {
          const r = await run(sql, params);
          return r.rows.map((row) => fromColumns(r.columns, row));
        },
        get: async (sql, params) => {
          const r = await run(sql, params);
          return r.rows[0] ? fromColumns(r.columns, r.rows[0]) : void 0;
        },
        run: async (sql, params) => {
          const r = await run(sql, params);
          return { changes: Number(r.rowsAffected ?? 0), lastInsertRowid: r.lastInsertRowid };
        },
        exec: async (sql) => {
          await client.execute(sql);
        },
        close: async () => {
          client.close?.();
        }
      };
    }
    function tauriSqlDriver(db) {
      return {
        kind: "sqlite",
        all: async (sql, params) => await db.select(sql, params),
        get: async (sql, params) => {
          const rows = await db.select(sql, params);
          return rows[0];
        },
        run: async (sql, params) => {
          const r = await db.execute(sql, params);
          return { changes: r.rowsAffected ?? 0, lastInsertRowid: r.lastInsertId };
        },
        // Tauri's execute is one statement per call; the migrator emits batches
        // separated by `;`. Split defensively and drop empty tail segments so a
        // trailing newline / semicolon doesn't fire an empty `execute`.
        exec: async (sql) => {
          for (const stmt of sql.split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter(Boolean)) {
            await db.execute(stmt);
          }
        },
        close: async () => {
          await db.close?.();
        }
      };
    }
    function isSqliteDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "sqlite" && typeof v2.all === "function" && typeof v2.run === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/introspect.js
var require_introspect3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspectSqlite = introspectSqlite;
    async function introspectSqlite(db) {
      const q = (s) => `"${s.replace(/"/g, '""')}"`;
      const objects = await db.all(`SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'`, []);
      const tables = [];
      const views = [];
      for (const obj of objects) {
        if (obj.type === "view") {
          views.push({ name: obj.name, materialised: false });
          continue;
        }
        if (/_fts(_data|_idx|_content|_docsize|_config)?$/.test(obj.name))
          continue;
        const info = await db.all(`PRAGMA table_info(${q(obj.name)})`, []);
        const columns = info.map((c) => ({
          name: c.name,
          type: String(c.type || "").toLowerCase(),
          nullable: c.notnull === 0,
          default: c.dflt_value ?? void 0
        }));
        const indexList = await db.all(`PRAGMA index_list(${q(obj.name)})`, []);
        const indexes = [];
        for (const ix of indexList) {
          const cols = (await db.all(`PRAGMA index_info(${q(ix.name)})`, [])).map((c) => c.name);
          indexes.push({ name: ix.name, columns: cols, unique: ix.unique === 1 });
        }
        const fkList = await db.all(`PRAGMA foreign_key_list(${q(obj.name)})`, []);
        const foreignKeys = fkList.map((fk) => ({
          name: `fk_${obj.name}_${fk.from}`,
          column: fk.from,
          refTable: fk.table,
          refColumn: fk.to
        }));
        tables.push({ name: obj.name, columns, indexes, foreignKeys });
      }
      return { kind: "sqlite", tables, views };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/adapter.js
var require_adapter4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SqliteAdapter = void 0;
    exports.getDefaultSqliteAdapter = getDefaultSqliteAdapter;
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute4();
    var errors_1 = require_errors4();
    var dialect_1 = require_dialect3();
    var driver_1 = require_driver3();
    var CAPS = {
      nativeCascades: true,
      nativeUpsert: true,
      nullsOrdering: true,
      jsonPath: true,
      transactionsRequireReplicaSet: false
    };
    var SqliteAdapter = class {
      _injected;
      kind = "sqlite";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _db;
      _url;
      // An injected driver bypasses better-sqlite3 entirely (React Native / edge).
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          this._db = this._injected;
        } else {
          const filename = this._urlToFilename(url);
          const sqlite = (0, missing_driver_1.loadDriver)("sqlite", url);
          const Database = sqlite.default ?? sqlite;
          this._db = (0, driver_1.betterSqlite3Driver)(new Database(filename));
          await this._db.exec("PRAGMA journal_mode = WAL");
        }
        await this._db.exec("PRAGMA foreign_keys = ON");
        await this._tryLoadSpatialite();
      }
      async _tryLoadSpatialite() {
        if (!this._db)
          return;
        try {
          await this._db.exec("SELECT load_extension('mod_spatialite')");
        } catch {
        }
      }
      async close() {
        if (this._db)
          await this._db.close();
        this._db = void 0;
      }
      async doctor() {
        const injected = !!this._injected;
        const driver = injected ? { installed: true, version: void 0 } : (0, missing_driver_1.isDriverInstalled)("sqlite");
        return {
          kind: "sqlite",
          driverPackage: injected ? "(injected driver)" : "better-sqlite3",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            injected ? "Custom driver injected via createDb({ driver }) \u2014 e.g. expo-sqlite, op-sqlite, libsql." : 'Embedded \u2014 no server, no port. "Database" is the file you point at.',
            "Queries route through a normalized async driver port, so sync (better-sqlite3) and async (RN/edge) drivers share one code path."
          ]
        };
      }
      get db() {
        if (!this._db)
          throw new Error("[forge:sqlite] db accessed before connect() resolved");
        return this._db;
      }
      sqliteOpts(opts) {
        return opts?.session ? { db: opts.session } : {};
      }
      async _track(op, node, model3, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const c = await Promise.resolve().then(() => __importStar(require_compile_from_ir4()));
        const a2 = op === "select" ? c.compileSelect(node, model3) : op === "count" ? c.compileCount(node, model3) : op === "groupBy" ? c.compileGroupBy(node, model3) : op === "insert" ? c.compileInsert(node, model3) : op === "update" ? c.compileUpdate(node, model3) : c.compileDelete(node, model3);
        return this.emitter.track({ adapter: "sqlite", model: node.model ?? "", op, sql: a2.sql, params: a2.params, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, model3, () => (0, execute_1.executeSqliteSelect)(this.db, node, model3, this.sqliteOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, model3, () => (0, execute_1.executeSqliteCount)(this.db, node, model3, this.sqliteOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, model3, () => (0, execute_1.executeSqliteInsert)(this.db, node, model3, this.sqliteOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, model3, () => (0, execute_1.executeSqliteUpdate)(this.db, node, model3, this.sqliteOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, model3, () => (0, execute_1.executeSqliteDelete)(this.db, node, model3, this.sqliteOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, model3, () => (0, execute_1.executeSqliteGroupBy)(this.db, node, model3, this.sqliteOpts(opts)), (r) => r.length);
      }
      // Stream via the driver's native cursor when it exposes one (better-sqlite3
      // stmt.iterate()); otherwise materialise via all() — still one yield per row.
      async *streamSelect(node, model3, _opts) {
        const { compileSelect } = await Promise.resolve().then(() => __importStar(require_compile_from_ir4()));
        const { decodeRow } = await Promise.resolve().then(() => __importStar(require_execute4()));
        const a2 = compileSelect(node, model3);
        if (this.db.iterate) {
          for await (const row of this.db.iterate(a2.sql, a2.params))
            yield decodeRow(model3, row);
        } else {
          const rows = await this.db.all(a2.sql, a2.params);
          for (const row of rows)
            yield decodeRow(model3, row);
        }
      }
      async applyProjectionAndHydration() {
      }
      async $queryRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "sqlite");
        const exec = opts?.session ?? this.db;
        return (0, errors_1.withSqliteErrors)(() => exec.all(sql, params));
      }
      async $executeRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "sqlite");
        const exec = opts?.session ?? this.db;
        const r = await (0, errors_1.withSqliteErrors)(() => exec.run(sql, params));
        return r.changes;
      }
      // Drive BEGIN/COMMIT/ROLLBACK explicitly (portable across drivers). The driver
      // handle is passed back via ExecOpts.session so nested calls share the txn.
      async $transaction(fn) {
        await this.db.exec("BEGIN");
        try {
          const result = await fn(this.db);
          await this.db.exec("COMMIT");
          return result;
        } catch (err) {
          try {
            await this.db.exec("ROLLBACK");
          } catch {
          }
          throw err;
        }
      }
      coerceInbound(model3, data, _opts) {
        if (!data || typeof data !== "object")
          return data;
        const out = {};
        for (const [k, v2] of Object.entries(data)) {
          const field = model3?.fields?.[k];
          if (!field || v2 == null) {
            out[k] = v2;
            continue;
          }
          switch (field.kind) {
            case "bool":
              out[k] = v2 ? 1 : 0;
              break;
            case "dateTime":
              out[k] = v2 instanceof Date ? v2.toISOString() : v2;
              break;
            case "json":
            case "embed":
            case "embedMany":
            case "stringArray":
            case "intArray":
              out[k] = typeof v2 === "object" ? JSON.stringify(v2) : v2;
              break;
            default:
              out[k] = v2;
          }
        }
        return out;
      }
      decodeOutbound(_model, row) {
        return row;
      }
      async applyCascadesForDelete() {
      }
      // Table-backed materialised view refresh: clear + re-populate from the view's
      // SELECT body, in a transaction (portable BEGIN/COMMIT, no driver helper).
      async refreshView(model3, opts) {
        const sql = model3?.view?.sql;
        if (!sql)
          throw new Error(`[forge:sqlite] '${model3?.collection}' has no view SQL to refresh`);
        const db = opts?.session ?? this.db;
        const q = `"${String(model3.collection).replace(/"/g, '""')}"`;
        await db.exec("BEGIN");
        try {
          await db.exec(`DELETE FROM ${q}`);
          await db.exec(`INSERT INTO ${q} ${sql}`);
          await db.exec("COMMIT");
        } catch (err) {
          try {
            await db.exec("ROLLBACK");
          } catch {
          }
          throw err;
        }
      }
      async introspect() {
        const { introspectSqlite } = await Promise.resolve().then(() => __importStar(require_introspect3()));
        return introspectSqlite(this.db);
      }
      _urlToFilename(url) {
        if (url === "sqlite::memory:" || url === ":memory:")
          return ":memory:";
        const stripped = url.replace(/^sqlite:/, "").replace(/^file:/, "");
        if (stripped === "" || stripped === ":memory:")
          return ":memory:";
        return stripped;
      }
    };
    exports.SqliteAdapter = SqliteAdapter;
    var _default;
    function getDefaultSqliteAdapter() {
      if (!_default)
        _default = new SqliteAdapter();
      return _default;
    }
    void dialect_1.SqliteDialect;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/errors.js
var require_errors5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowDuckdbError = rethrowDuckdbError;
    exports.withDuckdbErrors = withDuckdbErrors;
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    function rethrowDuckdbError(err) {
      if (!err || typeof err !== "object")
        throw err;
      const e = err;
      const msg = String(e.message ?? "");
      const errType = String(e.errorType ?? "");
      if (err instanceof errors_1.DbKnownError)
        throw err;
      if (errType === "Constraint" || /Constraint Error/i.test(msg)) {
        if (/duplicate key|UNIQUE constraint|Primary key conflict/i.test(msg)) {
          throw new errors_1.DbKnownError("P2002", `Unique constraint failed: ${msg}`, { detail: msg });
        }
        if (/NOT NULL/i.test(msg)) {
          throw new errors_1.DbKnownError("P2011", `Null constraint violation: ${msg}`, { detail: msg });
        }
        if (/CHECK constraint/i.test(msg)) {
          throw new errors_1.DbKnownError("P2004", `Check constraint failed: ${msg}`, { detail: msg });
        }
        if (/foreign key/i.test(msg)) {
          throw new errors_1.DbKnownError("P2003", `Foreign key constraint failed: ${msg}`, { detail: msg });
        }
      }
      if (errType === "Catalog" || /Catalog Error/i.test(msg)) {
        if (/Table .* does not exist|table named/i.test(msg)) {
          throw new errors_1.DbKnownError("P2021", `Table does not exist: ${msg}`, { detail: msg });
        }
        if (/column .* does not exist|column named/i.test(msg)) {
          throw new errors_1.DbKnownError("P2022", `Column does not exist: ${msg}`, { detail: msg });
        }
      }
      if (errType === "Conversion" || /Conversion Error/i.test(msg)) {
        throw new errors_1.DbKnownError("P2007", `Data conversion failed: ${msg}`, { detail: msg });
      }
      throw err;
    }
    async function withDuckdbErrors(op) {
      try {
        return await op();
      } catch (err) {
        rethrowDuckdbError(err);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/execute.js
var require_execute5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/execute.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeDuckdbSelect = executeDuckdbSelect;
    exports.executeDuckdbGroupBy = executeDuckdbGroupBy;
    exports.executeDuckdbCount = executeDuckdbCount;
    exports.executeDuckdbInsert = executeDuckdbInsert;
    exports.executeDuckdbUpdate = executeDuckdbUpdate;
    exports.executeDuckdbDelete = executeDuckdbDelete;
    var schema_1 = require_schema();
    var compile_from_ir_1 = require_compile_from_ir5();
    var errors_1 = require_errors5();
    async function executeDuckdbSelect(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const { rows } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      let out = rows;
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      const { extractFallbackGeoOps, applyHaversinePostFilter } = await Promise.resolve().then(() => __importStar(require_haversine()));
      const geoOps = extractFallbackGeoOps(node, model3);
      if (geoOps.near || geoOps.nearTo || geoOps.withinPolygon) {
        out = applyHaversinePostFilter(out, geoOps.near, geoOps.nearTo, geoOps.withinPolygon);
      }
      if (node.projection?.counts?.length) {
        await applyRelationCounts(exec, out, model3, node.projection.counts);
      }
      if (node.hydration?.length) {
        await hydrate(exec, out, model3, node.hydration);
      }
      return out;
    }
    function reshapeGroupByRow(row, byCols) {
      const out = {};
      for (const c of byCols)
        out[c] = row[c];
      for (const k of Object.keys(row)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        const bucketKey = `_${m2[1]}`;
        const field = m2[2];
        out[bucketKey] ??= {};
        let val = row[k];
        if (val != null && typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val)) {
          val = Number(val);
        }
        out[bucketKey][field] = val;
      }
      return out;
    }
    async function executeDuckdbGroupBy(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const { rows } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      return rows.map((r) => reshapeGroupByRow(r, node.by));
    }
    async function executeDuckdbCount(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileCount)(node, model3);
      const { rows } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      return Number(rows[0]?.count ?? 0);
    }
    async function executeDuckdbInsert(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileInsert)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      return { docs: rows, count: rowCount ?? rows.length };
    }
    async function executeDuckdbUpdate(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function executeDuckdbDelete(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileDelete)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withDuckdbErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function hydrate(exec, rows, parentModel, hydration) {
      if (rows.length === 0)
        return;
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && parentModel.fields[rel.on] != null;
        if (isOwningOne)
          await hydrateOwningOne(exec, rows, rel, targetModel);
        else if (rel.kind === "one")
          await hydrateInverseOne(exec, rows, rel, targetModel);
        else
          await hydrateMany(exec, rows, rel, targetModel);
      }
    }
    async function hydrateOwningOne(exec, rows, rel, targetModel) {
      const fks = unique(rows.map((r) => r[rel.on]).filter(notNull));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.refs, op: "in", value: fks },
        ...rel.nested ?? {}
      };
      const found = await executeDuckdbSelect(exec, subNode, targetModel);
      const byRef = /* @__PURE__ */ new Map();
      for (const t of found)
        byRef.set(stringKey(t[rel.refs]), t);
      for (const r of rows) {
        const k = r[rel.on];
        r[rel.name] = k == null ? null : byRef.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateInverseOne(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        where: { kind: "leaf", field: rel.on, op: "in", value: refs },
        ...rel.nested ?? {}
      };
      const found = await executeDuckdbSelect(exec, subNode, targetModel);
      const byFk = /* @__PURE__ */ new Map();
      for (const t of found)
        byFk.set(stringKey(t[rel.on]), t);
      for (const r of rows) {
        const k = r[rel.refs];
        r[rel.name] = k == null ? null : byFk.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateMany(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const nestedWhere = rel.nested?.where;
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: refs };
      const where = nestedWhere ? { kind: "and", children: [nestedWhere, fkLeaf] } : fkLeaf;
      const subNode = {
        kind: "select",
        model: rel.target,
        cardinality: "many",
        ...rel.nested ?? {},
        where
      };
      const found = await executeDuckdbSelect(exec, subNode, targetModel);
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = stringKey(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows)
        r[rel.name] = byParent.get(stringKey(r[rel.refs])) ?? [];
    }
    async function applyRelationCounts(exec, rows, parentModel, counts) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
        if (refs.length === 0) {
          for (const row of rows)
            row._count[relName] = 0;
          continue;
        }
        const sql = `SELECT "${rel.on}" AS fk, CAST(COUNT(*) AS BIGINT) AS c FROM "${targetModel.collection}" WHERE "${rel.on}" = ANY($1) GROUP BY "${rel.on}"`;
        const { rows: groups } = await exec.query(sql, [refs]);
        const byFk = /* @__PURE__ */ new Map();
        for (const g of groups)
          byFk.set(stringKey(g.fk), Number(g.c));
        for (const row of rows)
          row._count[relName] = byFk.get(stringKey(row[rel.refs])) ?? 0;
      }
    }
    function notNull(v2) {
      return v2 != null;
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = stringKey(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function stringKey(v2) {
      if (v2 == null)
        return "\0";
      return String(v2);
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/driver.js
var require_driver4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.duckdbDriver = duckdbDriver;
    exports.isDuckdbDriver = isDuckdbDriver;
    function coerceParam(v2) {
      if (v2 == null)
        return v2;
      if (v2 instanceof Date)
        return v2.toISOString();
      if (typeof v2 === "object" && !Array.isArray(v2))
        return JSON.stringify(v2);
      return v2;
    }
    function coerceParams(params) {
      if (!params)
        return [];
      return params.map(coerceParam);
    }
    function duckdbDriver(connection) {
      const runQuery = async (sql, params) => {
        const result = await connection.run(sql, coerceParams(params));
        try {
          const rows = await result.getRowObjects();
          return { rows: Array.isArray(rows) ? rows : [], rowCount: rows?.length };
        } catch {
          return { rows: [] };
        }
      };
      return {
        kind: "duckdb",
        query: runQuery,
        async transaction(fn) {
          await connection.run("BEGIN TRANSACTION");
          try {
            const out = await fn({ query: runQuery });
            await connection.run("COMMIT");
            return out;
          } catch (err) {
            try {
              await connection.run("ROLLBACK");
            } catch {
            }
            throw err;
          }
        },
        async close() {
          if (typeof connection?.close === "function") {
            await connection.close();
          }
        }
      };
    }
    function isDuckdbDriver(v2) {
      return !!v2 && typeof v2 === "object" && typeof v2.query === "function" && typeof v2.transaction === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/introspect.js
var require_introspect4 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspectDuckdb = introspectDuckdb;
    async function introspectDuckdb(driver) {
      const tables = await driver.query(`SELECT table_name FROM duckdb_tables() WHERE schema_name = current_schema()`);
      const cols = await driver.query(`SELECT table_name, column_name, data_type, is_nullable, column_default
       FROM duckdb_columns() WHERE schema_name = current_schema()
       ORDER BY table_name, column_index`);
      const idx = await driver.query(`SELECT table_name, index_name, is_unique, sql
       FROM duckdb_indexes() WHERE schema_name = current_schema()`);
      const fks = await driver.query(`SELECT table_name, constraint_name, constraint_column_names, referenced_table, referenced_column_names
       FROM duckdb_constraints()
      WHERE schema_name = current_schema() AND constraint_type = 'FOREIGN KEY'`);
      const tableMap = /* @__PURE__ */ new Map();
      const ensure = (name) => {
        let t = tableMap.get(name);
        if (!t) {
          t = { name, columns: [], indexes: [], foreignKeys: [] };
          tableMap.set(name, t);
        }
        return t;
      };
      for (const r of tables.rows)
        ensure(r.table_name);
      for (const r of cols.rows) {
        ensure(r.table_name).columns.push(normalizeColumn(r));
      }
      for (const r of idx.rows) {
        const columns = parseIndexColumns(String(r.sql ?? ""));
        const ix = {
          name: r.index_name,
          columns,
          unique: !!r.is_unique
        };
        ensure(r.table_name).indexes.push(ix);
      }
      for (const r of fks.rows) {
        const onCols = Array.isArray(r.constraint_column_names) ? r.constraint_column_names : [];
        const refCols = Array.isArray(r.referenced_column_names) ? r.referenced_column_names : [];
        if (onCols.length && refCols.length) {
          ensure(r.table_name).foreignKeys.push({
            name: r.constraint_name,
            column: onCols[0],
            refTable: r.referenced_table,
            refColumn: refCols[0]
          });
        }
      }
      return {
        kind: "duckdb",
        tables: [...tableMap.values()],
        views: []
        // DuckDB views via duckdb_views() — not surfaced for diff yet.
      };
    }
    function normalizeColumn(r) {
      return {
        name: r.column_name,
        type: String(r.data_type).toLowerCase(),
        nullable: r.is_nullable === true,
        default: r.column_default ?? void 0
      };
    }
    function parseIndexColumns(sql) {
      const m2 = sql.match(/\(([^)]+)\)/);
      if (!m2)
        return [];
      return m2[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "").split(/\s+/)[0]).filter(Boolean);
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/adapter.js
var require_adapter5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/duckdb/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DuckdbAdapter = void 0;
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute5();
    var driver_1 = require_driver4();
    var CAPS = {
      nativeCascades: false,
      nativeUpsert: true,
      nullsOrdering: true,
      jsonPath: true,
      transactionsRequireReplicaSet: false
    };
    var DuckdbAdapter = class {
      _injected;
      kind = "duckdb";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _driver;
      _url;
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          this._driver = this._injected;
        } else {
          const ddb = (0, missing_driver_1.loadDriver)("duckdb", url);
          const path = url.replace(/^duckdb:(\/\/)?/, "") || ":memory:";
          const instance = await ddb.DuckDBInstance.create(path);
          const connection = await instance.connect();
          this._driver = (0, driver_1.duckdbDriver)(connection);
        }
        await this._driver.query("SELECT 1", []);
        try {
          await this._driver.query("INSTALL spatial", []);
          await this._driver.query("LOAD spatial", []);
        } catch {
        }
      }
      async close() {
        if (!this._driver)
          return;
        await this._driver.close();
        this._driver = void 0;
      }
      async doctor() {
        const injected = !!this._injected;
        const driver = injected ? { installed: true, version: void 0 } : (0, missing_driver_1.isDriverInstalled)("duckdb");
        return {
          kind: "duckdb",
          driverPackage: injected ? "(injected driver)" : "@duckdb/node-api",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            injected ? "Custom driver injected via createDb({ driver })." : "Driver: @duckdb/node-api. Embedded OLAP \u2014 single-writer concurrency model.",
            "Foreign keys are accepted at DDL time but NOT enforced at write time. Cascades go through forge's app-side walker.",
            "Full-text search via .searchable() falls back to ILIKE \u2014 install the fts extension and pre-build a docs_fts index for real search."
          ]
        };
      }
      get driver() {
        if (!this._driver)
          throw new Error("[forge:duckdb] driver accessed before connect() resolved");
        return this._driver;
      }
      duckdbOpts(opts) {
        return opts?.session ? { client: opts.session } : {};
      }
      async _track(op, node, model3, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const { compileSelect, compileCount, compileGroupBy, compileInsert, compileUpdate, compileDelete } = await Promise.resolve().then(() => __importStar(require_compile_from_ir5()));
        const artifact = op === "select" ? compileSelect(node, model3) : op === "count" ? compileCount(node, model3) : op === "groupBy" ? compileGroupBy(node, model3) : op === "insert" ? compileInsert(node, model3) : op === "update" ? compileUpdate(node, model3) : compileDelete(node, model3);
        return this.emitter.track({ adapter: "duckdb", model: node.model ?? "", op, sql: artifact.sql, params: artifact.params, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, model3, () => (0, execute_1.executeDuckdbSelect)(this.handle(opts), node, model3, this.duckdbOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, model3, () => (0, execute_1.executeDuckdbCount)(this.handle(opts), node, model3, this.duckdbOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, model3, () => (0, execute_1.executeDuckdbInsert)(this.handle(opts), node, model3, this.duckdbOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, model3, () => (0, execute_1.executeDuckdbUpdate)(this.handle(opts), node, model3, this.duckdbOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, model3, () => (0, execute_1.executeDuckdbDelete)(this.handle(opts), node, model3, this.duckdbOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, model3, () => (0, execute_1.executeDuckdbGroupBy)(this.handle(opts), node, model3, this.duckdbOpts(opts)), (r) => r.length);
      }
      handle(opts) {
        return opts?.session ?? this.driver;
      }
      async applyProjectionAndHydration() {
      }
      coerceInbound(model3, data, _opts) {
        if (!data || typeof data !== "object")
          return data;
        const out = {};
        for (const [k, v2] of Object.entries(data)) {
          const field = model3?.fields?.[k];
          if (field && (field.kind === "json" || field.kind === "embed" || field.kind === "embedMany") && v2 != null && typeof v2 === "object") {
            out[k] = JSON.stringify(v2);
          } else {
            out[k] = v2;
          }
        }
        return out;
      }
      decodeOutbound(_model, row) {
        return row;
      }
      async applyCascadesForDelete() {
      }
      async introspect() {
        const { introspectDuckdb } = await Promise.resolve().then(() => __importStar(require_introspect4()));
        return introspectDuckdb(this.driver);
      }
      async $queryRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withDuckdbErrors } = await Promise.resolve().then(() => __importStar(require_errors5()));
        const { rows } = await withDuckdbErrors(() => this.handle(opts).query(sql, params));
        return rows;
      }
      async $executeRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withDuckdbErrors } = await Promise.resolve().then(() => __importStar(require_errors5()));
        const { rowCount } = await withDuckdbErrors(() => this.handle(opts).query(sql, params));
        return rowCount ?? 0;
      }
      async $transaction(fn) {
        return this.driver.transaction((qc) => fn(qc));
      }
    };
    exports.DuckdbAdapter = DuckdbAdapter;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/errors.js
var require_errors6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbKnownError = void 0;
    exports.rethrowMssqlError = rethrowMssqlError;
    exports.withMssqlErrors = withMssqlErrors;
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var NUMBER_MAP = {
      // Unique key / primary key violations
      2627: { code: "P2002", build: (e) => `Unique constraint failed: ${e.message ?? ""}` },
      2601: { code: "P2002", build: (e) => `Unique constraint failed: ${e.message ?? ""}` },
      // Foreign key violations
      547: { code: "P2003", build: (e) => `Foreign key constraint failed: ${e.message ?? ""}` },
      // NOT NULL violation
      515: { code: "P2011", build: (e) => `Null constraint violation: ${e.message ?? ""}` },
      // CHECK violation surfaces as 547 historically; nothing else clean.
      // Invalid object name (table not found)
      208: { code: "P2021", build: (e) => `Table does not exist: ${e.message ?? ""}` },
      // Invalid column name
      207: { code: "P2022", build: (e) => `Column does not exist: ${e.message ?? ""}` },
      // Deadlock
      1205: { code: "P2034", build: () => `Transaction deadlock \u2014 please retry` },
      // Login failed
      18456: { code: "P1010", build: () => `Authentication failed for database user` }
    };
    function rethrowMssqlError(err) {
      if (!err || typeof err !== "object")
        throw err;
      if (err instanceof errors_1.DbKnownError)
        throw err;
      const e = err;
      const num = typeof e.number === "number" ? e.number : void 0;
      if (num != null && NUMBER_MAP[num]) {
        const m2 = NUMBER_MAP[num];
        throw new errors_1.DbKnownError(m2.code, m2.build(e), { number: num, detail: e.message });
      }
      throw err;
    }
    async function withMssqlErrors(op) {
      try {
        return await op();
      } catch (err) {
        rethrowMssqlError(err);
      }
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/execute.js
var require_execute6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/execute.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeMssqlSelect = executeMssqlSelect;
    exports.executeMssqlGroupBy = executeMssqlGroupBy;
    exports.executeMssqlCount = executeMssqlCount;
    exports.executeMssqlInsert = executeMssqlInsert;
    exports.executeMssqlUpdate = executeMssqlUpdate;
    exports.executeMssqlDelete = executeMssqlDelete;
    var schema_1 = require_schema();
    var compile_from_ir_1 = require_compile_from_ir6();
    var errors_1 = require_errors6();
    async function executeMssqlSelect(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileSelect)(node, model3);
      const { rows } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      let out = rows;
      if (node.distinct?.length)
        out = dedupeBy(out, node.distinct);
      const { extractFallbackGeoOps, applyHaversinePostFilter } = await Promise.resolve().then(() => __importStar(require_haversine()));
      const geoOps = extractFallbackGeoOps(node, model3);
      if (geoOps.near || geoOps.nearTo || geoOps.withinPolygon) {
        out = applyHaversinePostFilter(out, geoOps.near, geoOps.nearTo, geoOps.withinPolygon);
      }
      if (node.projection?.counts?.length) {
        await applyRelationCounts(exec, out, model3, node.projection.counts);
      }
      if (node.hydration?.length) {
        await hydrate(exec, out, model3, node.hydration);
      }
      return out;
    }
    function reshapeGroupByRow(row, byCols) {
      const out = {};
      for (const c of byCols)
        out[c] = row[c];
      for (const k of Object.keys(row)) {
        const m2 = k.match(/^__agg_(count|avg|sum|min|max)_(.+)$/);
        if (!m2)
          continue;
        const bucketKey = `_${m2[1]}`;
        out[bucketKey] ??= {};
        out[bucketKey][m2[2]] = row[k];
      }
      return out;
    }
    async function executeMssqlGroupBy(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileGroupBy)(node, model3);
      const { rows } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      return rows.map((r) => reshapeGroupByRow(r, node.by));
    }
    async function executeMssqlCount(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileCount)(node, model3);
      const { rows } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      return Number(rows[0]?.count ?? 0);
    }
    async function executeMssqlInsert(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileInsert)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      return { docs: rows, count: rowCount ?? rows.length };
    }
    async function executeMssqlUpdate(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileUpdate)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function executeMssqlDelete(driver, node, model3, opts = {}) {
      const exec = opts.client ?? driver;
      const artifact = (0, compile_from_ir_1.compileDelete)(node, model3);
      const { rows, rowCount } = await (0, errors_1.withMssqlErrors)(() => exec.query(artifact.sql, artifact.params));
      if (node.many)
        return { count: rowCount ?? rows.length };
      return { doc: rows[0], count: rows.length };
    }
    async function hydrate(exec, rows, parentModel, hydration) {
      if (rows.length === 0)
        return;
      for (const rel of hydration) {
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const isOwningOne = rel.kind === "one" && parentModel.fields[rel.on] != null;
        if (isOwningOne)
          await hydrateOwningOne(exec, rows, rel, targetModel);
        else if (rel.kind === "one")
          await hydrateInverseOne(exec, rows, rel, targetModel);
        else
          await hydrateMany(exec, rows, rel, targetModel);
      }
    }
    async function hydrateOwningOne(exec, rows, rel, targetModel) {
      const fks = unique(rows.map((r) => r[rel.on]).filter(notNull));
      if (fks.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = { kind: "select", model: rel.target, cardinality: "many", where: { kind: "leaf", field: rel.refs, op: "in", value: fks }, ...rel.nested ?? {} };
      const found = await executeMssqlSelect(exec, subNode, targetModel);
      const byRef = /* @__PURE__ */ new Map();
      for (const t of found)
        byRef.set(stringKey(t[rel.refs]), t);
      for (const r of rows) {
        const k = r[rel.on];
        r[rel.name] = k == null ? null : byRef.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateInverseOne(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = null;
        return;
      }
      const subNode = { kind: "select", model: rel.target, cardinality: "many", where: { kind: "leaf", field: rel.on, op: "in", value: refs }, ...rel.nested ?? {} };
      const found = await executeMssqlSelect(exec, subNode, targetModel);
      const byFk = /* @__PURE__ */ new Map();
      for (const t of found)
        byFk.set(stringKey(t[rel.on]), t);
      for (const r of rows) {
        const k = r[rel.refs];
        r[rel.name] = k == null ? null : byFk.get(stringKey(k)) ?? null;
      }
    }
    async function hydrateMany(exec, rows, rel, targetModel) {
      const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
      if (refs.length === 0) {
        for (const r of rows)
          r[rel.name] = [];
        return;
      }
      const nestedWhere = rel.nested?.where;
      const fkLeaf = { kind: "leaf", field: rel.on, op: "in", value: refs };
      const where = nestedWhere ? { kind: "and", children: [nestedWhere, fkLeaf] } : fkLeaf;
      const subNode = { kind: "select", model: rel.target, cardinality: "many", ...rel.nested ?? {}, where };
      const found = await executeMssqlSelect(exec, subNode, targetModel);
      const byParent = /* @__PURE__ */ new Map();
      for (const t of found) {
        const k = stringKey(t[rel.on]);
        const list = byParent.get(k);
        if (list)
          list.push(t);
        else
          byParent.set(k, [t]);
      }
      for (const r of rows)
        r[rel.name] = byParent.get(stringKey(r[rel.refs])) ?? [];
    }
    async function applyRelationCounts(exec, rows, parentModel, counts) {
      if (rows.length === 0)
        return;
      const relMap = parentModel.relations();
      for (const r of rows)
        r._count = r._count ?? {};
      for (const relName of counts) {
        const rel = relMap[relName];
        if (!rel)
          continue;
        const targetModel = schema_1.schema[rel.target];
        if (!targetModel)
          continue;
        const refs = unique(rows.map((r) => r[rel.refs]).filter(notNull));
        if (refs.length === 0) {
          for (const row of rows)
            row._count[relName] = 0;
          continue;
        }
        const placeholders = refs.map((_, i) => `@p${i + 1}`).join(", ");
        const sqlText = `SELECT [${rel.on}] AS fk, COUNT(*) AS c FROM [${targetModel.collection}] WHERE [${rel.on}] IN (${placeholders}) GROUP BY [${rel.on}]`;
        const { rows: groups } = await exec.query(sqlText, refs);
        const byFk = /* @__PURE__ */ new Map();
        for (const g of groups)
          byFk.set(stringKey(g.fk), Number(g.c));
        for (const row of rows)
          row._count[relName] = byFk.get(stringKey(row[rel.refs])) ?? 0;
      }
    }
    function notNull(v2) {
      return v2 != null;
    }
    function unique(arr) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of arr) {
        const k = stringKey(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
    function stringKey(v2) {
      if (v2 == null)
        return "\0";
      return String(v2);
    }
    function dedupeBy(rows, fields) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const r of rows) {
        const k = fields.map((f3) => JSON.stringify(r[f3] ?? null)).join("");
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(r);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/driver.js
var require_driver5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mssqlDriver = mssqlDriver;
    exports.isMssqlDriver = isMssqlDriver;
    function mssqlDriver(pool) {
      const runQuery = async (sqlText, params) => {
        const request = pool.request();
        if (params) {
          for (let i = 0; i < params.length; i++) {
            request.input(`p${i + 1}`, params[i]);
          }
        }
        const result = await request.query(sqlText);
        const rows = Array.isArray(result?.recordset) ? result.recordset : [];
        const rowCount = typeof result?.rowsAffected === "object" && Array.isArray(result.rowsAffected) ? result.rowsAffected.reduce((s, n) => s + n, 0) : result?.rowsAffected ?? rows.length;
        return { rows, rowCount };
      };
      return {
        kind: "mssql",
        query: runQuery,
        async transaction(fn) {
          const tx = pool.transaction();
          await tx.begin();
          try {
            const out = await fn({
              query: async (sqlText, params) => {
                const req = tx.request();
                if (params) {
                  for (let i = 0; i < params.length; i++) {
                    req.input(`p${i + 1}`, params[i]);
                  }
                }
                const result = await req.query(sqlText);
                const rows = Array.isArray(result?.recordset) ? result.recordset : [];
                const rowCount = typeof result?.rowsAffected === "object" && Array.isArray(result.rowsAffected) ? result.rowsAffected.reduce((s, n) => s + n, 0) : result?.rowsAffected ?? rows.length;
                return { rows, rowCount };
              }
            });
            await tx.commit();
            return out;
          } catch (err) {
            try {
              await tx.rollback();
            } catch {
            }
            throw err;
          }
        },
        async close() {
          if (typeof pool?.close === "function") {
            await pool.close();
          }
        }
      };
    }
    function isMssqlDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "mssql" && typeof v2.query === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/introspect.js
var require_introspect5 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspectMssql = introspectMssql;
    async function introspectMssql(driver) {
      const tables = await driver.query(`SELECT t.name AS table_name FROM sys.tables t
       JOIN sys.schemas s ON s.schema_id = t.schema_id
       WHERE s.name = SCHEMA_NAME()`);
      const cols = await driver.query(`SELECT c.TABLE_NAME AS table_name, c.COLUMN_NAME AS column_name,
            c.DATA_TYPE AS data_type, c.IS_NULLABLE AS is_nullable,
            c.COLUMN_DEFAULT AS column_default
       FROM INFORMATION_SCHEMA.COLUMNS c
      WHERE c.TABLE_SCHEMA = SCHEMA_NAME()
      ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION`);
      const idx = await driver.query(`SELECT t.name AS table_name, i.name AS index_name, i.is_unique AS is_unique,
            STUFF((
              SELECT ',' + c.name FROM sys.index_columns ic
                JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
                ORDER BY ic.key_ordinal
                FOR XML PATH('')
            ), 1, 1, '') AS cols
       FROM sys.indexes i
       JOIN sys.tables  t ON t.object_id = i.object_id
       JOIN sys.schemas s ON s.schema_id = t.schema_id
      WHERE s.name = SCHEMA_NAME() AND i.is_primary_key = 0 AND i.name IS NOT NULL`);
      const fks = await driver.query(`SELECT fk.name AS constraint_name, t.name AS table_name,
            cpa.name AS column_name, rt.name AS ref_table, cref.name AS ref_column
       FROM sys.foreign_keys fk
       JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
       JOIN sys.tables  t  ON t.object_id  = fk.parent_object_id
       JOIN sys.tables  rt ON rt.object_id = fk.referenced_object_id
       JOIN sys.columns cpa  ON cpa.object_id = fk.parent_object_id     AND cpa.column_id = fkc.parent_column_id
       JOIN sys.columns cref ON cref.object_id = fk.referenced_object_id AND cref.column_id = fkc.referenced_column_id
       JOIN sys.schemas s  ON s.schema_id = t.schema_id
      WHERE s.name = SCHEMA_NAME()`);
      const tableMap = /* @__PURE__ */ new Map();
      const ensure = (name) => {
        let t = tableMap.get(name);
        if (!t) {
          t = { name, columns: [], indexes: [], foreignKeys: [] };
          tableMap.set(name, t);
        }
        return t;
      };
      for (const r of tables.rows)
        ensure(r.table_name);
      for (const r of cols.rows)
        ensure(r.table_name).columns.push(normalizeColumn(r));
      for (const r of idx.rows) {
        const columns = String(r.cols ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        const ix = { name: r.index_name, columns, unique: !!r.is_unique };
        ensure(r.table_name).indexes.push(ix);
      }
      for (const r of fks.rows) {
        ensure(r.table_name).foreignKeys.push({
          name: r.constraint_name,
          column: r.column_name,
          refTable: r.ref_table,
          refColumn: r.ref_column
        });
      }
      return { kind: "mssql", tables: [...tableMap.values()], views: [] };
    }
    function normalizeColumn(r) {
      return {
        name: r.column_name,
        type: String(r.data_type).toLowerCase(),
        nullable: r.is_nullable === "YES",
        default: r.column_default ?? void 0
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/adapter.js
var require_adapter6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mssql/adapter.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MssqlAdapter = void 0;
    var events_1 = require_events();
    var missing_driver_1 = require_missing_driver();
    var execute_1 = require_execute6();
    var driver_1 = require_driver5();
    var CAPS = {
      nativeCascades: true,
      // upsert is NOT supported in 2.3 — see compile-from-ir.ts. Reporting
      // false here so the wrapper layer can pick a safe fallback strategy if
      // it ever guards on this capability.
      nativeUpsert: false,
      nullsOrdering: false,
      // T-SQL needs the CASE-WHEN workaround
      jsonPath: true,
      // via JSON_VALUE / OPENJSON
      transactionsRequireReplicaSet: false
    };
    var MssqlAdapter = class {
      _injected;
      kind = "mssql";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _driver;
      _url;
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        if (this._injected) {
          this._driver = this._injected;
        } else {
          const sql = (0, missing_driver_1.loadDriver)("mssql", url);
          const pool = await sql.connect(url);
          this._driver = (0, driver_1.mssqlDriver)(pool);
        }
        await this._driver.query("SELECT 1", []);
      }
      async close() {
        if (!this._driver)
          return;
        await this._driver.close();
        this._driver = void 0;
      }
      async doctor() {
        const injected = !!this._injected;
        const driver = injected ? { installed: true, version: void 0 } : (0, missing_driver_1.isDriverInstalled)("mssql");
        return {
          kind: "mssql",
          driverPackage: injected ? "(injected driver)" : "mssql",
          driverInstalled: driver.installed,
          driverVersion: driver.version,
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            injected ? "Custom driver injected via createDb({ driver })." : "Driver: mssql (Tedious under the hood). Native cascades via FK clauses.",
            "Upsert / ON CONFLICT is NOT supported in 2.3 \u2014 the T-SQL MERGE rewrite lands in v2.4.",
            ".searchable() falls back to LIKE \u2014 install full-text catalogs for production search."
          ]
        };
      }
      get driver() {
        if (!this._driver)
          throw new Error("[forge:mssql] driver accessed before connect() resolved");
        return this._driver;
      }
      mssqlOpts(opts) {
        return opts?.session ? { client: opts.session } : {};
      }
      async _track(op, node, model3, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        const { compileSelect, compileCount, compileGroupBy, compileInsert, compileUpdate, compileDelete } = await Promise.resolve().then(() => __importStar(require_compile_from_ir6()));
        const artifact = op === "select" ? compileSelect(node, model3) : op === "count" ? compileCount(node, model3) : op === "groupBy" ? compileGroupBy(node, model3) : op === "insert" ? compileInsert(node, model3) : op === "update" ? compileUpdate(node, model3) : compileDelete(node, model3);
        return this.emitter.track({ adapter: "mssql", model: node.model ?? "", op, sql: artifact.sql, params: artifact.params, ...semanticOp ? { semanticOp } : {} }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, model3, () => (0, execute_1.executeMssqlSelect)(this.handle(opts), node, model3, this.mssqlOpts(opts)), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, model3, () => (0, execute_1.executeMssqlCount)(this.handle(opts), node, model3, this.mssqlOpts(opts)), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, model3, () => (0, execute_1.executeMssqlInsert)(this.handle(opts), node, model3, this.mssqlOpts(opts)), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, model3, () => (0, execute_1.executeMssqlUpdate)(this.handle(opts), node, model3, this.mssqlOpts(opts)), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, model3, () => (0, execute_1.executeMssqlDelete)(this.handle(opts), node, model3, this.mssqlOpts(opts)), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, model3, () => (0, execute_1.executeMssqlGroupBy)(this.handle(opts), node, model3, this.mssqlOpts(opts)), (r) => r.length);
      }
      handle(opts) {
        return opts?.session ?? this.driver;
      }
      async applyProjectionAndHydration() {
      }
      coerceInbound(model3, data, _opts) {
        if (!data || typeof data !== "object")
          return data;
        const out = {};
        for (const [k, v2] of Object.entries(data)) {
          const field = model3?.fields?.[k];
          if (field && (field.kind === "json" || field.kind === "embed" || field.kind === "embedMany" || field.kind === "stringArray" || field.kind === "intArray") && v2 != null && typeof v2 === "object") {
            out[k] = JSON.stringify(v2);
          } else {
            out[k] = v2;
          }
        }
        return out;
      }
      decodeOutbound(_model, row) {
        return row;
      }
      async applyCascadesForDelete() {
      }
      async introspect() {
        const { introspectMssql } = await Promise.resolve().then(() => __importStar(require_introspect5()));
        return introspectMssql(this.driver);
      }
      async $queryRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withMssqlErrors } = await Promise.resolve().then(() => __importStar(require_errors6()));
        const { rows } = await withMssqlErrors(() => this.handle(opts).query(sql, params));
        return rows;
      }
      async $executeRaw(fragment, opts) {
        const { compileSqlFragment } = await Promise.resolve().then(() => __importStar(require_raw_sql()));
        const { sql, params } = compileSqlFragment(fragment, "postgres");
        const { withMssqlErrors } = await Promise.resolve().then(() => __importStar(require_errors6()));
        const { rowCount } = await withMssqlErrors(() => this.handle(opts).query(sql, params));
        return rowCount ?? 0;
      }
      async $transaction(fn) {
        return this.driver.transaction((qc) => fn(qc));
      }
    };
    exports.MssqlAdapter = MssqlAdapter;
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/range.js
var require_range = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/range.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.leafToRange = leafToRange;
    exports.compoundEqualityRange = compoundEqualityRange;
    exports.compoundPrefixRange = compoundPrefixRange;
    function leafToRange(leaf) {
      const { op, value } = leaf;
      switch (op) {
        case "eq":
          if (value === null || value === void 0)
            return null;
          return { range: IDBKeyRange.only(value), direction: "next" };
        case "in": {
          if (!Array.isArray(value) || value.length === 0)
            return null;
          const ranges = value.filter((v2) => v2 !== null && v2 !== void 0).map((v2) => IDBKeyRange.only(v2));
          if (ranges.length === 0)
            return null;
          return { range: ranges[0], ranges, direction: "next" };
        }
        case "lt":
          return { range: IDBKeyRange.upperBound(value, true), direction: "next" };
        case "lte":
          return { range: IDBKeyRange.upperBound(value, false), direction: "next" };
        case "gt":
          return { range: IDBKeyRange.lowerBound(value, true), direction: "next" };
        case "gte":
          return { range: IDBKeyRange.lowerBound(value, false), direction: "next" };
        case "startsWith": {
          if (typeof value !== "string")
            return null;
          const lower = value;
          const upper = value + "\uFFFF";
          return {
            range: IDBKeyRange.bound(lower, upper, false, true),
            direction: "next"
          };
        }
        // ne / contains / endsWith / has / hasSome / hasEvery / isEmpty / jsonPath /
        // search / near / withinPolygon: no key-range form — predicate scan only.
        default:
          return null;
      }
    }
    function compoundEqualityRange(values) {
      return { range: IDBKeyRange.only(values), direction: "next" };
    }
    function compoundPrefixRange(prefix) {
      const lower = [...prefix, -Infinity];
      const upper = [...prefix, "zzzzzzzzzz\uFFFF"];
      return {
        range: IDBKeyRange.bound(lower, upper, false, false),
        direction: "next"
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/predicate.js
var require_predicate = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/predicate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ALWAYS_TRUE = void 0;
    exports.compilePredicate = compilePredicate;
    var ALWAYS_TRUE = () => true;
    exports.ALWAYS_TRUE = ALWAYS_TRUE;
    function compilePredicate(tree) {
      if (!tree)
        return exports.ALWAYS_TRUE;
      switch (tree.kind) {
        case "leaf":
          return compileLeaf(tree);
        case "and": {
          const parts = tree.children.map(compilePredicate);
          return (r) => parts.every((p2) => p2(r));
        }
        case "or": {
          const parts = tree.children.map(compilePredicate);
          return (r) => parts.some((p2) => p2(r));
        }
        case "not": {
          const p2 = compilePredicate(tree.child);
          return (r) => !p2(r);
        }
        case "relation":
          return exports.ALWAYS_TRUE;
      }
    }
    function compileLeaf(leaf) {
      const { field, op, value, caseInsensitive } = leaf;
      const get = getter(field);
      switch (op) {
        case "eq":
          return (r) => eqValue(get(r), value, caseInsensitive);
        case "ne":
          return (r) => !eqValue(get(r), value, caseInsensitive);
        case "lt":
          return (r) => cmp(get(r), value) < 0;
        case "lte":
          return (r) => cmp(get(r), value) <= 0;
        case "gt":
          return (r) => cmp(get(r), value) > 0;
        case "gte":
          return (r) => cmp(get(r), value) >= 0;
        case "in":
          return (r) => Array.isArray(value) && value.some((v2) => eqValue(get(r), v2, caseInsensitive));
        case "nin":
          return (r) => Array.isArray(value) && !value.some((v2) => eqValue(get(r), v2, caseInsensitive));
        case "contains":
          return (r) => stringOp(get(r), value, caseInsensitive, (a2, b2) => a2.includes(b2));
        case "startsWith":
          return (r) => stringOp(get(r), value, caseInsensitive, (a2, b2) => a2.startsWith(b2));
        case "endsWith":
          return (r) => stringOp(get(r), value, caseInsensitive, (a2, b2) => a2.endsWith(b2));
        case "has":
          return (r) => Array.isArray(get(r)) && get(r).some((x2) => eqValue(x2, value, caseInsensitive));
        case "hasSome":
          return (r) => Array.isArray(get(r)) && Array.isArray(value) && value.some((v2) => get(r).some((x2) => eqValue(x2, v2, caseInsensitive)));
        case "hasEvery":
          return (r) => Array.isArray(get(r)) && Array.isArray(value) && value.every((v2) => get(r).some((x2) => eqValue(x2, v2, caseInsensitive)));
        case "isEmpty":
          return (r) => {
            const v2 = get(r);
            const wantEmpty = !!value;
            const isEmpty = v2 == null || Array.isArray(v2) && v2.length === 0;
            return wantEmpty ? isEmpty : !isEmpty;
          };
        case "jsonPath": {
          if (!leaf.jsonPath)
            return () => false;
          const { path, subOp } = leaf.jsonPath;
          const nestedGet = (r) => walkPath(get(r), path);
          return (r) => {
            const at = nestedGet(r);
            switch (subOp) {
              case "eq":
                return eqValue(at, value);
              case "ne":
                return !eqValue(at, value);
              case "lt":
                return cmp(at, value) < 0;
              case "lte":
                return cmp(at, value) <= 0;
              case "gt":
                return cmp(at, value) > 0;
              case "gte":
                return cmp(at, value) >= 0;
              case "contains":
                return typeof at === "string" && typeof value === "string" && at.includes(value);
              case "in":
                return Array.isArray(value) && value.some((v2) => eqValue(at, v2));
              case "has":
                return Array.isArray(at) && at.some((x2) => eqValue(x2, value));
              default:
                return false;
            }
          };
        }
        // Handled by fallback paths, not this compiler:
        case "search":
        case "near":
        case "withinPolygon":
          return exports.ALWAYS_TRUE;
      }
    }
    function getter(field) {
      if (!field.includes("."))
        return (r) => r[field];
      const parts = field.split(".");
      return (r) => walkPath(r, parts);
    }
    function walkPath(root, parts) {
      let cur = root;
      for (const p2 of parts) {
        if (cur == null)
          return void 0;
        cur = cur[p2];
      }
      return cur;
    }
    function eqValue(a2, b2, ci) {
      if (a2 === b2)
        return true;
      if (a2 == null || b2 == null)
        return a2 == b2;
      if (a2 instanceof Date && b2 instanceof Date)
        return a2.getTime() === b2.getTime();
      if (a2 instanceof Date && typeof b2 === "string")
        return a2.getTime() === Date.parse(b2);
      if (typeof a2 === "string" && typeof b2 === "string" && ci)
        return a2.toLowerCase() === b2.toLowerCase();
      return false;
    }
    function cmp(a2, b2) {
      if (a2 == null && b2 == null)
        return 0;
      if (a2 == null)
        return -1;
      if (b2 == null)
        return 1;
      if (a2 instanceof Date && b2 instanceof Date)
        return a2.getTime() - b2.getTime();
      if (a2 instanceof Date && typeof b2 === "string")
        return a2.getTime() - Date.parse(b2);
      if (typeof a2 === "number" && typeof b2 === "number")
        return a2 - b2;
      if (typeof a2 === "string" && typeof b2 === "string")
        return a2 < b2 ? -1 : a2 > b2 ? 1 : 0;
      return 0;
    }
    function stringOp(av, bv, ci, fn) {
      if (typeof av !== "string" || typeof bv !== "string")
        return false;
      return ci ? fn(av.toLowerCase(), bv.toLowerCase()) : fn(av, bv);
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/planner.js
var require_planner = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/planner.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.planSelect = planSelect;
    exports.primaryKeyField = primaryKeyField;
    var range_1 = require_range();
    var predicate_1 = require_predicate();
    function planSelect(model3, where, orderBy) {
      const indexes = allIndexes(model3);
      const leaves = topLevelAndLeaves(where);
      const primary = pickPrimaryKeyLeaf(model3, leaves);
      const orderField = orderBy && orderBy.length === 1 ? orderBy[0] : void 0;
      let best = {
        range: null,
        residual: (0, predicate_1.compilePredicate)(where),
        score: 0,
        explain: "full-table scan"
      };
      if (primary) {
        const range = (0, range_1.leafToRange)(primary.leaf);
        if (range) {
          best = {
            indexName: void 0,
            // primary-key cursor
            range,
            residual: (0, predicate_1.compilePredicate)(removeLeaf(where, primary.leaf)),
            score: 100,
            explain: `primary-key ${primary.leaf.op} on '${primary.leaf.field}'`
          };
        }
      }
      for (const idx of indexes) {
        const cand = scoreIndex(idx, leaves, orderField);
        if (!cand)
          continue;
        if (cand.score > best.score) {
          best = {
            indexName: cand.name,
            range: cand.range,
            residual: (0, predicate_1.compilePredicate)(removeLeaves(where, cand.usedLeaves)),
            score: cand.score,
            orderByFree: cand.orderByFree,
            explain: cand.explain
          };
        }
      }
      if (best.score === 0 && orderField) {
        for (const idx of indexes) {
          const keys = Object.keys(idx.keys);
          if (keys.length === 1 && keys[0] === orderField.field) {
            best = {
              indexName: idx.name ?? autoIndexName(idx),
              range: { range: null, direction: orderField.direction === "desc" ? "prev" : "next" },
              residual: (0, predicate_1.compilePredicate)(where),
              score: 20,
              orderByFree: orderField.direction,
              explain: `full scan via '${orderField.field}' index for free sort`
            };
          }
        }
      }
      return best;
    }
    function topLevelAndLeaves(w) {
      if (!w)
        return [];
      if (w.kind === "leaf")
        return [w];
      if (w.kind === "and") {
        const out = [];
        for (const child of w.children) {
          if (child.kind === "leaf")
            out.push(child);
        }
        return out;
      }
      return [];
    }
    function pickPrimaryKeyLeaf(model3, leaves) {
      const pkField = primaryKeyField(model3);
      const l = leaves.find((x2) => x2.field === pkField && (x2.op === "eq" || x2.op === "in"));
      return l ? { leaf: l } : null;
    }
    function primaryKeyField(model3) {
      for (const [name, def] of Object.entries(model3.fields)) {
        if (def.kind === "id")
          return name;
      }
      return "id";
    }
    function scoreIndex(idx, leaves, orderField) {
      const keys = Object.keys(idx.keys);
      const name = idx.name ?? autoIndexName(idx);
      if (keys.length > 1) {
        const values = [];
        const used = [];
        for (const k of keys) {
          const l = leaves.find((x2) => x2.field === k && x2.op === "eq");
          if (!l)
            break;
          values.push(l.value);
          used.push(l);
        }
        if (values.length === keys.length) {
          return {
            name,
            score: idx.unique ? 95 : 85,
            range: (0, range_1.compoundEqualityRange)(values),
            usedLeaves: used,
            explain: `compound eq on [${keys.join(",")}]`
          };
        }
        return null;
      }
      const [col] = keys;
      const eqLeaf = leaves.find((x2) => x2.field === col && x2.op === "eq");
      if (eqLeaf) {
        const r = (0, range_1.leafToRange)(eqLeaf);
        if (!r)
          return null;
        return {
          name,
          score: idx.unique ? 90 : 70,
          range: r,
          usedLeaves: [eqLeaf],
          explain: `${idx.unique ? "unique " : ""}eq on '${col}'`
        };
      }
      const inLeaf = leaves.find((x2) => x2.field === col && x2.op === "in");
      if (inLeaf) {
        const r = (0, range_1.leafToRange)(inLeaf);
        if (!r)
          return null;
        return {
          name,
          score: 60,
          range: r,
          usedLeaves: [inLeaf],
          explain: `in on '${col}' (${inLeaf.value.length} points)`
        };
      }
      const rangeLeaf = leaves.find((x2) => x2.field === col && ["lt", "lte", "gt", "gte", "startsWith"].includes(x2.op));
      if (rangeLeaf) {
        const r = (0, range_1.leafToRange)(rangeLeaf);
        if (!r)
          return null;
        return {
          name,
          score: 50,
          range: r,
          usedLeaves: [rangeLeaf],
          explain: `${rangeLeaf.op} on '${col}'`
        };
      }
      if (orderField && orderField.field === col) {
        return {
          name,
          score: 20,
          range: { range: null, direction: orderField.direction === "desc" ? "prev" : "next" },
          usedLeaves: [],
          orderByFree: orderField.direction,
          explain: `free sort on '${col}'`
        };
      }
      return null;
    }
    function allIndexes(model3) {
      const out = [];
      const pk = primaryKeyField(model3);
      for (const [name, def] of Object.entries(model3.fields)) {
        if (name === pk)
          continue;
        if (def.unique) {
          out.push({ keys: { [name]: 1 }, unique: true, name: `_u_${name}` });
        }
      }
      for (const combo of model3.uniques ?? []) {
        const keys = {};
        for (const c of combo)
          keys[c] = 1;
        out.push({ keys, unique: true, name: `_u_${combo.join("_")}` });
      }
      for (const idx of model3.indexes ?? [])
        out.push(idx);
      return out;
    }
    function autoIndexName(idx) {
      const keys = Object.keys(idx.keys);
      return (idx.unique ? "_u_" : "_i_") + keys.join("_");
    }
    function removeLeaf(w, leaf) {
      return removeLeaves(w, [leaf]);
    }
    function removeLeaves(w, leaves) {
      if (!w)
        return void 0;
      if (w.kind === "leaf")
        return leaves.includes(w) ? void 0 : w;
      if (w.kind === "and") {
        const kept = w.children.map((c) => removeLeaves(c, leaves)).filter(Boolean);
        if (kept.length === 0)
          return void 0;
        if (kept.length === 1)
          return kept[0];
        return { kind: "and", children: kept };
      }
      return w;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/ddl.js
var require_ddl = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/ddl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildDDLPlan = buildDDLPlan;
    exports.buildStoreDDL = buildStoreDDL;
    exports.fingerprint = fingerprint;
    var planner_1 = require_planner();
    function buildDDLPlan(schema) {
      const stores = [];
      for (const key of Object.keys(schema)) {
        const model3 = schema[key];
        if (!model3 || model3.view)
          continue;
        stores.push(buildStoreDDL(model3));
      }
      return { stores, meta: { fingerprint: fingerprint(stores) } };
    }
    function buildStoreDDL(model3) {
      const pk = (0, planner_1.primaryKeyField)(model3);
      const indexes = [];
      for (const [name, def] of Object.entries(model3.fields)) {
        if (name === pk)
          continue;
        if (def.unique) {
          indexes.push({
            name: `_u_${name}`,
            keyPath: name,
            unique: true,
            multiEntry: isArrayField(def)
          });
        }
      }
      for (const combo of model3.uniques ?? []) {
        indexes.push({
          name: `_u_${combo.join("_")}`,
          keyPath: combo,
          unique: true,
          multiEntry: false
        });
      }
      for (const idx of model3.indexes ?? []) {
        const keys = Object.keys(idx.keys);
        indexes.push({
          name: idx.name ?? autoIndexName(keys, idx),
          keyPath: keys.length === 1 ? keys[0] : keys,
          unique: !!idx.unique,
          multiEntry: keys.length === 1 && shouldMultiEntry(model3, keys[0])
        });
      }
      for (const [name, def] of Object.entries(model3.fields)) {
        if (!def.searchable)
          continue;
        const tokenField = `_tokens_${name}`;
        indexes.push({
          name: `_i_tokens_${name}`,
          keyPath: tokenField,
          unique: false,
          multiEntry: true
        });
      }
      return {
        storeName: model3.collection,
        keyPath: pk,
        autoIncrement: false,
        indexes
      };
    }
    function autoIndexName(keys, idx) {
      return (idx.unique ? "_u_" : "_i_") + keys.join("_");
    }
    function shouldMultiEntry(model3, field) {
      if (field.startsWith("_tokens_"))
        return true;
      const def = model3.fields[field];
      return !!def && isArrayField(def);
    }
    function isArrayField(def) {
      return def.kind === "stringArray" || def.kind === "intArray";
    }
    function fingerprint(stores) {
      const canonical = JSON.stringify(stores.map((s) => ({
        n: s.storeName,
        k: s.keyPath,
        i: s.indexes.map((i) => ({ n: i.name, k: i.keyPath, u: i.unique, m: i.multiEntry })).sort((a2, b2) => a2.n.localeCompare(b2.n))
      })).sort((a2, b2) => a2.n.localeCompare(b2.n)));
      let h = 2166136261;
      for (let i = 0; i < canonical.length; i++) {
        h ^= canonical.charCodeAt(i);
        h = h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
      }
      return h.toString(16).padStart(8, "0");
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/open.js
var require_open = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/open.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.openDb = openDb;
    exports.deleteDb = deleteDb;
    var ddl_1 = require_ddl();
    async function openDb(opts) {
      if (typeof indexedDB === "undefined") {
        throw new Error('forge-orm IndexedDB adapter requires a browser or worker environment. Detected server-side runtime \u2014 use a server adapter (postgres/mysql/sqlite/mongo) or route this code path client-only (Next.js: "use client" or dynamic({ ssr: false })).');
      }
      const plan = (0, ddl_1.buildDDLPlan)(opts.schema);
      const first = await rawOpen(opts.name);
      const currentVersion = first.version || 0;
      const diff = diffAgainstLive(plan, first);
      first.close();
      if (diff.hasWork) {
        const nextVersion = currentVersion + 1;
        const upgraded = await rawOpen(opts.name, nextVersion, (db, txn) => {
          for (const create of diff.createStores) {
            const store = db.createObjectStore(create.storeName, { keyPath: create.keyPath });
            for (const idx of create.indexes) {
              store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multiEntry });
            }
          }
          for (const { storeName, add, drop } of diff.alterStores) {
            const store = txn.objectStore(storeName);
            for (const idx of add) {
              store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multiEntry });
            }
            for (const name of drop) {
              store.deleteIndex(name);
            }
          }
        });
        return {
          db: upgraded,
          applied: [
            ...diff.createStores.map((s) => `create store ${s.storeName}`),
            ...diff.alterStores.flatMap((a2) => [
              ...a2.add.map((i) => `create index ${a2.storeName}.${i.name}`),
              ...a2.drop.map((n) => `drop index ${a2.storeName}.${n}`)
            ])
          ],
          skipped: diff.skipped,
          pending: diff.pending,
          version: nextVersion
        };
      }
      const reopen = await rawOpen(opts.name);
      return { db: reopen, applied: [], skipped: [], pending: diff.pending, version: currentVersion };
    }
    function diffAgainstLive(plan, db) {
      const liveStoreNames = new Set(Array.from(db.objectStoreNames));
      const wantStoreNames = new Set(plan.stores.map((s) => s.storeName));
      const createStores = [];
      const alterStores = [];
      const skipped = [];
      const pending = [];
      if (liveStoreNames.size > 0) {
        const tx = db.transaction(Array.from(liveStoreNames), "readonly");
        for (const want of plan.stores) {
          if (!liveStoreNames.has(want.storeName)) {
            createStores.push(want);
            continue;
          }
          const store = tx.objectStore(want.storeName);
          const liveIdxNames = new Set(Array.from(store.indexNames));
          const wantIdxNames = new Set(want.indexes.map((i) => i.name));
          const add = want.indexes.filter((i) => !liveIdxNames.has(i.name));
          const drop = Array.from(liveIdxNames).filter((n) => !wantIdxNames.has(n));
          if (add.length || drop.length) {
            alterStores.push({ storeName: want.storeName, add, drop });
          } else {
            skipped.push(`store ${want.storeName} \u2014 no change`);
          }
        }
      } else {
        for (const want of plan.stores)
          createStores.push(want);
      }
      for (const live of liveStoreNames) {
        if (!wantStoreNames.has(live)) {
          pending.push(`drop store ${live} \u2014 schema no longer declares it (destructive; skipped)`);
        }
      }
      return {
        createStores,
        alterStores,
        skipped,
        pending,
        hasWork: createStores.length > 0 || alterStores.length > 0
      };
    }
    function rawOpen(name, version, onUpgrade) {
      return new Promise((resolve, reject) => {
        const req = version === void 0 ? indexedDB.open(name) : indexedDB.open(name, version);
        req.onupgradeneeded = () => {
          const db = req.result;
          const txn = req.transaction;
          if (onUpgrade)
            onUpgrade(db, txn);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error(`IDB open blocked \u2014 close other tabs holding ${name}`));
      });
    }
    function deleteDb(name) {
      return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(name);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error(`deleteDatabase blocked on ${name}`));
      });
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/driver.js
var require_driver6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.indexedDbDriver = indexedDbDriver;
    exports.isIdbDriver = isIdbDriver;
    var open_1 = require_open();
    function indexedDbDriver(opts) {
      let handle = null;
      const driver = {
        kind: "indexeddb",
        name: opts.name,
        async open(schema) {
          if (handle)
            return handle;
          const r = await (0, open_1.openDb)({ name: opts.name, schema, logger: opts.logger });
          handle = r.db;
          return handle;
        },
        close() {
          if (handle) {
            handle.close();
            handle = null;
          }
        },
        async drop() {
          driver.close();
          await (0, open_1.deleteDb)(opts.name);
        }
      };
      return driver;
    }
    function isIdbDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "indexeddb";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/cursor-scan.js
var require_cursor_scan = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/cursor-scan.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cursorScan = cursorScan;
    exports.cursorScanIds = cursorScanIds;
    async function cursorScan(db, opts) {
      const { plan } = opts;
      const tx = db.transaction(opts.storeName, "readonly");
      const store = tx.objectStore(opts.storeName);
      const source = plan.indexName ? store.index(plan.indexName) : store;
      const collected = [];
      const ranges = plan.range?.ranges ?? [plan.range?.range ?? null];
      const direction = plan.range?.direction ?? "next";
      let skipped = 0;
      const wantLimit = opts.limit ?? Infinity;
      const wantOffset = opts.offset ?? 0;
      for (const range of ranges) {
        await new Promise((resolve, reject) => {
          const req = source.openCursor(range ?? null, direction);
          req.onsuccess = () => {
            const cur = req.result;
            if (!cur)
              return resolve();
            if (collected.length >= wantLimit)
              return resolve();
            const row = cur.value;
            if (plan.residual(row)) {
              if (skipped < wantOffset)
                skipped++;
              else
                collected.push(row);
            }
            cur.continue();
          };
          req.onerror = () => reject(req.error);
        });
        if (collected.length >= wantLimit)
          break;
      }
      return collected;
    }
    async function cursorScanIds(db, storeName, ids) {
      if (ids.length === 0)
        return [];
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const out = [];
      await Promise.all(ids.map((id) => new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result !== void 0)
            out.push(req.result);
          resolve();
        };
        req.onerror = () => reject(req.error);
      })));
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/hydration.js
var require_hydration = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/hydration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hydrate = hydrate;
    exports.applyRelationCounts = applyRelationCounts;
    var planner_1 = require_planner();
    var cursor_scan_1 = require_cursor_scan();
    async function hydrate(db, schema, parentModelKey, parents, hydration) {
      if (!hydration || hydration.length === 0 || parents.length === 0)
        return parents;
      const parentModel = schema[parentModelKey];
      for (const rel of hydration) {
        const targetModel = schema[rel.target];
        if (!targetModel)
          continue;
        if (rel.kind === "many") {
          const parentKeys = uniqueKeys(parents.map((p2) => p2[rel.refs]));
          const rows = await getByIndex(db, targetModel.collection, rel.on, parentKeys);
          const grouped = /* @__PURE__ */ new Map();
          for (const r of rows) {
            const key = String(r[rel.on]);
            const arr = grouped.get(key) ?? [];
            arr.push(r);
            grouped.set(key, arr);
          }
          for (const [k, group] of grouped) {
            if (rel.nested?.hydration) {
              grouped.set(k, await hydrate(db, schema, rel.target, group, rel.nested.hydration));
            }
          }
          for (const p2 of parents) {
            p2[rel.name] = grouped.get(String(p2[rel.refs])) ?? [];
          }
        } else {
          const childIds = uniqueKeys(parents.map((p2) => p2[rel.on]));
          let rows = await (0, cursor_scan_1.cursorScanIds)(db, targetModel.collection, childIds);
          if (rel.nested?.hydration)
            rows = await hydrate(db, schema, rel.target, rows, rel.nested.hydration);
          const targetPk = (0, planner_1.primaryKeyField)(targetModel);
          const byId = new Map(rows.map((r) => [String(r[targetPk]), r]));
          for (const p2 of parents) {
            const key = p2[rel.on];
            p2[rel.name] = key == null ? null : byId.get(String(key)) ?? null;
          }
        }
      }
      void parentModel;
      return parents;
    }
    async function applyRelationCounts(db, schema, parentModelKey, parents, counts) {
      if (!counts || counts.length === 0 || parents.length === 0)
        return;
      const parentModel = schema[parentModelKey];
      const rels = parentModel.relations?.() ?? {};
      for (const p2 of parents) {
        if (typeof p2._count !== "object" || p2._count === null)
          p2._count = {};
      }
      for (const relName of counts) {
        const rel = rels[relName];
        if (!rel) {
          for (const p2 of parents)
            p2._count[relName] = 0;
          continue;
        }
        const targetModel = schema[rel.target];
        if (!targetModel) {
          for (const p2 of parents)
            p2._count[relName] = 0;
          continue;
        }
        const parentKeys = uniqueKeys(parents.map((p2) => p2[rel.refs]));
        const rows = await getByIndex(db, targetModel.collection, rel.on, parentKeys);
        const byFk = /* @__PURE__ */ new Map();
        for (const r of rows) {
          const k = String(r[rel.on]);
          byFk.set(k, (byFk.get(k) ?? 0) + 1);
        }
        for (const p2 of parents) {
          p2._count[relName] = byFk.get(String(p2[rel.refs])) ?? 0;
        }
      }
    }
    async function getByIndex(db, storeName, keyPath, keys) {
      if (keys.length === 0)
        return [];
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const idx = tryIndex(store, keyPath);
      const results = [];
      await Promise.all(keys.map((k) => new Promise((resolve, reject) => {
        const req = idx ? idx.openCursor(IDBKeyRange.only(k)) : store.openCursor();
        req.onsuccess = () => {
          const cur = req.result;
          if (!cur)
            return resolve();
          const row = cur.value;
          if (!idx) {
            if (row[keyPath] === k)
              results.push(row);
          } else {
            results.push(row);
          }
          cur.continue();
        };
        req.onerror = () => reject(req.error);
      })));
      return results;
    }
    function tryIndex(store, keyPath) {
      for (const n of Array.from(store.indexNames)) {
        const i = store.index(n);
        if (typeof i.keyPath === "string" && i.keyPath === keyPath)
          return i;
      }
      return null;
    }
    function uniqueKeys(vs2) {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const v2 of vs2) {
        if (v2 === null || v2 === void 0)
          continue;
        const k = String(v2);
        if (seen.has(k))
          continue;
        seen.add(k);
        out.push(v2);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/coerce.js
var require_coerce2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/coerce.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coerceInbound = coerceInbound;
    exports.decodeOutbound = decodeOutbound;
    exports.stampUpdatedAt = stampUpdatedAt;
    function coerceInbound(model3, row, opts = {}) {
      const out = { ...row };
      const fields = model3.fields;
      for (const [name, def] of Object.entries(fields)) {
        const cur = out[name];
        if (cur === void 0 || cur === null) {
          if (opts.forCreate && def.default) {
            out[name] = materializeDefault(def);
          }
          continue;
        }
        if (def.kind === "dateTime" && typeof cur === "string") {
          out[name] = new Date(cur);
        }
        if (def.updatedAt && opts.forCreate && !(name in row)) {
          out[name] = /* @__PURE__ */ new Date();
        }
      }
      return out;
    }
    function decodeOutbound(_model, row) {
      return row;
    }
    function stampUpdatedAt(model3, patch) {
      const out = { ...patch };
      const fields = model3.fields;
      for (const [name, def] of Object.entries(fields)) {
        if (def.updatedAt && !(name in patch))
          out[name] = /* @__PURE__ */ new Date();
      }
      return out;
    }
    function materializeDefault(def) {
      if (!def.default)
        return void 0;
      if (def.default.kind === "now")
        return /* @__PURE__ */ new Date();
      if (def.default.kind === "autoId")
        return crypto.randomUUID();
      if (def.default.kind === "literal")
        return def.default.value;
      return void 0;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/vector.js
var require_vector = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/vector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.vectorDistance = vectorDistance;
    function vectorDistance(a2, b2, metric) {
      if (a2.length !== b2.length)
        return Infinity;
      switch (metric) {
        case "cosine":
          return 1 - cosineSim(a2, b2);
        case "l2":
          return Math.sqrt(l2Squared(a2, b2));
        case "dot":
          return -dot(a2, b2);
      }
    }
    function dot(a2, b2) {
      let s = 0;
      for (let i = 0; i < a2.length; i++)
        s += a2[i] * b2[i];
      return s;
    }
    function cosineSim(a2, b2) {
      let d2 = 0, na = 0, nb = 0;
      for (let i = 0; i < a2.length; i++) {
        d2 += a2[i] * b2[i];
        na += a2[i] * a2[i];
        nb += b2[i] * b2[i];
      }
      const denom = Math.sqrt(na) * Math.sqrt(nb);
      return denom === 0 ? 0 : d2 / denom;
    }
    function l2Squared(a2, b2) {
      let s = 0;
      for (let i = 0; i < a2.length; i++) {
        const d2 = a2[i] - b2[i];
        s += d2 * d2;
      }
      return s;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/geo.js
var require_geo = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/geo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.haversineMeters = haversineMeters;
    exports.pointInMultiPolygon = pointInMultiPolygon;
    var R_METERS = 63710088e-1;
    function haversineMeters(a2, b2) {
      const \u03C61 = a2.lat * Math.PI / 180;
      const \u03C62 = b2.lat * Math.PI / 180;
      const d\u03C6 = (b2.lat - a2.lat) * Math.PI / 180;
      const d\u03BB = (b2.lng - a2.lng) * Math.PI / 180;
      const s = Math.sin(d\u03C6 / 2) ** 2 + Math.cos(\u03C61) * Math.cos(\u03C62) * Math.sin(d\u03BB / 2) ** 2;
      return 2 * R_METERS * Math.asin(Math.min(1, Math.sqrt(s)));
    }
    function pointInMultiPolygon(mp, p2) {
      for (const poly of mp) {
        if (poly.length === 0)
          continue;
        const [outer, ...holes] = poly;
        if (!pointInRing(outer, p2))
          continue;
        if (holes.some((h) => pointInRing(h, p2)))
          continue;
        return true;
      }
      return false;
    }
    function pointInRing(ring, p2) {
      let inside = false;
      const n = ring.length;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi2 = ring[i].lng, yi2 = ring[i].lat;
        const xj = ring[j].lng, yj = ring[j].lat;
        const intersect = yi2 > p2.lat !== yj > p2.lat && p2.lng < (xj - xi2) * (p2.lat - yi2) / (yj - yi2) + xi2;
        if (intersect)
          inside = !inside;
      }
      return inside;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/fts.js
var require_fts = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/fts.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenize = tokenize;
    exports.tokensForRow = tokensForRow;
    exports.searchByTokens = searchByTokens;
    function tokenize(text) {
      return Array.from(new Set(text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length >= 1 && w.length <= 40)));
    }
    function tokensForRow(row, searchableFields) {
      const out = {};
      for (const f3 of searchableFields) {
        const v2 = row[f3];
        if (typeof v2 === "string" && v2.length > 0) {
          out[`_tokens_${f3}`] = tokenize(v2);
        }
      }
      return out;
    }
    async function searchByTokens(db, storeName, field, query) {
      const terms = tokenize(query);
      if (terms.length === 0)
        return /* @__PURE__ */ new Set();
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const idxName = `_i_tokens_${field}`;
      if (!Array.from(store.indexNames).includes(idxName))
        return /* @__PURE__ */ new Set();
      const index = store.index(idxName);
      const perTerm = [];
      await Promise.all(terms.map((term) => new Promise((resolve, reject) => {
        const set = /* @__PURE__ */ new Set();
        const req = index.openKeyCursor(IDBKeyRange.only(term));
        req.onsuccess = () => {
          const cur = req.result;
          if (!cur) {
            perTerm.push(set);
            return resolve();
          }
          set.add(String(cur.primaryKey));
          cur.continue();
        };
        req.onerror = () => reject(req.error);
      })));
      perTerm.sort((a2, b2) => a2.size - b2.size);
      if (perTerm.length === 0)
        return /* @__PURE__ */ new Set();
      const [head, ...rest] = perTerm;
      const result = /* @__PURE__ */ new Set();
      for (const id of head) {
        if (rest.every((s) => s.has(id)))
          result.add(id);
      }
      return result;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/errors.js
var require_errors7 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapIdbError = wrapIdbError;
    exports.withIdbErrors = withIdbErrors;
    exports.notFound = notFound;
    var errors_1 = require_errors();
    var CODE_MAP = {
      ConstraintError: "P2002",
      // unique-index conflict
      DataError: "P2011",
      // key-path type mismatch, out-of-range
      NotFoundError: "P2025",
      // store or record not found
      QuotaExceededError: "P2028",
      // over storage quota
      VersionError: "P2035",
      // open() version < current
      AbortError: "P2034",
      // txn aborted (deadlock analog)
      TransactionInactiveError: "P2036",
      // async gap outside txn
      ReadOnlyError: "P2037",
      // write on readonly txn
      InvalidStateError: "P2038"
      // db closed
    };
    function wrapIdbError(err) {
      if (err instanceof errors_1.DbKnownError)
        return err;
      if (err instanceof Error) {
        const code = CODE_MAP[err.name] ?? "P2010";
        return new errors_1.DbKnownError(code, err.message, { originalName: err.name });
      }
      return new errors_1.DbKnownError("P2010", String(err));
    }
    async function withIdbErrors(op) {
      try {
        return await op();
      } catch (e) {
        throw wrapIdbError(e);
      }
    }
    function notFound(collection, where) {
      return new errors_1.DbKnownError("P2025", `No ${collection} found matching the given criteria`, { modelName: collection, cause: where });
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/execute.js
var require_execute7 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/execute.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeSelect = executeSelect;
    exports.executeCount = executeCount;
    exports.executeInsert = executeInsert;
    exports.executeUpdate = executeUpdate;
    exports.executeDelete = executeDelete;
    exports.executeGroupBy = executeGroupBy;
    var active_1 = require_active();
    var planner_1 = require_planner();
    var cursor_scan_1 = require_cursor_scan();
    var hydration_1 = require_hydration();
    var coerce_1 = require_coerce2();
    var vector_1 = require_vector();
    var geo_1 = require_geo();
    var fts_1 = require_fts();
    var errors_1 = require_errors7();
    async function executeSelect(db, node, model3, _opts = {}, schemaOverride) {
      return (0, errors_1.withIdbErrors)(async () => {
        const schema = schemaOverride ?? (0, active_1.getActiveSchema)();
        const storeName = model3.collection;
        const searchLeaf = findLeaf(node.where, "search");
        let idFilter = null;
        if (searchLeaf) {
          idFilter = await (0, fts_1.searchByTokens)(db, storeName, searchLeaf.field, String(searchLeaf.value));
          if (idFilter.size === 0)
            return [];
        }
        const nearLeaf = findLeaf(node.where, "near");
        const nearOrder = node.orderBy?.find((o) => o.nearTo);
        const plan = (0, planner_1.planSelect)(model3, stripPostFilterOps(node.where), node.orderBy);
        const needsPostSort = !!node.orderBy?.length && !plan.orderByFree;
        const deferSlice = !!nearOrder || !!node.cursor && Object.keys(node.cursor.fields).length > 0 || needsPostSort;
        let rows = await (0, cursor_scan_1.cursorScan)(db, {
          storeName,
          plan,
          limit: deferSlice ? void 0 : node.limit,
          offset: deferSlice ? void 0 : node.offset
        });
        if (idFilter)
          rows = rows.filter((r) => idFilter.has(r[(0, planner_1.primaryKeyField)(model3)]));
        if (nearLeaf) {
          const fieldDef = model3.fields[nearLeaf.field];
          if (fieldDef?.kind === "geoPoint") {
            const { lng, lat, withinMeters } = nearLeaf.value;
            rows = rows.filter((r) => {
              const p2 = r[nearLeaf.field];
              if (!p2)
                return false;
              const d2 = (0, geo_1.haversineMeters)({ lng, lat }, p2);
              r._distanceMeters = d2;
              return withinMeters === void 0 || d2 <= withinMeters;
            });
          }
          if (fieldDef?.kind === "vector") {
            const { vector: v2, withinDistance } = nearLeaf.value;
            const metric = fieldDef.vector?.metric ?? "cosine";
            rows = rows.filter((r) => {
              const rv = r[nearLeaf.field];
              if (!rv)
                return false;
              const d2 = (0, vector_1.vectorDistance)(rv, v2, metric);
              r._distance = d2;
              return withinDistance === void 0 || d2 <= withinDistance;
            });
          }
        }
        const polyLeaf = findLeaf(node.where, "withinPolygon");
        if (polyLeaf) {
          const mp = polyLeaf.value.multiPolygon;
          rows = rows.filter((r) => {
            const p2 = r[polyLeaf.field];
            if (!p2)
              return false;
            return (0, geo_1.pointInMultiPolygon)(mp, p2);
          });
        }
        if (nearOrder?.nearTo) {
          const nt2 = nearOrder.nearTo;
          const isVector = !!nt2.vector;
          const key = isVector ? "_distance" : "_distanceMeters";
          if (isVector) {
            const fieldDef = model3.fields[nearOrder.field];
            const metric = fieldDef?.vector?.metric ?? "cosine";
            for (const r of rows) {
              const rv = r[nearOrder.field];
              r._distance = rv ? (0, vector_1.vectorDistance)(rv, nt2.vector, metric) : Infinity;
            }
          } else {
            for (const r of rows) {
              const p2 = r[nearOrder.field];
              r._distanceMeters = p2 ? (0, geo_1.haversineMeters)({ lng: nt2.lng, lat: nt2.lat }, p2) : Infinity;
            }
          }
          rows.sort((a2, b2) => a2[key] - b2[key]);
          if (nearOrder.direction === "desc")
            rows.reverse();
          if (node.offset)
            rows = rows.slice(node.offset);
          if (node.limit)
            rows = rows.slice(0, node.limit);
        } else if (node.orderBy && node.orderBy.length > 0 && !plan.orderByFree) {
          rows = [...rows].sort((a2, b2) => {
            for (const o of node.orderBy) {
              const av = a2[o.field], bv = b2[o.field];
              const c = jsCompare(av, bv);
              if (c !== 0)
                return o.direction === "desc" ? -c : c;
            }
            return 0;
          });
          if (node.offset)
            rows = rows.slice(node.offset);
          if (node.limit)
            rows = rows.slice(0, node.limit);
        }
        if (node.cursor && Object.keys(node.cursor.fields).length > 0) {
          const [firstField] = Object.keys(node.cursor.fields);
          const cursorValue = node.cursor.fields[firstField];
          let cutIdx = -1;
          for (let i = 0; i < rows.length; i++) {
            if (jsCompare(rows[i][firstField], cursorValue) === 0) {
              cutIdx = i;
              break;
            }
          }
          if (cutIdx >= 0)
            rows = rows.slice(cutIdx + 1);
          if (node.offset)
            rows = rows.slice(node.offset);
          if (node.limit !== void 0)
            rows = rows.slice(0, node.limit);
        }
        if (node.distinct?.length) {
          const seen = /* @__PURE__ */ new Set();
          rows = rows.filter((r) => {
            const key = JSON.stringify(node.distinct.map((f3) => r[f3] ?? null));
            if (seen.has(key))
              return false;
            seen.add(key);
            return true;
          });
        }
        if (node.cardinality === "one")
          rows = rows.slice(0, 1);
        if (node.hydration?.length)
          rows = await (0, hydration_1.hydrate)(db, schema, node.model, rows, node.hydration);
        if (node.projection?.counts?.length)
          await (0, hydration_1.applyRelationCounts)(db, schema, node.model, rows, node.projection.counts);
        if (node.projection)
          rows = rows.map((r) => project(r, node.projection, node.hydration));
        return rows;
      });
    }
    function project(row, plan, hydration) {
      if (plan.exclusive) {
        const out = {};
        for (const f3 of plan.fields)
          out[f3] = row[f3];
        for (const rel of hydration ?? [])
          out[rel.name] = row[rel.name];
        if (plan.counts.length && row._count !== void 0)
          out._count = row._count;
        return out;
      }
      if (plan.omit && plan.omit.length) {
        const out = { ...row };
        for (const f3 of plan.omit)
          delete out[f3];
        return out;
      }
      return row;
    }
    function jsCompare(a2, b2) {
      if (a2 == null && b2 == null)
        return 0;
      if (a2 == null)
        return -1;
      if (b2 == null)
        return 1;
      if (typeof a2 === "number" && typeof b2 === "number")
        return a2 - b2;
      if (a2 instanceof Date && b2 instanceof Date)
        return a2.getTime() - b2.getTime();
      return String(a2) < String(b2) ? -1 : String(a2) > String(b2) ? 1 : 0;
    }
    function findLeaf(w, op) {
      if (!w)
        return void 0;
      if (w.kind === "leaf" && w.op === op)
        return w;
      if (w.kind === "and" || w.kind === "or") {
        for (const c of w.children) {
          const f3 = findLeaf(c, op);
          if (f3)
            return f3;
        }
      }
      if (w.kind === "not")
        return findLeaf(w.child, op);
      return void 0;
    }
    function stripPostFilterOps(w) {
      const STRIP = /* @__PURE__ */ new Set(["search", "near", "withinPolygon"]);
      const walk = (n) => {
        if (!n)
          return n;
        if (n.kind === "leaf")
          return STRIP.has(n.op) ? void 0 : n;
        if (n.kind === "and" || n.kind === "or") {
          const c = n.children.map(walk).filter(Boolean);
          if (c.length === 0)
            return void 0;
          if (c.length === 1)
            return c[0];
          return { ...n, children: c };
        }
        if (n.kind === "not") {
          const inner = walk(n.child);
          return inner ? { kind: "not", child: inner } : void 0;
        }
        return n;
      };
      return walk(w);
    }
    async function executeCount(db, node, model3, _opts = {}) {
      return (0, errors_1.withIdbErrors)(async () => {
        if (!node.where && !node.distinct) {
          const tx = db.transaction(model3.collection, "readonly");
          return await new Promise((resolve, reject) => {
            const req = tx.objectStore(model3.collection).count();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });
        }
        const plan = (0, planner_1.planSelect)(model3, node.where);
        const rows = await (0, cursor_scan_1.cursorScan)(db, { storeName: model3.collection, plan });
        if (!node.distinct)
          return rows.length;
        const seen = /* @__PURE__ */ new Set();
        for (const r of rows) {
          seen.add(JSON.stringify(node.distinct.map((f3) => r[f3] ?? null)));
        }
        return seen.size;
      });
    }
    async function executeInsert(db, node, model3, _opts = {}) {
      return (0, errors_1.withIdbErrors)(async () => {
        const pk = (0, planner_1.primaryKeyField)(model3);
        const searchable = Object.entries(model3.fields).filter(([, f3]) => f3.searchable).map(([n]) => n);
        const tx = db.transaction(model3.collection, "readwrite");
        const store = tx.objectStore(model3.collection);
        const inserted = [];
        for (const raw of node.rows) {
          const row = (0, coerce_1.coerceInbound)(model3, raw, { forCreate: true });
          if (row[pk] === void 0 || row[pk] === null) {
            row[pk] = crypto.randomUUID();
          }
          Object.assign(row, (0, fts_1.tokensForRow)(row, searchable));
          await new Promise((resolve, reject) => {
            const req = node.skipDuplicates ? store.put(row) : store.add(row);
            req.onsuccess = () => {
              inserted.push(row);
              resolve();
            };
            req.onerror = () => {
              if (node.skipDuplicates && req.error?.name === "ConstraintError") {
                resolve();
              } else
                reject(req.error);
            };
          });
        }
        return { docs: inserted, count: inserted.length };
      });
    }
    async function executeUpdate(db, node, model3, opts = {}) {
      return (0, errors_1.withIdbErrors)(async () => {
        const searchable = Object.entries(model3.fields).filter(([, f3]) => f3.searchable).map(([n]) => n);
        if (node.upsertCreate) {
          const found = await executeSelect(db, {
            kind: "select",
            model: node.model,
            where: node.where,
            cardinality: "one"
          }, model3, opts);
          if (found.length === 0) {
            const created = await executeInsert(db, {
              kind: "insert",
              model: node.model,
              rows: [node.upsertCreate]
            }, model3, opts);
            return { doc: created.docs[0], count: created.count };
          }
        }
        const matches = await executeSelect(db, {
          kind: "select",
          model: node.model,
          where: node.where,
          cardinality: node.many ? "many" : "one"
        }, model3, opts);
        if (matches.length === 0) {
          if (node.many)
            return { count: 0 };
          throw (0, errors_1.notFound)(model3.collection, node.where);
        }
        const tx = db.transaction(model3.collection, "readwrite");
        const store = tx.objectStore(model3.collection);
        const out = [];
        for (const r of matches) {
          let patch = { ...r };
          if (node.set)
            Object.assign(patch, node.set);
          if (node.increment)
            for (const [f3, v2] of Object.entries(node.increment))
              patch[f3] = (patch[f3] ?? 0) + v2;
          if (node.multiply)
            for (const [f3, v2] of Object.entries(node.multiply))
              patch[f3] = (patch[f3] ?? 0) * v2;
          if (node.push)
            for (const [f3, vs2] of Object.entries(node.push)) {
              const arr = Array.isArray(patch[f3]) ? [...patch[f3]] : [];
              const values = Array.isArray(vs2) ? vs2 : [vs2];
              arr.push(...values);
              patch[f3] = arr;
            }
          if (node.unset)
            for (const f3 of node.unset)
              delete patch[f3];
          patch = (0, coerce_1.stampUpdatedAt)(model3, patch);
          Object.assign(patch, (0, fts_1.tokensForRow)(patch, searchable));
          await new Promise((resolve, reject) => {
            const req = store.put(patch);
            req.onsuccess = () => {
              out.push(patch);
              resolve();
            };
            req.onerror = () => reject(req.error);
          });
        }
        if (node.many)
          return { count: out.length };
        return { doc: out[0], count: out.length };
      });
    }
    async function executeDelete(db, node, model3, opts = {}, schemaOverride) {
      return (0, errors_1.withIdbErrors)(async () => {
        const pk = (0, planner_1.primaryKeyField)(model3);
        const matches = await executeSelect(db, {
          kind: "select",
          model: node.model,
          where: node.where,
          cardinality: node.many ? "many" : "one"
        }, model3, opts, schemaOverride);
        if (matches.length === 0) {
          if (node.many)
            return { count: 0 };
          throw (0, errors_1.notFound)(model3.collection, node.where);
        }
        const tx = db.transaction(model3.collection, "readwrite");
        const store = tx.objectStore(model3.collection);
        for (const r of matches) {
          await new Promise((resolve, reject) => {
            const req = store.delete(r[pk]);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        }
        if (node.many)
          return { count: matches.length };
        return { doc: matches[0], count: matches.length };
      });
    }
    async function executeGroupBy(db, node, model3, _opts = {}) {
      return (0, errors_1.withIdbErrors)(async () => {
        const plan = (0, planner_1.planSelect)(model3, node.where);
        const rows = await (0, cursor_scan_1.cursorScan)(db, { storeName: model3.collection, plan });
        const groups = /* @__PURE__ */ new Map();
        for (const r of rows) {
          const key = {};
          for (const f3 of node.by)
            key[f3] = r[f3];
          const k = JSON.stringify(node.by.map((f3) => r[f3] ?? null));
          const g = groups.get(k) ?? { keys: key, rows: [] };
          g.rows.push(r);
          groups.set(k, g);
        }
        const out = [];
        for (const g of groups.values()) {
          const bucket = { ...g.keys };
          if (node._count) {
            const c = {};
            if (node._count._all)
              c._all = g.rows.length;
            for (const [f3, want] of Object.entries(node._count)) {
              if (f3 === "_all" || !want)
                continue;
              c[f3] = g.rows.filter((r) => r[f3] != null).length;
            }
            bucket._count = c;
          }
          if (node._sum)
            bucket._sum = mapAgg(g.rows, node._sum, (nums) => nums.reduce((a2, b2) => a2 + b2, 0));
          if (node._avg)
            bucket._avg = mapAgg(g.rows, node._avg, (nums) => nums.length ? nums.reduce((a2, b2) => a2 + b2, 0) / nums.length : 0);
          if (node._min)
            bucket._min = mapAgg(g.rows, node._min, (nums) => nums.length ? Math.min(...nums) : null);
          if (node._max)
            bucket._max = mapAgg(g.rows, node._max, (nums) => nums.length ? Math.max(...nums) : null);
          out.push(bucket);
        }
        if (node.orderBy && node.orderBy.length) {
          out.sort((a2, b2) => {
            for (const o of node.orderBy) {
              const av = a2[o.field], bv = b2[o.field];
              const c = jsCompare(av, bv);
              if (c !== 0)
                return o.direction === "desc" ? -c : c;
            }
            return 0;
          });
        }
        if (node.offset)
          out.splice(0, node.offset);
        if (node.limit !== void 0)
          out.length = Math.min(out.length, node.limit);
        return out;
      });
    }
    function mapAgg(rows, fields, fn) {
      const out = {};
      for (const [f3, want] of Object.entries(fields)) {
        if (!want)
          continue;
        const nums = rows.map((r) => r[f3]).filter((v2) => typeof v2 === "number");
        out[f3] = fn(nums);
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/cascade.js
var require_cascade2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/cascade.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cascadeDelete = cascadeDelete;
    var planner_1 = require_planner();
    var execute_1 = require_execute7();
    async function cascadeDelete(db, schema, modelKey, parents) {
      const ctx = { db, schema, visited: /* @__PURE__ */ new Set() };
      await walk(ctx, modelKey, parents);
    }
    async function walk(ctx, modelKey, parents) {
      const model3 = ctx.schema[modelKey];
      const pk = (0, planner_1.primaryKeyField)(model3);
      const parentIds = parents.map((p2) => p2[pk]);
      for (const [childKey, childModelRaw] of Object.entries(ctx.schema)) {
        const childModel = childModelRaw;
        const rels = childModel.relations?.() ?? {};
        for (const rel of Object.values(rels)) {
          if (rel.target !== modelKey)
            continue;
          if (rel.kind !== "one")
            continue;
          if (rel.inverse)
            continue;
          const action = rel.onDelete;
          if (!action || action === "NoAction")
            continue;
          const tx = ctx.db.transaction(childModel.collection, "readonly");
          const store = tx.objectStore(childModel.collection);
          const idx = findIdx(store, rel.on);
          const children = [];
          for (const pid of parentIds) {
            const key = `${childKey}:${String(pid)}`;
            if (ctx.visited.has(key))
              continue;
            ctx.visited.add(key);
            await new Promise((resolve, reject) => {
              const req = idx ? idx.openCursor(IDBKeyRange.only(pid)) : store.openCursor();
              req.onsuccess = () => {
                const cur = req.result;
                if (!cur)
                  return resolve();
                const row = cur.value;
                if (!idx && row[rel.on] !== pid) {
                  cur.continue();
                  return;
                }
                children.push(row);
                cur.continue();
              };
              req.onerror = () => reject(req.error);
            });
          }
          if (children.length === 0)
            continue;
          if (action === "Restrict") {
            throw new Error(`onDelete Restrict: cannot delete ${modelKey} \u2014 ${children.length} child ${childKey} row(s) exist`);
          }
          if (action === "Cascade") {
            await walk(ctx, childKey, children);
            const childPk = (0, planner_1.primaryKeyField)(childModel);
            await (0, execute_1.executeDelete)(ctx.db, {
              kind: "delete",
              model: childKey,
              many: true,
              where: {
                kind: "leaf",
                field: childPk,
                op: "in",
                value: children.map((c) => c[childPk])
              }
            }, childModel, {}, ctx.schema);
          } else if (action === "SetNull") {
            const wx = ctx.db.transaction(childModel.collection, "readwrite");
            const wstore = wx.objectStore(childModel.collection);
            for (const c of children) {
              const patched = { ...c };
              delete patched[rel.on];
              await new Promise((resolve, reject) => {
                const req = wstore.put(patched);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
              });
            }
          }
        }
      }
    }
    function findIdx(store, keyPath) {
      for (const n of Array.from(store.indexNames)) {
        const i = store.index(n);
        if (typeof i.keyPath === "string" && i.keyPath === keyPath)
          return i;
      }
      return null;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/introspect.js
var require_introspect6 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/introspect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introspect = introspect;
    async function introspect(db) {
      const tables = [];
      const names = Array.from(db.objectStoreNames);
      if (names.length === 0)
        return { kind: "indexeddb", tables, views: [] };
      const tx = db.transaction(names, "readonly");
      for (const n of names) {
        const store = tx.objectStore(n);
        const indexes = Array.from(store.indexNames).map((iName) => {
          const i = store.index(iName);
          const columns2 = Array.isArray(i.keyPath) ? [...i.keyPath] : [String(i.keyPath)];
          return { name: iName, columns: columns2, unique: i.unique };
        });
        const seen = /* @__PURE__ */ new Set();
        const columns = [];
        const push = (name) => {
          if (seen.has(name))
            return;
          seen.add(name);
          columns.push({ name, type: "unknown", nullable: true });
        };
        if (typeof store.keyPath === "string")
          push(store.keyPath);
        else if (Array.isArray(store.keyPath))
          for (const k of store.keyPath)
            push(String(k));
        for (const idx of indexes)
          for (const c of idx.columns)
            push(c);
        tables.push({ name: n, columns, indexes, foreignKeys: [] });
      }
      return { kind: "indexeddb", tables, views: [] };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/adapter.js
var require_adapter7 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/adapter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IndexeddbAdapter = void 0;
    exports.createIndexeddbAdapter = createIndexeddbAdapter;
    exports.getDefaultIndexeddbAdapter = getDefaultIndexeddbAdapter;
    var active_1 = require_active();
    var events_1 = require_events();
    var driver_1 = require_driver6();
    var execute_1 = require_execute7();
    var coerce_1 = require_coerce2();
    var cascade_1 = require_cascade2();
    var hydration_1 = require_hydration();
    var introspect_1 = require_introspect6();
    var CAPS = {
      nativeCascades: false,
      nativeUpsert: true,
      nullsOrdering: false,
      jsonPath: true,
      transactionsRequireReplicaSet: false
    };
    var IndexeddbAdapter = class {
      _injected;
      kind = "indexeddb";
      capabilities = CAPS;
      emitter = new events_1.ForgeEmitter();
      _driver;
      _db;
      _url;
      // An injected driver bypasses the URL parser (React Native web / test shims).
      constructor(_injected) {
        this._injected = _injected;
      }
      async connect(url) {
        this._url = url;
        const schema = (0, active_1.getActiveSchema)();
        if (this._injected) {
          this._driver = this._injected;
        } else {
          const name = this._urlToName(url);
          this._driver = (0, driver_1.indexedDbDriver)({ name });
        }
        this._db = await this._driver.open(schema);
      }
      async close() {
        if (this._driver)
          this._driver.close();
        this._db = void 0;
      }
      async doctor() {
        return {
          kind: "indexeddb",
          driverPackage: "(host IndexedDB)",
          driverInstalled: typeof indexedDB !== "undefined",
          connectionString: this._url,
          capabilities: CAPS,
          notes: [
            "Runs against the host browser / worker IndexedDB \u2014 no separate driver install.",
            "Full-text search uses a shadow `_tokens_<field>` multiEntry index; auto-emitted for every `.searchable()` field.",
            "Geo `near` / `withinPolygon` and vector similarity are brute-force post-filter \u2014 fine for <~1k rows, route larger workloads to forge-orm/wasm/worker-pro (sqlite-vec).",
            "onDelete cascades are enforced by a JS walker (mongo-style); the DB has no FKs of its own."
          ]
        };
      }
      get db() {
        if (!this._db)
          throw new Error("[forge:indexeddb] db accessed before connect() resolved");
        return this._db;
      }
      async _track(op, node, exec, countRows, semanticOp) {
        if (!this.emitter.hasListeners())
          return exec();
        return this.emitter.track({
          adapter: "indexeddb",
          model: node.model ?? "",
          op,
          sql: `idb.${op}(${node.model ?? ""})`,
          params: [],
          ...semanticOp ? { semanticOp } : {}
        }, exec, countRows);
      }
      executeSelect(node, model3, opts) {
        return this._track("select", node, () => (0, execute_1.executeSelect)(this.db, node, model3, opts ?? {}), (r) => r.length);
      }
      executeCount(node, model3, opts) {
        return this._track("count", node, () => (0, execute_1.executeCount)(this.db, node, model3, opts ?? {}), () => 1);
      }
      executeInsert(node, model3, opts) {
        return this._track("insert", node, () => (0, execute_1.executeInsert)(this.db, node, model3, opts ?? {}), (r) => r.count);
      }
      executeUpdate(node, model3, opts) {
        return this._track("update", node, () => (0, execute_1.executeUpdate)(this.db, node, model3, opts ?? {}), (r) => r.count, opts?.semanticOp);
      }
      executeDelete(node, model3, opts) {
        return this._track("delete", node, () => (0, execute_1.executeDelete)(this.db, node, model3, opts ?? {}), (r) => r.count);
      }
      executeGroupBy(node, model3, opts) {
        return this._track("groupBy", node, () => (0, execute_1.executeGroupBy)(this.db, node, model3, opts ?? {}), (r) => r.length);
      }
      // Write-then-project support for create/update/delete + include/select/omit.
      // Called by the wrapper after an insert/update/delete that returned rows.
      async applyProjectionAndHydration(rows, model3, node, _opts) {
        if (rows.length === 0)
          return;
        const schema = (0, active_1.getActiveSchema)();
        const modelKey = keyForModel(schema, model3) ?? "";
        if (!modelKey)
          return;
        if (node.hydration?.length)
          await (0, hydration_1.hydrate)(this.db, schema, modelKey, rows, node.hydration);
        if (node.projection?.counts?.length)
          await (0, hydration_1.applyRelationCounts)(this.db, schema, modelKey, rows, node.projection.counts);
      }
      // IDB txns auto-commit on task idle — a shared IDBTransaction can't span
      // an await on a non-IDB promise. v0 runs the callback with `undefined`
      // session; per-op txns give the strongest atomicity IDB supports here.
      async $transaction(fn) {
        return fn(void 0);
      }
      coerceInbound(model3, data, opts) {
        return (0, coerce_1.coerceInbound)(model3, data, opts);
      }
      decodeOutbound(model3, row) {
        return (0, coerce_1.decodeOutbound)(model3, row);
      }
      async applyCascadesForDelete(model3, docs, _opts) {
        if (docs.length === 0)
          return;
        const schema = (0, active_1.getActiveSchema)();
        const modelKey = keyForModel(schema, model3);
        if (!modelKey)
          return;
        await (0, cascade_1.cascadeDelete)(this.db, schema, modelKey, docs);
      }
      async $queryRaw() {
        throw new Error("IndexedDB has no SQL query language; use db.<model>.aggregate or model methods.");
      }
      async $executeRaw() {
        throw new Error("IndexedDB has no SQL query language; use db.<model>.aggregate or model methods.");
      }
      async introspect() {
        return (0, introspect_1.introspect)(this.db);
      }
      _urlToName(url) {
        if (url.startsWith("idb:"))
          return url.slice("idb:".length) || "forge";
        if (url.startsWith("indexeddb:"))
          return url.slice("indexeddb:".length) || "forge";
        return url || "forge";
      }
    };
    exports.IndexeddbAdapter = IndexeddbAdapter;
    function keyForModel(schema, model3) {
      for (const [k, v2] of Object.entries(schema)) {
        if (v2.collection === model3.collection)
          return k;
      }
      return void 0;
    }
    function createIndexeddbAdapter(driver) {
      return new IndexeddbAdapter(driver && (0, driver_1.isIdbDriver)(driver) ? driver : void 0);
    }
    var _default;
    function getDefaultIndexeddbAdapter() {
      if (!_default)
        _default = new IndexeddbAdapter();
      return _default;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/mongo-to-sql-where.js
var require_mongo_to_sql_where = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/shared/mongo-to-sql-where.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mongoToSqlWhere = mongoToSqlWhere;
    var COMPARATORS = {
      $eq: "=",
      $ne: "<>",
      $gt: ">",
      $gte: ">=",
      $lt: "<",
      $lte: "<="
    };
    function mongoToSqlWhere(filter, opts = {}) {
      const q = opts.quoteIdent ?? ((c) => `"${c.replace(/"/g, '""')}"`);
      const dialect = opts.dialect ?? "postgres";
      return translateNode(filter, q, dialect);
    }
    function translateNode(node, q, dialect) {
      const parts = [];
      for (const [key, value] of Object.entries(node)) {
        if (key === "$and" || key === "$or") {
          if (!Array.isArray(value))
            return null;
          const sub = [];
          for (const child of value) {
            if (!child || typeof child !== "object")
              return null;
            const t = translateNode(child, q, dialect);
            if (t === null)
              return null;
            sub.push(`(${t})`);
          }
          if (sub.length === 0)
            continue;
          parts.push(sub.join(key === "$and" ? " AND " : " OR "));
          continue;
        }
        if (key === "$nor") {
          if (!Array.isArray(value) || value.length === 0)
            return null;
          const sub = [];
          for (const child of value) {
            if (!child || typeof child !== "object")
              return null;
            const t = translateNode(child, q, dialect);
            if (t === null)
              return null;
            sub.push(`(${t})`);
          }
          parts.push(`NOT (${sub.join(" OR ")})`);
          continue;
        }
        if (key.startsWith("$"))
          return null;
        const f3 = translateField(key, value, q, dialect);
        if (f3 === null)
          return null;
        parts.push(f3);
      }
      if (parts.length === 0)
        return null;
      return parts.join(" AND ");
    }
    function translateField(col, value, q, dialect) {
      if (value === null || isScalar(value)) {
        if (value === null)
          return `${q(col)} IS NULL`;
        return `${q(col)} = ${literal(value)}`;
      }
      if (Array.isArray(value))
        return null;
      if (typeof value !== "object")
        return null;
      const ops = Object.entries(value);
      const subParts = [];
      for (const [opName, opValue] of ops) {
        const piece = translateOperator(col, opName, opValue, q, dialect);
        if (piece === null)
          return null;
        subParts.push(piece);
      }
      if (subParts.length === 0)
        return null;
      return subParts.join(" AND ");
    }
    function translateOperator(col, opName, opValue, q, dialect) {
      if (opName in COMPARATORS) {
        const sym = COMPARATORS[opName];
        if (opValue === null) {
          if (opName === "$eq")
            return `${q(col)} IS NULL`;
          if (opName === "$ne")
            return `${q(col)} IS NOT NULL`;
          return null;
        }
        if (!isScalar(opValue))
          return null;
        return `${q(col)} ${sym} ${literal(opValue)}`;
      }
      if (opName === "$in" || opName === "$nin") {
        if (!Array.isArray(opValue) || opValue.length === 0)
          return null;
        if (!opValue.every(isScalar))
          return null;
        const list = opValue.map(literal).join(", ");
        return `${q(col)} ${opName === "$in" ? "IN" : "NOT IN"} (${list})`;
      }
      if (opName === "$exists") {
        if (opValue === true)
          return `${q(col)} IS NOT NULL`;
        if (opValue === false)
          return `${q(col)} IS NULL`;
        return null;
      }
      if (opName === "$type") {
        return `${q(col)} IS NOT NULL`;
      }
      if (opName === "$regex") {
        if (typeof opValue !== "string")
          return null;
        if (dialect === "postgres")
          return `${q(col)} ~ ${literal(opValue)}`;
        if (dialect === "mysql")
          return `${q(col)} REGEXP ${literal(opValue)}`;
        return null;
      }
      if (opName === "$size") {
        if (typeof opValue !== "number" || !Number.isFinite(opValue))
          return null;
        if (dialect === "postgres") {
          return `coalesce(array_length(${q(col)}, 1), 0) = ${opValue}`;
        }
        return null;
      }
      if (opName === "$not") {
        if (!opValue || typeof opValue !== "object" || Array.isArray(opValue))
          return null;
        const inner = translateField(col, opValue, q, dialect);
        if (inner === null)
          return null;
        return `NOT (${inner})`;
      }
      return null;
    }
    function isScalar(v2) {
      if (v2 === null)
        return false;
      if (typeof v2 === "string" || typeof v2 === "number" || typeof v2 === "boolean")
        return true;
      if (v2 instanceof Date)
        return true;
      return false;
    }
    function literal(v2) {
      if (typeof v2 === "string")
        return `'${v2.replace(/'/g, "''")}'`;
      if (typeof v2 === "number")
        return Number.isFinite(v2) ? String(v2) : "NULL";
      if (typeof v2 === "boolean")
        return v2 ? "TRUE" : "FALSE";
      if (v2 instanceof Date)
        return `'${v2.toISOString()}'`;
      return "NULL";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/ddl.js
var require_ddl2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/ddl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildSchemaDDL = buildSchemaDDL;
    exports.renderColumn = renderColumn;
    var mongo_to_sql_where_1 = require_mongo_to_sql_where();
    var dialect_1 = require_dialect3();
    var RESERVED_INDEX_PREFIX = "forge_";
    function tableConstraintName(table, kind, parts) {
      const raw = `${RESERVED_INDEX_PREFIX}${table}_${kind}_${parts.join("_")}`;
      if (raw.length <= 60)
        return raw;
      let hash = 0;
      for (let i = 0; i < raw.length; i++)
        hash = hash * 31 + raw.charCodeAt(i) | 0;
      return `${RESERVED_INDEX_PREFIX}${table}_${kind}_${(hash >>> 0).toString(36)}`;
    }
    function buildSchemaDDL(schema) {
      const d2 = dialect_1.SqliteDialect;
      const out = [];
      for (const key of Object.keys(schema)) {
        const m2 = schema[key];
        if (!m2 || m2.view)
          continue;
        out.push(buildCreateTable(m2, schema));
      }
      for (const key of Object.keys(schema)) {
        const m2 = schema[key];
        if (!m2 || m2.view)
          continue;
        out.push(...buildUniques(m2));
        out.push(...buildIndexes(m2));
        out.push(...buildFtsTables(m2));
      }
      for (const key of Object.keys(schema)) {
        const m2 = schema[key];
        if (!m2?.view?.sql)
          continue;
        const q = d2.quoteIdent(m2.collection);
        if (m2.view.materialised) {
          out.push({
            kind: "table",
            name: m2.collection,
            table: m2.collection,
            sql: `CREATE TABLE IF NOT EXISTS ${q} AS ${m2.view.sql}`,
            dropSql: `DROP TABLE IF EXISTS ${q}`
          });
          continue;
        }
        out.push({
          kind: "table",
          name: m2.collection,
          table: m2.collection,
          sql: `CREATE VIEW IF NOT EXISTS ${q} AS ${m2.view.sql}`,
          dropSql: `DROP VIEW IF EXISTS ${q}`
        });
      }
      return out;
    }
    function buildFtsTables(m2) {
      const d2 = dialect_1.SqliteDialect;
      const cols = [];
      for (const [name, fdef] of Object.entries(m2.fields)) {
        if (fdef.searchable)
          cols.push(name);
      }
      if (cols.length === 0)
        return [];
      const out = [];
      const tname = `${m2.collection}_fts`;
      const baseQ = d2.quoteIdent(m2.collection);
      const ftsQ = d2.quoteIdent(tname);
      const colsQ = cols.map(d2.quoteIdent).join(", ");
      const colsList = cols.join(", ");
      const newCols = cols.map((c) => `new.${d2.quoteIdent(c)}`).join(", ");
      const oldCols = cols.map((c) => `old.${d2.quoteIdent(c)}`).join(", ");
      out.push({
        kind: "index",
        name: tname,
        table: m2.collection,
        sql: `CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsQ} USING fts5(${colsQ}, content=${baseQ}, content_rowid='rowid')`,
        dropSql: `DROP TABLE IF EXISTS ${ftsQ}`
      });
      out.push({
        kind: "index",
        name: `${tname}_ai`,
        table: m2.collection,
        sql: `CREATE TRIGGER IF NOT EXISTS ${d2.quoteIdent(`${tname}_ai`)}
          AFTER INSERT ON ${baseQ} BEGIN
            INSERT INTO ${ftsQ}(rowid, ${colsList}) VALUES (new.rowid, ${newCols});
          END`,
        dropSql: `DROP TRIGGER IF EXISTS ${d2.quoteIdent(`${tname}_ai`)}`
      });
      out.push({
        kind: "index",
        name: `${tname}_ad`,
        table: m2.collection,
        sql: `CREATE TRIGGER IF NOT EXISTS ${d2.quoteIdent(`${tname}_ad`)}
          AFTER DELETE ON ${baseQ} BEGIN
            INSERT INTO ${ftsQ}(${ftsQ}, rowid, ${colsList}) VALUES('delete', old.rowid, ${oldCols});
          END`,
        dropSql: `DROP TRIGGER IF EXISTS ${d2.quoteIdent(`${tname}_ad`)}`
      });
      out.push({
        kind: "index",
        name: `${tname}_au`,
        table: m2.collection,
        sql: `CREATE TRIGGER IF NOT EXISTS ${d2.quoteIdent(`${tname}_au`)}
          AFTER UPDATE ON ${baseQ} BEGIN
            INSERT INTO ${ftsQ}(${ftsQ}, rowid, ${colsList}) VALUES('delete', old.rowid, ${oldCols});
            INSERT INTO ${ftsQ}(rowid, ${colsList}) VALUES (new.rowid, ${newCols});
          END`,
        dropSql: `DROP TRIGGER IF EXISTS ${d2.quoteIdent(`${tname}_au`)}`
      });
      return out;
    }
    function buildCreateTable(m2, schema) {
      const d2 = dialect_1.SqliteDialect;
      const table = m2.collection;
      const cols = [];
      let pkField;
      let pkInline = false;
      for (const [name, fdef] of Object.entries(m2.fields)) {
        const field = fdef;
        cols.push(renderColumn(name, field));
        if (field.kind === "id") {
          pkField = name;
          if (field.idType === "bigserial")
            pkInline = true;
        }
      }
      if (pkField && !pkInline)
        cols.push(`PRIMARY KEY (${d2.quoteIdent(pkField)})`);
      for (const [name, fdef] of Object.entries(m2.fields)) {
        const field = fdef;
        if (field.kind === "enum" && field.enumValues?.length) {
          const vals = field.enumValues.map(escapeSqlString).join(", ");
          cols.push(`CHECK (${d2.quoteIdent(name)} IN (${vals}))`);
        }
      }
      const rels = m2.relations();
      for (const [, rel] of Object.entries(rels)) {
        const r = rel;
        if (r.inverse)
          continue;
        if (!m2.fields[r.on])
          continue;
        const onField = m2.fields[r.on];
        if (onField?.kind === "id")
          continue;
        const targetModel = schema[r.target];
        if (!targetModel)
          continue;
        const onDelete = (() => {
          switch (r.onDelete) {
            case "Cascade":
              return " ON DELETE CASCADE";
            case "SetNull":
              return " ON DELETE SET NULL";
            case "Restrict":
              return " ON DELETE RESTRICT";
            default:
              return " ON DELETE NO ACTION";
          }
        })();
        cols.push(`FOREIGN KEY (${d2.quoteIdent(r.on)}) REFERENCES ${d2.quoteIdent(targetModel.collection)} (${d2.quoteIdent(r.refs)})${onDelete}`);
      }
      const sql = `CREATE TABLE IF NOT EXISTS ${d2.quoteIdent(table)} (
  ${cols.join(",\n  ")}
)`;
      return {
        kind: "table",
        sql,
        name: table,
        table,
        dropSql: `DROP TABLE IF EXISTS ${d2.quoteIdent(table)}`
      };
    }
    function renderColumn(name, field) {
      const d2 = dialect_1.SqliteDialect;
      const colName = d2.quoteIdent(name);
      const type = d2.columnType(field);
      if (field.dbGenerated) {
        return `${colName} ${type} GENERATED ALWAYS AS (${field.dbGenerated}) STORED`;
      }
      if (field.kind === "id" && field.idType === "bigserial") {
        return `${colName} ${type} PRIMARY KEY AUTOINCREMENT`;
      }
      const nullable = field.optional ? "" : " NOT NULL";
      const def = renderDefault(field);
      return `${colName} ${type}${nullable}${def}`;
    }
    function renderDefault(field) {
      if (!field.default) {
        if (field.kind === "embedMany" && !field.optional)
          return ` DEFAULT '[]'`;
        return "";
      }
      switch (field.default.kind) {
        case "now":
          return " DEFAULT CURRENT_TIMESTAMP";
        case "autoId":
          return "";
        // user-supplied
        case "literal": {
          const v2 = field.default.value;
          if (v2 === null)
            return " DEFAULT NULL";
          if (typeof v2 === "boolean")
            return ` DEFAULT ${v2 ? 1 : 0}`;
          if (typeof v2 === "number")
            return ` DEFAULT ${v2}`;
          if (typeof v2 === "string")
            return ` DEFAULT ${escapeSqlString(v2)}`;
          return ` DEFAULT ${escapeSqlString(JSON.stringify(v2))}`;
        }
      }
    }
    function escapeSqlString(v2) {
      return `'${String(v2).replace(/'/g, "''")}'`;
    }
    function buildUniques(m2) {
      const d2 = dialect_1.SqliteDialect;
      const table = m2.collection;
      const out = [];
      for (const [fieldName, field] of Object.entries(m2.fields)) {
        const fd = field;
        if (!fd.unique)
          continue;
        if (fd.kind === "id")
          continue;
        const name = tableConstraintName(table, "uq", [fieldName]);
        out.push({
          kind: "unique",
          name,
          table,
          sql: `CREATE UNIQUE INDEX IF NOT EXISTS ${d2.quoteIdent(name)} ON ${d2.quoteIdent(table)} (${d2.quoteIdent(fieldName)})`,
          dropSql: `DROP INDEX IF EXISTS ${d2.quoteIdent(name)}`
        });
      }
      for (const cols of m2.uniques ?? []) {
        const name = tableConstraintName(table, "uq", cols);
        const colList = cols.map(d2.quoteIdent).join(", ");
        out.push({
          kind: "unique",
          name,
          table,
          sql: `CREATE UNIQUE INDEX IF NOT EXISTS ${d2.quoteIdent(name)} ON ${d2.quoteIdent(table)} (${colList})`,
          dropSql: `DROP INDEX IF EXISTS ${d2.quoteIdent(name)}`
        });
      }
      return out;
    }
    function buildIndexes(m2) {
      const d2 = dialect_1.SqliteDialect;
      const table = m2.collection;
      const out = [];
      for (const idx of m2.indexes ?? []) {
        const i = idx;
        const cols = Object.keys(i.keys);
        const name = i.name ?? tableConstraintName(table, "idx", i.expression ? ["expr"] : cols);
        const uniqueKW = i.unique ? "UNIQUE " : "";
        let payload;
        if (i.expression) {
          payload = `(${i.expression})`;
        } else {
          payload = cols.map((c) => {
            const dir = i.keys[c];
            if (dir === "text")
              return `${d2.quoteIdent(c)}`;
            return `${d2.quoteIdent(c)} ${dir === -1 ? "DESC" : "ASC"}`;
          }).join(", ");
        }
        let whereClause = "";
        if (typeof i.where === "string" && i.where.trim()) {
          whereClause = ` WHERE ${i.where}`;
        } else if (i.where && typeof i.where === "object") {
          const translated = (0, mongo_to_sql_where_1.mongoToSqlWhere)(i.where, {
            quoteIdent: d2.quoteIdent,
            dialect: "sqlite"
          });
          if (translated) {
            whereClause = ` WHERE ${translated}`;
          } else {
            console.warn(`[forge:push:sqlite] index '${name}' has an object-form 'where' that uses operators outside the translator's coverage. Pass a raw SQL string in 'where' or simplify the object. Filter omitted.`);
          }
        } else if (i.partialFilterExpression) {
          const translated = (0, mongo_to_sql_where_1.mongoToSqlWhere)(i.partialFilterExpression, {
            quoteIdent: d2.quoteIdent,
            dialect: "sqlite"
          });
          if (translated)
            whereClause = ` WHERE ${translated}`;
        }
        if (i.include?.length) {
          console.warn(`[forge:push:sqlite] index '${name}' uses include \u2014 INCLUDE is a Postgres-only feature. Ignored on SQLite.`);
        }
        if (i.method === "vector") {
          console.warn(`[forge:push:sqlite] index '${name}' uses method:'vector' \u2014 SQLite vector indexes need sqlite-vec (CREATE VIRTUAL TABLE \u2026 USING vec0). forge-orm doesn't auto-create the vec0 mirror; do it manually if you need ANN search, or use brute-force JSON-array scans.`);
        }
        if (i.method === "spatial") {
          console.warn(`[forge:push:sqlite] index '${name}' uses method:'spatial' \u2014 SQLite spatial indexes are created by the adapter at runtime via SpatiaLite (or skipped in fallback mode). The CREATE INDEX statement below lands as a plain b-tree, which is mostly a no-op for geo queries.`);
        } else if (i.method && i.method !== "btree") {
          console.warn(`[forge:push:sqlite] index '${name}' specifies method='${i.method}' \u2014 SQLite only supports BTREE. Method ignored.`);
        }
        if (i.visible === false || i.parser) {
          console.warn(`[forge:push:sqlite] index '${name}' uses MySQL-only fields (visible / parser). Ignored on SQLite.`);
        }
        out.push({
          kind: "index",
          name,
          table,
          sql: `CREATE ${uniqueKW}INDEX IF NOT EXISTS ${d2.quoteIdent(name)} ON ${d2.quoteIdent(table)} (${payload})${whereClause}`,
          dropSql: `DROP INDEX IF EXISTS ${d2.quoteIdent(name)}`
        });
      }
      return out;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/migrate.js
var require_migrate = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/migrate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyMigration = applyMigration;
    async function applyMigration(db, ddl, opts = {}) {
      const log = opts.logger ?? (() => {
      });
      await db.exec("PRAGMA foreign_keys = ON");
      const applied = [];
      const skipped = [];
      const failures = [];
      const existingTables = new Set((await db.all(`SELECT name FROM sqlite_master WHERE type = 'table'`, [])).map((r) => r.name));
      const existingIndexes = new Set((await db.all(`SELECT name FROM sqlite_master WHERE type = 'index'`, [])).map((r) => r.name));
      await db.exec("BEGIN");
      try {
        for (const stmt of ddl) {
          const present = stmt.kind === "table" ? existingTables.has(stmt.name) : existingIndexes.has(stmt.name);
          if (present) {
            skipped.push(stmt.name);
            continue;
          }
          try {
            await db.exec(stmt.sql);
            applied.push(stmt.name);
            log(`  \u2713 ${stmt.kind.padEnd(11)} ${stmt.name}`);
          } catch (err) {
            failures.push({ name: stmt.name, error: err?.message ?? String(err) });
            log(`  \u2717 ${stmt.kind.padEnd(11)} ${stmt.name}  \u2192  ${err?.message ?? err}`);
          }
        }
        await db.exec("COMMIT");
      } catch (err) {
        try {
          await db.exec("ROLLBACK");
        } catch {
        }
        throw err;
      }
      return { applied, skipped, failures };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/scripts/diff-core.js
var require_diff_core = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/scripts/diff-core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseIgnoreList = parseIgnoreList;
    exports.expectedFromSchema = expectedFromSchema;
    exports.diffIntrospection = diffIntrospection;
    exports.formatDriftReport = formatDriftReport;
    function matchesIgnore(name, spec) {
      for (const p2 of spec) {
        if (typeof p2 === "string") {
          if (p2 === name)
            return true;
        } else if (p2 instanceof RegExp) {
          if (p2.test(name))
            return true;
        }
      }
      return false;
    }
    function parseIgnoreList(raw) {
      if (!raw)
        return [];
      const out = [];
      for (const item of raw.split(",")) {
        const trimmed = item.trim();
        if (!trimmed)
          continue;
        const m2 = /^\/(.+)\/([a-z]*)$/.exec(trimmed);
        if (m2) {
          try {
            out.push(new RegExp(m2[1], m2[2]));
            continue;
          } catch {
          }
        }
        out.push(trimmed);
      }
      return out;
    }
    function indexSig(unique, cols) {
      return `${unique ? "u" : "n"}:${[...cols].sort().join(",")}`;
    }
    function canonOrdered(v2) {
      if (v2 === null || typeof v2 !== "object")
        return v2;
      if (Array.isArray(v2))
        return v2.map(canonOrdered);
      const out = {};
      for (const k of Object.keys(v2).sort()) {
        out[k] = canonOrdered(v2[k]);
      }
      return out;
    }
    function expectedFromSchema(schema) {
      const tables = /* @__PURE__ */ new Map();
      const views = [];
      for (const key of Object.keys(schema)) {
        const m2 = schema[key];
        if (!m2)
          continue;
        if (m2.view) {
          views.push({ name: m2.collection, materialised: m2.view.materialised === true });
          continue;
        }
        const columns = /* @__PURE__ */ new Map();
        let idCol;
        for (const [name, fdef] of Object.entries(m2.fields)) {
          columns.set(name, fdef);
          if (fdef.kind === "id")
            idCol = name;
        }
        const indexSigs = /* @__PURE__ */ new Set();
        const indexDecls = [];
        if (idCol)
          indexSigs.add(indexSig(true, [idCol]));
        for (const [name, fdef] of Object.entries(m2.fields)) {
          const fd = fdef;
          if (fd.unique && fd.kind !== "id")
            indexSigs.add(indexSig(true, [name]));
        }
        for (const cols of m2.uniques ?? [])
          indexSigs.add(indexSig(true, cols));
        for (const idx of m2.indexes ?? []) {
          if (!idx.expression) {
            indexSigs.add(indexSig(idx.unique === true, Object.keys(idx.keys)));
          }
          indexDecls.push({
            name: idx.name,
            unique: idx.unique === true,
            keys: idx.keys,
            method: idx.method,
            where: idx.where,
            include: idx.include,
            expression: idx.expression,
            partialFilterExpression: idx.partialFilterExpression,
            collation: idx.collation,
            wildcardProjection: idx.wildcardProjection
          });
        }
        const fks = [];
        for (const rel of Object.values(m2.relations())) {
          const r = rel;
          if (r.inverse)
            continue;
          if (!m2.fields[r.on])
            continue;
          if (m2.fields[r.on]?.kind === "id")
            continue;
          const target = schema[r.target];
          if (!target)
            continue;
          fks.push({ column: r.on, refTable: target.collection, refColumn: r.refs });
        }
        tables.set(m2.collection, { name: m2.collection, columns, indexSigs, indexDecls, fks });
      }
      return { tables, views };
    }
    function fieldCategory(kind) {
      switch (kind) {
        case "id":
        case "objectId":
        case "string":
        case "text":
        case "uuid":
        case "enum":
          return "string";
        case "int":
          return "int";
        case "bigint":
          return "bigint";
        case "float":
          return "float";
        case "decimal":
          return "decimal";
        case "bool":
          return "bool";
        case "dateTime":
          return "datetime";
        case "json":
        case "embed":
        case "embedMany":
          return "json";
        default:
          return void 0;
      }
    }
    function dbTypeCategory(type) {
      const t = type.toLowerCase();
      if (/^(text|varchar|char|character|uuid|citext)/.test(t))
        return "string";
      if (/^(bigint|int8)/.test(t))
        return "bigint";
      if (/^(smallint|integer|int|int4|int2|mediumint)/.test(t))
        return "int";
      if (/^(numeric|decimal)/.test(t))
        return "decimal";
      if (/^(real|double|float)/.test(t))
        return "float";
      if (/^(bool|tinyint\(1\))/.test(t))
        return "bool";
      if (/^(timestamp|datetime|date|time)/.test(t))
        return "datetime";
      if (/^(json|jsonb)/.test(t))
        return "json";
      return void 0;
    }
    function diffIntrospection(schema, actual, ignore = []) {
      const expected = expectedFromSchema(schema);
      const items = [];
      const dialect = actual.kind;
      const checkTypes = dialect !== "sqlite" && dialect !== "mongo";
      const structuralColumns = dialect !== "mongo";
      const ignored = [];
      const actualTables = /* @__PURE__ */ new Map();
      for (const t of actual.tables)
        actualTables.set(t.name, t);
      for (const [name, exp] of expected.tables) {
        const act = actualTables.get(name);
        if (!act) {
          items.push({ kind: "table", direction: "missing", table: name, detail: `table '${name}' declared in schema but not in DB` });
          continue;
        }
        if (structuralColumns) {
          const actCols = new Map(act.columns.map((c) => [c.name, c]));
          for (const [col, fd] of exp.columns) {
            const ac = actCols.get(col);
            if (!ac) {
              items.push({ kind: "column", direction: "missing", table: name, detail: `column '${col}'` });
              continue;
            }
            if (checkTypes) {
              const ec = fieldCategory(fd.kind);
              const dc = dbTypeCategory(ac.type);
              if (ec && dc && ec !== dc) {
                items.push({ kind: "columnType", direction: "mismatch", table: name, detail: `column '${col}': schema=${ec} db=${ac.type}` });
              }
            }
          }
          for (const ac of act.columns) {
            if (!exp.columns.has(ac.name))
              items.push({ kind: "column", direction: "extra", table: name, detail: `column '${ac.name}' in DB but not in schema` });
          }
        }
        const actSigs = /* @__PURE__ */ new Set();
        const actByName = /* @__PURE__ */ new Map();
        for (const ix of act.indexes) {
          if (/_fts/i.test(ix.name))
            continue;
          actSigs.add(indexSig(ix.unique, ix.columns));
          actByName.set(ix.name, ix);
        }
        for (const sig of exp.indexSigs) {
          if (!actSigs.has(sig))
            items.push({ kind: "index", direction: "missing", table: name, detail: `index ${sig}` });
        }
        for (const sig of actSigs) {
          if (sig.startsWith("u:") && !exp.indexSigs.has(sig))
            items.push({ kind: "index", direction: "extra", table: name, detail: `unique index ${sig} in DB but not in schema` });
        }
        for (const decl of exp.indexDecls) {
          if (!decl.name)
            continue;
          const ix = actByName.get(decl.name);
          if (!ix)
            continue;
          if (ix.method !== void 0) {
            const expM = decl.method ?? "btree";
            if (expM !== ix.method) {
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' method: schema=${expM} db=${ix.method}` });
            }
          }
          const expWhereStr = typeof decl.where === "string" ? decl.where.trim() : void 0;
          const expPfe = decl.partialFilterExpression ?? (typeof decl.where === "object" ? decl.where : void 0);
          if (ix.where !== void 0 && (expWhereStr || ix.where)) {
            const norm = (s) => s.replace(/\s+/g, " ").toLowerCase().trim().replace(/^\(+|\)+$/g, "").trim();
            const a2 = norm(expWhereStr || "");
            const b2 = norm(String(ix.where));
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' where: schema=${a2 || "\u2205"} db=${b2}` });
          }
          if (ix.partialFilterExpression !== void 0) {
            const a2 = expPfe ? JSON.stringify(canonOrdered(expPfe)) : "\u2205";
            const b2 = JSON.stringify(canonOrdered(ix.partialFilterExpression));
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' partialFilter: schema=${a2} db=${b2}` });
          }
          if (ix.include !== void 0) {
            const a2 = (decl.include ?? []).join(",");
            const b2 = (ix.include ?? []).join(",");
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' include: schema=[${a2}] db=[${b2}]` });
          }
          if (ix.expression !== void 0 && (decl.expression || ix.expression)) {
            const norm = (s) => s.replace(/\s+/g, " ").toLowerCase().trim();
            const a2 = decl.expression ? norm(decl.expression) : "";
            const b2 = ix.expression ? norm(ix.expression) : "";
            const ap = a2.replace(/^\(+|\)+$/g, "");
            const bp = b2.replace(/^\(+|\)+$/g, "");
            if (ap !== bp)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' expression: schema='${a2}' db='${b2}'` });
          }
          if (ix.collation && decl.collation) {
            const dk = Object.keys(decl.collation);
            const projected = {};
            for (const k of dk)
              projected[k] = ix.collation[k];
            const a2 = JSON.stringify(canonOrdered(decl.collation));
            const b2 = JSON.stringify(canonOrdered(projected));
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' collation: schema=${a2} db=${b2}` });
          }
          if (ix.wildcardProjection !== void 0 && (decl.wildcardProjection || ix.wildcardProjection)) {
            const a2 = JSON.stringify(canonOrdered(decl.wildcardProjection ?? {}));
            const b2 = JSON.stringify(canonOrdered(ix.wildcardProjection ?? {}));
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' wildcardProjection: schema=${a2} db=${b2}` });
          }
          if (ix.keySpec) {
            const a2 = JSON.stringify(canonOrdered(decl.keys));
            const b2 = JSON.stringify(canonOrdered(ix.keySpec));
            if (a2 !== b2)
              items.push({ kind: "index", direction: "mismatch", table: name, detail: `index '${decl.name}' keys: schema=${a2} db=${b2}` });
          }
        }
        if (dialect !== "mongo") {
          const actFks = new Set(act.foreignKeys.map((f3) => `${f3.column}->${f3.refTable}.${f3.refColumn}`));
          for (const fk of exp.fks) {
            const k = `${fk.column}->${fk.refTable}.${fk.refColumn}`;
            if (!actFks.has(k))
              items.push({ kind: "foreignKey", direction: "missing", table: name, detail: k });
          }
        }
      }
      for (const [name] of actualTables) {
        if (expected.tables.has(name))
          continue;
        if (expected.views.some((v2) => v2.name === name))
          continue;
        if (name === "_forge_migrations" || /_fts/i.test(name))
          continue;
        if (ignore.length > 0 && matchesIgnore(name, ignore)) {
          ignored.push(name);
          continue;
        }
        items.push({ kind: "table", direction: "extra", table: name, detail: `table '${name}' in DB but not in schema` });
      }
      const actualViewNames = new Set(actual.views.map((v2) => v2.name));
      for (const v2 of expected.views) {
        if (!actualViewNames.has(v2.name) && !actualTables.has(v2.name)) {
          items.push({ kind: "view", direction: "missing", table: v2.name, detail: `view '${v2.name}'` });
        }
      }
      return {
        dialect,
        items,
        inSync: items.length === 0,
        ignored: ignored.length > 0 ? ignored : void 0
      };
    }
    function formatDriftReport(r) {
      const ignoredTail = r.ignored && r.ignored.length > 0 ? `
  (ignored ${r.ignored.length} table${r.ignored.length === 1 ? "" : "s"}: ${r.ignored.join(", ")})` : "";
      if (r.inSync)
        return `\u2713 no drift \u2014 live ${r.dialect} schema matches forge schema${ignoredTail}`;
      const lines = [`\u2717 drift detected on ${r.dialect} (${r.items.length} issue${r.items.length === 1 ? "" : "s"}):`];
      for (const it2 of r.items) {
        const tag = it2.direction === "missing" ? "\u2212" : it2.direction === "extra" ? "+" : "\u2260";
        lines.push(`  ${tag} [${it2.kind}] ${it2.table}: ${it2.detail}`);
      }
      if (ignoredTail)
        lines.push(ignoredTail.replace(/^\n  /, "  "));
      return lines.join("\n");
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/drift-apply.js
var require_drift_apply = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/drift-apply.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyDrift = applyDrift;
    var introspect_1 = require_introspect3();
    var ddl_1 = require_ddl2();
    var dialect_1 = require_dialect3();
    var diff_core_1 = require_diff_core();
    async function applyDrift(db, opts) {
      const log = opts.logger ?? (() => {
      });
      const out = { alteredColumns: [], pending: [], failures: [] };
      const introspection = await (0, introspect_1.introspectSqlite)(db);
      const drift = (0, diff_core_1.diffIntrospection)(opts.schema, introspection);
      if (drift.inSync)
        return out;
      const modelByCollection = /* @__PURE__ */ new Map();
      for (const key of Object.keys(opts.schema)) {
        const m2 = opts.schema[key];
        if (m2?.collection)
          modelByCollection.set(m2.collection, m2);
      }
      const adds = [];
      for (const item of drift.items) {
        if (item.kind === "column" && item.direction === "missing") {
          const model3 = modelByCollection.get(item.table);
          if (!model3) {
            out.pending.push(item);
            continue;
          }
          const colName = item.detail.replace(/^column '|'$/g, "");
          const field = model3.fields[colName];
          if (!field) {
            out.pending.push(item);
            continue;
          }
          if (!isSafeAddColumn(field)) {
            out.pending.push(item);
            continue;
          }
          adds.push({ table: item.table, column: colName, field });
          continue;
        }
        out.pending.push(item);
      }
      if (adds.length === 0)
        return out;
      await db.exec("BEGIN");
      try {
        for (const a2 of adds) {
          const stmt = `ALTER TABLE ${dialect_1.SqliteDialect.quoteIdent(a2.table)} ADD COLUMN ${(0, ddl_1.renderColumn)(a2.column, a2.field)}`;
          try {
            await db.exec(stmt);
            out.alteredColumns.push(`${a2.table}.${a2.column}`);
            log(`  \u2713 add-column  ${a2.table}.${a2.column}`);
          } catch (err) {
            out.failures.push({ name: `${a2.table}.${a2.column}`, error: err?.message ?? String(err) });
            log(`  \u2717 add-column  ${a2.table}.${a2.column}  \u2192  ${err?.message ?? err}`);
          }
        }
        await db.exec("COMMIT");
      } catch (err) {
        try {
          await db.exec("ROLLBACK");
        } catch {
        }
        throw err;
      }
      return out;
    }
    function isSafeAddColumn(field) {
      if (field.kind === "id")
        return false;
      if (field.dbGenerated)
        return false;
      if (field.optional)
        return true;
      if (field.default)
        return true;
      return false;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/migrate.js
var require_migrate2 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/migrate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runMigrate = runMigrate;
    var ddl_1 = require_ddl2();
    var migrate_1 = require_migrate();
    var drift_apply_1 = require_drift_apply();
    var active_1 = require_active();
    async function runMigrate(driver, opts = {}) {
      const schema = opts.schema ?? (0, active_1.getActiveSchema)();
      if (!schema) {
        throw new Error("[forge:wasm] $migrate(): no active schema. Pass createDb({ schema }) or runMigrate(driver, { schema }).");
      }
      const ddl = (0, ddl_1.buildSchemaDDL)(schema);
      const createReport = await (0, migrate_1.applyMigration)(driver, ddl, opts.logger ? { logger: opts.logger } : {});
      const wantsDrift = opts.alter !== false;
      if (!wantsDrift || createReport.failures.length > 0) {
        return { ...createReport, alteredColumns: [], pending: [] };
      }
      const driftReport = await (0, drift_apply_1.applyDrift)(driver, opts.logger ? { schema, logger: opts.logger } : { schema });
      const failures = [...createReport.failures, ...driftReport.failures];
      return {
        applied: createReport.applied,
        skipped: createReport.skipped,
        failures,
        alteredColumns: driftReport.alteredColumns,
        pending: driftReport.pending
      };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/migrate.js
var require_migrate3 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/indexeddb/migrate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runMigrate = runMigrate;
    exports.applyDrift = applyDrift;
    var open_1 = require_open();
    async function runMigrate(opts) {
      const log = opts.logger ?? (() => {
      });
      try {
        const r = await (0, open_1.openDb)({ name: opts.name, schema: opts.schema, logger: log });
        r.applied.forEach((a2) => log(`[migrate] ${a2}`));
        r.pending.forEach((p2) => log(`[migrate] pending: ${p2}`));
        r.db.close();
        return {
          applied: r.applied,
          skipped: r.skipped,
          failures: [],
          alteredColumns: [],
          pending: r.pending,
          version: r.version
        };
      } catch (e) {
        return {
          applied: [],
          skipped: [],
          alteredColumns: [],
          pending: [],
          failures: [`migrate failed: ${e.message}`],
          version: 0
        };
      }
    }
    async function applyDrift(opts) {
      return runMigrate(opts);
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/browser-doctor.js
var require_browser_doctor = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/wasm/browser-doctor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.browserDoctor = browserDoctor;
    async function detectEnvironment() {
      const runtime = typeof globalThis.Window !== "undefined" && typeof document !== "undefined" ? "browser" : typeof globalThis.WorkerGlobalScope !== "undefined" ? "worker" : typeof globalThis.process?.versions?.node === "string" ? "node" : "unknown";
      const nav = globalThis.navigator;
      const storage = nav?.storage;
      const opfs = !!storage?.getDirectory;
      const opfsSyncHandles = opfs && runtime === "worker";
      const sharedArrayBuffer = typeof globalThis.SharedArrayBuffer !== "undefined";
      let persistent = "unavailable";
      if (storage?.persisted) {
        try {
          const isPersisted = await storage.persisted();
          persistent = isPersisted ? "granted" : "requestable";
        } catch {
        }
      }
      let estimatedQuotaMB;
      let estimatedUsageMB;
      if (storage?.estimate) {
        try {
          const est = await storage.estimate();
          if (est.quota)
            estimatedQuotaMB = Math.round(est.quota / 1048576);
          if (est.usage)
            estimatedUsageMB = Math.round(est.usage / 1048576);
        } catch {
        }
      }
      return {
        runtime,
        opfs,
        opfsSyncHandles,
        sharedArrayBuffer,
        persistent,
        ...estimatedQuotaMB != null ? { estimatedQuotaMB } : {},
        ...estimatedUsageMB != null ? { estimatedUsageMB } : {},
        ...nav?.userAgent ? { userAgent: nav.userAgent } : {}
      };
    }
    async function probe(fn) {
      try {
        const value = await fn();
        return { ok: true, value };
      } catch (err) {
        return { ok: false, error: err?.message ?? String(err) };
      }
    }
    async function browserDoctor(driver) {
      const environment = await detectEnvironment();
      const notes = [];
      const version = await probe(() => driver.get("SELECT sqlite_version() AS v", []));
      const versionString = version.ok ? version.value?.v : void 0;
      const json1 = await probe(() => driver.get("SELECT json('{}') AS j", []));
      const fts5 = await probe(async () => {
        await driver.exec("CREATE VIRTUAL TABLE IF NOT EXISTS __forge_doctor_fts USING fts5(x)");
        await driver.exec("DROP TABLE IF EXISTS __forge_doctor_fts");
      });
      const rtree = await probe(async () => {
        await driver.exec("CREATE VIRTUAL TABLE IF NOT EXISTS __forge_doctor_rt USING rtree(id, minX, maxX, minY, maxY)");
        await driver.exec("DROP TABLE IF EXISTS __forge_doctor_rt");
      });
      const sqliteVec = await probe(() => driver.get("SELECT vec_version() AS v", []));
      const foreignKeys = await probe(async () => {
        const r = await driver.get("PRAGMA foreign_keys", []);
        return r?.foreign_keys === 1;
      });
      const sqlite = {
        ...versionString ? { version: versionString } : {},
        json1: json1.ok,
        fts5: fts5.ok,
        rtree: rtree.ok,
        sqliteVec: sqliteVec.ok,
        foreignKeys: foreignKeys.ok && foreignKeys.value === true
      };
      const capabilities = {
        softDelete: "native",
        unique: "native",
        partialFilterIndex: "native",
        relationsAndJoins: "native",
        aggregations: "native",
        transactions: "native",
        "json(path)": sqlite.json1 ? "native" : "unavailable",
        "text.searchable() / FTS5": sqlite.fts5 ? "native" : "fallback",
        "geoPoint near / withinPolygon": sqlite.rtree ? "native" : "fallback",
        "vector near / nearTo": sqlite.sqliteVec ? "native" : "fallback",
        "persistent OPFS storage": environment.opfs ? "native" : "unavailable",
        "multi-tab safe": "native"
        // wasm driver runs through SAH pool by default
      };
      if (!environment.opfs) {
        notes.push("OPFS unavailable \u2014 falling back to :memory: storage. Data is lost on tab close. Upgrade to a modern browser (Chrome 109+, Edge 109+, Safari 16.4+, Firefox 111+).");
      }
      if (environment.persistent === "requestable") {
        notes.push("Storage is evictable. Call await navigator.storage.persist() at app boot to flip into persistent mode (especially important on iOS Safari to avoid the 7-day Intelligent-Tracking-Prevention eviction).");
      }
      if (!sqlite.fts5) {
        notes.push("FTS5 not compiled into this sqlite-wasm build. f.text().searchable() falls back to a LIKE-based prefilter \u2014 slower on large tables.");
      }
      if (!sqlite.rtree) {
        notes.push("R-Tree extension not compiled in. f.geoPoint() falls back to bbox + Haversine post-filter in JS. Acceptable to ~50k rows; rebuild with the rtree extension for native spatial index. See forge-orm/wasm-pro.");
      }
      if (!sqlite.sqliteVec) {
        notes.push("sqlite-vec not loaded. f.vector() falls back to brute-force cosine distance in JS. Build forge-orm/wasm-pro to bundle sqlite-vec for HNSW-grade vector search.");
      }
      return { environment, sqlite, capabilities, notes };
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/factory.js
var require_factory = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/factory.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v2) {
      Object.defineProperty(o, "default", { enumerable: true, value: v2 });
    }) : function(o, v2) {
      o["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDb = createDb2;
    var collection_1 = require_collection();
    var coerce_1 = require_coerce();
    var client_1 = require_client2();
    var schema_1 = require_schema();
    var active_1 = require_active();
    var detect_1 = require_detect();
    var adapter_1 = require_adapter();
    var adapter_2 = require_adapter2();
    var adapter_3 = require_adapter3();
    var adapter_4 = require_adapter4();
    var adapter_5 = require_adapter5();
    var adapter_6 = require_adapter6();
    var PROXY_PASSTHROUGH = /* @__PURE__ */ new Set([
      "then",
      "toJSON",
      "toString",
      "valueOf",
      "inspect",
      "constructor",
      "asymmetricMatch",
      "$$typeof",
      "nodeType"
    ]);
    async function createDb2(opts) {
      if (opts.schema)
        (0, active_1.setActiveSchema)(opts.schema);
      const { adapter, url } = await pickAndConnect(opts);
      return makeDb(adapter, url, { strict: opts.strict === true });
    }
    async function pickAndConnect(opts) {
      if ("driver" in opts && opts.driver) {
        const kind2 = opts.driver.kind;
        const label = opts.url ?? `${kind2}:injected`;
        const adapter2 = instantiateAdapter(kind2, opts.driver);
        await adapter2.connect(label);
        return { adapter: adapter2, url: label };
      }
      const url = "url" in opts && opts.url ? opts.url : buildUrlFromStructured(opts);
      const kind = "type" in opts && opts.type || (0, detect_1.detectAdapterKind)(url);
      if (!kind) {
        throw new Error(`[forge] Could not infer adapter from URL '${redactForLog(url)}'.
  Pass an explicit type: createDb({ type: 'mongo' | 'postgres' | 'mysql' | 'sqlite', url })`);
      }
      if ("type" in opts && opts.type && "url" in opts && opts.url) {
        const detected = (0, detect_1.detectAdapterKind)(opts.url);
        if (detected && detected !== opts.type) {
          throw new Error(`[forge] type='${opts.type}' but URL prefix indicates '${detected}'. Fix one of them before continuing.`);
        }
      }
      const adapter = instantiateAdapter(kind);
      await adapter.connect(url);
      return { adapter, url };
    }
    function instantiateAdapter(kind, driver) {
      switch (kind) {
        case "mongo":
          return new adapter_1.MongoAdapter(driver);
        case "postgres":
          return new adapter_2.PostgresAdapter(driver);
        case "mysql":
          return new adapter_3.MysqlAdapter(driver);
        case "sqlite":
          return new adapter_4.SqliteAdapter(driver);
        case "duckdb":
          return new adapter_5.DuckdbAdapter(driver);
        case "mssql":
          return new adapter_6.MssqlAdapter(driver);
        case "indexeddb": {
          const { IndexeddbAdapter } = require_adapter7();
          return new IndexeddbAdapter(driver);
        }
      }
    }
    function buildUrlFromStructured(o) {
      const scheme = o.type === "postgres" ? "postgres" : o.type === "mysql" ? "mysql" : o.type === "sqlite" ? "sqlite" : "mongodb";
      if (o.type === "sqlite")
        return `sqlite:${o.database}`;
      const auth = o.user ? `${encodeURIComponent(o.user)}${o.password ? `:${encodeURIComponent(o.password)}` : ""}@` : "";
      const port = o.port ? `:${o.port}` : "";
      const ssl = o.ssl ? "?sslmode=require" : "";
      return `${scheme}://${auth}${o.host}${port}/${o.database}${ssl}`;
    }
    function redactForLog(url) {
      return url.replace(/(:\/\/[^:@/]+):([^@/]+)@/, "$1:****@");
    }
    function makeRawCaller(run) {
      return function(first, ...values) {
        if (Array.isArray(first) && first.raw && Array.isArray(first.raw)) {
          const frag = { __forgeSql: true, strings: first, values };
          return run(frag);
        }
        return run(first);
      };
    }
    function makeDb(adapter, _url, runtime = { strict: false }) {
      const cache = {};
      const root = new Proxy({}, {
        get: (_t3, prop) => {
          if (typeof prop === "symbol" || PROXY_PASSTHROUGH.has(prop))
            return void 0;
          const key = String(prop);
          if (key === "adapter")
            return adapter;
          if (key === "$transaction")
            return $transaction;
          if (key === "$runCommandRaw")
            return $runCommandRaw;
          if (key === "$queryRaw")
            return makeRawCaller((frag) => adapter.$queryRaw(frag));
          if (key === "$executeRaw")
            return makeRawCaller((frag) => adapter.$executeRaw(frag));
          if (key === "$disconnect")
            return () => adapter.close();
          if (key === "$migrate")
            return $migrate;
          if (key === "$doctor")
            return $doctor;
          if (key === "$diff")
            return $diff;
          if (key === "$on")
            return (event, cb) => adapter.emitter.on(event, cb);
          if (key === "$off")
            return (event, cb) => adapter.emitter.off(event, cb);
          const model3 = schema_1.schema[key];
          if (!model3)
            return void 0;
          if (!cache[key]) {
            cache[key] = new collection_1.CollectionWrapper(model3, void 0, adapter, runtime.strict);
          }
          return cache[key];
        }
      });
      function $transaction(arg) {
        if (Array.isArray(arg))
          return Promise.all(arg);
        return adapter.$transaction(async (session) => arg(makeTx(session)));
      }
      async function $migrate(opts) {
        if (adapter.kind === "sqlite") {
          const { runMigrate } = await Promise.resolve().then(() => __importStar(require_migrate2()));
          const driver = adapter.db;
          return runMigrate(driver, opts);
        }
        if (adapter.kind === "indexeddb") {
          const { runMigrate } = await Promise.resolve().then(() => __importStar(require_migrate3()));
          const url = _url ?? "forge";
          const name = url.startsWith("idb:") ? url.slice(4) || "forge" : url.startsWith("indexeddb:") ? url.slice(10) || "forge" : url || "forge";
          const { getActiveSchema } = await Promise.resolve().then(() => __importStar(require_active()));
          return runMigrate({ name, schema: getActiveSchema(), logger: opts?.logger });
        }
        throw new Error(`[forge] $migrate() is only supported on sqlite + indexeddb adapters today. For ${adapter.kind} use the CLI: 'npx forge push'.`);
      }
      async function $doctor() {
        if (adapter.kind === "sqlite") {
          const { browserDoctor } = await Promise.resolve().then(() => __importStar(require_browser_doctor()));
          const driver = adapter.db;
          return browserDoctor(driver);
        }
        return adapter.doctor();
      }
      async function $diff(opts) {
        const { diffIntrospection } = await Promise.resolve().then(() => __importStar(require_diff_core()));
        if (typeof adapter.introspect !== "function") {
          throw new Error(`[forge] $diff(): adapter '${adapter.kind}' does not support introspection.`);
        }
        const introspection = await adapter.introspect();
        return diffIntrospection(schema_1.schema, introspection, opts?.ignore ?? []);
      }
      function $runCommandRaw(command) {
        if (adapter.kind !== "mongo") {
          throw new Error("[forge] $runCommandRaw is Mongo-only. Use $queryRaw on SQL adapters.");
        }
        return client_1.dbClient.db.command((0, coerce_1.coerceExtendedJSON)(command));
      }
      function makeTx(session) {
        const txCache = {};
        return new Proxy({}, {
          get: (_t3, prop) => {
            if (typeof prop === "symbol" || PROXY_PASSTHROUGH.has(prop))
              return void 0;
            const key = String(prop);
            if (key === "adapter")
              return adapter;
            if (key === "$transaction")
              return (a2) => Array.isArray(a2) ? Promise.all(a2) : a2(makeTx(session));
            if (key === "$queryRaw")
              return makeRawCaller((frag) => adapter.$queryRaw(frag, { session }));
            if (key === "$executeRaw")
              return makeRawCaller((frag) => adapter.$executeRaw(frag, { session }));
            if (key === "$runCommandRaw") {
              if (adapter.kind !== "mongo") {
                return () => Promise.reject(new Error("[forge] $runCommandRaw is Mongo-only."));
              }
              return (c) => client_1.dbClient.db.command(c, { session });
            }
            if (key === "$disconnect")
              return () => adapter.close();
            if (key === "$on")
              return (event, cb) => adapter.emitter.on(event, cb);
            if (key === "$off")
              return (event, cb) => adapter.emitter.off(event, cb);
            const model3 = schema_1.schema[key];
            if (!model3)
              return void 0;
            if (!txCache[key]) {
              txCache[key] = new collection_1.CollectionWrapper(model3, session, adapter, runtime.strict);
            }
            return txCache[key];
          }
        });
      }
      return root;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/wasm-driver.js
var require_wasm_driver = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/sqlite/wasm-driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wasmSqliteDriver = wasmSqliteDriver;
    exports.isWasmSqliteDriver = isWasmSqliteDriver;
    var DEFAULT_URL = "opfs-sahpool:///forge.sqlite";
    function wasmSqliteDriver(opts) {
      const url = opts.url ?? DEFAULT_URL;
      const openTimeoutMs = opts.openTimeoutMs ?? 3e4;
      const requestTimeoutMs = opts.requestTimeoutMs ?? 6e4;
      let workerPromise = Promise.resolve(opts.worker);
      let nextId = 1;
      let opened = null;
      const pending = /* @__PURE__ */ new Map();
      let chain = Promise.resolve();
      async function getWorker() {
        if (!workerPromise)
          throw new Error("[forge:wasm] driver closed");
        return workerPromise;
      }
      function attach(worker) {
        worker.addEventListener("message", (ev) => {
          const msg = ev.data;
          if (!msg || typeof msg.id !== "number")
            return;
          const p2 = pending.get(msg.id);
          if (!p2)
            return;
          pending.delete(msg.id);
          if (p2.timer)
            clearTimeout(p2.timer);
          if (msg.ok)
            p2.resolve(msg);
          else
            p2.reject(buildError(msg));
        });
        worker.addEventListener("error", (ev) => {
          const err = new Error(`[forge:wasm] worker error: ${ev.message ?? "unknown"}`);
          for (const p2 of pending.values()) {
            if (p2.timer)
              clearTimeout(p2.timer);
            p2.reject(err);
          }
          pending.clear();
        });
      }
      function buildError(msg) {
        const e = new Error(msg.error || "[forge:wasm] worker reported error");
        if (msg.code)
          e.code = msg.code;
        return e;
      }
      async function send(body, timeoutMs = requestTimeoutMs) {
        const worker = await getWorker();
        const id = nextId++;
        return new Promise((resolve, reject) => {
          const p2 = {
            id,
            resolve: (v2) => resolve(v2),
            reject
          };
          if (timeoutMs > 0) {
            p2.timer = setTimeout(() => {
              pending.delete(id);
              reject(new Error(`[forge:wasm] request timed out after ${timeoutMs}ms (${String(body.type)})`));
            }, timeoutMs);
          }
          pending.set(id, p2);
          worker.postMessage({ id, ...body });
        });
      }
      async function ensureOpen() {
        if (opened)
          return opened;
        opened = (async () => {
          const worker = await getWorker();
          attach(worker);
          await send({ type: "open", url }, openTimeoutMs);
        })();
        return opened;
      }
      function enqueue(fn) {
        const run = chain.then(() => fn(), () => fn());
        chain = run.catch(() => void 0);
        return run;
      }
      return {
        kind: "sqlite",
        all: (sql, params) => enqueue(async () => {
          await ensureOpen();
          const reply = await send({ type: "all", sql, params });
          return reply.rows ?? [];
        }),
        get: (sql, params) => enqueue(async () => {
          await ensureOpen();
          const reply = await send({ type: "get", sql, params });
          return reply.row;
        }),
        run: (sql, params) => enqueue(async () => {
          await ensureOpen();
          const reply = await send({ type: "run", sql, params });
          return {
            changes: reply.changes ?? 0,
            ...reply.lastInsertRowid != null ? { lastInsertRowid: reply.lastInsertRowid } : {}
          };
        }),
        exec: (sql) => enqueue(async () => {
          await ensureOpen();
          await send({ type: "exec", sql });
        }),
        close: async () => {
          try {
            await send({ type: "close" }, 5e3);
          } catch {
          }
          const w = workerPromise ? await workerPromise.catch(() => null) : null;
          workerPromise = null;
          opened = null;
          if (w)
            w.terminate();
          for (const p2 of pending.values()) {
            if (p2.timer)
              clearTimeout(p2.timer);
            p2.reject(new Error("[forge:wasm] driver closed"));
          }
          pending.clear();
        }
      };
    }
    function isWasmSqliteDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "sqlite";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/driver.js
var require_driver7 = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/adapters/mongo/driver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mongoDriver = mongoDriver;
    exports.isMongoDriver = isMongoDriver;
    function mongoDriver(client, dbName) {
      if (!client || typeof client.db !== "function") {
        throw new Error("[forge] mongoDriver() expects a MongoClient (with a .db() method)");
      }
      return { kind: "mongo", client, dbName };
    }
    function isMongoDriver(v2) {
      return !!v2 && typeof v2 === "object" && v2.kind === "mongo" && typeof v2.client?.db === "function";
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/null-markers.js
var require_null_markers = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/null-markers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ForgeAnyNull = exports.ForgeJsonNull = exports.ForgeDbNull = void 0;
    exports.isForgeNullMarker = isForgeNullMarker;
    exports.ForgeDbNull = Object.freeze({ __forge: "DbNull" });
    exports.ForgeJsonNull = Object.freeze({ __forge: "JsonNull" });
    exports.ForgeAnyNull = Object.freeze({ __forge: "AnyNull" });
    function isForgeNullMarker(v2) {
      return !!v2 && typeof v2 === "object" && "__forge" in v2 && ["DbNull", "JsonNull", "AnyNull"].includes(v2.__forge);
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/validator.js
var require_validator = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/validator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.forgeValidator = forgeValidator;
    function forgeValidator() {
      return (value) => value;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/observability/otel.js
var require_otel = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/observability/otel.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wireOtel = wireOtel;
    var SYSTEM_BY_ADAPTER = {
      postgres: "postgresql",
      mysql: "mysql",
      sqlite: "sqlite",
      mongo: "mongodb"
    };
    function wireOtel(db, opts) {
      const maxLen = opts.maxStatementLen ?? 1024;
      const recordStmt = opts.recordStatement !== false;
      const offQ = db.$on("query", (e) => {
        const sys = opts.dbSystem ?? SYSTEM_BY_ADAPTER[e.adapter];
        const spanName = e.semanticOp ? `forge.${e.semanticOp}` : `forge.${e.op}`;
        const span = opts.tracer.startSpan(spanName, {
          attributes: {
            "db.system": sys,
            "db.operation": e.op,
            "db.collection.name": e.model || void 0,
            "forge.adapter": e.adapter,
            "forge.model": e.model || void 0,
            "forge.row_count": e.rowCount,
            "forge.duration_ms": e.duration_ms,
            ...e.semanticOp ? { "forge.semantic_op": e.semanticOp } : {},
            ...recordStmt && typeof e.sql === "string" ? { "db.statement": truncate(e.sql, maxLen) } : {}
          }
        });
        span.setStatus({ code: 1 });
        span.end();
      });
      const offE = db.$on("error", (e) => {
        const sys = opts.dbSystem ?? SYSTEM_BY_ADAPTER[e.adapter];
        const span = opts.tracer.startSpan(`forge.${e.op}`, {
          attributes: {
            "db.system": sys,
            "db.operation": e.op,
            "db.collection.name": e.model || void 0,
            "forge.adapter": e.adapter,
            "forge.duration_ms": e.duration_ms,
            ...recordStmt && typeof e.sql === "string" ? { "db.statement": truncate(e.sql, maxLen) } : {}
          }
        });
        span.recordException(e.error);
        span.setStatus({ code: 2, message: e.error.message });
        span.end();
      });
      return () => {
        offQ();
        offE();
      };
    }
    function truncate(s, max) {
      return s.length <= max ? s : `${s.slice(0, max - 1)}\u2026`;
    }
  }
});

// node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/forge-orm@2.6.3/node_modules/forge-orm/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setActiveSchema = exports.sampleSchema = exports.embed = exports.enums = exports.rel = exports.model = exports.f = exports.forgeValidator = exports.isForgeNullMarker = exports.ForgeAnyNull = exports.ForgeJsonNull = exports.ForgeDbNull = exports.FORGE_COL = exports.isColRef = exports.col = exports.buildCursor = exports.buildUpdateData = exports.buildProjection = exports.buildOrderBy = exports.buildWhereTree = exports.buildGroupBy = exports.buildDelete = exports.buildUpdate = exports.buildInsert = exports.buildCount = exports.buildSelect = exports.detectAdapterKind = exports.ForgeMissingDriverError = exports.isMssqlDriver = exports.mssqlDriver = exports.isDuckdbDriver = exports.duckdbDriver = exports.isMongoDriver = exports.mongoDriver = exports.isMysqlDriver = exports.planetscaleDriver = exports.mariadbDriver = exports.mysql2Driver = exports.isPostgresDriver = exports.postgresJsDriver = exports.pgDriver = exports.isWasmSqliteDriver = exports.wasmSqliteDriver = exports.isSqliteDriver = exports.tauriSqlDriver = exports.libsqlDriver = exports.opSqliteDriver = exports.expoSqliteDriver = exports.betterSqlite3Driver = exports.createDb = void 0;
    exports.applySqliteMigration = exports.buildSqliteSchemaDDL = exports.browserDoctor = exports.applyDrift = exports.runMigrate = exports.parseIgnoreList = exports.formatDriftReport = exports.expectedFromSchema = exports.diffIntrospection = exports.DbKnownError = exports.RevisionEmbed = exports.SocialLinkEmbed = exports.AddressEmbed = exports.LikeKind = exports.PostStatus = exports.Role = exports.AuditLog = exports.Like = exports.PostTag = exports.Tag = exports.Comment = exports.Post = exports.Profile = exports.User = exports.schema = exports.dbClient = exports.wireOtel = exports.ForgeEmitter = exports.compileSqlFragment = exports.isSqlFragment = exports.forgeSql = exports.buildPostgresCompileApi = exports.getActiveSchema = void 0;
    var factory_1 = require_factory();
    Object.defineProperty(exports, "createDb", { enumerable: true, get: function() {
      return factory_1.createDb;
    } });
    var driver_1 = require_driver3();
    Object.defineProperty(exports, "betterSqlite3Driver", { enumerable: true, get: function() {
      return driver_1.betterSqlite3Driver;
    } });
    Object.defineProperty(exports, "expoSqliteDriver", { enumerable: true, get: function() {
      return driver_1.expoSqliteDriver;
    } });
    Object.defineProperty(exports, "opSqliteDriver", { enumerable: true, get: function() {
      return driver_1.opSqliteDriver;
    } });
    Object.defineProperty(exports, "libsqlDriver", { enumerable: true, get: function() {
      return driver_1.libsqlDriver;
    } });
    Object.defineProperty(exports, "tauriSqlDriver", { enumerable: true, get: function() {
      return driver_1.tauriSqlDriver;
    } });
    Object.defineProperty(exports, "isSqliteDriver", { enumerable: true, get: function() {
      return driver_1.isSqliteDriver;
    } });
    var wasm_driver_1 = require_wasm_driver();
    Object.defineProperty(exports, "wasmSqliteDriver", { enumerable: true, get: function() {
      return wasm_driver_1.wasmSqliteDriver;
    } });
    Object.defineProperty(exports, "isWasmSqliteDriver", { enumerable: true, get: function() {
      return wasm_driver_1.isWasmSqliteDriver;
    } });
    var driver_2 = require_driver();
    Object.defineProperty(exports, "pgDriver", { enumerable: true, get: function() {
      return driver_2.pgDriver;
    } });
    Object.defineProperty(exports, "postgresJsDriver", { enumerable: true, get: function() {
      return driver_2.postgresJsDriver;
    } });
    Object.defineProperty(exports, "isPostgresDriver", { enumerable: true, get: function() {
      return driver_2.isPostgresDriver;
    } });
    var driver_3 = require_driver2();
    Object.defineProperty(exports, "mysql2Driver", { enumerable: true, get: function() {
      return driver_3.mysql2Driver;
    } });
    Object.defineProperty(exports, "mariadbDriver", { enumerable: true, get: function() {
      return driver_3.mariadbDriver;
    } });
    Object.defineProperty(exports, "planetscaleDriver", { enumerable: true, get: function() {
      return driver_3.planetscaleDriver;
    } });
    Object.defineProperty(exports, "isMysqlDriver", { enumerable: true, get: function() {
      return driver_3.isMysqlDriver;
    } });
    var driver_4 = require_driver7();
    Object.defineProperty(exports, "mongoDriver", { enumerable: true, get: function() {
      return driver_4.mongoDriver;
    } });
    Object.defineProperty(exports, "isMongoDriver", { enumerable: true, get: function() {
      return driver_4.isMongoDriver;
    } });
    var driver_5 = require_driver4();
    Object.defineProperty(exports, "duckdbDriver", { enumerable: true, get: function() {
      return driver_5.duckdbDriver;
    } });
    Object.defineProperty(exports, "isDuckdbDriver", { enumerable: true, get: function() {
      return driver_5.isDuckdbDriver;
    } });
    var driver_6 = require_driver5();
    Object.defineProperty(exports, "mssqlDriver", { enumerable: true, get: function() {
      return driver_6.mssqlDriver;
    } });
    Object.defineProperty(exports, "isMssqlDriver", { enumerable: true, get: function() {
      return driver_6.isMssqlDriver;
    } });
    var missing_driver_1 = require_missing_driver();
    Object.defineProperty(exports, "ForgeMissingDriverError", { enumerable: true, get: function() {
      return missing_driver_1.ForgeMissingDriverError;
    } });
    var detect_1 = require_detect();
    Object.defineProperty(exports, "detectAdapterKind", { enumerable: true, get: function() {
      return detect_1.detectAdapterKind;
    } });
    var build_1 = require_build();
    Object.defineProperty(exports, "buildSelect", { enumerable: true, get: function() {
      return build_1.buildSelect;
    } });
    Object.defineProperty(exports, "buildCount", { enumerable: true, get: function() {
      return build_1.buildCount;
    } });
    Object.defineProperty(exports, "buildInsert", { enumerable: true, get: function() {
      return build_1.buildInsert;
    } });
    Object.defineProperty(exports, "buildUpdate", { enumerable: true, get: function() {
      return build_1.buildUpdate;
    } });
    Object.defineProperty(exports, "buildDelete", { enumerable: true, get: function() {
      return build_1.buildDelete;
    } });
    Object.defineProperty(exports, "buildGroupBy", { enumerable: true, get: function() {
      return build_1.buildGroupBy;
    } });
    Object.defineProperty(exports, "buildWhereTree", { enumerable: true, get: function() {
      return build_1.buildWhereTree;
    } });
    Object.defineProperty(exports, "buildOrderBy", { enumerable: true, get: function() {
      return build_1.buildOrderBy;
    } });
    Object.defineProperty(exports, "buildProjection", { enumerable: true, get: function() {
      return build_1.buildProjection;
    } });
    Object.defineProperty(exports, "buildUpdateData", { enumerable: true, get: function() {
      return build_1.buildUpdateData;
    } });
    Object.defineProperty(exports, "buildCursor", { enumerable: true, get: function() {
      return build_1.buildCursor;
    } });
    var col_1 = require_col();
    Object.defineProperty(exports, "col", { enumerable: true, get: function() {
      return col_1.col;
    } });
    Object.defineProperty(exports, "isColRef", { enumerable: true, get: function() {
      return col_1.isColRef;
    } });
    Object.defineProperty(exports, "FORGE_COL", { enumerable: true, get: function() {
      return col_1.FORGE_COL;
    } });
    var null_markers_1 = require_null_markers();
    Object.defineProperty(exports, "ForgeDbNull", { enumerable: true, get: function() {
      return null_markers_1.ForgeDbNull;
    } });
    Object.defineProperty(exports, "ForgeJsonNull", { enumerable: true, get: function() {
      return null_markers_1.ForgeJsonNull;
    } });
    Object.defineProperty(exports, "ForgeAnyNull", { enumerable: true, get: function() {
      return null_markers_1.ForgeAnyNull;
    } });
    Object.defineProperty(exports, "isForgeNullMarker", { enumerable: true, get: function() {
      return null_markers_1.isForgeNullMarker;
    } });
    var validator_1 = require_validator();
    Object.defineProperty(exports, "forgeValidator", { enumerable: true, get: function() {
      return validator_1.forgeValidator;
    } });
    var core_1 = require_core();
    Object.defineProperty(exports, "f", { enumerable: true, get: function() {
      return core_1.f;
    } });
    Object.defineProperty(exports, "model", { enumerable: true, get: function() {
      return core_1.model;
    } });
    Object.defineProperty(exports, "rel", { enumerable: true, get: function() {
      return core_1.rel;
    } });
    Object.defineProperty(exports, "enums", { enumerable: true, get: function() {
      return core_1.enums;
    } });
    Object.defineProperty(exports, "embed", { enumerable: true, get: function() {
      return core_1.embed;
    } });
    var schema_1 = require_schema();
    Object.defineProperty(exports, "sampleSchema", { enumerable: true, get: function() {
      return schema_1.sampleSchema;
    } });
    var active_1 = require_active();
    Object.defineProperty(exports, "setActiveSchema", { enumerable: true, get: function() {
      return active_1.setActiveSchema;
    } });
    Object.defineProperty(exports, "getActiveSchema", { enumerable: true, get: function() {
      return active_1.getActiveSchema;
    } });
    var compile_1 = require_compile2();
    Object.defineProperty(exports, "buildPostgresCompileApi", { enumerable: true, get: function() {
      return compile_1.buildPostgresCompileApi;
    } });
    var raw_sql_1 = require_raw_sql();
    Object.defineProperty(exports, "forgeSql", { enumerable: true, get: function() {
      return raw_sql_1.forgeSql;
    } });
    Object.defineProperty(exports, "isSqlFragment", { enumerable: true, get: function() {
      return raw_sql_1.isSqlFragment;
    } });
    Object.defineProperty(exports, "compileSqlFragment", { enumerable: true, get: function() {
      return raw_sql_1.compileSqlFragment;
    } });
    var events_1 = require_events();
    Object.defineProperty(exports, "ForgeEmitter", { enumerable: true, get: function() {
      return events_1.ForgeEmitter;
    } });
    var otel_1 = require_otel();
    Object.defineProperty(exports, "wireOtel", { enumerable: true, get: function() {
      return otel_1.wireOtel;
    } });
    var client_1 = require_client2();
    Object.defineProperty(exports, "dbClient", { enumerable: true, get: function() {
      return client_1.dbClient;
    } });
    var schema_2 = require_schema();
    Object.defineProperty(exports, "schema", { enumerable: true, get: function() {
      return schema_2.schema;
    } });
    Object.defineProperty(exports, "User", { enumerable: true, get: function() {
      return schema_2.User;
    } });
    Object.defineProperty(exports, "Profile", { enumerable: true, get: function() {
      return schema_2.Profile;
    } });
    Object.defineProperty(exports, "Post", { enumerable: true, get: function() {
      return schema_2.Post;
    } });
    Object.defineProperty(exports, "Comment", { enumerable: true, get: function() {
      return schema_2.Comment;
    } });
    Object.defineProperty(exports, "Tag", { enumerable: true, get: function() {
      return schema_2.Tag;
    } });
    Object.defineProperty(exports, "PostTag", { enumerable: true, get: function() {
      return schema_2.PostTag;
    } });
    Object.defineProperty(exports, "Like", { enumerable: true, get: function() {
      return schema_2.Like;
    } });
    Object.defineProperty(exports, "AuditLog", { enumerable: true, get: function() {
      return schema_2.AuditLog;
    } });
    Object.defineProperty(exports, "Role", { enumerable: true, get: function() {
      return schema_2.Role;
    } });
    Object.defineProperty(exports, "PostStatus", { enumerable: true, get: function() {
      return schema_2.PostStatus;
    } });
    Object.defineProperty(exports, "LikeKind", { enumerable: true, get: function() {
      return schema_2.LikeKind;
    } });
    Object.defineProperty(exports, "AddressEmbed", { enumerable: true, get: function() {
      return schema_2.AddressEmbed;
    } });
    Object.defineProperty(exports, "SocialLinkEmbed", { enumerable: true, get: function() {
      return schema_2.SocialLinkEmbed;
    } });
    Object.defineProperty(exports, "RevisionEmbed", { enumerable: true, get: function() {
      return schema_2.RevisionEmbed;
    } });
    var errors_1 = require_errors();
    Object.defineProperty(exports, "DbKnownError", { enumerable: true, get: function() {
      return errors_1.DbKnownError;
    } });
    var diff_core_1 = require_diff_core();
    Object.defineProperty(exports, "diffIntrospection", { enumerable: true, get: function() {
      return diff_core_1.diffIntrospection;
    } });
    Object.defineProperty(exports, "expectedFromSchema", { enumerable: true, get: function() {
      return diff_core_1.expectedFromSchema;
    } });
    Object.defineProperty(exports, "formatDriftReport", { enumerable: true, get: function() {
      return diff_core_1.formatDriftReport;
    } });
    Object.defineProperty(exports, "parseIgnoreList", { enumerable: true, get: function() {
      return diff_core_1.parseIgnoreList;
    } });
    var migrate_1 = require_migrate2();
    Object.defineProperty(exports, "runMigrate", { enumerable: true, get: function() {
      return migrate_1.runMigrate;
    } });
    var drift_apply_1 = require_drift_apply();
    Object.defineProperty(exports, "applyDrift", { enumerable: true, get: function() {
      return drift_apply_1.applyDrift;
    } });
    var browser_doctor_1 = require_browser_doctor();
    Object.defineProperty(exports, "browserDoctor", { enumerable: true, get: function() {
      return browser_doctor_1.browserDoctor;
    } });
    var ddl_1 = require_ddl2();
    Object.defineProperty(exports, "buildSqliteSchemaDDL", { enumerable: true, get: function() {
      return ddl_1.buildSchemaDDL;
    } });
    var migrate_2 = require_migrate();
    Object.defineProperty(exports, "applySqliteMigration", { enumerable: true, get: function() {
      return migrate_2.applyMigration;
    } });
  }
});

// index.js
var import_forge_orm2 = __toESM(require_dist(), 1);

// node_modules/.pnpm/@neondatabase+serverless@1.1.0/node_modules/@neondatabase/serverless/index.mjs
var So = Object.create;
var Ie = Object.defineProperty;
var Eo = Object.getOwnPropertyDescriptor;
var Ao = Object.getOwnPropertyNames;
var Co = Object.getPrototypeOf;
var _o = Object.prototype.hasOwnProperty;
var Io = (r, e, t) => e in r ? Ie(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
var a = (r, e) => Ie(r, "name", { value: e, configurable: true });
var G = (r, e) => () => (r && (e = r(r = 0)), e);
var T = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var ie = (r, e) => {
  for (var t in e) Ie(r, t, {
    get: e[t],
    enumerable: true
  });
};
var Dn = (r, e, t, n) => {
  if (e && typeof e == "object" || typeof e == "function") for (let i of Ao(e)) !_o.call(r, i) && i !== t && Ie(r, i, { get: () => e[i], enumerable: !(n = Eo(e, i)) || n.enumerable });
  return r;
};
var Se = (r, e, t) => (t = r != null ? So(Co(r)) : {}, Dn(e || !r || !r.__esModule ? Ie(t, "default", { value: r, enumerable: true }) : t, r));
var O = (r) => Dn(Ie({}, "__esModule", { value: true }), r);
var E = (r, e, t) => Io(r, typeof e != "symbol" ? e + "" : e, t);
var Qn = T((lt) => {
  "use strict";
  p();
  lt.byteLength = Po;
  lt.toByteArray = Bo;
  lt.fromByteArray = ko;
  var ae = [], te = [], To = typeof Uint8Array < "u" ? Uint8Array : Array, qt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (Ee = 0, On = qt.length; Ee < On; ++Ee) ae[Ee] = qt[Ee], te[qt.charCodeAt(Ee)] = Ee;
  var Ee, On;
  te[45] = 62;
  te[95] = 63;
  function qn(r) {
    var e = r.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var t = r.indexOf("=");
    t === -1 && (t = e);
    var n = t === e ? 0 : 4 - t % 4;
    return [t, n];
  }
  a(qn, "getLens");
  function Po(r) {
    var e = qn(r), t = e[0], n = e[1];
    return (t + n) * 3 / 4 - n;
  }
  a(Po, "byteLength");
  function Ro(r, e, t) {
    return (e + t) * 3 / 4 - t;
  }
  a(Ro, "_byteLength");
  function Bo(r) {
    var e, t = qn(r), n = t[0], i = t[1], s = new To(Ro(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
    for (c = 0; c < u; c += 4) e = te[r.charCodeAt(c)] << 18 | te[r.charCodeAt(c + 1)] << 12 | te[r.charCodeAt(c + 2)] << 6 | te[r.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
    return i === 2 && (e = te[r.charCodeAt(
      c
    )] << 2 | te[r.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = te[r.charCodeAt(c)] << 10 | te[r.charCodeAt(c + 1)] << 4 | te[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
  }
  a(Bo, "toByteArray");
  function Lo(r) {
    return ae[r >> 18 & 63] + ae[r >> 12 & 63] + ae[r >> 6 & 63] + ae[r & 63];
  }
  a(Lo, "tripletToBase64");
  function Fo(r, e, t) {
    for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(Lo(n));
    return i.join("");
  }
  a(Fo, "encodeChunk");
  function ko(r) {
    for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s) i.push(Fo(
      r,
      o,
      o + s > u ? u : o + s
    ));
    return n === 1 ? (e = r[t - 1], i.push(ae[e >> 2] + ae[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(ae[e >> 10] + ae[e >> 4 & 63] + ae[e << 2 & 63] + "=")), i.join("");
  }
  a(ko, "fromByteArray");
});
var Nn = T((Qt) => {
  p();
  Qt.read = function(r, e, t, n, i) {
    var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, l = c >> 1, f3 = -7, y = t ? i - 1 : 0, g = t ? -1 : 1, A = r[e + y];
    for (y += g, s = A & (1 << -f3) - 1, A >>= -f3, f3 += u; f3 > 0; s = s * 256 + r[e + y], y += g, f3 -= 8) ;
    for (o = s & (1 << -f3) - 1, s >>= -f3, f3 += n; f3 > 0; o = o * 256 + r[e + y], y += g, f3 -= 8) ;
    if (s === 0) s = 1 - l;
    else {
      if (s === c) return o ? NaN : (A ? -1 : 1) * (1 / 0);
      o = o + Math.pow(2, n), s = s - l;
    }
    return (A ? -1 : 1) * o * Math.pow(2, s - n);
  };
  Qt.write = function(r, e, t, n, i, s) {
    var o, u, c, l = s * 8 - i - 1, f3 = (1 << l) - 1, y = f3 >> 1, g = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, A = n ? 0 : s - 1, C = n ? 1 : -1, D = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = f3) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + y >= 1 ? e += g / c : e += g * Math.pow(2, 1 - y), e * c >= 2 && (o++, c /= 2), o + y >= f3 ? (u = 0, o = f3) : o + y >= 1 ? (u = (e * c - 1) * Math.pow(2, i), o = o + y) : (u = e * Math.pow(2, y - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + A] = u & 255, A += C, u /= 256, i -= 8) ;
    for (o = o << i | u, l += i; l > 0; r[t + A] = o & 255, A += C, o /= 256, l -= 8) ;
    r[t + A - C] |= D * 128;
  };
});
var ii = T((Be) => {
  "use strict";
  p();
  var Nt = Qn(), Pe = Nn(), Wn = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
  Be.Buffer = h;
  Be.SlowBuffer = Qo;
  Be.INSPECT_MAX_BYTES = 50;
  var ft = 2147483647;
  Be.kMaxLength = ft;
  h.TYPED_ARRAY_SUPPORT = Mo();
  !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function Mo() {
    try {
      let r = new Uint8Array(1), e = { foo: a(function() {
        return 42;
      }, "foo") };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42;
    } catch {
      return false;
    }
  }
  a(Mo, "typedArraySupport");
  Object.defineProperty(h.prototype, "parent", { enumerable: true, get: a(function() {
    if (h.isBuffer(this)) return this.buffer;
  }, "get") });
  Object.defineProperty(h.prototype, "offset", { enumerable: true, get: a(function() {
    if (h.isBuffer(
      this
    )) return this.byteOffset;
  }, "get") });
  function he(r) {
    if (r > ft) throw new RangeError('The value "' + r + '" is invalid for option "size"');
    let e = new Uint8Array(r);
    return Object.setPrototypeOf(e, h.prototype), e;
  }
  a(he, "createBuffer");
  function h(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string") throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      );
      return $t(r);
    }
    return Gn(r, e, t);
  }
  a(h, "Buffer");
  h.poolSize = 8192;
  function Gn(r, e, t) {
    if (typeof r == "string") return Do(r, e);
    if (ArrayBuffer.isView(r)) return Oo(r);
    if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
    if (ue(r, ArrayBuffer) || r && ue(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(r, SharedArrayBuffer) || r && ue(
      r.buffer,
      SharedArrayBuffer
    ))) return jt(r, e, t);
    if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    let n = r.valueOf && r.valueOf();
    if (n != null && n !== r) return h.from(n, e, t);
    let i = qo(r);
    if (i) return i;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return h.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
  }
  a(Gn, "from");
  h.from = function(r, e, t) {
    return Gn(r, e, t);
  };
  Object.setPrototypeOf(
    h.prototype,
    Uint8Array.prototype
  );
  Object.setPrototypeOf(h, Uint8Array);
  function Vn(r) {
    if (typeof r != "number") throw new TypeError(
      '"size" argument must be of type number'
    );
    if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  a(Vn, "assertSize");
  function Uo(r, e, t) {
    return Vn(r), r <= 0 ? he(r) : e !== void 0 ? typeof t == "string" ? he(r).fill(e, t) : he(r).fill(e) : he(r);
  }
  a(Uo, "alloc");
  h.alloc = function(r, e, t) {
    return Uo(r, e, t);
  };
  function $t(r) {
    return Vn(r), he(r < 0 ? 0 : Gt(r) | 0);
  }
  a($t, "allocUnsafe");
  h.allocUnsafe = function(r) {
    return $t(
      r
    );
  };
  h.allocUnsafeSlow = function(r) {
    return $t(r);
  };
  function Do(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !h.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
    let t = zn(r, e) | 0, n = he(t), i = n.write(
      r,
      e
    );
    return i !== t && (n = n.slice(0, i)), n;
  }
  a(Do, "fromString");
  function Wt(r) {
    let e = r.length < 0 ? 0 : Gt(r.length) | 0, t = he(e);
    for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
    return t;
  }
  a(Wt, "fromArrayLike");
  function Oo(r) {
    if (ue(r, Uint8Array)) {
      let e = new Uint8Array(r);
      return jt(e.buffer, e.byteOffset, e.byteLength);
    }
    return Wt(r);
  }
  a(Oo, "fromArrayView");
  function jt(r, e, t) {
    if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(
      r,
      e,
      t
    ), Object.setPrototypeOf(n, h.prototype), n;
  }
  a(jt, "fromArrayBuffer");
  function qo(r) {
    if (h.isBuffer(r)) {
      let e = Gt(r.length) | 0, t = he(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0) return typeof r.length != "number" || zt(r.length) ? he(0) : Wt(r);
    if (r.type === "Buffer" && Array.isArray(r.data)) return Wt(r.data);
  }
  a(qo, "fromObject");
  function Gt(r) {
    if (r >= ft) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ft.toString(16) + " bytes");
    return r | 0;
  }
  a(Gt, "checked");
  function Qo(r) {
    return +r != r && (r = 0), h.alloc(+r);
  }
  a(Qo, "SlowBuffer");
  h.isBuffer = a(function(e) {
    return e != null && e._isBuffer === true && e !== h.prototype;
  }, "isBuffer");
  h.compare = a(function(e, t) {
    if (ue(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), ue(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(e) || !h.isBuffer(t)) throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    );
    if (e === t) return 0;
    let n = e.length, i = t.length;
    for (let s = 0, o = Math.min(n, i); s < o; ++s) if (e[s] !== t[s]) {
      n = e[s], i = t[s];
      break;
    }
    return n < i ? -1 : i < n ? 1 : 0;
  }, "compare");
  h.isEncoding = a(function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, "isEncoding");
  h.concat = a(function(e, t) {
    if (!Array.isArray(e)) throw new TypeError(
      '"list" argument must be an Array of Buffers'
    );
    if (e.length === 0) return h.alloc(0);
    let n;
    if (t === void 0)
      for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
    let i = h.allocUnsafe(t), s = 0;
    for (n = 0; n < e.length; ++n) {
      let o = e[n];
      if (ue(o, Uint8Array)) s + o.length > i.length ? (h.isBuffer(o) || (o = h.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
      else if (h.isBuffer(o)) o.copy(i, s);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      s += o.length;
    }
    return i;
  }, "concat");
  function zn(r, e) {
    if (h.isBuffer(r)) return r.length;
    if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer)) return r.byteLength;
    if (typeof r != "string") throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
    );
    let t = r.length, n = arguments.length > 2 && arguments[2] === true;
    if (!n && t === 0) return 0;
    let i = false;
    for (; ; ) switch (e) {
      case "ascii":
      case "latin1":
      case "binary":
        return t;
      case "utf8":
      case "utf-8":
        return Ht(r).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return t * 2;
      case "hex":
        return t >>> 1;
      case "base64":
        return ni(r).length;
      default:
        if (i) return n ? -1 : Ht(r).length;
        e = ("" + e).toLowerCase(), i = true;
    }
  }
  a(zn, "byteLength");
  h.byteLength = zn;
  function No(r, e, t) {
    let n = false;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
    for (r || (r = "utf8"); ; ) switch (r) {
      case "hex":
        return Zo(this, e, t);
      case "utf8":
      case "utf-8":
        return Yn(this, e, t);
      case "ascii":
        return Ko(this, e, t);
      case "latin1":
      case "binary":
        return Yo(
          this,
          e,
          t
        );
      case "base64":
        return Vo(this, e, t);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Jo(
          this,
          e,
          t
        );
      default:
        if (n) throw new TypeError("Unknown encoding: " + r);
        r = (r + "").toLowerCase(), n = true;
    }
  }
  a(
    No,
    "slowToString"
  );
  h.prototype._isBuffer = true;
  function Ae(r, e, t) {
    let n = r[e];
    r[e] = r[t], r[t] = n;
  }
  a(Ae, "swap");
  h.prototype.swap16 = a(function() {
    let e = this.length;
    if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2) Ae(this, t, t + 1);
    return this;
  }, "swap16");
  h.prototype.swap32 = a(function() {
    let e = this.length;
    if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4) Ae(this, t, t + 3), Ae(this, t + 1, t + 2);
    return this;
  }, "swap32");
  h.prototype.swap64 = a(
    function() {
      let e = this.length;
      if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let t = 0; t < e; t += 8) Ae(this, t, t + 7), Ae(this, t + 1, t + 6), Ae(this, t + 2, t + 5), Ae(this, t + 3, t + 4);
      return this;
    },
    "swap64"
  );
  h.prototype.toString = a(function() {
    let e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? Yn(
      this,
      0,
      e
    ) : No.apply(this, arguments);
  }, "toString");
  h.prototype.toLocaleString = h.prototype.toString;
  h.prototype.equals = a(function(e) {
    if (!h.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? true : h.compare(this, e) === 0;
  }, "equals");
  h.prototype.inspect = a(function() {
    let e = "", t = Be.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, "inspect");
  Wn && (h.prototype[Wn] = h.prototype.inspect);
  h.prototype.compare = a(function(e, t, n, i, s) {
    if (ue(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
    if (i >= s && t >= n) return 0;
    if (i >= s) return -1;
    if (t >= n) return 1;
    if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
    let o = s - i, u = n - t, c = Math.min(o, u), l = this.slice(
      i,
      s
    ), f3 = e.slice(t, n);
    for (let y = 0; y < c; ++y) if (l[y] !== f3[y]) {
      o = l[y], u = f3[y];
      break;
    }
    return o < u ? -1 : u < o ? 1 : 0;
  }, "compare");
  function Kn(r, e, t, n, i) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, zt(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (i) return -1;
      t = r.length - 1;
    } else if (t < 0) if (i) t = 0;
    else return -1;
    if (typeof e == "string" && (e = h.from(
      e,
      n
    )), h.isBuffer(e)) return e.length === 0 ? -1 : jn(r, e, t, n, i);
    if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : jn(r, [e], t, n, i);
    throw new TypeError("val must be string, number or Buffer");
  }
  a(Kn, "bidirectionalIndexOf");
  function jn(r, e, t, n, i) {
    let s = 1, o = r.length, u = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2) return -1;
      s = 2, o /= 2, u /= 2, t /= 2;
    }
    function c(f3, y) {
      return s === 1 ? f3[y] : f3.readUInt16BE(y * s);
    }
    a(c, "read");
    let l;
    if (i) {
      let f3 = -1;
      for (l = t; l < o; l++) if (c(r, l) === c(e, f3 === -1 ? 0 : l - f3)) {
        if (f3 === -1 && (f3 = l), l - f3 + 1 === u) return f3 * s;
      } else f3 !== -1 && (l -= l - f3), f3 = -1;
    } else for (t + u > o && (t = o - u), l = t; l >= 0; l--) {
      let f3 = true;
      for (let y = 0; y < u; y++) if (c(r, l + y) !== c(e, y)) {
        f3 = false;
        break;
      }
      if (f3) return l;
    }
    return -1;
  }
  a(jn, "arrayIndexOf");
  h.prototype.includes = a(function(e, t, n) {
    return this.indexOf(
      e,
      t,
      n
    ) !== -1;
  }, "includes");
  h.prototype.indexOf = a(function(e, t, n) {
    return Kn(this, e, t, n, true);
  }, "indexOf");
  h.prototype.lastIndexOf = a(function(e, t, n) {
    return Kn(this, e, t, n, false);
  }, "lastIndexOf");
  function Wo(r, e, t, n) {
    t = Number(t) || 0;
    let i = r.length - t;
    n ? (n = Number(n), n > i && (n = i)) : n = i;
    let s = e.length;
    n > s / 2 && (n = s / 2);
    let o;
    for (o = 0; o < n; ++o) {
      let u = parseInt(e.substr(o * 2, 2), 16);
      if (zt(u)) return o;
      r[t + o] = u;
    }
    return o;
  }
  a(Wo, "hexWrite");
  function jo(r, e, t, n) {
    return ht(Ht(e, r.length - t), r, t, n);
  }
  a(jo, "utf8Write");
  function Ho(r, e, t, n) {
    return ht(ra(e), r, t, n);
  }
  a(
    Ho,
    "asciiWrite"
  );
  function $o(r, e, t, n) {
    return ht(ni(e), r, t, n);
  }
  a($o, "base64Write");
  function Go(r, e, t, n) {
    return ht(
      na(e, r.length - t),
      r,
      t,
      n
    );
  }
  a(Go, "ucs2Write");
  h.prototype.write = a(function(e, t, n, i) {
    if (t === void 0) i = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    let s = this.length - t;
    if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    i || (i = "utf8");
    let o = false;
    for (; ; ) switch (i) {
      case "hex":
        return Wo(this, e, t, n);
      case "utf8":
      case "utf-8":
        return jo(this, e, t, n);
      case "ascii":
      case "latin1":
      case "binary":
        return Ho(this, e, t, n);
      case "base64":
        return $o(this, e, t, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Go(this, e, t, n);
      default:
        if (o) throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = true;
    }
  }, "write");
  h.prototype.toJSON = a(function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  }, "toJSON");
  function Vo(r, e, t) {
    return e === 0 && t === r.length ? Nt.fromByteArray(r) : Nt.fromByteArray(r.slice(e, t));
  }
  a(Vo, "base64Slice");
  function Yn(r, e, t) {
    t = Math.min(r.length, t);
    let n = [], i = e;
    for (; i < t; ) {
      let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
      if (i + u <= t) {
        let c, l, f3, y;
        switch (u) {
          case 1:
            s < 128 && (o = s);
            break;
          case 2:
            c = r[i + 1], (c & 192) === 128 && (y = (s & 31) << 6 | c & 63, y > 127 && (o = y));
            break;
          case 3:
            c = r[i + 1], l = r[i + 2], (c & 192) === 128 && (l & 192) === 128 && (y = (s & 15) << 12 | (c & 63) << 6 | l & 63, y > 2047 && (y < 55296 || y > 57343) && (o = y));
            break;
          case 4:
            c = r[i + 1], l = r[i + 2], f3 = r[i + 3], (c & 192) === 128 && (l & 192) === 128 && (f3 & 192) === 128 && (y = (s & 15) << 18 | (c & 63) << 12 | (l & 63) << 6 | f3 & 63, y > 65535 && y < 1114112 && (o = y));
        }
      }
      o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
    }
    return zo(n);
  }
  a(Yn, "utf8Slice");
  var Hn = 4096;
  function zo(r) {
    let e = r.length;
    if (e <= Hn) return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; ) t += String.fromCharCode.apply(String, r.slice(n, n += Hn));
    return t;
  }
  a(zo, "decodeCodePointsArray");
  function Ko(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
    return n;
  }
  a(Ko, "asciiSlice");
  function Yo(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
    return n;
  }
  a(Yo, "latin1Slice");
  function Zo(r, e, t) {
    let n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let i = "";
    for (let s = e; s < t; ++s) i += ia[r[s]];
    return i;
  }
  a(Zo, "hexSlice");
  function Jo(r, e, t) {
    let n = r.slice(e, t), i = "";
    for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
    return i;
  }
  a(Jo, "utf16leSlice");
  h.prototype.slice = a(function(e, t) {
    let n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    let i = this.subarray(e, t);
    return Object.setPrototypeOf(i, h.prototype), i;
  }, "slice");
  function q(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError("Trying to access beyond buffer length");
  }
  a(q, "checkOffset");
  h.prototype.readUintLE = h.prototype.readUIntLE = a(
    function(e, t, n) {
      e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
      let i = this[e], s = 1, o = 0;
      for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
      return i;
    },
    "readUIntLE"
  );
  h.prototype.readUintBE = h.prototype.readUIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(
      e,
      t,
      this.length
    );
    let i = this[e + --t], s = 1;
    for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
    return i;
  }, "readUIntBE");
  h.prototype.readUint8 = h.prototype.readUInt8 = a(
    function(e, t) {
      return e = e >>> 0, t || q(e, 1, this.length), this[e];
    },
    "readUInt8"
  );
  h.prototype.readUint16LE = h.prototype.readUInt16LE = a(function(e, t) {
    return e = e >>> 0, t || q(
      e,
      2,
      this.length
    ), this[e] | this[e + 1] << 8;
  }, "readUInt16LE");
  h.prototype.readUint16BE = h.prototype.readUInt16BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, "readUInt16BE");
  h.prototype.readUint32LE = h.prototype.readUInt32LE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, "readUInt32LE");
  h.prototype.readUint32BE = h.prototype.readUInt32BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, "readUInt32BE");
  h.prototype.readBigUInt64LE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(i) + (BigInt(s) << BigInt(32));
  }, "readBigUInt64LE"));
  h.prototype.readBigUInt64BE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(s);
  }, "readBigUInt64BE"));
  h.prototype.readIntLE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(
      e,
      t,
      this.length
    );
    let i = this[e], s = 1, o = 0;
    for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
    return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
  }, "readIntLE");
  h.prototype.readIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
    let i = t, s = 1, o = this[e + --i];
    for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
    return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
  }, "readIntBE");
  h.prototype.readInt8 = a(function(e, t) {
    return e = e >>> 0, t || q(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, "readInt8");
  h.prototype.readInt16LE = a(function(e, t) {
    e = e >>> 0, t || q(
      e,
      2,
      this.length
    );
    let n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16LE");
  h.prototype.readInt16BE = a(function(e, t) {
    e = e >>> 0, t || q(e, 2, this.length);
    let n = this[e + 1] | this[e] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16BE");
  h.prototype.readInt32LE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, "readInt32LE");
  h.prototype.readInt32BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, "readInt32BE");
  h.prototype.readBigInt64LE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }, "readBigInt64LE"));
  h.prototype.readBigInt64BE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(i) << BigInt(32)) + BigInt(
      this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
    );
  }, "readBigInt64BE"));
  h.prototype.readFloatLE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, true, 23, 4);
  }, "readFloatLE");
  h.prototype.readFloatBE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, false, 23, 4);
  }, "readFloatBE");
  h.prototype.readDoubleLE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, true, 52, 8);
  }, "readDoubleLE");
  h.prototype.readDoubleBE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 8, this.length), Pe.read(
      this,
      e,
      false,
      52,
      8
    );
  }, "readDoubleBE");
  function V(r, e, t, n, i, s) {
    if (!h.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError("Index out of range");
  }
  a(V, "checkInt");
  h.prototype.writeUintLE = h.prototype.writeUIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      V(
        this,
        e,
        t,
        n,
        u,
        0
      );
    }
    let s = 1, o = 0;
    for (this[t] = e & 255; ++o < n && (s *= 256); ) this[t + o] = e / s & 255;
    return t + n;
  }, "writeUIntLE");
  h.prototype.writeUintBE = h.prototype.writeUIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      V(this, e, t, n, u, 0);
    }
    let s = n - 1, o = 1;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) this[t + s] = e / o & 255;
    return t + n;
  }, "writeUIntBE");
  h.prototype.writeUint8 = h.prototype.writeUInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, "writeUInt8");
  h.prototype.writeUint16LE = h.prototype.writeUInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeUInt16LE");
  h.prototype.writeUint16BE = h.prototype.writeUInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeUInt16BE");
  h.prototype.writeUint32LE = h.prototype.writeUInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, "writeUInt32LE");
  h.prototype.writeUint32BE = h.prototype.writeUInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeUInt32BE");
  function Zn(r, e, t, n, i) {
    ri(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
  }
  a(Zn, "wrtBigUInt64LE");
  function Jn(r, e, t, n, i) {
    ri(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
  }
  a(Jn, "wrtBigUInt64BE");
  h.prototype.writeBigUInt64LE = we(a(function(e, t = 0) {
    return Zn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }, "writeBigUInt64LE"));
  h.prototype.writeBigUInt64BE = we(a(function(e, t = 0) {
    return Jn(this, e, t, BigInt(0), BigInt(
      "0xffffffffffffffff"
    ));
  }, "writeBigUInt64BE"));
  h.prototype.writeIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      V(this, e, t, n, c - 1, -c);
    }
    let s = 0, o = 1, u = 0;
    for (this[t] = e & 255; ++s < n && (o *= 256); )
      e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntLE");
  h.prototype.writeIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      V(this, e, t, n, c - 1, -c);
    }
    let s = n - 1, o = 1, u = 0;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntBE");
  h.prototype.writeInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, "writeInt8");
  h.prototype.writeInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeInt16LE");
  h.prototype.writeInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeInt16BE");
  h.prototype.writeInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, "writeInt32LE");
  h.prototype.writeInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeInt32BE");
  h.prototype.writeBigInt64LE = we(a(function(e, t = 0) {
    return Zn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }, "writeBigInt64LE"));
  h.prototype.writeBigInt64BE = we(
    a(function(e, t = 0) {
      return Jn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }, "writeBigInt64BE")
  );
  function Xn(r, e, t, n, i, s) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  a(Xn, "checkIEEE754");
  function ei(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Xn(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Pe.write(r, e, t, n, 23, 4), t + 4;
  }
  a(
    ei,
    "writeFloat"
  );
  h.prototype.writeFloatLE = a(function(e, t, n) {
    return ei(this, e, t, true, n);
  }, "writeFloatLE");
  h.prototype.writeFloatBE = a(function(e, t, n) {
    return ei(this, e, t, false, n);
  }, "writeFloatBE");
  function ti(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Xn(r, e, t, 8, 17976931348623157e292, -17976931348623157e292), Pe.write(
      r,
      e,
      t,
      n,
      52,
      8
    ), t + 8;
  }
  a(ti, "writeDouble");
  h.prototype.writeDoubleLE = a(function(e, t, n) {
    return ti(this, e, t, true, n);
  }, "writeDoubleLE");
  h.prototype.writeDoubleBE = a(function(e, t, n) {
    return ti(this, e, t, false, n);
  }, "writeDoubleBE");
  h.prototype.copy = a(function(e, t, n, i) {
    if (!h.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (i < 0) throw new RangeError("sourceEnd out of bounds");
    i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
    let s = i - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
  }, "copy");
  h.prototype.fill = a(function(e, t, n, i) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
      if (typeof i == "string" && !h.isEncoding(i)) throw new TypeError(
        "Unknown encoding: " + i
      );
      if (e.length === 1) {
        let o = e.charCodeAt(0);
        (i === "utf8" && o < 128 || i === "latin1") && (e = o);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
    if (n <= t) return this;
    t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
    let s;
    if (typeof e == "number") for (s = t; s < n; ++s) this[s] = e;
    else {
      let o = h.isBuffer(e) ? e : h.from(
        e,
        i
      ), u = o.length;
      if (u === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
    }
    return this;
  }, "fill");
  var Te = {};
  function Vt(r, e, t) {
    var n;
    Te[r] = (n = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", { value: e.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
      }
      get code() {
        return r;
      }
      set code(s) {
        Object.defineProperty(
          this,
          "code",
          { configurable: true, enumerable: true, value: s, writable: true }
        );
      }
      toString() {
        return `${this.name} [${r}]: ${this.message}`;
      }
    }, a(n, "NodeError"), n);
  }
  a(Vt, "E");
  Vt("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
    return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError);
  Vt(
    "ERR_INVALID_ARG_TYPE",
    function(r, e) {
      return `The "${r}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  );
  Vt("ERR_OUT_OF_RANGE", function(r, e, t) {
    let n = `The value of "${r}" is out of range.`, i = t;
    return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = $n(String(t)) : typeof t == "bigint" && (i = String(
      t
    ), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = $n(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
  }, RangeError);
  function $n(r) {
    let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(0, t)}${e}`;
  }
  a($n, "addNumericalSeparator");
  function Xo(r, e, t) {
    Re(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && je(e, r.length - (t + 1));
  }
  a(Xo, "checkBounds");
  function ri(r, e, t, n, i, s) {
    if (r > t || r < e) {
      let o = typeof e == "bigint" ? "n" : "", u;
      throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Te.ERR_OUT_OF_RANGE("value", u, r);
    }
    Xo(n, i, s);
  }
  a(ri, "checkIntBI");
  function Re(r, e) {
    if (typeof r != "number") throw new Te.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  a(Re, "validateNumber");
  function je(r, e, t) {
    throw Math.floor(r) !== r ? (Re(r, t), new Te.ERR_OUT_OF_RANGE(t || "offset", "an integer", r)) : e < 0 ? new Te.ERR_BUFFER_OUT_OF_BOUNDS() : new Te.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
  }
  a(je, "boundsError");
  var ea = /[^+/0-9A-Za-z-_]/g;
  function ta(r) {
    if (r = r.split("=")[0], r = r.trim().replace(ea, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; ) r = r + "=";
    return r;
  }
  a(ta, "base64clean");
  function Ht(r, e) {
    e = e || 1 / 0;
    let t, n = r.length, i = null, s = [];
    for (let o = 0; o < n; ++o) {
      if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
        if (!i) {
          if (t > 56319) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          } else if (o + 1 === n) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          }
          i = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && s.push(239, 191, 189), i = t;
          continue;
        }
        t = (i - 55296 << 10 | t - 56320) + 65536;
      } else i && (e -= 3) > -1 && s.push(239, 191, 189);
      if (i = null, t < 128) {
        if ((e -= 1) < 0) break;
        s.push(t);
      } else if (t < 2048) {
        if ((e -= 2) < 0) break;
        s.push(t >> 6 | 192, t & 63 | 128);
      } else if (t < 65536) {
        if ((e -= 3) < 0) break;
        s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
      } else if (t < 1114112) {
        if ((e -= 4) < 0) break;
        s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return s;
  }
  a(Ht, "utf8ToBytes");
  function ra(r) {
    let e = [];
    for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(t) & 255);
    return e;
  }
  a(
    ra,
    "asciiToBytes"
  );
  function na(r, e) {
    let t, n, i, s = [];
    for (let o = 0; o < r.length && !((e -= 2) < 0); ++o) t = r.charCodeAt(
      o
    ), n = t >> 8, i = t % 256, s.push(i), s.push(n);
    return s;
  }
  a(na, "utf16leToBytes");
  function ni(r) {
    return Nt.toByteArray(
      ta(r)
    );
  }
  a(ni, "base64ToBytes");
  function ht(r, e, t, n) {
    let i;
    for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
      e[i + t] = r[i];
    return i;
  }
  a(ht, "blitBuffer");
  function ue(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
  }
  a(ue, "isInstance");
  function zt(r) {
    return r !== r;
  }
  a(zt, "numberIsNaN");
  var ia = (function() {
    let r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      let n = t * 16;
      for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
    }
    return e;
  })();
  function we(r) {
    return typeof BigInt > "u" ? sa : r;
  }
  a(we, "defineBigIntMethod");
  function sa() {
    throw new Error("BigInt not supported");
  }
  a(sa, "BufferBigIntNotDefined");
});
var b;
var v;
var x;
var d;
var m;
var p = G(() => {
  "use strict";
  b = globalThis, v = globalThis.setImmediate ?? ((r) => setTimeout(r, 0)), x = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), d = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : ii().Buffer, m = globalThis.process ?? {};
  m.env ?? (m.env = {});
  try {
    m.nextTick(() => {
    });
  } catch {
    let e = Promise.resolve();
    m.nextTick = e.then.bind(e);
  }
});
var ge = T((Bl, Kt) => {
  "use strict";
  p();
  var Le = typeof Reflect == "object" ? Reflect : null, si = Le && typeof Le.apply == "function" ? Le.apply : a(function(e, t, n) {
    return Function.prototype.apply.call(e, t, n);
  }, "ReflectApply"), pt;
  Le && typeof Le.ownKeys == "function" ? pt = Le.ownKeys : Object.getOwnPropertySymbols ? pt = a(function(e) {
    return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
  }, "ReflectOwnKeys") : pt = a(function(e) {
    return Object.getOwnPropertyNames(e);
  }, "ReflectOwnKeys");
  function oa(r) {
    console && console.warn && console.warn(r);
  }
  a(
    oa,
    "ProcessEmitWarning"
  );
  var ai = Number.isNaN || a(function(e) {
    return e !== e;
  }, "NumberIsNaN");
  function R() {
    R.init.call(this);
  }
  a(R, "EventEmitter");
  Kt.exports = R;
  Kt.exports.once = la;
  R.EventEmitter = R;
  R.prototype._events = void 0;
  R.prototype._eventsCount = 0;
  R.prototype._maxListeners = void 0;
  var oi = 10;
  function dt(r) {
    if (typeof r != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
  }
  a(dt, "checkListener");
  Object.defineProperty(R, "defaultMaxListeners", { enumerable: true, get: a(function() {
    return oi;
  }, "get"), set: a(
    function(r) {
      if (typeof r != "number" || r < 0 || ai(r)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
      oi = r;
    },
    "set"
  ) });
  R.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  };
  R.prototype.setMaxListeners = a(function(e) {
    if (typeof e != "number" || e < 0 || ai(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
    return this._maxListeners = e, this;
  }, "setMaxListeners");
  function ui(r) {
    return r._maxListeners === void 0 ? R.defaultMaxListeners : r._maxListeners;
  }
  a(ui, "_getMaxListeners");
  R.prototype.getMaxListeners = a(function() {
    return ui(this);
  }, "getMaxListeners");
  R.prototype.emit = a(function(e) {
    for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
    var i = e === "error", s = this._events;
    if (s !== void 0) i = i && s.error === void 0;
    else if (!i) return false;
    if (i) {
      var o;
      if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
      var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
      throw u.context = o, u;
    }
    var c = s[e];
    if (c === void 0) return false;
    if (typeof c == "function") si(c, this, t);
    else for (var l = c.length, f3 = pi(c, l), n = 0; n < l; ++n) si(f3[n], this, t);
    return true;
  }, "emit");
  function ci(r, e, t, n) {
    var i, s, o;
    if (dt(
      t
    ), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit("newListener", e, t.listener ? t.listener : t), s = r._events), o = s[e]), o === void 0) o = s[e] = t, ++r._eventsCount;
    else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(t) : o.push(t), i = ui(r), i > 0 && o.length > i && !o.warned) {
      o.warned = true;
      var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, oa(u);
    }
    return r;
  }
  a(ci, "_addListener");
  R.prototype.addListener = a(function(e, t) {
    return ci(this, e, t, false);
  }, "addListener");
  R.prototype.on = R.prototype.addListener;
  R.prototype.prependListener = a(function(e, t) {
    return ci(this, e, t, true);
  }, "prependListener");
  function aa() {
    if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  a(aa, "onceWrapper");
  function li(r, e, t) {
    var n = {
      fired: false,
      wrapFn: void 0,
      target: r,
      type: e,
      listener: t
    }, i = aa.bind(n);
    return i.listener = t, n.wrapFn = i, i;
  }
  a(li, "_onceWrap");
  R.prototype.once = a(function(e, t) {
    return dt(t), this.on(e, li(this, e, t)), this;
  }, "once");
  R.prototype.prependOnceListener = a(function(e, t) {
    return dt(t), this.prependListener(e, li(this, e, t)), this;
  }, "prependOnceListener");
  R.prototype.removeListener = a(function(e, t) {
    var n, i, s, o, u;
    if (dt(t), i = this._events, i === void 0) return this;
    if (n = i[e], n === void 0) return this;
    if (n === t || n.listener === t) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
    else if (typeof n != "function") {
      for (s = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
        u = n[o].listener, s = o;
        break;
      }
      if (s < 0) return this;
      s === 0 ? n.shift() : ua(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
    }
    return this;
  }, "removeListener");
  R.prototype.off = R.prototype.removeListener;
  R.prototype.removeAllListeners = a(function(e) {
    var t, n, i;
    if (n = this._events, n === void 0) return this;
    if (n.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
    if (arguments.length === 0) {
      var s = Object.keys(n), o;
      for (i = 0; i < s.length; ++i) o = s[i], o !== "removeListener" && this.removeAllListeners(
        o
      );
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (t = n[e], typeof t == "function") this.removeListener(e, t);
    else if (t !== void 0) for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
    return this;
  }, "removeAllListeners");
  function fi(r, e, t) {
    var n = r._events;
    if (n === void 0) return [];
    var i = n[e];
    return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? ca(i) : pi(i, i.length);
  }
  a(fi, "_listeners");
  R.prototype.listeners = a(function(e) {
    return fi(this, e, true);
  }, "listeners");
  R.prototype.rawListeners = a(function(e) {
    return fi(this, e, false);
  }, "rawListeners");
  R.listenerCount = function(r, e) {
    return typeof r.listenerCount == "function" ? r.listenerCount(e) : hi.call(r, e);
  };
  R.prototype.listenerCount = hi;
  function hi(r) {
    var e = this._events;
    if (e !== void 0) {
      var t = e[r];
      if (typeof t == "function")
        return 1;
      if (t !== void 0) return t.length;
    }
    return 0;
  }
  a(hi, "listenerCount");
  R.prototype.eventNames = a(function() {
    return this._eventsCount > 0 ? pt(this._events) : [];
  }, "eventNames");
  function pi(r, e) {
    for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
    return t;
  }
  a(pi, "arrayClone");
  function ua(r, e) {
    for (; e + 1 < r.length; e++) r[e] = r[e + 1];
    r.pop();
  }
  a(ua, "spliceOne");
  function ca(r) {
    for (var e = new Array(r.length), t = 0; t < e.length; ++t) e[t] = r[t].listener || r[t];
    return e;
  }
  a(ca, "unwrapListeners");
  function la(r, e) {
    return new Promise(function(t, n) {
      function i(o) {
        r.removeListener(e, s), n(o);
      }
      a(i, "errorListener");
      function s() {
        typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(arguments));
      }
      a(s, "resolver"), di(r, e, s, { once: true }), e !== "error" && fa(r, i, { once: true });
    });
  }
  a(la, "once");
  function fa(r, e, t) {
    typeof r.on == "function" && di(r, "error", e, t);
  }
  a(
    fa,
    "addErrorHandlerIfEventEmitter"
  );
  function di(r, e, t, n) {
    if (typeof r.on == "function") n.once ? r.once(e, t) : r.on(e, t);
    else if (typeof r.addEventListener == "function") r.addEventListener(e, a(function i(s) {
      n.once && r.removeEventListener(e, i), t(s);
    }, "wrapListener"));
    else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
  }
  a(di, "eventTargetAgnosticAddListener");
});
var wi = {};
ie(wi, { Socket: () => ce, isIP: () => ha });
function ha(r) {
  return 0;
}
var mi;
var yi;
var S;
var ce;
var Fe = G(() => {
  "use strict";
  p();
  mi = Se(ge(), 1);
  a(ha, "isIP");
  yi = /^[^.]+\./, S = class S2 extends mi.EventEmitter {
    constructor() {
      super(...arguments);
      E(this, "opts", {});
      E(this, "connecting", false);
      E(this, "pending", true);
      E(
        this,
        "writable",
        true
      );
      E(this, "encrypted", false);
      E(this, "authorized", false);
      E(this, "destroyed", false);
      E(this, "ws", null);
      E(this, "writeBuffer");
      E(this, "tlsState", 0);
      E(this, "tlsRead");
      E(this, "tlsWrite");
    }
    static get poolQueryViaFetch() {
      return S2.opts.poolQueryViaFetch ?? S2.defaults.poolQueryViaFetch;
    }
    static set poolQueryViaFetch(t) {
      S2.opts.poolQueryViaFetch = t;
    }
    static get fetchEndpoint() {
      return S2.opts.fetchEndpoint ?? S2.defaults.fetchEndpoint;
    }
    static set fetchEndpoint(t) {
      S2.opts.fetchEndpoint = t;
    }
    static get fetchConnectionCache() {
      return true;
    }
    static set fetchConnectionCache(t) {
      console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
    }
    static get fetchFunction() {
      return S2.opts.fetchFunction ?? S2.defaults.fetchFunction;
    }
    static set fetchFunction(t) {
      S2.opts.fetchFunction = t;
    }
    static get webSocketConstructor() {
      return S2.opts.webSocketConstructor ?? S2.defaults.webSocketConstructor;
    }
    static set webSocketConstructor(t) {
      S2.opts.webSocketConstructor = t;
    }
    get webSocketConstructor() {
      return this.opts.webSocketConstructor ?? S2.webSocketConstructor;
    }
    set webSocketConstructor(t) {
      this.opts.webSocketConstructor = t;
    }
    static get wsProxy() {
      return S2.opts.wsProxy ?? S2.defaults.wsProxy;
    }
    static set wsProxy(t) {
      S2.opts.wsProxy = t;
    }
    get wsProxy() {
      return this.opts.wsProxy ?? S2.wsProxy;
    }
    set wsProxy(t) {
      this.opts.wsProxy = t;
    }
    static get coalesceWrites() {
      return S2.opts.coalesceWrites ?? S2.defaults.coalesceWrites;
    }
    static set coalesceWrites(t) {
      S2.opts.coalesceWrites = t;
    }
    get coalesceWrites() {
      return this.opts.coalesceWrites ?? S2.coalesceWrites;
    }
    set coalesceWrites(t) {
      this.opts.coalesceWrites = t;
    }
    static get useSecureWebSocket() {
      return S2.opts.useSecureWebSocket ?? S2.defaults.useSecureWebSocket;
    }
    static set useSecureWebSocket(t) {
      S2.opts.useSecureWebSocket = t;
    }
    get useSecureWebSocket() {
      return this.opts.useSecureWebSocket ?? S2.useSecureWebSocket;
    }
    set useSecureWebSocket(t) {
      this.opts.useSecureWebSocket = t;
    }
    static get forceDisablePgSSL() {
      return S2.opts.forceDisablePgSSL ?? S2.defaults.forceDisablePgSSL;
    }
    static set forceDisablePgSSL(t) {
      S2.opts.forceDisablePgSSL = t;
    }
    get forceDisablePgSSL() {
      return this.opts.forceDisablePgSSL ?? S2.forceDisablePgSSL;
    }
    set forceDisablePgSSL(t) {
      this.opts.forceDisablePgSSL = t;
    }
    static get disableSNI() {
      return S2.opts.disableSNI ?? S2.defaults.disableSNI;
    }
    static set disableSNI(t) {
      S2.opts.disableSNI = t;
    }
    get disableSNI() {
      return this.opts.disableSNI ?? S2.disableSNI;
    }
    set disableSNI(t) {
      this.opts.disableSNI = t;
    }
    static get disableWarningInBrowsers() {
      return S2.opts.disableWarningInBrowsers ?? S2.defaults.disableWarningInBrowsers;
    }
    static set disableWarningInBrowsers(t) {
      S2.opts.disableWarningInBrowsers = t;
    }
    get disableWarningInBrowsers() {
      return this.opts.disableWarningInBrowsers ?? S2.disableWarningInBrowsers;
    }
    set disableWarningInBrowsers(t) {
      this.opts.disableWarningInBrowsers = t;
    }
    static get pipelineConnect() {
      return S2.opts.pipelineConnect ?? S2.defaults.pipelineConnect;
    }
    static set pipelineConnect(t) {
      S2.opts.pipelineConnect = t;
    }
    get pipelineConnect() {
      return this.opts.pipelineConnect ?? S2.pipelineConnect;
    }
    set pipelineConnect(t) {
      this.opts.pipelineConnect = t;
    }
    static get subtls() {
      return S2.opts.subtls ?? S2.defaults.subtls;
    }
    static set subtls(t) {
      S2.opts.subtls = t;
    }
    get subtls() {
      return this.opts.subtls ?? S2.subtls;
    }
    set subtls(t) {
      this.opts.subtls = t;
    }
    static get pipelineTLS() {
      return S2.opts.pipelineTLS ?? S2.defaults.pipelineTLS;
    }
    static set pipelineTLS(t) {
      S2.opts.pipelineTLS = t;
    }
    get pipelineTLS() {
      return this.opts.pipelineTLS ?? S2.pipelineTLS;
    }
    set pipelineTLS(t) {
      this.opts.pipelineTLS = t;
    }
    static get rootCerts() {
      return S2.opts.rootCerts ?? S2.defaults.rootCerts;
    }
    static set rootCerts(t) {
      S2.opts.rootCerts = t;
    }
    get rootCerts() {
      return this.opts.rootCerts ?? S2.rootCerts;
    }
    set rootCerts(t) {
      this.opts.rootCerts = t;
    }
    wsProxyAddrForHost(t, n) {
      let i = this.wsProxy;
      if (i === void 0) throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
      return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
    }
    setNoDelay() {
      return this;
    }
    setKeepAlive() {
      return this;
    }
    ref() {
      return this;
    }
    unref() {
      return this;
    }
    connect(t, n, i) {
      this.connecting = true, i && this.once("connect", i);
      let s = a(() => {
        this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
      }, "handleWebSocketOpen"), o = a((c, l = false) => {
        c.binaryType = "arraybuffer", c.addEventListener("error", (f3) => {
          this.emit("error", f3), this.emit("close");
        }), c.addEventListener("message", (f3) => {
          if (this.tlsState === 0) {
            let y = d.from(f3.data);
            this.emit("data", y);
          }
        }), c.addEventListener("close", () => {
          this.emit("close");
        }), l ? s() : c.addEventListener(
          "open",
          s
        );
      }, "configureWebSocket"), u;
      try {
        u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
      } catch (c) {
        this.emit("error", c), this.emit("close");
        return;
      }
      try {
        let l = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
        if (this.webSocketConstructor !== void 0) this.ws = new this.webSocketConstructor(l), o(this.ws);
        else try {
          this.ws = new WebSocket(l), o(this.ws);
        } catch {
          this.ws = new __unstable_WebSocket(l), o(this.ws);
        }
      } catch (c) {
        let f3 = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
        fetch(f3, { headers: { Upgrade: "websocket" } }).then(
          (y) => {
            if (this.ws = y.webSocket, this.ws == null) throw c;
            this.ws.accept(), o(this.ws, true);
          }
        ).catch((y) => {
          this.emit(
            "error",
            new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${y}`)
          ), this.emit("close");
        });
      }
    }
    async startTls(t) {
      if (this.subtls === void 0) throw new Error(
        "For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information."
      );
      this.tlsState = 1;
      let n = await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(i), o = this.rawWrite.bind(this), { read: u, write: c } = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
      this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit("secureConnection", this), this.tlsReadLoop();
    }
    async tlsReadLoop() {
      for (; ; ) {
        let t = await this.tlsRead();
        if (t === void 0) break;
        {
          let n = d.from(t);
          this.emit("data", n);
        }
      }
    }
    rawWrite(t) {
      if (!this.coalesceWrites) {
        this.ws && this.ws.send(t);
        return;
      }
      if (this.writeBuffer === void 0) this.writeBuffer = t, setTimeout(() => {
        this.ws && this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
      }, 0);
      else {
        let n = new Uint8Array(
          this.writeBuffer.length + t.length
        );
        n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
      }
    }
    write(t, n = "utf8", i = (s) => {
    }) {
      return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = d.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
        this.write(
          t,
          n,
          i
        );
      }) : (this.tlsWrite(t), i()), true);
    }
    end(t = d.alloc(0), n = "utf8", i = () => {
    }) {
      return this.write(t, n, () => {
        this.ws.close(), i();
      }), this;
    }
    destroy() {
      return this.destroyed = true, this.end();
    }
  };
  a(S, "Socket"), E(S, "defaults", {
    poolQueryViaFetch: false,
    fetchEndpoint: a((t, n, i) => {
      let s;
      return i?.jwtAuth ? s = t.replace(yi, "apiauth.") : s = t.replace(yi, "api."), "https://" + s + "/sql";
    }, "fetchEndpoint"),
    fetchConnectionCache: true,
    fetchFunction: void 0,
    webSocketConstructor: void 0,
    wsProxy: a((t) => t + "/v2", "wsProxy"),
    useSecureWebSocket: true,
    forceDisablePgSSL: true,
    coalesceWrites: true,
    pipelineConnect: "password",
    subtls: void 0,
    rootCerts: "",
    pipelineTLS: false,
    disableSNI: false,
    disableWarningInBrowsers: false
  }), E(S, "opts", {});
  ce = S;
});
var gi = {};
ie(gi, { parse: () => Yt });
function Yt(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(
    t.length
  ), { username: i, password: s, host: o, hostname: u, port: c, pathname: l, search: f3, searchParams: y, hash: g } = new URL(
    n
  );
  s = decodeURIComponent(s), i = decodeURIComponent(i), l = decodeURIComponent(l);
  let A = i + ":" + s, C = e ? Object.fromEntries(y.entries()) : f3;
  return {
    href: r,
    protocol: t,
    auth: A,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: l,
    search: f3,
    query: C,
    hash: g
  };
}
var Zt = G(() => {
  "use strict";
  p();
  a(Yt, "parse");
});
var tr = T((Ai) => {
  "use strict";
  p();
  Ai.parse = function(r, e) {
    return new er(r, e).parse();
  };
  var vt = class vt2 {
    constructor(e, t) {
      this.source = e, this.transform = t || Ca, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var e = this.source[this.position++];
      return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
    }
    record(e) {
      this.recorded.push(
        e
      );
    }
    newEntry(e) {
      var t;
      (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(t), this.recorded = []);
    }
    consumeDimensions() {
      if (this.source[0] === "[") for (; !this.isEof(); ) {
        var e = this.nextCharacter();
        if (e.value === "=") break;
      }
    }
    parse(e) {
      var t, n, i;
      for (this.consumeDimensions(); !this.isEof(); ) if (t = this.nextCharacter(), t.value === "{" && !i) this.dimension++, this.dimension > 1 && (n = new vt2(this.source.substr(this.position - 1), this.transform), this.entries.push(n.parse(
        true
      )), this.position += n.position - 2);
      else if (t.value === "}" && !i) {
        if (this.dimension--, !this.dimension && (this.newEntry(), e)) return this.entries;
      } else t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(t.value);
      if (this.dimension !== 0) throw new Error("array dimension not balanced");
      return this.entries;
    }
  };
  a(vt, "ArrayParser");
  var er = vt;
  function Ca(r) {
    return r;
  }
  a(Ca, "identity");
});
var rr = T((Zl, Ci) => {
  p();
  var _a = tr();
  Ci.exports = { create: a(function(r, e) {
    return { parse: a(function() {
      return _a.parse(r, e);
    }, "parse") };
  }, "create") };
});
var Ti = T((ef, Ii) => {
  "use strict";
  p();
  var Ia = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Ta = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, Pa = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, Ra = /^-?infinity$/;
  Ii.exports = a(function(e) {
    if (Ra.test(e)) return Number(e.replace("i", "I"));
    var t = Ia.exec(e);
    if (!t) return Ba(
      e
    ) || null;
    var n = !!t[8], i = parseInt(t[1], 10);
    n && (i = _i(i));
    var s = parseInt(t[2], 10) - 1, o = t[3], u = parseInt(
      t[4],
      10
    ), c = parseInt(t[5], 10), l = parseInt(t[6], 10), f3 = t[7];
    f3 = f3 ? 1e3 * parseFloat(f3) : 0;
    var y, g = La(e);
    return g != null ? (y = new Date(Date.UTC(i, s, o, u, c, l, f3)), nr(i) && y.setUTCFullYear(i), g !== 0 && y.setTime(y.getTime() - g)) : (y = new Date(i, s, o, u, c, l, f3), nr(i) && y.setFullYear(i)), y;
  }, "parseDate");
  function Ba(r) {
    var e = Ta.exec(r);
    if (e) {
      var t = parseInt(e[1], 10), n = !!e[4];
      n && (t = _i(t));
      var i = parseInt(e[2], 10) - 1, s = e[3], o = new Date(t, i, s);
      return nr(
        t
      ) && o.setFullYear(t), o;
    }
  }
  a(Ba, "getDate");
  function La(r) {
    if (r.endsWith("+00")) return 0;
    var e = Pa.exec(r.split(" ")[1]);
    if (e) {
      var t = e[1];
      if (t === "Z") return 0;
      var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
        e[3] || 0,
        10
      ) * 60 + parseInt(e[4] || 0, 10);
      return i * n * 1e3;
    }
  }
  a(La, "timeZoneOffset");
  function _i(r) {
    return -(r - 1);
  }
  a(_i, "bcYearToNegativeYear");
  function nr(r) {
    return r >= 0 && r < 100;
  }
  a(nr, "is0To99");
});
var Ri = T((nf, Pi) => {
  p();
  Pi.exports = ka;
  var Fa = Object.prototype.hasOwnProperty;
  function ka(r) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var n in t) Fa.call(t, n) && (r[n] = t[n]);
    }
    return r;
  }
  a(ka, "extend");
});
var Fi = T((af, Li) => {
  "use strict";
  p();
  var Ma = Ri();
  Li.exports = ke;
  function ke(r) {
    if (!(this instanceof ke))
      return new ke(r);
    Ma(this, Va(r));
  }
  a(ke, "PostgresInterval");
  var Ua = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "months",
    "years"
  ];
  ke.prototype.toPostgres = function() {
    var r = Ua.filter(this.hasOwnProperty, this);
    return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
      var t = this[e] || 0;
      return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
        /\.?0+$/,
        ""
      )), t + " " + e;
    }, this).join(" ");
  };
  var Da = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, Oa = ["years", "months", "days"], qa = ["hours", "minutes", "seconds"];
  ke.prototype.toISOString = ke.prototype.toISO = function() {
    var r = Oa.map(t, this).join(""), e = qa.map(t, this).join("");
    return "P" + r + "T" + e;
    function t(n) {
      var i = this[n] || 0;
      return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
        /0+$/,
        ""
      )), i + Da[n];
    }
  };
  var ir = "([+-]?\\d+)", Qa = ir + "\\s+years?", Na = ir + "\\s+mons?", Wa = ir + "\\s+days?", ja = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", Ha = new RegExp([Qa, Na, Wa, ja].map(function(r) {
    return "(" + r + ")?";
  }).join("\\s*")), Bi = { years: 2, months: 4, days: 6, hours: 9, minutes: 10, seconds: 11, milliseconds: 12 }, $a = ["hours", "minutes", "seconds", "milliseconds"];
  function Ga(r) {
    var e = r + "000000".slice(r.length);
    return parseInt(
      e,
      10
    ) / 1e3;
  }
  a(Ga, "parseMilliseconds");
  function Va(r) {
    if (!r) return {};
    var e = Ha.exec(r), t = e[8] === "-";
    return Object.keys(Bi).reduce(function(n, i) {
      var s = Bi[i], o = e[s];
      return !o || (o = i === "milliseconds" ? Ga(o) : parseInt(o, 10), !o) || (t && ~$a.indexOf(i) && (o *= -1), n[i] = o), n;
    }, {});
  }
  a(Va, "parse");
});
var Mi = T((lf, ki) => {
  "use strict";
  p();
  ki.exports = a(function(e) {
    if (/^\\x/.test(e)) return new d(e.substr(
      2
    ), "hex");
    for (var t = "", n = 0; n < e.length; ) if (e[n] !== "\\") t += e[n], ++n;
    else if (/[0-7]{3}/.test(e.substr(n + 1, 3))) t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
    else {
      for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
      for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
      n += Math.floor(i / 2) * 2;
    }
    return new d(t, "binary");
  }, "parseBytea");
});
var Wi = T((pf, Ni) => {
  p();
  var Ve = tr(), ze = rr(), xt = Ti(), Di = Fi(), Oi = Mi();
  function St(r) {
    return a(function(t) {
      return t === null ? t : r(t);
    }, "nullAllowed");
  }
  a(St, "allowNull");
  function qi(r) {
    return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
  }
  a(qi, "parseBool");
  function za(r) {
    return r ? Ve.parse(r, qi) : null;
  }
  a(za, "parseBoolArray");
  function Ka(r) {
    return parseInt(r, 10);
  }
  a(Ka, "parseBaseTenInt");
  function sr(r) {
    return r ? Ve.parse(r, St(Ka)) : null;
  }
  a(sr, "parseIntegerArray");
  function Ya(r) {
    return r ? Ve.parse(r, St(function(e) {
      return Qi(e).trim();
    })) : null;
  }
  a(Ya, "parseBigIntegerArray");
  var Za = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = cr(t)), t;
    });
    return e.parse();
  }, "parsePointArray"), or = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = parseFloat(t)), t;
    });
    return e.parse();
  }, "parseFloatArray"), re = a(function(r) {
    if (!r) return null;
    var e = ze.create(r);
    return e.parse();
  }, "parseStringArray"), ar = a(function(r) {
    if (!r) return null;
    var e = ze.create(
      r,
      function(t) {
        return t !== null && (t = xt(t)), t;
      }
    );
    return e.parse();
  }, "parseDateArray"), Ja = a(function(r) {
    if (!r)
      return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = Di(t)), t;
    });
    return e.parse();
  }, "parseIntervalArray"), Xa = a(function(r) {
    return r ? Ve.parse(r, St(Oi)) : null;
  }, "parseByteAArray"), ur = a(function(r) {
    return parseInt(r, 10);
  }, "parseInteger"), Qi = a(function(r) {
    var e = String(r);
    return /^\d+$/.test(e) ? e : r;
  }, "parseBigInteger"), Ui = a(function(r) {
    return r ? Ve.parse(r, St(JSON.parse)) : null;
  }, "parseJsonArray"), cr = a(
    function(r) {
      return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(
        r[1]
      ) });
    },
    "parsePoint"
  ), eu = a(function(r) {
    if (r[0] !== "<" && r[1] !== "(") return null;
    for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
      if (n || (e += r[i]), r[i] === ")") {
        n = true;
        continue;
      } else if (!n) continue;
      r[i] !== "," && (t += r[i]);
    }
    var s = cr(e);
    return s.radius = parseFloat(t), s;
  }, "parseCircle"), tu = a(function(r) {
    r(20, Qi), r(21, ur), r(23, ur), r(26, ur), r(700, parseFloat), r(701, parseFloat), r(16, qi), r(1082, xt), r(1114, xt), r(1184, xt), r(
      600,
      cr
    ), r(651, re), r(718, eu), r(1e3, za), r(1001, Xa), r(1005, sr), r(1007, sr), r(1028, sr), r(1016, Ya), r(1017, Za), r(1021, or), r(1022, or), r(1231, or), r(1014, re), r(1015, re), r(1008, re), r(1009, re), r(1040, re), r(1041, re), r(
      1115,
      ar
    ), r(1182, ar), r(1185, ar), r(1186, Di), r(1187, Ja), r(17, Oi), r(114, JSON.parse.bind(JSON)), r(3802, JSON.parse.bind(JSON)), r(199, Ui), r(3807, Ui), r(3907, re), r(2951, re), r(791, re), r(1183, re), r(1270, re);
  }, "init");
  Ni.exports = { init: tu };
});
var Hi = T((mf, ji) => {
  "use strict";
  p();
  var z = 1e6;
  function ru(r) {
    var e = r.readInt32BE(0), t = r.readUInt32BE(
      4
    ), n = "";
    e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
    var i = "", s, o, u, c, l, f3;
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f3 = 0; f3 < l; f3++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f3 = 0; f3 < l; f3++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f3 = 0; f3 < l; f3++) c += "0";
      i = c + u + i;
    }
    return s = e % z, o = 4294967296 * s + t, u = "" + o % z, n + u + i;
  }
  a(ru, "readInt8");
  ji.exports = ru;
});
var Ki = T((bf, zi) => {
  p();
  var nu = Hi(), L = a(function(r, e, t, n, i) {
    t = t || 0, n = n || false, i = i || function(A, C, D) {
      return A * Math.pow(2, D) + C;
    };
    var s = t >> 3, o = a(function(A) {
      return n ? ~A & 255 : A;
    }, "inv"), u = 255, c = 8 - t % 8;
    e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
    var l = 0;
    t % 8 + e >= 8 && (l = i(0, o(r[s]) & u, c));
    for (var f3 = e + t >> 3, y = s + 1; y < f3; y++) l = i(l, o(
      r[y]
    ), 8);
    var g = (e + t) % 8;
    return g > 0 && (l = i(l, o(r[f3]) >> 8 - g, g)), l;
  }, "parseBits"), Vi = a(function(r, e, t) {
    var n = Math.pow(2, t - 1) - 1, i = L(r, 1), s = L(r, t, 1);
    if (s === 0) return 0;
    var o = 1, u = a(function(l, f3, y) {
      l === 0 && (l = 1);
      for (var g = 1; g <= y; g++) o /= 2, (f3 & 1 << y - g) > 0 && (l += o);
      return l;
    }, "parsePrecisionBits"), c = L(r, e, t + 1, false, u);
    return s == Math.pow(
      2,
      t + 1
    ) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
  }, "parseFloatFromBits"), iu = a(function(r) {
    return L(r, 1) == 1 ? -1 * (L(r, 15, 1, true) + 1) : L(r, 15, 1);
  }, "parseInt16"), $i = a(function(r) {
    return L(r, 1) == 1 ? -1 * (L(
      r,
      31,
      1,
      true
    ) + 1) : L(r, 31, 1);
  }, "parseInt32"), su = a(function(r) {
    return Vi(r, 23, 8);
  }, "parseFloat32"), ou = a(function(r) {
    return Vi(r, 52, 11);
  }, "parseFloat64"), au = a(function(r) {
    var e = L(r, 16, 32);
    if (e == 49152) return NaN;
    for (var t = Math.pow(1e4, L(r, 16, 16)), n = 0, i = [], s = L(r, 16), o = 0; o < s; o++) n += L(r, 16, 64 + 16 * o) * t, t /= 1e4;
    var u = Math.pow(10, L(
      r,
      16,
      48
    ));
    return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
  }, "parseNumeric"), Gi = a(function(r, e) {
    var t = L(e, 1), n = L(
      e,
      63,
      1
    ), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
    return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
      return this.usec;
    }, i.setMicroSeconds = function(s) {
      this.usec = s;
    }, i.getUTCMicroSeconds = function() {
      return this.usec;
    }, i;
  }, "parseDate"), Ke = a(
    function(r) {
      for (var e = L(
        r,
        32
      ), t = L(r, 32, 32), n = L(r, 32, 64), i = 96, s = [], o = 0; o < e; o++) s[o] = L(r, 32, i), i += 32, i += 32;
      var u = a(function(l) {
        var f3 = L(r, 32, i);
        if (i += 32, f3 == 4294967295) return null;
        var y;
        if (l == 23 || l == 20) return y = L(r, f3 * 8, i), i += f3 * 8, y;
        if (l == 25) return y = r.toString(this.encoding, i >> 3, (i += f3 << 3) >> 3), y;
        console.log("ERROR: ElementType not implemented: " + l);
      }, "parseElement"), c = a(function(l, f3) {
        var y = [], g;
        if (l.length > 1) {
          var A = l.shift();
          for (g = 0; g < A; g++) y[g] = c(l, f3);
          l.unshift(A);
        } else for (g = 0; g < l[0]; g++) y[g] = u(f3);
        return y;
      }, "parse");
      return c(s, n);
    },
    "parseArray"
  ), uu = a(function(r) {
    return r.toString("utf8");
  }, "parseText"), cu = a(function(r) {
    return r === null ? null : L(r, 8) > 0;
  }, "parseBool"), lu = a(function(r) {
    r(20, nu), r(21, iu), r(23, $i), r(26, $i), r(1700, au), r(700, su), r(701, ou), r(16, cu), r(1114, Gi.bind(null, false)), r(1184, Gi.bind(null, true)), r(1e3, Ke), r(1007, Ke), r(1016, Ke), r(1008, Ke), r(1009, Ke), r(25, uu);
  }, "init");
  zi.exports = { init: lu };
});
var Zi = T((Sf, Yi) => {
  p();
  Yi.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
  };
});
var Je = T((Ze) => {
  p();
  var fu = Wi(), hu = Ki(), pu = rr(), du = Zi();
  Ze.getTypeParser = yu;
  Ze.setTypeParser = mu;
  Ze.arrayParser = pu;
  Ze.builtins = du;
  var Ye = { text: {}, binary: {} };
  function Ji(r) {
    return String(r);
  }
  a(Ji, "noParse");
  function yu(r, e) {
    return e = e || "text", Ye[e] && Ye[e][r] || Ji;
  }
  a(yu, "getTypeParser");
  function mu(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), Ye[e][r] = t;
  }
  a(mu, "setTypeParser");
  fu.init(function(r, e) {
    Ye.text[r] = e;
  });
  hu.init(function(r, e) {
    Ye.binary[r] = e;
  });
});
var At = T((If, Xi) => {
  "use strict";
  p();
  var wu = Je();
  function Et(r) {
    this._types = r || wu, this.text = {}, this.binary = {};
  }
  a(Et, "TypeOverrides");
  Et.prototype.getOverrides = function(r) {
    switch (r) {
      case "text":
        return this.text;
      case "binary":
        return this.binary;
      default:
        return {};
    }
  };
  Et.prototype.setTypeParser = function(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
  };
  Et.prototype.getTypeParser = function(r, e) {
    return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
  };
  Xi.exports = Et;
});
function Xe(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, l = 0, f3 = 0, y = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], g = a((I, w) => I >>> w | I << 32 - w, "rrot"), A = new Uint32Array(64), C = new Uint8Array(64), D = a(() => {
    for (let B = 0, j = 0; B < 16; B++, j += 4) A[B] = C[j] << 24 | C[j + 1] << 16 | C[j + 2] << 8 | C[j + 3];
    for (let B = 16; B < 64; B++) {
      let j = g(A[B - 15], 7) ^ g(A[B - 15], 18) ^ A[B - 15] >>> 3, le = g(
        A[B - 2],
        17
      ) ^ g(A[B - 2], 19) ^ A[B - 2] >>> 10;
      A[B] = A[B - 16] + j + A[B - 7] + le | 0;
    }
    let I = e, w = t, Z = n, W = i, J = s, X = o, se = u, oe = c;
    for (let B = 0; B < 64; B++) {
      let j = g(J, 6) ^ g(J, 11) ^ g(J, 25), le = J & X ^ ~J & se, de = oe + j + le + y[B] + A[B] | 0, We = g(I, 2) ^ g(
        I,
        13
      ) ^ g(I, 22), fe = I & w ^ I & Z ^ w & Z, _e = We + fe | 0;
      oe = se, se = X, X = J, J = W + de | 0, W = Z, Z = w, w = I, I = de + _e | 0;
    }
    e = e + I | 0, t = t + w | 0, n = n + Z | 0, i = i + W | 0, s = s + J | 0, o = o + X | 0, u = u + se | 0, c = c + oe | 0, f3 = 0;
  }, "process"), Y = a((I) => {
    typeof I == "string" && (I = new TextEncoder().encode(I));
    for (let w = 0; w < I.length; w++) C[f3++] = I[w], f3 === 64 && D();
    l += I.length;
  }, "add"), P = a(() => {
    if (C[f3++] = 128, f3 == 64 && D(), f3 + 8 > 64) {
      for (; f3 < 64; ) C[f3++] = 0;
      D();
    }
    for (; f3 < 58; ) C[f3++] = 0;
    let I = l * 8;
    C[f3++] = I / 1099511627776 & 255, C[f3++] = I / 4294967296 & 255, C[f3++] = I >>> 24, C[f3++] = I >>> 16 & 255, C[f3++] = I >>> 8 & 255, C[f3++] = I & 255, D();
    let w = new Uint8Array(
      32
    );
    return w[0] = e >>> 24, w[1] = e >>> 16 & 255, w[2] = e >>> 8 & 255, w[3] = e & 255, w[4] = t >>> 24, w[5] = t >>> 16 & 255, w[6] = t >>> 8 & 255, w[7] = t & 255, w[8] = n >>> 24, w[9] = n >>> 16 & 255, w[10] = n >>> 8 & 255, w[11] = n & 255, w[12] = i >>> 24, w[13] = i >>> 16 & 255, w[14] = i >>> 8 & 255, w[15] = i & 255, w[16] = s >>> 24, w[17] = s >>> 16 & 255, w[18] = s >>> 8 & 255, w[19] = s & 255, w[20] = o >>> 24, w[21] = o >>> 16 & 255, w[22] = o >>> 8 & 255, w[23] = o & 255, w[24] = u >>> 24, w[25] = u >>> 16 & 255, w[26] = u >>> 8 & 255, w[27] = u & 255, w[28] = c >>> 24, w[29] = c >>> 16 & 255, w[30] = c >>> 8 & 255, w[31] = c & 255, w;
  }, "digest");
  return r === void 0 ? { add: Y, digest: P } : (Y(r), P());
}
var es = G(() => {
  "use strict";
  p();
  a(Xe, "sha256");
});
var U;
var et;
var ts = G(() => {
  "use strict";
  p();
  U = class U2 {
    constructor() {
      E(this, "_dataLength", 0);
      E(this, "_bufferLength", 0);
      E(this, "_state", new Int32Array(4));
      E(this, "_buffer", new ArrayBuffer(68));
      E(this, "_buffer8");
      E(this, "_buffer32");
      this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
    }
    static hashByteArray(e, t = false) {
      return this.onePassHasher.start().appendByteArray(
        e
      ).end(t);
    }
    static hashStr(e, t = false) {
      return this.onePassHasher.start().appendStr(e).end(t);
    }
    static hashAsciiStr(e, t = false) {
      return this.onePassHasher.start().appendAsciiStr(e).end(t);
    }
    static _hex(e) {
      let t = U2.hexChars, n = U2.hexOut, i, s, o, u;
      for (u = 0; u < 4; u += 1) for (s = u * 8, i = e[u], o = 0; o < 8; o += 2) n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(
        i & 15
      ), i >>>= 4;
      return n.join("");
    }
    static _md5cycle(e, t) {
      let n = e[0], i = e[1], s = e[2], o = e[3];
      n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
    }
    start() {
      return this._dataLength = 0, this._bufferLength = 0, this._state.set(U2.stateIdentity), this;
    }
    appendStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
      for (o = 0; o < e.length; o += 1) {
        if (s = e.charCodeAt(o), s < 128) t[i++] = s;
        else if (s < 2048) t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
        else if (s < 55296 || s > 56319) t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        else {
          if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111) throw new Error(
            "Unicode standard supports code points up to U+10FFFF"
          );
          t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        }
        i >= 64 && (this._dataLength += 64, U2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
      }
      return this._bufferLength = i, this;
    }
    appendAsciiStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e.charCodeAt(o++);
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    appendByteArray(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    getState() {
      let e = this._state;
      return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
    }
    setState(e) {
      let t = e.buffer, n = e.state, i = this._state, s;
      for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1) this._buffer8[s] = t.charCodeAt(s);
    }
    end(e = false) {
      let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
      this._dataLength += t;
      let o = this._dataLength * 8;
      if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(U2.buffer32Identity.subarray(s), s), t > 55 && (U2._md5cycle(this._state, i), i.set(U2.buffer32Identity)), o <= 4294967295) i[14] = o;
      else {
        let u = o.toString(16).match(/(.*?)(.{0,8})$/);
        if (u === null) return;
        let c = parseInt(
          u[2],
          16
        ), l = parseInt(u[1], 16) || 0;
        i[14] = c, i[15] = l;
      }
      return U2._md5cycle(this._state, i), e ? this._state : U2._hex(
        this._state
      );
    }
  };
  a(U, "Md5"), E(U, "stateIdentity", new Int32Array([1732584193, -271733879, -1732584194, 271733878])), E(U, "buffer32Identity", new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), E(U, "hexChars", "0123456789abcdef"), E(U, "hexOut", []), E(U, "onePassHasher", new U());
  et = U;
});
var lr = {};
ie(lr, { createHash: () => bu, createHmac: () => vu, randomBytes: () => gu });
function gu(r) {
  return crypto.getRandomValues(d.alloc(r));
}
function bu(r) {
  if (r === "sha256") return { update: a(function(e) {
    return { digest: a(
      function() {
        return d.from(Xe(e));
      },
      "digest"
    ) };
  }, "update") };
  if (r === "md5") return { update: a(function(e) {
    return {
      digest: a(function() {
        return typeof e == "string" ? et.hashStr(e) : et.hashByteArray(e);
      }, "digest")
    };
  }, "update") };
  throw new Error(`Hash type '${r}' not supported`);
}
function vu(r, e) {
  if (r !== "sha256") throw new Error(`Only sha256 is supported (requested: '${r}')`);
  return { update: a(function(t) {
    return { digest: a(
      function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(
          t
        ));
        let n = e.length;
        if (n > 64) e = Xe(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(
          64
        ), s = new Uint8Array(64);
        for (let c = 0; c < 64; c++) i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(Xe(o), 64), d.from(Xe(u));
      },
      "digest"
    ) };
  }, "update") };
}
var fr = G(() => {
  "use strict";
  p();
  es();
  ts();
  a(gu, "randomBytes");
  a(bu, "createHash");
  a(vu, "createHmac");
});
var tt = T((Qf, hr) => {
  "use strict";
  p();
  hr.exports = {
    host: "localhost",
    user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
    database: void 0,
    password: null,
    connectionString: void 0,
    port: 5432,
    rows: 0,
    binary: false,
    max: 10,
    idleTimeoutMillis: 3e4,
    client_encoding: "",
    ssl: false,
    application_name: void 0,
    fallback_application_name: void 0,
    options: void 0,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    lock_timeout: false,
    idle_in_transaction_session_timeout: false,
    query_timeout: false,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var Me = Je(), xu = Me.getTypeParser(20, "text"), Su = Me.getTypeParser(
    1016,
    "text"
  );
  hr.exports.__defineSetter__("parseInt8", function(r) {
    Me.setTypeParser(20, "text", r ? Me.getTypeParser(
      23,
      "text"
    ) : xu), Me.setTypeParser(1016, "text", r ? Me.getTypeParser(1007, "text") : Su);
  });
});
var rt = T((Wf, ns) => {
  "use strict";
  p();
  var Eu = (fr(), O(lr)), Au = tt();
  function Cu(r) {
    var e = r.replace(
      /\\/g,
      "\\\\"
    ).replace(/"/g, '\\"');
    return '"' + e + '"';
  }
  a(Cu, "escapeElement");
  function rs(r) {
    for (var e = "{", t = 0; t < r.length; t++) t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + rs(r[t]) : r[t] instanceof d ? e += "\\\\x" + r[t].toString("hex") : e += Cu(Ct(r[t]));
    return e = e + "}", e;
  }
  a(rs, "arrayString");
  var Ct = a(function(r, e) {
    if (r == null) return null;
    if (r instanceof d) return r;
    if (ArrayBuffer.isView(r)) {
      var t = d.from(r.buffer, r.byteOffset, r.byteLength);
      return t.length === r.byteLength ? t : t.slice(r.byteOffset, r.byteOffset + r.byteLength);
    }
    return r instanceof Date ? Au.parseInputDatesAsUTC ? Tu(r) : Iu(r) : Array.isArray(r) ? rs(r) : typeof r == "object" ? _u(r, e) : r.toString();
  }, "prepareValue");
  function _u(r, e) {
    if (r && typeof r.toPostgres == "function") {
      if (e = e || [], e.indexOf(r) !== -1) throw new Error('circular reference detected while preparing "' + r + '" for query');
      return e.push(r), Ct(r.toPostgres(Ct), e);
    }
    return JSON.stringify(r);
  }
  a(_u, "prepareObject");
  function N(r, e) {
    for (r = "" + r; r.length < e; ) r = "0" + r;
    return r;
  }
  a(N, "pad");
  function Iu(r) {
    var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
    n && (t = Math.abs(t) + 1);
    var i = N(t, 4) + "-" + N(r.getMonth() + 1, 2) + "-" + N(r.getDate(), 2) + "T" + N(
      r.getHours(),
      2
    ) + ":" + N(r.getMinutes(), 2) + ":" + N(r.getSeconds(), 2) + "." + N(r.getMilliseconds(), 3);
    return e < 0 ? (i += "-", e *= -1) : i += "+", i += N(Math.floor(e / 60), 2) + ":" + N(e % 60, 2), n && (i += " BC"), i;
  }
  a(Iu, "dateToString");
  function Tu(r) {
    var e = r.getUTCFullYear(), t = e < 1;
    t && (e = Math.abs(e) + 1);
    var n = N(e, 4) + "-" + N(r.getUTCMonth() + 1, 2) + "-" + N(r.getUTCDate(), 2) + "T" + N(r.getUTCHours(), 2) + ":" + N(r.getUTCMinutes(), 2) + ":" + N(r.getUTCSeconds(), 2) + "." + N(
      r.getUTCMilliseconds(),
      3
    );
    return n += "+00:00", t && (n += " BC"), n;
  }
  a(Tu, "dateToStringUTC");
  function Pu(r, e, t) {
    return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
  }
  a(Pu, "normalizeQueryConfig");
  var pr = a(function(r) {
    return Eu.createHash("md5").update(r, "utf-8").digest("hex");
  }, "md5"), Ru = a(
    function(r, e, t) {
      var n = pr(e + r), i = pr(d.concat([d.from(n), t]));
      return "md5" + i;
    },
    "postgresMd5PasswordHash"
  );
  ns.exports = {
    prepareValue: a(function(e) {
      return Ct(e);
    }, "prepareValueWrapper"),
    normalizeQueryConfig: Pu,
    postgresMd5PasswordHash: Ru,
    md5: pr
  };
});
var nt = {};
ie(nt, { default: () => ku });
var ku;
var it = G(() => {
  "use strict";
  p();
  ku = {};
});
var ds = T((th, ps) => {
  "use strict";
  p();
  var yr = (fr(), O(lr));
  function Mu(r) {
    if (r.indexOf("SCRAM-SHA-256") === -1) throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
    let e = yr.randomBytes(
      18
    ).toString("base64");
    return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
  }
  a(Mu, "startSession");
  function Uu(r, e, t) {
    if (r.message !== "SASLInitialResponse") throw new Error(
      "SASL: Last message was not SASLInitialResponse"
    );
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
    if (typeof t != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
    let n = qu(t);
    if (n.nonce.startsWith(r.clientNonce)) {
      if (n.nonce.length === r.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    var i = d.from(n.salt, "base64"), s = Wu(e, i, n.iteration), o = Ue(s, "Client Key"), u = Nu(
      o
    ), c = "n=*,r=" + r.clientNonce, l = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, f3 = "c=biws,r=" + n.nonce, y = c + "," + l + "," + f3, g = Ue(u, y), A = hs(o, g), C = A.toString("base64"), D = Ue(s, "Server Key"), Y = Ue(D, y);
    r.message = "SASLResponse", r.serverSignature = Y.toString("base64"), r.response = f3 + ",p=" + C;
  }
  a(Uu, "continueSession");
  function Du(r, e) {
    if (r.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
    let { serverSignature: t } = Qu(
      e
    );
    if (t !== r.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
  }
  a(Du, "finalizeSession");
  function Ou(r) {
    if (typeof r != "string") throw new TypeError("SASL: text must be a string");
    return r.split("").map((e, t) => r.charCodeAt(t)).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
  }
  a(Ou, "isPrintableChars");
  function ls(r) {
    return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
  }
  a(ls, "isBase64");
  function fs(r) {
    if (typeof r != "string") throw new TypeError("SASL: attribute pairs text must be a string");
    return new Map(r.split(",").map((e) => {
      if (!/^.=/.test(e)) throw new Error("SASL: Invalid attribute pair entry");
      let t = e[0], n = e.substring(2);
      return [t, n];
    }));
  }
  a(fs, "parseAttributePairs");
  function qu(r) {
    let e = fs(r), t = e.get("r");
    if (t) {
      if (!Ou(t)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
    let n = e.get("s");
    if (n) {
      if (!ls(n)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
    let i = e.get("i");
    if (i) {
      if (!/^[1-9][0-9]*$/.test(i)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
    let s = parseInt(i, 10);
    return { nonce: t, salt: n, iteration: s };
  }
  a(qu, "parseServerFirstMessage");
  function Qu(r) {
    let t = fs(r).get("v");
    if (t) {
      if (!ls(t)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
    return { serverSignature: t };
  }
  a(Qu, "parseServerFinalMessage");
  function hs(r, e) {
    if (!d.isBuffer(r)) throw new TypeError("first argument must be a Buffer");
    if (!d.isBuffer(e)) throw new TypeError(
      "second argument must be a Buffer"
    );
    if (r.length !== e.length) throw new Error("Buffer lengths must match");
    if (r.length === 0) throw new Error("Buffers cannot be empty");
    return d.from(r.map((t, n) => r[n] ^ e[n]));
  }
  a(hs, "xorBuffers");
  function Nu(r) {
    return yr.createHash("sha256").update(r).digest();
  }
  a(Nu, "sha256");
  function Ue(r, e) {
    return yr.createHmac("sha256", r).update(e).digest();
  }
  a(Ue, "hmacSha256");
  function Wu(r, e, t) {
    for (var n = Ue(
      r,
      d.concat([e, d.from([0, 0, 0, 1])])
    ), i = n, s = 0; s < t - 1; s++) n = Ue(r, n), i = hs(i, n);
    return i;
  }
  a(Wu, "Hi");
  ps.exports = { startSession: Mu, continueSession: Uu, finalizeSession: Du };
});
var mr = {};
ie(mr, { join: () => ju });
function ju(...r) {
  return r.join("/");
}
var wr = G(() => {
  "use strict";
  p();
  a(
    ju,
    "join"
  );
});
var gr = {};
ie(gr, { stat: () => Hu });
function Hu(r, e) {
  e(new Error("No filesystem"));
}
var br = G(() => {
  "use strict";
  p();
  a(Hu, "stat");
});
var vr = {};
ie(vr, { default: () => $u });
var $u;
var xr = G(() => {
  "use strict";
  p();
  $u = {};
});
var ys = {};
ie(ys, { StringDecoder: () => Sr });
var Er;
var Sr;
var ms = G(() => {
  "use strict";
  p();
  Er = class Er {
    constructor(e) {
      E(this, "td");
      this.td = new TextDecoder(e);
    }
    write(e) {
      return this.td.decode(e, { stream: true });
    }
    end(e) {
      return this.td.decode(e);
    }
  };
  a(Er, "StringDecoder");
  Sr = Er;
});
var vs = T((fh, bs) => {
  "use strict";
  p();
  var { Transform: Gu } = (xr(), O(vr)), { StringDecoder: Vu } = (ms(), O(ys)), ve = /* @__PURE__ */ Symbol(
    "last"
  ), It = /* @__PURE__ */ Symbol("decoder");
  function zu(r, e, t) {
    let n;
    if (this.overflow) {
      if (n = this[It].write(r).split(
        this.matcher
      ), n.length === 1) return t();
      n.shift(), this.overflow = false;
    } else this[ve] += this[It].write(r), n = this[ve].split(this.matcher);
    this[ve] = n.pop();
    for (let i = 0; i < n.length; i++) try {
      gs(this, this.mapper(n[i]));
    } catch (s) {
      return t(s);
    }
    if (this.overflow = this[ve].length > this.maxLength, this.overflow && !this.skipOverflow) {
      t(new Error(
        "maximum buffer reached"
      ));
      return;
    }
    t();
  }
  a(zu, "transform");
  function Ku(r) {
    if (this[ve] += this[It].end(), this[ve])
      try {
        gs(this, this.mapper(this[ve]));
      } catch (e) {
        return r(e);
      }
    r();
  }
  a(Ku, "flush");
  function gs(r, e) {
    e !== void 0 && r.push(e);
  }
  a(gs, "push");
  function ws(r) {
    return r;
  }
  a(ws, "noop");
  function Yu(r, e, t) {
    switch (r = r || /\r?\n/, e = e || ws, t = t || {}, arguments.length) {
      case 1:
        typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
        break;
      case 2:
        typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = ws);
    }
    t = Object.assign({}, t), t.autoDestroy = true, t.transform = zu, t.flush = Ku, t.readableObjectMode = true;
    let n = new Gu(t);
    return n[ve] = "", n[It] = new Vu("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
      this._writableState.errorEmitted = false, s(i);
    }, n;
  }
  a(Yu, "split");
  bs.exports = Yu;
});
var Es = T((dh, pe) => {
  "use strict";
  p();
  var xs = (wr(), O(mr)), Zu = (xr(), O(vr)).Stream, Ju = vs(), Ss = (it(), O(nt)), Xu = 5432, Tt = m.platform === "win32", st = m.stderr, ec = 56, tc = 7, rc = 61440, nc = 32768;
  function ic(r) {
    return (r & rc) == nc;
  }
  a(ic, "isRegFile");
  var De = ["host", "port", "database", "user", "password"], Ar = De.length, sc = De[Ar - 1];
  function Cr() {
    var r = st instanceof Zu && st.writable === true;
    if (r) {
      var e = Array.prototype.slice.call(arguments).concat(`
`);
      st.write(Ss.format.apply(Ss, e));
    }
  }
  a(Cr, "warn");
  Object.defineProperty(pe.exports, "isWin", { get: a(function() {
    return Tt;
  }, "get"), set: a(function(r) {
    Tt = r;
  }, "set") });
  pe.exports.warnTo = function(r) {
    var e = st;
    return st = r, e;
  };
  pe.exports.getFileName = function(r) {
    var e = r || m.env, t = e.PGPASSFILE || (Tt ? xs.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : xs.join(e.HOME || "./", ".pgpass"));
    return t;
  };
  pe.exports.usePgPass = function(r, e) {
    return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD") ? false : Tt ? true : (e = e || "<unkn>", ic(r.mode) ? r.mode & (ec | tc) ? (Cr('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (Cr('WARNING: password file "%s" is not a plain file', e), false));
  };
  var oc = pe.exports.match = function(r, e) {
    return De.slice(0, -1).reduce(function(t, n, i) {
      return i == 1 && Number(r[n] || Xu) === Number(
        e[n]
      ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
    }, true);
  };
  pe.exports.getPassword = function(r, e, t) {
    var n, i = e.pipe(
      Ju()
    );
    function s(c) {
      var l = ac(c);
      l && uc(l) && oc(r, l) && (n = l[sc], i.end());
    }
    a(s, "onLine");
    var o = a(function() {
      e.destroy(), t(n);
    }, "onEnd"), u = a(function(c) {
      e.destroy(), Cr("WARNING: error on reading file: %s", c), t(
        void 0
      );
    }, "onErr");
    e.on("error", u), i.on("data", s).on("end", o).on("error", u);
  };
  var ac = pe.exports.parseLine = function(r) {
    if (r.length < 11 || r.match(/^\s+#/)) return null;
    for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(
      function(f3, y, g) {
        var A = r.substring(y, g);
        Object.hasOwnProperty.call(m.env, "PGPASS_NO_DEESCAPE") || (A = A.replace(/\\([:\\])/g, "$1")), o[De[f3]] = A;
      },
      "addToObj"
    ), l = 0; l < r.length - 1; l += 1) {
      if (e = r.charAt(l + 1), t = r.charAt(
        l
      ), u = n == Ar - 1, u) {
        c(n, i);
        break;
      }
      l >= 0 && e == ":" && t !== "\\" && (c(n, i, l + 1), i = l + 2, n += 1);
    }
    return o = Object.keys(o).length === Ar ? o : null, o;
  }, uc = pe.exports.isValidEntry = function(r) {
    for (var e = { 0: function(o) {
      return o.length > 0;
    }, 1: function(o) {
      return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
    }, 2: function(o) {
      return o.length > 0;
    }, 3: function(o) {
      return o.length > 0;
    }, 4: function(o) {
      return o.length > 0;
    } }, t = 0; t < De.length; t += 1) {
      var n = e[t], i = r[De[t]] || "", s = n(i);
      if (!s) return false;
    }
    return true;
  };
});
var Cs = T((gh, _r) => {
  "use strict";
  p();
  var wh = (wr(), O(mr)), As = (br(), O(gr)), Pt = Es();
  _r.exports = function(r, e) {
    var t = Pt.getFileName();
    As.stat(t, function(n, i) {
      if (n || !Pt.usePgPass(i, t)) return e(void 0);
      var s = As.createReadStream(
        t
      );
      Pt.getPassword(r, s, e);
    });
  };
  _r.exports.warnTo = Pt.warnTo;
});
var _s = {};
ie(_s, { default: () => cc });
var cc;
var Is = G(() => {
  "use strict";
  p();
  cc = {};
});
var Ps = T((xh, Ts) => {
  "use strict";
  p();
  var lc = (Zt(), O(gi)), Ir = (br(), O(gr));
  function Tr(r) {
    if (r.charAt(0) === "/") {
      var t = r.split(" ");
      return { host: t[0], database: t[1] };
    }
    var e = lc.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(/\%25(\d\d)/g, "%$1") : r, true), t = e.query;
    for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
    var i = (e.auth || ":").split(":");
    if (t.user = i[0], t.password = i.splice(1).join(
      ":"
    ), t.port = e.port, e.protocol == "socket:") return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
    t.host || (t.host = e.hostname);
    var s = e.pathname;
    if (!t.host && s && /^%2f/i.test(s)) {
      var o = s.split("/");
      t.host = decodeURIComponent(o[0]), s = o.splice(1).join("/");
    }
    switch (s && s.charAt(
      0
    ) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = Ir.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = Ir.readFileSync(t.sslkey).toString()), t.sslrootcert && (t.ssl.ca = Ir.readFileSync(t.sslrootcert).toString()), t.sslmode) {
      case "disable": {
        t.ssl = false;
        break;
      }
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        break;
      case "no-verify": {
        t.ssl.rejectUnauthorized = false;
        break;
      }
    }
    return t;
  }
  a(Tr, "parse");
  Ts.exports = Tr;
  Tr.parse = Tr;
});
var Rt = T((Ah, Ls) => {
  "use strict";
  p();
  var fc = (Is(), O(_s)), Bs = tt(), Rs = Ps().parse, H = a(function(r, e, t) {
    return t === void 0 ? t = m.env["PG" + r.toUpperCase()] : t === false || (t = m.env[t]), e[r] || t || Bs[r];
  }, "val"), hc = a(function() {
    switch (m.env.PGSSLMODE) {
      case "disable":
        return false;
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        return true;
      case "no-verify":
        return { rejectUnauthorized: false };
    }
    return Bs.ssl;
  }, "readSSLConfigFromEnvironment"), Oe = a(function(r) {
    return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  }, "quoteParamValue"), ne = a(function(r, e, t) {
    var n = e[t];
    n != null && r.push(t + "=" + Oe(n));
  }, "add"), Rr = class Rr {
    constructor(e) {
      e = typeof e == "string" ? Rs(e) : e || {}, e.connectionString && (e = Object.assign({}, e, Rs(e.connectionString))), this.user = H("user", e), this.database = H("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(H("port", e), 10), this.host = H("host", e), Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: H("password", e)
      }), this.binary = H("binary", e), this.options = H("options", e), this.ssl = typeof e.ssl > "u" ? hc() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = H("client_encoding", e), this.replication = H("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = H("application_name", e, "PGAPPNAME"), this.fallback_application_name = H("fallback_application_name", e, false), this.statement_timeout = H("statement_timeout", e, false), this.lock_timeout = H("lock_timeout", e, false), this.idle_in_transaction_session_timeout = H("idle_in_transaction_session_timeout", e, false), this.query_timeout = H("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
    }
    getLibpqConnectionString(e) {
      var t = [];
      ne(t, this, "user"), ne(t, this, "password"), ne(t, this, "port"), ne(t, this, "application_name"), ne(
        t,
        this,
        "fallback_application_name"
      ), ne(t, this, "connect_timeout"), ne(t, this, "options");
      var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
      if (ne(t, n, "sslmode"), ne(t, n, "sslca"), ne(t, n, "sslkey"), ne(t, n, "sslcert"), ne(t, n, "sslrootcert"), this.database && t.push("dbname=" + Oe(this.database)), this.replication && t.push("replication=" + Oe(this.replication)), this.host && t.push("host=" + Oe(this.host)), this.isDomainSocket) return e(null, t.join(" "));
      this.client_encoding && t.push("client_encoding=" + Oe(this.client_encoding)), fc.lookup(this.host, function(i, s) {
        return i ? e(i, null) : (t.push("hostaddr=" + Oe(s)), e(null, t.join(" ")));
      });
    }
  };
  a(Rr, "ConnectionParameters");
  var Pr = Rr;
  Ls.exports = Pr;
});
var Ms = T((Ih, ks) => {
  "use strict";
  p();
  var pc = Je(), Fs = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, Lr = class Lr {
    constructor(e, t) {
      this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
    }
    addCommandComplete(e) {
      var t;
      e.text ? t = Fs.exec(e.text) : t = Fs.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(
        t[2],
        10
      ), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(t[2], 10)));
    }
    _parseRowAsArray(e) {
      for (var t = new Array(
        e.length
      ), n = 0, i = e.length; n < i; n++) {
        var s = e[n];
        s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
      }
      return t;
    }
    parseRow(e) {
      for (var t = {}, n = 0, i = e.length; n < i; n++) {
        var s = e[n], o = this.fields[n].name;
        s !== null ? t[o] = this._parsers[n](
          s
        ) : t[o] = null;
      }
      return t;
    }
    addRow(e) {
      this.rows.push(e);
    }
    addFields(e) {
      this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = pc.getTypeParser(n.dataTypeID, n.format || "text");
      }
    }
  };
  a(Lr, "Result");
  var Br = Lr;
  ks.exports = Br;
});
var qs = T((Rh, Os) => {
  "use strict";
  p();
  var { EventEmitter: dc } = ge(), Us = Ms(), Ds = rt(), kr = class kr extends dc {
    constructor(e, t, n) {
      super(), e = Ds.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, m.domain && e.callback && (this.callback = m.domain.bind(e.callback)), this._result = new Us(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
    }
    requiresPreparation() {
      return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
    }
    _checkForMultirow() {
      this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new Us(this._rowMode, this.types), this._results.push(this._result));
    }
    handleRowDescription(e) {
      this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
    }
    handleDataRow(e) {
      let t;
      if (!this._canceledDueToError) {
        try {
          t = this._result.parseRow(
            e.fields
          );
        } catch (n) {
          this._canceledDueToError = n;
          return;
        }
        this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
      }
    }
    handleCommandComplete(e, t) {
      this._checkForMultirow(), this._result.addCommandComplete(
        e
      ), this.rows && t.sync();
    }
    handleEmptyQuery(e) {
      this.rows && e.sync();
    }
    handleError(e, t) {
      if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e);
      this.emit("error", e);
    }
    handleReadyForQuery(e) {
      if (this._canceledDueToError) return this.handleError(
        this._canceledDueToError,
        e
      );
      if (this.callback) try {
        this.callback(null, this._results);
      } catch (t) {
        m.nextTick(() => {
          throw t;
        });
      }
      this.emit(
        "end",
        this._results
      );
    }
    submit(e) {
      if (typeof this.text != "string" && typeof this.name != "string") return new Error(
        "A query must have either text or a name. Supplying neither is unsupported."
      );
      let t = e.parsedStatements[this.name];
      return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
    }
    hasBeenParsed(e) {
      return this.name && e.parsedStatements[this.name];
    }
    handlePortalSuspended(e) {
      this._getRows(e, this.rows);
    }
    _getRows(e, t) {
      e.execute({ portal: this.portal, rows: t }), t ? e.flush() : e.sync();
    }
    prepare(e) {
      this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
      try {
        e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: Ds.prepareValue });
      } catch (t) {
        this.handleError(t, e);
        return;
      }
      e.describe({ type: "P", name: this.portal || "" }), this._getRows(e, this.rows);
    }
    handleCopyInResponse(e) {
      e.sendCopyFail("No source stream defined");
    }
    handleCopyData(e, t) {
    }
  };
  a(kr, "Query");
  var Fr = kr;
  Os.exports = Fr;
});
var ln = T((_) => {
  "use strict";
  p();
  Object.defineProperty(_, "__esModule", { value: true });
  _.NoticeMessage = _.DataRowMessage = _.CommandCompleteMessage = _.ReadyForQueryMessage = _.NotificationResponseMessage = _.BackendKeyDataMessage = _.AuthenticationMD5Password = _.ParameterStatusMessage = _.ParameterDescriptionMessage = _.RowDescriptionMessage = _.Field = _.CopyResponse = _.CopyDataMessage = _.DatabaseError = _.copyDone = _.emptyQuery = _.replicationStart = _.portalSuspended = _.noData = _.closeComplete = _.bindComplete = _.parseComplete = void 0;
  _.parseComplete = { name: "parseComplete", length: 5 };
  _.bindComplete = { name: "bindComplete", length: 5 };
  _.closeComplete = { name: "closeComplete", length: 5 };
  _.noData = { name: "noData", length: 5 };
  _.portalSuspended = { name: "portalSuspended", length: 5 };
  _.replicationStart = { name: "replicationStart", length: 4 };
  _.emptyQuery = { name: "emptyQuery", length: 4 };
  _.copyDone = { name: "copyDone", length: 4 };
  var Kr = class Kr extends Error {
    constructor(e, t, n) {
      super(e), this.length = t, this.name = n;
    }
  };
  a(Kr, "DatabaseError");
  var Mr = Kr;
  _.DatabaseError = Mr;
  var Yr = class Yr {
    constructor(e, t) {
      this.length = e, this.chunk = t, this.name = "copyData";
    }
  };
  a(Yr, "CopyDataMessage");
  var Ur = Yr;
  _.CopyDataMessage = Ur;
  var Zr = class Zr {
    constructor(e, t, n, i) {
      this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
    }
  };
  a(Zr, "CopyResponse");
  var Dr = Zr;
  _.CopyResponse = Dr;
  var Jr = class Jr {
    constructor(e, t, n, i, s, o, u) {
      this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
    }
  };
  a(Jr, "Field");
  var Or = Jr;
  _.Field = Or;
  var Xr = class Xr {
    constructor(e, t) {
      this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(this.fieldCount);
    }
  };
  a(Xr, "RowDescriptionMessage");
  var qr = Xr;
  _.RowDescriptionMessage = qr;
  var en = class en {
    constructor(e, t) {
      this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
    }
  };
  a(en, "ParameterDescriptionMessage");
  var Qr = en;
  _.ParameterDescriptionMessage = Qr;
  var tn = class tn {
    constructor(e, t, n) {
      this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
    }
  };
  a(tn, "ParameterStatusMessage");
  var Nr = tn;
  _.ParameterStatusMessage = Nr;
  var rn = class rn {
    constructor(e, t) {
      this.length = e, this.salt = t, this.name = "authenticationMD5Password";
    }
  };
  a(rn, "AuthenticationMD5Password");
  var Wr = rn;
  _.AuthenticationMD5Password = Wr;
  var nn = class nn {
    constructor(e, t, n) {
      this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
    }
  };
  a(nn, "BackendKeyDataMessage");
  var jr = nn;
  _.BackendKeyDataMessage = jr;
  var sn = class sn {
    constructor(e, t, n, i) {
      this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
    }
  };
  a(sn, "NotificationResponseMessage");
  var Hr = sn;
  _.NotificationResponseMessage = Hr;
  var on = class on {
    constructor(e, t) {
      this.length = e, this.status = t, this.name = "readyForQuery";
    }
  };
  a(on, "ReadyForQueryMessage");
  var $r = on;
  _.ReadyForQueryMessage = $r;
  var an = class an {
    constructor(e, t) {
      this.length = e, this.text = t, this.name = "commandComplete";
    }
  };
  a(an, "CommandCompleteMessage");
  var Gr = an;
  _.CommandCompleteMessage = Gr;
  var un = class un {
    constructor(e, t) {
      this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
    }
  };
  a(un, "DataRowMessage");
  var Vr = un;
  _.DataRowMessage = Vr;
  var cn = class cn {
    constructor(e, t) {
      this.length = e, this.message = t, this.name = "notice";
    }
  };
  a(cn, "NoticeMessage");
  var zr = cn;
  _.NoticeMessage = zr;
});
var Qs = T((Bt) => {
  "use strict";
  p();
  Object.defineProperty(Bt, "__esModule", { value: true });
  Bt.Writer = void 0;
  var hn = class hn {
    constructor(e = 256) {
      this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = d.allocUnsafe(e);
    }
    ensure(e) {
      if (this.buffer.length - this.offset < e) {
        let n = this.buffer, i = n.length + (n.length >> 1) + e;
        this.buffer = d.allocUnsafe(i), n.copy(
          this.buffer
        );
      }
    }
    addInt32(e) {
      return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addInt16(e) {
      return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addCString(e) {
      if (!e) this.ensure(1);
      else {
        let t = d.byteLength(e);
        this.ensure(t + 1), this.buffer.write(e, this.offset, "utf-8"), this.offset += t;
      }
      return this.buffer[this.offset++] = 0, this;
    }
    addString(e = "") {
      let t = d.byteLength(e);
      return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
    }
    add(e) {
      return this.ensure(
        e.length
      ), e.copy(this.buffer, this.offset), this.offset += e.length, this;
    }
    join(e) {
      if (e) {
        this.buffer[this.headerPosition] = e;
        let t = this.offset - (this.headerPosition + 1);
        this.buffer.writeInt32BE(t, this.headerPosition + 1);
      }
      return this.buffer.slice(e ? 0 : 5, this.offset);
    }
    flush(e) {
      let t = this.join(e);
      return this.offset = 5, this.headerPosition = 0, this.buffer = d.allocUnsafe(this.size), t;
    }
  };
  a(hn, "Writer");
  var fn = hn;
  Bt.Writer = fn;
});
var Ws = T((Ft) => {
  "use strict";
  p();
  Object.defineProperty(Ft, "__esModule", { value: true });
  Ft.serialize = void 0;
  var pn = Qs(), F = new pn.Writer(), yc = a((r) => {
    F.addInt16(3).addInt16(0);
    for (let n of Object.keys(r)) F.addCString(
      n
    ).addCString(r[n]);
    F.addCString("client_encoding").addCString("UTF8");
    let e = F.addCString("").flush(), t = e.length + 4;
    return new pn.Writer().addInt32(t).add(e).flush();
  }, "startup"), mc = a(() => {
    let r = d.allocUnsafe(
      8
    );
    return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
  }, "requestSsl"), wc = a((r) => F.addCString(r).flush(
    112
  ), "password"), gc = a(function(r, e) {
    return F.addCString(r).addInt32(d.byteLength(e)).addString(e), F.flush(112);
  }, "sendSASLInitialResponseMessage"), bc = a(function(r) {
    return F.addString(r).flush(112);
  }, "sendSCRAMClientFinalMessage"), vc = a((r) => F.addCString(r).flush(81), "query"), Ns = [], xc = a((r) => {
    let e = r.name || "";
    e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
    let t = r.types || Ns, n = t.length, i = F.addCString(e).addCString(r.text).addInt16(n);
    for (let s = 0; s < n; s++) i.addInt32(t[s]);
    return F.flush(80);
  }, "parse"), qe = new pn.Writer(), Sc = a(function(r, e) {
    for (let t = 0; t < r.length; t++) {
      let n = e ? e(r[t], t) : r[t];
      n == null ? (F.addInt16(0), qe.addInt32(-1)) : n instanceof d ? (F.addInt16(
        1
      ), qe.addInt32(n.length), qe.add(n)) : (F.addInt16(0), qe.addInt32(d.byteLength(n)), qe.addString(n));
    }
  }, "writeValues"), Ec = a((r = {}) => {
    let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || Ns, s = i.length;
    return F.addCString(e).addCString(t), F.addInt16(s), Sc(i, r.valueMapper), F.addInt16(s), F.add(qe.flush()), F.addInt16(n ? 1 : 0), F.flush(66);
  }, "bind"), Ac = d.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Cc = a((r) => {
    if (!r || !r.portal && !r.rows) return Ac;
    let e = r.portal || "", t = r.rows || 0, n = d.byteLength(e), i = 4 + n + 1 + 4, s = d.allocUnsafe(1 + i);
    return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
  }, "execute"), _c = a(
    (r, e) => {
      let t = d.allocUnsafe(16);
      return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(
        5678,
        6
      ), t.writeInt32BE(r, 8), t.writeInt32BE(e, 12), t;
    },
    "cancel"
  ), dn = a((r, e) => {
    let n = 4 + d.byteLength(e) + 1, i = d.allocUnsafe(1 + n);
    return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
  }, "cstringMessage"), Ic = F.addCString("P").flush(68), Tc = F.addCString("S").flush(68), Pc = a((r) => r.name ? dn(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Ic : Tc, "describe"), Rc = a((r) => {
    let e = `${r.type}${r.name || ""}`;
    return dn(67, e);
  }, "close"), Bc = a((r) => F.add(r).flush(100), "copyData"), Lc = a((r) => dn(102, r), "copyFail"), Lt = a((r) => d.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), Fc = Lt(72), kc = Lt(83), Mc = Lt(88), Uc = Lt(99), Dc = {
    startup: yc,
    password: wc,
    requestSsl: mc,
    sendSASLInitialResponseMessage: gc,
    sendSCRAMClientFinalMessage: bc,
    query: vc,
    parse: xc,
    bind: Ec,
    execute: Cc,
    describe: Pc,
    close: Rc,
    flush: a(
      () => Fc,
      "flush"
    ),
    sync: a(() => kc, "sync"),
    end: a(() => Mc, "end"),
    copyData: Bc,
    copyDone: a(() => Uc, "copyDone"),
    copyFail: Lc,
    cancel: _c
  };
  Ft.serialize = Dc;
});
var js = T((kt) => {
  "use strict";
  p();
  Object.defineProperty(kt, "__esModule", { value: true });
  kt.BufferReader = void 0;
  var Oc = d.allocUnsafe(0), mn = class mn {
    constructor(e = 0) {
      this.offset = e, this.buffer = Oc, this.encoding = "utf-8";
    }
    setBuffer(e, t) {
      this.offset = e, this.buffer = t;
    }
    int16() {
      let e = this.buffer.readInt16BE(this.offset);
      return this.offset += 2, e;
    }
    byte() {
      let e = this.buffer[this.offset];
      return this.offset++, e;
    }
    int32() {
      let e = this.buffer.readInt32BE(
        this.offset
      );
      return this.offset += 4, e;
    }
    uint32() {
      let e = this.buffer.readUInt32BE(this.offset);
      return this.offset += 4, e;
    }
    string(e) {
      let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
      return this.offset += e, t;
    }
    cstring() {
      let e = this.offset, t = e;
      for (; this.buffer[t++] !== 0; ) ;
      return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
    }
    bytes(e) {
      let t = this.buffer.slice(this.offset, this.offset + e);
      return this.offset += e, t;
    }
  };
  a(mn, "BufferReader");
  var yn = mn;
  kt.BufferReader = yn;
});
var Gs = T((Mt) => {
  "use strict";
  p();
  Object.defineProperty(Mt, "__esModule", { value: true });
  Mt.Parser = void 0;
  var k = ln(), qc = js(), wn = 1, Qc = 4, Hs = wn + Qc, $s = d.allocUnsafe(0), bn = class bn {
    constructor(e) {
      if (this.buffer = $s, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new qc.BufferReader(), e?.mode === "binary") throw new Error("Binary mode not supported yet");
      this.mode = e?.mode || "text";
    }
    parse(e, t) {
      this.mergeBuffer(e);
      let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
      for (; i + Hs <= n; ) {
        let s = this.buffer[i], o = this.buffer.readUInt32BE(
          i + wn
        ), u = wn + o;
        if (u + i <= n) {
          let c = this.handlePacket(i + Hs, s, o, this.buffer);
          t(c), i += u;
        } else break;
      }
      i === n ? (this.buffer = $s, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
    }
    mergeBuffer(e) {
      if (this.bufferLength > 0) {
        let t = this.bufferLength + e.byteLength;
        if (t + this.bufferOffset > this.buffer.byteLength) {
          let i;
          if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) i = this.buffer;
          else {
            let s = this.buffer.byteLength * 2;
            for (; t >= s; ) s *= 2;
            i = d.allocUnsafe(s);
          }
          this.buffer.copy(i, 0, this.bufferOffset, this.bufferOffset + this.bufferLength), this.buffer = i, this.bufferOffset = 0;
        }
        e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
      } else this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
    }
    handlePacket(e, t, n, i) {
      switch (t) {
        case 50:
          return k.bindComplete;
        case 49:
          return k.parseComplete;
        case 51:
          return k.closeComplete;
        case 110:
          return k.noData;
        case 115:
          return k.portalSuspended;
        case 99:
          return k.copyDone;
        case 87:
          return k.replicationStart;
        case 73:
          return k.emptyQuery;
        case 68:
          return this.parseDataRowMessage(e, n, i);
        case 67:
          return this.parseCommandCompleteMessage(
            e,
            n,
            i
          );
        case 90:
          return this.parseReadyForQueryMessage(e, n, i);
        case 65:
          return this.parseNotificationMessage(
            e,
            n,
            i
          );
        case 82:
          return this.parseAuthenticationResponse(e, n, i);
        case 83:
          return this.parseParameterStatusMessage(
            e,
            n,
            i
          );
        case 75:
          return this.parseBackendKeyData(e, n, i);
        case 69:
          return this.parseErrorMessage(e, n, i, "error");
        case 78:
          return this.parseErrorMessage(e, n, i, "notice");
        case 84:
          return this.parseRowDescriptionMessage(
            e,
            n,
            i
          );
        case 116:
          return this.parseParameterDescriptionMessage(e, n, i);
        case 71:
          return this.parseCopyInMessage(
            e,
            n,
            i
          );
        case 72:
          return this.parseCopyOutMessage(e, n, i);
        case 100:
          return this.parseCopyData(e, n, i);
        default:
          return new k.DatabaseError("received invalid response: " + t.toString(16), n, "error");
      }
    }
    parseReadyForQueryMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.string(1);
      return new k.ReadyForQueryMessage(t, i);
    }
    parseCommandCompleteMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring();
      return new k.CommandCompleteMessage(t, i);
    }
    parseCopyData(e, t, n) {
      let i = n.slice(e, e + (t - 4));
      return new k.CopyDataMessage(t, i);
    }
    parseCopyInMessage(e, t, n) {
      return this.parseCopyMessage(
        e,
        t,
        n,
        "copyInResponse"
      );
    }
    parseCopyOutMessage(e, t, n) {
      return this.parseCopyMessage(e, t, n, "copyOutResponse");
    }
    parseCopyMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = this.reader.byte() !== 0, o = this.reader.int16(), u = new k.CopyResponse(t, i, s, o);
      for (let c = 0; c < o; c++) u.columnTypes[c] = this.reader.int16();
      return u;
    }
    parseNotificationMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int32(), s = this.reader.cstring(), o = this.reader.cstring();
      return new k.NotificationResponseMessage(t, i, s, o);
    }
    parseRowDescriptionMessage(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int16(), s = new k.RowDescriptionMessage(t, i);
      for (let o = 0; o < i; o++) s.fields[o] = this.parseField();
      return s;
    }
    parseField() {
      let e = this.reader.cstring(), t = this.reader.uint32(), n = this.reader.int16(), i = this.reader.uint32(), s = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
      return new k.Field(e, t, n, i, s, o, u);
    }
    parseParameterDescriptionMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new k.ParameterDescriptionMessage(t, i);
      for (let o = 0; o < i; o++)
        s.dataTypeIDs[o] = this.reader.int32();
      return s;
    }
    parseDataRowMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new Array(i);
      for (let o = 0; o < i; o++) {
        let u = this.reader.int32();
        s[o] = u === -1 ? null : this.reader.string(u);
      }
      return new k.DataRowMessage(t, s);
    }
    parseParameterStatusMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring(), s = this.reader.cstring();
      return new k.ParameterStatusMessage(
        t,
        i,
        s
      );
    }
    parseBackendKeyData(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int32(), s = this.reader.int32();
      return new k.BackendKeyDataMessage(t, i, s);
    }
    parseAuthenticationResponse(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int32(), s = { name: "authenticationOk", length: t };
      switch (i) {
        case 0:
          break;
        case 3:
          s.length === 8 && (s.name = "authenticationCleartextPassword");
          break;
        case 5:
          if (s.length === 12) {
            s.name = "authenticationMD5Password";
            let o = this.reader.bytes(4);
            return new k.AuthenticationMD5Password(t, o);
          }
          break;
        case 10:
          {
            s.name = "authenticationSASL", s.mechanisms = [];
            let o;
            do
              o = this.reader.cstring(), o && s.mechanisms.push(o);
            while (o);
          }
          break;
        case 11:
          s.name = "authenticationSASLContinue", s.data = this.reader.string(t - 8);
          break;
        case 12:
          s.name = "authenticationSASLFinal", s.data = this.reader.string(t - 8);
          break;
        default:
          throw new Error("Unknown authenticationOk message type " + i);
      }
      return s;
    }
    parseErrorMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = {}, o = this.reader.string(1);
      for (; o !== "\0"; ) s[o] = this.reader.cstring(), o = this.reader.string(1);
      let u = s.M, c = i === "notice" ? new k.NoticeMessage(t, u) : new k.DatabaseError(u, t, i);
      return c.severity = s.S, c.code = s.C, c.detail = s.D, c.hint = s.H, c.position = s.P, c.internalPosition = s.p, c.internalQuery = s.q, c.where = s.W, c.schema = s.s, c.table = s.t, c.column = s.c, c.dataType = s.d, c.constraint = s.n, c.file = s.F, c.line = s.L, c.routine = s.R, c;
    }
  };
  a(bn, "Parser");
  var gn = bn;
  Mt.Parser = gn;
});
var vn = T((xe) => {
  "use strict";
  p();
  Object.defineProperty(xe, "__esModule", { value: true });
  xe.DatabaseError = xe.serialize = xe.parse = void 0;
  var Nc = ln();
  Object.defineProperty(xe, "DatabaseError", { enumerable: true, get: a(
    function() {
      return Nc.DatabaseError;
    },
    "get"
  ) });
  var Wc = Ws();
  Object.defineProperty(xe, "serialize", {
    enumerable: true,
    get: a(function() {
      return Wc.serialize;
    }, "get")
  });
  var jc = Gs();
  function Hc(r, e) {
    let t = new jc.Parser();
    return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
  }
  a(Hc, "parse");
  xe.parse = Hc;
});
var Vs = {};
ie(Vs, { connect: () => $c });
function $c({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
var zs = G(
  () => {
    "use strict";
    p();
    a($c, "connect");
  }
);
var En = T((Xh, Zs) => {
  "use strict";
  p();
  var Ks = (Fe(), O(wi)), Gc = ge().EventEmitter, { parse: Vc, serialize: Q } = vn(), Ys = Q.flush(), zc = Q.sync(), Kc = Q.end(), Sn = class Sn extends Gc {
    constructor(e) {
      super(), e = e || {}, this.stream = e.stream || new Ks.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
      var t = this;
      this.on("newListener", function(n) {
        n === "message" && (t._emitMessage = true);
      });
    }
    connect(e, t) {
      var n = this;
      this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(e, t), this.stream.once("connect", function() {
        n._keepAlive && n.stream.setKeepAlive(true, n._keepAliveInitialDelayMillis), n.emit("connect");
      });
      let i = a(function(s) {
        n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
      }, "reportStreamError");
      if (this.stream.on("error", i), this.stream.on("close", function() {
        n.emit("end");
      }), !this.ssl) return this.attachListeners(
        this.stream
      );
      this.stream.once("data", function(s) {
        var o = s.toString("utf8");
        switch (o) {
          case "S":
            break;
          case "N":
            return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
          default:
            return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
        }
        var u = (zs(), O(Vs));
        let c = { socket: n.stream };
        n.ssl !== true && (Object.assign(c, n.ssl), "key" in n.ssl && (c.key = n.ssl.key)), Ks.isIP(t) === 0 && (c.servername = t);
        try {
          n.stream = u.connect(c);
        } catch (l) {
          return n.emit(
            "error",
            l
          );
        }
        n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
      });
    }
    attachListeners(e) {
      e.on(
        "end",
        () => {
          this.emit("end");
        }
      ), Vc(e, (t) => {
        var n = t.name === "error" ? "errorMessage" : t.name;
        this._emitMessage && this.emit("message", t), this.emit(n, t);
      });
    }
    requestSsl() {
      this.stream.write(Q.requestSsl());
    }
    startup(e) {
      this.stream.write(Q.startup(e));
    }
    cancel(e, t) {
      this._send(Q.cancel(e, t));
    }
    password(e) {
      this._send(Q.password(e));
    }
    sendSASLInitialResponseMessage(e, t) {
      this._send(Q.sendSASLInitialResponseMessage(e, t));
    }
    sendSCRAMClientFinalMessage(e) {
      this._send(Q.sendSCRAMClientFinalMessage(
        e
      ));
    }
    _send(e) {
      return this.stream.writable ? this.stream.write(e) : false;
    }
    query(e) {
      this._send(Q.query(e));
    }
    parse(e) {
      this._send(Q.parse(e));
    }
    bind(e) {
      this._send(Q.bind(e));
    }
    execute(e) {
      this._send(Q.execute(e));
    }
    flush() {
      this.stream.writable && this.stream.write(Ys);
    }
    sync() {
      this._ending = true, this._send(Ys), this._send(zc);
    }
    ref() {
      this.stream.ref();
    }
    unref() {
      this.stream.unref();
    }
    end() {
      if (this._ending = true, !this._connecting || !this.stream.writable) {
        this.stream.end();
        return;
      }
      return this.stream.write(Kc, () => {
        this.stream.end();
      });
    }
    close(e) {
      this._send(Q.close(e));
    }
    describe(e) {
      this._send(Q.describe(e));
    }
    sendCopyFromChunk(e) {
      this._send(Q.copyData(e));
    }
    endCopyFrom() {
      this._send(Q.copyDone());
    }
    sendCopyFail(e) {
      this._send(Q.copyFail(e));
    }
  };
  a(Sn, "Connection");
  var xn = Sn;
  Zs.exports = xn;
});
var eo = T((np, Xs) => {
  "use strict";
  p();
  var Yc = ge().EventEmitter, rp = (it(), O(nt)), Zc = rt(), An = ds(), Jc = Cs(), Xc = At(), el = Rt(), Js = qs(), tl = tt(), rl = En(), Cn = class Cn extends Yc {
    constructor(e) {
      super(), this.connectionParameters = new el(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(
        this,
        "password",
        { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }
      ), this.replication = this.connectionParameters.replication;
      var t = e || {};
      this._Promise = t.Promise || b.Promise, this._types = new Xc(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new rl({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || tl.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
    }
    _errorAllQueries(e) {
      let t = a((n) => {
        m.nextTick(() => {
          n.handleError(e, this.connection);
        });
      }, "enqueueError");
      this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
    }
    _connect(e) {
      var t = this, n = this.connection;
      if (this._connectionCallback = e, this._connecting || this._connected) {
        let i = new Error("Client has already been connected. You cannot reuse a client.");
        m.nextTick(
          () => {
            e(i);
          }
        );
        return;
      }
      this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
        n._ending = true, n.stream.destroy(new Error("timeout expired"));
      }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
        t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
      }), n.on("sslconnect", function() {
        n.startup(t.getStartupConf());
      }), this._attachListeners(
        n
      ), n.once("end", () => {
        let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
        clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(i)), m.nextTick(() => {
          this.emit("end");
        });
      });
    }
    connect(e) {
      if (e) {
        this._connect(e);
        return;
      }
      return new this._Promise((t, n) => {
        this._connect((i) => {
          i ? n(i) : t();
        });
      });
    }
    _attachListeners(e) {
      e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on("errorMessage", this._handleErrorMessage.bind(this)), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(
        this
      )), e.on("emptyQuery", this._handleEmptyQuery.bind(this)), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
    }
    _checkPgPass(e) {
      let t = this.connection;
      typeof this.password == "function" ? this._Promise.resolve().then(() => this.password()).then((n) => {
        if (n !== void 0) {
          if (typeof n != "string") {
            t.emit("error", new TypeError(
              "Password must be a string"
            ));
            return;
          }
          this.connectionParameters.password = this.password = n;
        } else this.connectionParameters.password = this.password = null;
        e();
      }).catch((n) => {
        t.emit("error", n);
      }) : this.password !== null ? e() : Jc(
        this.connectionParameters,
        (n) => {
          n !== void 0 && (this.connectionParameters.password = this.password = n), e();
        }
      );
    }
    _handleAuthCleartextPassword(e) {
      this._checkPgPass(() => {
        this.connection.password(this.password);
      });
    }
    _handleAuthMD5Password(e) {
      this._checkPgPass(
        () => {
          let t = Zc.postgresMd5PasswordHash(this.user, this.password, e.salt);
          this.connection.password(t);
        }
      );
    }
    _handleAuthSASL(e) {
      this._checkPgPass(() => {
        this.saslSession = An.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
          this.saslSession.mechanism,
          this.saslSession.response
        );
      });
    }
    _handleAuthSASLContinue(e) {
      An.continueSession(
        this.saslSession,
        this.password,
        e.data
      ), this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
    }
    _handleAuthSASLFinal(e) {
      An.finalizeSession(this.saslSession, e.data), this.saslSession = null;
    }
    _handleBackendKeyData(e) {
      this.processID = e.processID, this.secretKey = e.secretKey;
    }
    _handleReadyForQuery(e) {
      this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
      let { activeQuery: t } = this;
      this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
    }
    _handleErrorWhileConnecting(e) {
      if (!this._connectionError) {
        if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e);
        this.emit("error", e);
      }
    }
    _handleErrorEvent(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
    }
    _handleErrorMessage(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      let t = this.activeQuery;
      if (!t) {
        this._handleErrorEvent(e);
        return;
      }
      this.activeQuery = null, t.handleError(
        e,
        this.connection
      );
    }
    _handleRowDescription(e) {
      this.activeQuery.handleRowDescription(e);
    }
    _handleDataRow(e) {
      this.activeQuery.handleDataRow(e);
    }
    _handlePortalSuspended(e) {
      this.activeQuery.handlePortalSuspended(this.connection);
    }
    _handleEmptyQuery(e) {
      this.activeQuery.handleEmptyQuery(this.connection);
    }
    _handleCommandComplete(e) {
      this.activeQuery.handleCommandComplete(e, this.connection);
    }
    _handleParseComplete(e) {
      this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
    }
    _handleCopyInResponse(e) {
      this.activeQuery.handleCopyInResponse(this.connection);
    }
    _handleCopyData(e) {
      this.activeQuery.handleCopyData(
        e,
        this.connection
      );
    }
    _handleNotification(e) {
      this.emit("notification", e);
    }
    _handleNotice(e) {
      this.emit("notice", e);
    }
    getStartupConf() {
      var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
      return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(e.statement_timeout, 10))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(e.idle_in_transaction_session_timeout, 10))), e.options && (t.options = e.options), t;
    }
    cancel(e, t) {
      if (e.activeQuery === t) {
        var n = this.connection;
        this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
          n.cancel(
            e.processID,
            e.secretKey
          );
        });
      } else e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
    }
    setTypeParser(e, t, n) {
      return this._types.setTypeParser(e, t, n);
    }
    getTypeParser(e, t) {
      return this._types.getTypeParser(e, t);
    }
    escapeIdentifier(e) {
      return '"' + e.replace(/"/g, '""') + '"';
    }
    escapeLiteral(e) {
      for (var t = false, n = "'", i = 0; i < e.length; i++) {
        var s = e[i];
        s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
      }
      return n += "'", t === true && (n = " E" + n), n;
    }
    _pulseQueryQueue() {
      if (this.readyForQuery === true) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
        this.readyForQuery = false, this.hasExecuted = true;
        let e = this.activeQuery.submit(this.connection);
        e && m.nextTick(() => {
          this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
        });
      } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
    }
    query(e, t, n) {
      var i, s, o, u, c;
      if (e == null) throw new TypeError(
        "Client was passed a null or undefined query"
      );
      return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new Js(e, t, n), i.callback || (s = new this._Promise((l, f3) => {
        i.callback = (y, g) => y ? f3(y) : l(g);
      }))), o && (c = i.callback, u = setTimeout(() => {
        var l = new Error("Query read timeout");
        m.nextTick(
          () => {
            i.handleError(l, this.connection);
          }
        ), c(l), i.callback = () => {
        };
        var f3 = this.queryQueue.indexOf(i);
        f3 > -1 && this.queryQueue.splice(f3, 1), this._pulseQueryQueue();
      }, o), i.callback = (l, f3) => {
        clearTimeout(u), c(l, f3);
      }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (m.nextTick(() => {
        i.handleError(new Error("Client was closed and is not queryable"), this.connection);
      }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (m.nextTick(() => {
        i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
      }), s);
    }
    ref() {
      this.connection.ref();
    }
    unref() {
      this.connection.unref();
    }
    end(e) {
      if (this._ending = true, !this.connection._connecting) if (e) e();
      else return this._Promise.resolve();
      if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e) this.connection.once("end", e);
      else return new this._Promise((t) => {
        this.connection.once("end", t);
      });
    }
  };
  a(Cn, "Client");
  var Ut = Cn;
  Ut.Query = Js;
  Xs.exports = Ut;
});
var io = T((op, no) => {
  "use strict";
  p();
  var nl = ge().EventEmitter, to = a(function() {
  }, "NOOP"), ro = a((r, e) => {
    let t = r.findIndex(e);
    return t === -1 ? void 0 : r.splice(t, 1)[0];
  }, "removeWhere"), Tn = class Tn {
    constructor(e, t, n) {
      this.client = e, this.idleListener = t, this.timeoutId = n;
    }
  };
  a(Tn, "IdleItem");
  var _n = Tn, Pn = class Pn {
    constructor(e) {
      this.callback = e;
    }
  };
  a(Pn, "PendingItem");
  var Qe = Pn;
  function il() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  a(il, "throwOnDoubleRelease");
  function Dt(r, e) {
    if (e)
      return { callback: e, result: void 0 };
    let t, n, i = a(function(o, u) {
      o ? t(o) : n(u);
    }, "cb"), s = new r(function(o, u) {
      n = o, t = u;
    }).catch((o) => {
      throw Error.captureStackTrace(o), o;
    });
    return { callback: i, result: s };
  }
  a(Dt, "promisify");
  function sl(r, e) {
    return a(function t(n) {
      n.client = e, e.removeListener("error", t), e.on("error", () => {
        r.log(
          "additional client error after disconnection due to error",
          n
        );
      }), r._remove(e), r.emit("error", n, e);
    }, "idleListener");
  }
  a(sl, "makeIdleListener");
  var Rn = class Rn extends nl {
    constructor(e, t) {
      super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(this.options, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: e.password
      }), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.min = this.options.min || 0, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
      }, this.Client = this.options.Client || t || ot().Client, this.Promise = this.options.Promise || b.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _isAboveMin() {
      return this._clients.length > this.options.min;
    }
    _pulseQueue() {
      if (this.log("pulse queue"), this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log("pulse queue on ending"), this._idle.length && this._idle.slice().map((t) => {
          this._remove(t.client);
        }), this._clients.length || (this.ended = true, this._endCallback());
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull()) return;
      let e = this._pendingQueue.shift();
      if (this._idle.length) {
        let t = this._idle.pop();
        clearTimeout(
          t.timeoutId
        );
        let n = t.client;
        n.ref && n.ref();
        let i = t.idleListener;
        return this._acquireClient(n, e, i, false);
      }
      if (!this._isFull()) return this.newClient(e);
      throw new Error("unexpected condition");
    }
    _remove(e) {
      let t = ro(
        this._idle,
        (n) => n.client === e
      );
      t !== void 0 && clearTimeout(t.timeoutId), this._clients = this._clients.filter(
        (n) => n !== e
      ), e.end(), this.emit("remove", e);
    }
    connect(e) {
      if (this.ending) {
        let i = new Error("Cannot use a pool after calling end on the pool");
        return e ? e(i) : this.Promise.reject(i);
      }
      let t = Dt(this.Promise, e), n = t.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length && m.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis) return this._pendingQueue.push(new Qe(t.callback)), n;
        let i = a((u, c, l) => {
          clearTimeout(o), t.callback(u, c, l);
        }, "queueCallback"), s = new Qe(i), o = setTimeout(() => {
          ro(
            this._pendingQueue,
            (u) => u.callback === i
          ), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        return o.unref && o.unref(), this._pendingQueue.push(s), n;
      }
      return this.newClient(new Qe(t.callback)), n;
    }
    newClient(e) {
      let t = new this.Client(this.options);
      this._clients.push(
        t
      );
      let n = sl(this, t);
      this.log("checking client timeout");
      let i, s = false;
      this.options.connectionTimeoutMillis && (i = setTimeout(() => {
        this.log("ending client due to timeout"), s = true, t.connection ? t.connection.stream.destroy() : t.end();
      }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
        if (i && clearTimeout(i), t.on("error", n), o) this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o = new Error("Connection terminated due to connection timeout", { cause: o })), this._pulseQueue(), e.timedOut || e.callback(o, void 0, to);
        else {
          if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
            let u = setTimeout(() => {
              this.log("ending client due to expired lifetime"), this._expired.add(t), this._idle.findIndex((l) => l.client === t) !== -1 && this._acquireClient(
                t,
                new Qe((l, f3, y) => y()),
                n,
                false
              );
            }, this.options.maxLifetimeSeconds * 1e3);
            u.unref(), t.once("end", () => clearTimeout(u));
          }
          return this._acquireClient(t, e, n, true);
        }
      });
    }
    _acquireClient(e, t, n, i) {
      i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(e, e.release) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
        if (s) return e.release(s), t.callback(s, void 0, to);
        t.callback(void 0, e, e.release);
      }) : t.callback(void 0, e, e.release);
    }
    _releaseOnce(e, t) {
      let n = false;
      return (i) => {
        n && il(), n = true, this._release(e, t, i);
      };
    }
    _release(e, t, n) {
      if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit("release", n, e), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) {
        e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e), this._pulseQueue();
        return;
      }
      if (this._expired.has(e)) {
        this.log("remove expired client"), this._expired.delete(e), this._remove(e), this._pulseQueue();
        return;
      }
      let s;
      this.options.idleTimeoutMillis && this._isAboveMin() && (s = setTimeout(() => {
        this.log("remove idle client"), this._remove(e);
      }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new _n(
        e,
        t,
        s
      )), this._pulseQueue();
    }
    query(e, t, n) {
      if (typeof e == "function") {
        let s = Dt(this.Promise, e);
        return v(function() {
          return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        }), s.result;
      }
      typeof t == "function" && (n = t, t = void 0);
      let i = Dt(this.Promise, n);
      return n = i.callback, this.connect((s, o) => {
        if (s) return n(s);
        let u = false, c = a((l) => {
          u || (u = true, o.release(l), n(l));
        }, "onError");
        o.once("error", c), this.log("dispatching query");
        try {
          o.query(e, t, (l, f3) => {
            if (this.log("query dispatched"), o.removeListener(
              "error",
              c
            ), !u) return u = true, o.release(l), l ? n(l) : n(void 0, f3);
          });
        } catch (l) {
          return o.release(l), n(l);
        }
      }), i.result;
    }
    end(e) {
      if (this.log("ending"), this.ending) {
        let n = new Error("Called end on pool more than once");
        return e ? e(n) : this.Promise.reject(n);
      }
      this.ending = true;
      let t = Dt(this.Promise, e);
      return this._endCallback = t.callback, this._pulseQueue(), t.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  };
  a(Rn, "Pool");
  var In = Rn;
  no.exports = In;
});
var so = {};
ie(so, { default: () => ol });
var ol;
var oo = G(() => {
  "use strict";
  p();
  ol = {};
});
var ao = T((lp, al) => {
  al.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
    "database",
    "libpq",
    "pg",
    "postgre",
    "postgres",
    "postgresql",
    "rdbms"
  ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: { "buffer-writer": "2.0.0", "packet-reader": "1.0.0", "pg-connection-string": "^2.5.0", "pg-pool": "^3.5.2", "pg-protocol": "^1.5.0", "pg-types": "^2.1.0", pgpass: "1.x" }, devDependencies: {
    async: "2.6.4",
    bluebird: "3.5.2",
    co: "4.6.0",
    "pg-copy-streams": "0.3.0"
  }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: { "pg-native": { optional: true } }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
});
var lo = T((fp, co) => {
  "use strict";
  p();
  var uo = ge().EventEmitter, ul = (it(), O(nt)), Bn = rt(), Ne = co.exports = function(r, e, t) {
    uo.call(this), r = Bn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
      n === "row" && (this._emitRowEvents = true);
    }.bind(this));
  };
  ul.inherits(Ne, uo);
  var cl = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
  Ne.prototype.handleError = function(r) {
    var e = this.native.pq.resultErrorFields();
    if (e) for (var t in e) {
      var n = cl[t] || t;
      r[n] = e[t];
    }
    this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
  };
  Ne.prototype.then = function(r, e) {
    return this._getPromise().then(
      r,
      e
    );
  };
  Ne.prototype.catch = function(r) {
    return this._getPromise().catch(r);
  };
  Ne.prototype._getPromise = function() {
    return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
      this._once("end", r), this._once("error", e);
    }.bind(this)), this._promise);
  };
  Ne.prototype.submit = function(r) {
    this.state = "running";
    var e = this;
    this.native = r.native, r.native.arrayMode = this._arrayMode;
    var t = a(function(s, o, u) {
      if (r.native.arrayMode = false, v(function() {
        e.emit("_done");
      }), s) return e.handleError(s);
      e._emitRowEvents && (u.length > 1 ? o.forEach(
        (c, l) => {
          c.forEach((f3) => {
            e.emit("row", f3, u[l]);
          });
        }
      ) : o.forEach(function(c) {
        e.emit("row", c, u);
      })), e.state = "end", e.emit("end", u), e.callback && e.callback(null, u);
    }, "after");
    if (m.domain && (t = m.domain.bind(t)), this.name) {
      this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", this.name, this.name.length), console.error("This can cause conflicts and silent errors executing queries"));
      var n = (this.values || []).map(Bn.prepareValue);
      if (r.namedQueries[this.name]) {
        if (this.text && r.namedQueries[this.name] !== this.text) {
          let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return t(s);
        }
        return r.native.execute(this.name, n, t);
      }
      return r.native.prepare(this.name, this.text, n.length, function(s) {
        return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
      });
    } else if (this.values) {
      if (!Array.isArray(
        this.values
      )) {
        let s = new Error("Query values must be an array");
        return t(s);
      }
      var i = this.values.map(Bn.prepareValue);
      r.native.query(this.text, i, t);
    } else r.native.query(this.text, t);
  };
});
var yo = T((yp, po) => {
  "use strict";
  p();
  var ll = (oo(), O(so)), fl = At(), dp = ao(), fo = ge().EventEmitter, hl = (it(), O(nt)), pl = Rt(), ho = lo(), K = po.exports = function(r) {
    fo.call(this), r = r || {}, this._Promise = r.Promise || b.Promise, this._types = new fl(r.types), this.native = new ll({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
    var e = this.connectionParameters = new pl(r);
    this.user = e.user, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: e.password }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
  };
  K.Query = ho;
  hl.inherits(K, fo);
  K.prototype._errorAllQueries = function(r) {
    let e = a((t) => {
      m.nextTick(() => {
        t.native = this.native, t.handleError(r);
      });
    }, "enqueueError");
    this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
  };
  K.prototype._connect = function(r) {
    var e = this;
    if (this._connecting) {
      m.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
      if (t) return r(t);
      e.native.connect(n, function(i) {
        if (i) return e.native.end(), r(i);
        e._connected = true, e.native.on("error", function(s) {
          e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
        }), e.native.on("notification", function(s) {
          e.emit("notification", { channel: s.relname, payload: s.extra });
        }), e.emit("connect"), e._pulseQueryQueue(true), r();
      });
    });
  };
  K.prototype.connect = function(r) {
    if (r) {
      this._connect(r);
      return;
    }
    return new this._Promise((e, t) => {
      this._connect((n) => {
        n ? t(n) : e();
      });
    });
  };
  K.prototype.query = function(r, e, t) {
    var n, i, s, o, u;
    if (r == null) throw new TypeError("Client was passed a null or undefined query");
    if (typeof r.submit == "function") s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
    else if (s = this.connectionParameters.query_timeout, n = new ho(r, e, t), !n.callback) {
      let c, l;
      i = new this._Promise((f3, y) => {
        c = f3, l = y;
      }), n.callback = (f3, y) => f3 ? l(f3) : c(y);
    }
    return s && (u = n.callback, o = setTimeout(() => {
      var c = new Error(
        "Query read timeout"
      );
      m.nextTick(() => {
        n.handleError(c, this.connection);
      }), u(c), n.callback = () => {
      };
      var l = this._queryQueue.indexOf(n);
      l > -1 && this._queryQueue.splice(l, 1), this._pulseQueryQueue();
    }, s), n.callback = (c, l) => {
      clearTimeout(o), u(c, l);
    }), this._queryable ? this._ending ? (n.native = this.native, m.nextTick(() => {
      n.handleError(
        new Error("Client was closed and is not queryable")
      );
    }), i) : (this._queryQueue.push(n), this._pulseQueryQueue(), i) : (n.native = this.native, m.nextTick(() => {
      n.handleError(new Error("Client has encountered a connection error and is not queryable"));
    }), i);
  };
  K.prototype.end = function(r) {
    var e = this;
    this._ending = true, this._connected || this.once("connect", this.end.bind(this, r));
    var t;
    return r || (t = new this._Promise(function(n, i) {
      r = a((s) => s ? i(s) : n(), "cb");
    })), this.native.end(function() {
      e._errorAllQueries(new Error("Connection terminated")), m.nextTick(() => {
        e.emit("end"), r && r();
      });
    }), t;
  };
  K.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  };
  K.prototype._pulseQueryQueue = function(r) {
    if (this._connected && !this._hasActiveQuery()) {
      var e = this._queryQueue.shift();
      if (!e) {
        r || this.emit("drain");
        return;
      }
      this._activeQuery = e, e.submit(this);
      var t = this;
      e.once("_done", function() {
        t._pulseQueryQueue();
      });
    }
  };
  K.prototype.cancel = function(r) {
    this._activeQuery === r ? this.native.cancel(function() {
    }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
  };
  K.prototype.ref = function() {
  };
  K.prototype.unref = function() {
  };
  K.prototype.setTypeParser = function(r, e, t) {
    return this._types.setTypeParser(
      r,
      e,
      t
    );
  };
  K.prototype.getTypeParser = function(r, e) {
    return this._types.getTypeParser(r, e);
  };
});
var Ln = T((gp, mo) => {
  "use strict";
  p();
  mo.exports = yo();
});
var ot = T((vp, at) => {
  "use strict";
  p();
  var dl = eo(), yl = tt(), ml = En(), wl = io(), { DatabaseError: gl } = vn(), bl = a(
    (r) => {
      var e;
      return e = class extends wl {
        constructor(n) {
          super(n, r);
        }
      }, a(e, "BoundPool"), e;
    },
    "poolFactory"
  ), Fn = a(
    function(r) {
      this.defaults = yl, this.Client = r, this.Query = this.Client.Query, this.Pool = bl(this.Client), this._pools = [], this.Connection = ml, this.types = Je(), this.DatabaseError = gl;
    },
    "PG"
  );
  typeof m.env.NODE_PG_FORCE_NATIVE < "u" ? at.exports = new Fn(Ln()) : (at.exports = new Fn(dl), Object.defineProperty(at.exports, "native", {
    configurable: true,
    enumerable: false,
    get() {
      var r = null;
      try {
        r = new Fn(Ln());
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") throw e;
      }
      return Object.defineProperty(at.exports, "native", { value: r }), r;
    }
  }));
});
p();
p();
Fe();
Zt();
p();
var pa = Object.defineProperty;
var da = Object.defineProperties;
var ya = Object.getOwnPropertyDescriptors;
var bi = Object.getOwnPropertySymbols;
var ma = Object.prototype.hasOwnProperty;
var wa = Object.prototype.propertyIsEnumerable;
var vi = a(
  (r, e, t) => e in r ? pa(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t,
  "__defNormalProp"
);
var ga = a((r, e) => {
  for (var t in e || (e = {})) ma.call(e, t) && vi(r, t, e[t]);
  if (bi) for (var t of bi(e)) wa.call(e, t) && vi(r, t, e[t]);
  return r;
}, "__spreadValues");
var ba = a((r, e) => da(r, ya(e)), "__spreadProps");
var va = 1008e3;
var xi = new Uint8Array(
  new Uint16Array([258]).buffer
)[0] === 2;
var xa = new TextDecoder();
var Jt = new TextEncoder();
var yt = Jt.encode("0123456789abcdef");
var mt = Jt.encode("0123456789ABCDEF");
var Sa = Jt.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
var Si = Sa.slice();
Si[62] = 45;
Si[63] = 95;
var He;
var wt;
function Ea(r, { alphabet: e, scratchArr: t } = {}) {
  if (!He) if (He = new Uint16Array(256), wt = new Uint16Array(256), xi) for (let C = 0; C < 256; C++) He[C] = yt[C & 15] << 8 | yt[C >>> 4], wt[C] = mt[C & 15] << 8 | mt[C >>> 4];
  else for (let C = 0; C < 256; C++) He[C] = yt[C & 15] | yt[C >>> 4] << 8, wt[C] = mt[C & 15] | mt[C >>> 4] << 8;
  r.byteOffset % 4 !== 0 && (r = new Uint8Array(r));
  let n = r.length, i = n >>> 1, s = n >>> 2, o = t || new Uint16Array(n), u = new Uint32Array(
    r.buffer,
    r.byteOffset,
    s
  ), c = new Uint32Array(o.buffer, o.byteOffset, i), l = e === "upper" ? wt : He, f3 = 0, y = 0, g;
  if (xi)
    for (; f3 < s; ) g = u[f3++], c[y++] = l[g >>> 8 & 255] << 16 | l[g & 255], c[y++] = l[g >>> 24] << 16 | l[g >>> 16 & 255];
  else for (; f3 < s; )
    g = u[f3++], c[y++] = l[g >>> 24] << 16 | l[g >>> 16 & 255], c[y++] = l[g >>> 8 & 255] << 16 | l[g & 255];
  for (f3 <<= 2; f3 < n; ) o[f3] = l[r[f3++]];
  return xa.decode(o.subarray(0, n));
}
a(Ea, "_toHex");
function Aa(r, e = {}) {
  let t = "", n = r.length, i = va >>> 1, s = Math.ceil(n / i), o = new Uint16Array(s > 1 ? i : n);
  for (let u = 0; u < s; u++) {
    let c = u * i, l = c + i;
    t += Ea(r.subarray(c, l), ba(ga(
      {},
      e
    ), { scratchArr: o }));
  }
  return t;
}
a(Aa, "_toHexChunked");
function Ei(r, e = {}) {
  return e.alphabet !== "upper" && typeof r.toHex == "function" ? r.toHex() : Aa(r, e);
}
a(Ei, "toHex");
p();
var gt = class gt2 {
  constructor(e, t) {
    this.strings = e;
    this.values = t;
  }
  toParameterizedQuery(e = { query: "", params: [] }) {
    let { strings: t, values: n } = this;
    for (let i = 0, s = t.length; i < s; i++) if (e.query += t[i], i < n.length) {
      let o = n[i];
      if (o instanceof Ge) e.query += o.sql;
      else if (o instanceof Ce) if (o.queryData instanceof gt2) o.queryData.toParameterizedQuery(
        e
      );
      else {
        if (o.queryData.params?.length) throw new Error("This query is not composable");
        e.query += o.queryData.query;
      }
      else {
        let { params: u } = e;
        u.push(o), e.query += "$" + u.length, (o instanceof d || ArrayBuffer.isView(o)) && (e.query += "::bytea");
      }
    }
    return e;
  }
};
a(gt, "SqlTemplate");
var $e = gt;
var Xt = class Xt2 {
  constructor(e) {
    this.sql = e;
  }
};
a(Xt, "UnsafeRawSql");
var Ge = Xt;
p();
function bt() {
  typeof window < "u" && typeof document < "u" && typeof console < "u" && typeof console.warn == "function" && console.warn(`          
        ************************************************************
        *                                                          *
        *  WARNING: Running SQL directly from the browser can have *
        *  security implications. Even if your database is         *
        *  protected by Row-Level Security (RLS), use it at your   *
        *  own risk. This approach is great for fast prototyping,  *
        *  but ensure proper safeguards are in place to prevent    *
        *  misuse or execution of expensive SQL queries by your    *
        *  end users.                                              *
        *                                                          *
        *  If you've assessed the risks, suppress this message     *
        *  using the disableWarningInBrowsers configuration        *
        *  parameter.                                              *
        *                                                          *
        ************************************************************`);
}
a(bt, "warnIfBrowser");
Fe();
var as = Se(At());
var us = Se(rt());
var _t = class _t2 extends Error {
  constructor(t) {
    super(t);
    E(this, "name", "NeonDbError");
    E(this, "severity");
    E(this, "code");
    E(this, "detail");
    E(this, "hint");
    E(this, "position");
    E(this, "internalPosition");
    E(
      this,
      "internalQuery"
    );
    E(this, "where");
    E(this, "schema");
    E(this, "table");
    E(this, "column");
    E(this, "dataType");
    E(this, "constraint");
    E(this, "file");
    E(this, "line");
    E(this, "routine");
    E(this, "sourceError");
    "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, _t2);
  }
};
a(
  _t,
  "NeonDbError"
);
var be = _t;
var is = "transaction() expects an array of queries, or a function returning an array of queries";
var Bu = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
function Lu(r) {
  return r instanceof d ? "\\x" + Ei(r) : r;
}
a(Lu, "encodeBuffersAsBytea");
function ss(r) {
  let { query: e, params: t } = r instanceof $e ? r.toParameterizedQuery() : r;
  return { query: e, params: t.map((n) => Lu((0, us.prepareValue)(n))) };
}
a(ss, "prepareQuery");
function cs(r, {
  arrayMode: e,
  fullResults: t,
  fetchOptions: n,
  isolationLevel: i,
  readOnly: s,
  deferrable: o,
  authToken: u,
  disableWarningInBrowsers: c
} = {}) {
  if (!r) throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
  let l;
  try {
    l = Yt(r);
  } catch {
    throw new Error(
      "Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(r)
    );
  }
  let { protocol: f3, username: y, hostname: g, port: A, pathname: C } = l;
  if (f3 !== "postgres:" && f3 !== "postgresql:" || !y || !g || !C) throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
  function D(P, ...I) {
    if (!(Array.isArray(P) && Array.isArray(P.raw) && Array.isArray(I))) throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');
    return new Ce(
      Y,
      new $e(P, I)
    );
  }
  a(D, "templateFn"), D.query = (P, I, w) => new Ce(Y, { query: P, params: I ?? [] }, w), D.unsafe = (P) => new Ge(
    P
  ), D.transaction = async (P, I) => {
    if (typeof P == "function" && (P = P(D)), !Array.isArray(P)) throw new Error(is);
    P.forEach((W) => {
      if (!(W instanceof Ce)) throw new Error(is);
    });
    let w = P.map((W) => W.queryData), Z = P.map((W) => W.opts ?? {});
    return Y(w, Z, I);
  };
  async function Y(P, I, w) {
    let { fetchEndpoint: Z, fetchFunction: W } = ce, J = Array.isArray(
      P
    ) ? { queries: P.map((ee) => ss(ee)) } : ss(P), X = n ?? {}, se = e ?? false, oe = t ?? false, B = i, j = s, le = o;
    w !== void 0 && (w.fetchOptions !== void 0 && (X = { ...X, ...w.fetchOptions }), w.arrayMode !== void 0 && (se = w.arrayMode), w.fullResults !== void 0 && (oe = w.fullResults), w.isolationLevel !== void 0 && (B = w.isolationLevel), w.readOnly !== void 0 && (j = w.readOnly), w.deferrable !== void 0 && (le = w.deferrable)), I !== void 0 && !Array.isArray(I) && I.fetchOptions !== void 0 && (X = { ...X, ...I.fetchOptions });
    let de = u;
    !Array.isArray(I) && I?.authToken !== void 0 && (de = I.authToken);
    let We = typeof Z == "function" ? Z(g, A, { jwtAuth: de !== void 0 }) : Z, fe = { "Neon-Connection-String": r, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" }, _e = await Fu(de);
    _e && (fe.Authorization = `Bearer ${_e}`), Array.isArray(P) && (B !== void 0 && (fe["Neon-Batch-Isolation-Level"] = B), j !== void 0 && (fe["Neon-Batch-Read-Only"] = String(j)), le !== void 0 && (fe["Neon-Batch-Deferrable"] = String(le))), c || ce.disableWarningInBrowsers || bt();
    let ye;
    try {
      ye = await (W ?? fetch)(We, { method: "POST", body: JSON.stringify(J), headers: fe, ...X });
    } catch (ee) {
      let M = new be(
        `Error connecting to database: ${ee}`
      );
      throw M.sourceError = ee, M;
    }
    if (ye.ok) {
      let ee = await ye.json();
      if (Array.isArray(P)) {
        let M = ee.results;
        if (!Array.isArray(M)) throw new be("Neon internal error: unexpected result format");
        return M.map(($, me) => {
          let Ot = I[me] ?? {}, vo = Ot.arrayMode ?? se, xo = Ot.fullResults ?? oe;
          return os(
            $,
            { arrayMode: vo, fullResults: xo, types: Ot.types }
          );
        });
      } else {
        let M = I ?? {}, $ = M.arrayMode ?? se, me = M.fullResults ?? oe;
        return os(ee, { arrayMode: $, fullResults: me, types: M.types });
      }
    } else {
      let { status: ee } = ye;
      if (ee === 400) {
        let M = await ye.json(), $ = new be(M.message);
        for (let me of Bu) $[me] = M[me] ?? void 0;
        throw $;
      } else {
        let M = await ye.text();
        throw new be(
          `Server error (HTTP status ${ee}): ${M}`
        );
      }
    }
  }
  return a(Y, "execute"), D;
}
a(cs, "neon");
var dr = class dr2 {
  constructor(e, t, n) {
    this.execute = e;
    this.queryData = t;
    this.opts = n;
  }
  then(e, t) {
    return this.execute(this.queryData, this.opts).then(e, t);
  }
  catch(e) {
    return this.execute(this.queryData, this.opts).catch(e);
  }
  finally(e) {
    return this.execute(
      this.queryData,
      this.opts
    ).finally(e);
  }
};
a(dr, "NeonQueryPromise");
var Ce = dr;
function os(r, {
  arrayMode: e,
  fullResults: t,
  types: n
}) {
  let i = new as.default(n), s = r.fields.map((c) => c.name), o = r.fields.map((c) => i.getTypeParser(
    c.dataTypeID
  )), u = e === true ? r.rows.map((c) => c.map((l, f3) => l === null ? null : o[f3](l))) : r.rows.map((c) => Object.fromEntries(
    c.map((l, f3) => [s[f3], l === null ? null : o[f3](l)])
  ));
  return t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = u, r._parsers = o, r._types = i, r) : u;
}
a(os, "processQueryResult");
async function Fu(r) {
  if (typeof r == "string") return r;
  if (typeof r == "function") try {
    return await Promise.resolve(r());
  } catch (e) {
    let t = new be("Error getting auth token.");
    throw e instanceof Error && (t = new be(`Error getting auth token: ${e.message}`)), t;
  }
}
a(Fu, "getAuthToken");
p();
var go = Se(ot());
p();
var wo = Se(ot());
var kn = class kn2 extends wo.Client {
  constructor(t) {
    super(t);
    this.config = t;
  }
  get neonConfig() {
    return this.connection.stream;
  }
  connect(t) {
    let { neonConfig: n } = this;
    n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
    let i = typeof this.config != "string" && this.config?.host !== void 0 || typeof this.config != "string" && this.config?.connectionString !== void 0 || m.env.PGHOST !== void 0, s = m.env.USER ?? m.env.USERNAME;
    if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null) throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
    let o = super.connect(t), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
    if (!u && !n.pipelineConnect) return o;
    let l = this.connection;
    if (u && l.on(
      "connect",
      () => l.stream.emit("data", "S")
    ), c) {
      l.removeAllListeners("authenticationCleartextPassword"), l.removeAllListeners("readyForQuery"), l.once("readyForQuery", () => l.on("readyForQuery", this._handleReadyForQuery.bind(this)));
      let f3 = this.ssl ? "sslconnect" : "connect";
      l.on(f3, () => {
        this.neonConfig.disableWarningInBrowsers || bt(), this._handleAuthCleartextPassword(), this._handleReadyForQuery();
      });
    }
    return o;
  }
  async _handleAuthSASLContinue(t) {
    if (typeof crypto > "u" || crypto.subtle === void 0 || crypto.subtle.importKey === void 0) throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");
    let n = crypto.subtle, i = this.saslSession, s = this.password, o = t.data;
    if (i.message !== "SASLInitialResponse" || typeof s != "string" || typeof o != "string") throw new Error(
      "SASL: protocol error"
    );
    let u = Object.fromEntries(o.split(",").map((M) => {
      if (!/^.=/.test(M)) throw new Error(
        "SASL: Invalid attribute pair entry"
      );
      let $ = M[0], me = M.substring(2);
      return [$, me];
    })), c = u.r, l = u.s, f3 = u.i;
    if (!c || !/^[!-+--~]+$/.test(c)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
    if (!l || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(l)) throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64"
    );
    if (!f3 || !/^[1-9][0-9]*$/.test(f3)) throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count"
    );
    if (!c.startsWith(i.clientNonce))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    if (c.length === i.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    let y = parseInt(f3, 10), g = d.from(l, "base64"), A = new TextEncoder(), C = A.encode(s), D = await n.importKey(
      "raw",
      C,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), Y = new Uint8Array(await n.sign("HMAC", D, d.concat(
      [g, d.from([0, 0, 0, 1])]
    ))), P = Y;
    for (var I = 0; I < y - 1; I++) Y = new Uint8Array(await n.sign("HMAC", D, Y)), P = d.from(
      P.map((M, $) => P[$] ^ Y[$])
    );
    let w = P, Z = await n.importKey(
      "raw",
      w,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), W = new Uint8Array(await n.sign("HMAC", Z, A.encode("Client Key"))), J = await n.digest(
      "SHA-256",
      W
    ), X = "n=*,r=" + i.clientNonce, se = "r=" + c + ",s=" + l + ",i=" + y, oe = "c=biws,r=" + c, B = X + "," + se + "," + oe, j = await n.importKey(
      "raw",
      J,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
    var le = new Uint8Array(await n.sign(
      "HMAC",
      j,
      A.encode(B)
    )), de = d.from(W.map((M, $) => W[$] ^ le[$])), We = de.toString("base64");
    let fe = await n.importKey(
      "raw",
      w,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), _e = await n.sign("HMAC", fe, A.encode("Server Key")), ye = await n.importKey("raw", _e, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    var ee = d.from(
      await n.sign("HMAC", ye, A.encode(B))
    );
    i.message = "SASLResponse", i.serverSignature = ee.toString("base64"), i.response = oe + ",p=" + We, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
  }
};
a(
  kn,
  "NeonClient"
);
var ut = kn;
Fe();
var bo = Se(Rt());
function vl(r, e) {
  if (e) return { callback: e, result: void 0 };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
a(vl, "promisify");
var Un = class Un2 extends go.Pool {
  constructor() {
    super(...arguments);
    E(this, "Client", ut);
    E(this, "hasFetchUnsupportedListeners", false);
    E(this, "addListener", this.on);
  }
  on(t, n) {
    return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
  }
  query(t, n, i) {
    if (!ce.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function") return super.query(
      t,
      n,
      i
    );
    typeof n == "function" && (i = n, n = void 0);
    let s = vl(this.Promise, i);
    i = s.callback;
    try {
      let o = new bo.default(
        this.options
      ), u = encodeURIComponent, c = encodeURI, l = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, f3 = typeof t == "string" ? t : t.text, y = n ?? t.values ?? [];
      cs(l, { fullResults: true, arrayMode: t.rowMode === "array" }).query(f3, y, { types: t.types ?? this.options?.types }).then((A) => i(void 0, A)).catch((A) => i(
        A
      ));
    } catch (o) {
      i(o);
    }
    return s.result;
  }
};
a(Un, "NeonPool");
var Mn = Un;
Fe();
var ct = Se(ot());
var export_DatabaseError = ct.DatabaseError;
var export_defaults = ct.defaults;
var export_escapeIdentifier = ct.escapeIdentifier;
var export_escapeLiteral = ct.escapeLiteral;
var export_types = ct.types;

// toForgeSchema.js
var import_forge_orm = __toESM(require_dist(), 1);
function toForgeSchema(schemaData) {
  const tables = Object.getOwnPropertyNames(schemaData.definitions);
  const schema = {};
  for (let table of tables) {
    schema[table] = {};
    const properties = Object.getOwnPropertyNames(
      schemaData.definitions[table].properties
    );
    const fields = {};
    for (let property of properties) {
      const value = schemaData.definitions[table].properties[property];
      const isObject = typeof value === "object";
      if (isObject) fields[property] = getType(value.type);
    }
    schema[table] = (0, import_forge_orm.model)(table, fields);
  }
  return schema;
}
var fMap = {
  integer: "int",
  boolean: "bool",
  number: "decimal"
};
function getType(type) {
  if (type instanceof Array) type = type[0];
  type = fMap[type] || type;
  const fType = import_forge_orm.f[type]();
  return fType;
}

// toJsonData.js
var { readFileSync } = await import("node:fs");
function toJsonData(filePathOrJsonString) {
  let jsonString = filePathOrJsonString;
  if (readFileSync) jsonString = readFileSync(filePathOrJsonString, "utf-8");
  let jsonData = jsonString;
  if (typeof jsonString === "string") jsonData = JSON.parse(jsonString);
  return jsonData;
}

// handleError.js
function handleError(error) {
  let message = error.message;
  if (message.includes("definitions")) message = "Invalid JSON schema.";
  throw new Error(message);
}

// index.js
async function createWebClient({ datasourceUrl, jsonSchema }) {
  try {
    const isNodeJs = typeof window === "undefined";
    if (isNodeJs) {
      const dotenv = await import("dotenv");
      dotenv.config();
      if (!datasourceUrl) datasourceUrl = process.env.DATABASE_URL;
    }
    const pool = new Mn({ connectionString: datasourceUrl });
    const jsonData = toJsonData(jsonSchema);
    const schema = toForgeSchema(jsonData);
    const driver = (0, import_forge_orm2.pgDriver)(pool);
    const client = await (0, import_forge_orm2.createDb)({ driver, schema });
    return client;
  } catch (error) {
    handleError(error);
  }
}
export {
  createWebClient
};
/*! Bundled license information:

@neondatabase/serverless/index.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  *)
*/

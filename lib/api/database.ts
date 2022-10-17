import { Collection, Db, MongoClient, ObjectId } from "mongodb";

export type Nullable<T> = T | null;

export interface Waifu {
  id: number;
  creator_id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  weight: Nullable<number>;
  height: Nullable<number>;
  bust: Nullable<number>;
  hip: Nullable<number>;
  blood_type: Nullable<string>;
  origin: Nullable<string>;
  display_picture: string;
  waist: Nullable<number>;
  alternative_name: Nullable<string>;
  birthday_month: Nullable<number>;
  birthday_day: Nullable<number>;
  birthday_year: Nullable<number>;
  age: Nullable<number>;
  husbando: boolean;
  original_name: string;
  romaji_name: Nullable<string>;
  submission_notes: Nullable<string>;
  adult: number;
  approved: number;
  popularity_rank: number;
  like_rank: number;
  trash_rank: number;
  nsfw: boolean;
  rejection_reason: Nullable<string>;
  virtual_youtuber: boolean;
  display_picture_locked: number;
  display_picture_artist_name: Nullable<string>;
  display_picture_artist_source: Nullable<string>;
  display_picture_approval_notes: Nullable<string>;
  uuid: string;
  likes: number;
  trash: number;
  appearances: {
    slug: string;
    name: string;
    root_name: string;
    thumbnail: Nullable<string>;
    description: string;
  }[];
}

export interface User {
  username: string;
  password: string;
}

export interface SeriesWaifu {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  original_name: string;
  display_picture: string;
  popularity_rank: number;
  like_rank: number;
  trash_rank: number;
}

export interface Series {
  id: number;
  uuid: string;
  type: string;
  root_name: string;
  name: string;
  slug: string;
  description: string;
  episode_count: number;
  original_name: string;
  romaji_name: Nullable<string>;
  release: Nullable<string>;
  nsfw: boolean;
  image: string;
  banner: Nullable<string>;
  thumbnail: Nullable<string>;
  studio: Nullable<string>;
  waifus: SeriesWaifu[];
}

class XDatabase {
  connected = false;
  mongodb: MongoClient;
  db: Db;
  series: Collection<Series> | undefined;
  users: Collection<User> | undefined;
  waifus: Collection<Waifu> | undefined;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("Please add your Mongo URI to .env");
    }
    if (!process.env.DB_NAME) {
      throw new Error("Please add your database name to .env");
    }

    this.mongodb = new MongoClient(process.env.MONGODB_URI);
    this.db = this.mongodb.db(process.env.DB_NAME);
  }

  async connect() {
    if (this.connected) {
      return;
    }
    await this.mongodb.connect();
    this.connected = true;
  }

  async getClient() {
    await this.connect();
    return this.mongodb;
  }

  async listSeries() {
    await this.connect();
    if (!this.series) {
      this.series = this.db.collection<Series>("series");
    }
    return this.series;
  }

  async listUsers() {
    await this.connect();
    if (!this.users) {
      this.users = this.db.collection<User>("users");
    }
    return this.users;
  }

  async listWaifus() {
    await this.connect();
    if (!this.waifus) {
      this.waifus = this.db.collection("waifus");
    }
    return this.waifus;
  }

  /* ------------------------------ User Methods ------------------------------ */

  async getUserFromUsername(username: string) {
    const exists = (await this.listUsers()).findOne({ username });

    if (!exists) {
      return null;
    }

    return exists;
  }

  async insertUser(username: string, password: string) {
    return (await this.listUsers()).insertOne({ username, password });
  }

  async deleteUser(id: ObjectId) {
    return (await this.listUsers()).deleteOne({ _id: id });
  }

  /* ------------------------------ Waifu Methods ----------------------------- */

  async getRandomWaifu() {
    const randomWaifu = await (await this.listWaifus()).aggregate([{ $sample: { size: 1 } }]).toArray();
    return randomWaifu[0] as Waifu;
  }

  async getWaifu(slug: string) {
    return (await (
      await this.listWaifus()
    ).findOne({
      slug,
    })) as unknown as Waifu;
  }

  async getWaifusLikeName(name: string) {
    return (await this.listWaifus())
      .aggregate([
        {
          $match: {
            $expr: {
              $gt: [{ $indexOfCP: [{ $toLower: "$name" }, name] }, -1],
            },
          },
        },
      ])
      .toArray() as unknown as Waifu[];
  }

  async getPageNOfWaifus(page: number) {
    const pageSize = 20;
    const skips = pageSize * (page - 1);
    return (await this.listWaifus()).find({}).skip(skips).limit(pageSize).toArray();
  }

  /* ----------------------------- Series Methods ----------------------------- */

  async getSeries(slug: string) {
    return (await this.listSeries()).findOne({
      slug,
    });
  }

  async getSeriesLikeName(name: string) {
    return (await (
      await this.listSeries()
    )
      .aggregate([
        {
          $match: {
            $expr: {
              $gt: [{ $indexOfCP: [{ $toLower: "$name" }, name] }, -1],
            },
          },
        },
      ])
      .toArray()) as Series[];
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _database: XDatabase | undefined;
}

let database: XDatabase;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._database) {
    global._database = new XDatabase();
  }
  database = global._database;
} else {
  // In production mode, it's best to not use a global variable.
  database = new XDatabase();
}

export default database;

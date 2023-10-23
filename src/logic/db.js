import { kv } from "@vercel/kv";
import ELECCIONES_DATA from "../logic/elecciones";
import { hash, id } from "./utils";

// DB UTILS

export const create = async (key, value) => {
  const newId = id();
  const creation = new Date().toISOString();
  await kv.hset(`${key}:${newId}`, { ...value, creation });
  return newId;
};

export const getAll = async (key) => {
  // TODO: investigate that this has a 1000 limit!!!
  // TODO: stop using scan, use an `elections-generales2023`
  // and that contains an array of party ids
  return (await kv.scan(0, { match: `${key}:*`, count: 10000 }))[1];
};

export const getN = async (key) => {
  return (await getAll(key)).length;
};

// PARTY CRUD

export const createParty = async () => {
  return create("party", { users: [], electionsId: ELECCIONES_DATA.current });
};

export const getParty = async (partyId) => {
  const party = await kv.hgetall(`party:${partyId}`);
  if (!party) {
    return null;
  }

  const users =
    party.users.length > 0
      ? await Promise.all(party.users.map((u) => u.split(":")[1]).map(getUser))
      : [];

  return {
    id: partyId,
    ...party,
    users,
    admin: users.find((u) => u.id === party.admin) ?? null,
  };
};

export const updateParty = async (partyId, body) => {
  const { name, admin } = body;
  return kv.hset(`party:${partyId}`, {
    name: name.trim(),
    admin,
  });
};

export const deleteParty = async (partyId) => {
  const env = process.env.NODE_ENV;
  if (env !== "development") {
    return;
  }

  // Delete every empty party in case of an overdose...
  // for (const key of await getAll("party")) {
  //   const p = await getParty(key.split(":")[1]);
  //   if (!p.name) {
  //     console.log("deleting", key);
  //     await kv.del(key);
  //   }
  // }
  // console.log("finish");
  // return;

  const users = await kv.hget(`party:${partyId}`, "users");
  for (const user of users) {
    await kv.del(user);
  }
  return kv.del(`party:${partyId}`);
};

// USER CRUD

export const createUser = async (partyId, body) => {
  const { name, password, prode } = body;

  const userId = await create("user", {
    name: name.trim(),
    password: hash(password),
    prode,
  });

  const users = await kv.hget(`party:${partyId}`, "users");
  await kv.hset(`party:${partyId}`, { users: [...users, `user:${userId}`] });
  return userId;
};

export const getUser = async (userId) => {
  const user = { id: userId };
  const keys = await kv.hkeys(`user:${userId}`);
  const keysToRetrieve = keys.filter((key) => key !== "password");
  const userValues = await kv.hmget(`user:${userId}`, ...keysToRetrieve);

  Object.entries(userValues).forEach(([key, value]) => {
    user[key] = value;
  });
  return user;
};

export const updateUser = async (userId, body) => {
  return kv.hset(`user:${userId}`, body);
};

export const deleteUser = async (partyId, userId) => {
  const users = await kv.hget(`party:${partyId}`, "users");
  await kv.hset(`party:${partyId}`, {
    users: users.filter((u) => u !== `user:${userId}`),
  });
  return kv.del(`user:${userId}`);
};

// LOGIN

export const checkUser = async (partyId, userName, userPassword) => {
  const party = await getParty(partyId);
  // TODO: arreglar estooo, encontre una partida con dos usuarios con el mismo nombre!
  const user = party.users.find(
    (u) => u.name.trim().toLowerCase() === userName.trim().toLowerCase()
  );

  // if the user doesn't exist, we can create it
  if (!user) {
    return { create: true };
  }

  // if the user exists, but the password is wrong, we error out
  const currentPassword = await kv.hget(`user:${user.id}`, "password");
  if (hash(userPassword) !== currentPassword) {
    return { wrongPassword: true };
  }

  // if the user exists and the password is correct, we return the userId
  return { userId: user.id };
};

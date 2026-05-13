import Database from "better-sqlite3"

const db = new Database("app.db");


const createUsersTable = db.prepare(
    `create table if not exists users (
        id integer primary key Autoincrement,
        name text,
        email unique not null,
        password not null,
        isVerified INTEGER NOT NULL DEFAULT 0 
         CHECK (isVerified IN (0, 1)),
        otp string default null,
        otpExpiry integer
    )
    `
)

const createProblemsTable = db.prepare(
    `create table if not exists problems (
        id integer primary key Autoincrement,
        name text,
        difficulty not null
    )
    `
)

const createTagsTable = db.prepare(
    `create table if not exists tags (
        id integer primary key Autoincrement,
        name text
    )
    `
)

const createProblemTagsTable = db.prepare(
    `create table if not exists problemTagsRelation (
        pid integer not null,
        tid integer not null,
        PRIMARY KEY (pid, tid),
        foreign key (pid) references problems(id),
        foreign key (tid) references tags(id)
    )
    `
)

const deleteTable = db.prepare(`drop table if exists problemTagsRelation`);


const instantiateDatabase = async ()=>{

    createUsersTable.run();
    createProblemsTable.run();
    createTagsTable.run();
    createProblemTagsTable.run();
}

export {instantiateDatabase,db}
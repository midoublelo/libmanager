// import "fake-indexeddb/auto";
import Dexie, { type Table } from "dexie";

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    pubDate: string;
    copies: number;
    isbn?: string;
    pageCount?: string;
    description?: string;
    imageLink?: string;
    publisher?: string;
    language?: string;
}

export interface User {
    email: string;
    password: string;
}

export class meDexie extends Dexie {
    books!: Table<Book>;
    users!: Table<User>;

    constructor() {
        super('library')
        this.version(1).stores({
            books: '++id, title, author, genre'
        })
        this.version(2).stores({users: '++id, &email, password'})
    }
}

export const db = new meDexie();

export async function readDb() {
    let req = await db.books.toArray()
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.error(`Error: ${error}`)
    })
}

export async function wipeDb() {
    db.books.clear()
}

export async function addItem(id, title, author, genre, pubDate, copies, isbn?, pageCount?, description?, imageLink?, publisher?, language?) {
    await db.books.add({
        id: id,
        title: title,
        author: author,
        genre: genre,
        pubDate: pubDate,
        copies: copies,
        isbn: isbn,
        pageCount: pageCount,
        description: description,
        imageLink: imageLink,
        publisher: publisher,
        language: language
    })
}

export async function updateItem(newBook, existingBook) {
    await db.books.update(existingBook['id'], newBook)
}

export async function validateUser(user, pass) {
    const isUser = await db.users.get({
        email: user,
        password: pass
    })
    if (isUser == undefined) {
        return false;
    } else {
        return true;
    }
}

export async function addUser(user, pass) {
    await db.users.add({
        email: user,
        password: pass
    })
}
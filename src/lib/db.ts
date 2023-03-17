// import "fake-indexeddb/auto";
import Dexie, { type Table } from "dexie";
import { store } from "../hooks/auth"
import { currentBook } from "./stores";

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
    books: object;
    currentFee: number;
    type: string;
}

export interface Borrow {
    book: object;
    user: object;
    returnDate: string;
    lastChecked: string;
}

export const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class meDexie extends Dexie {
    books!: Table<Book>;
    users!: Table<User>;
    borrows!: Table<Borrow>;

    constructor() {
        super('library')
        this.version(1).stores({books: '++id, title, author, genre'})
        this.version(2).stores({users: '++id, &email, password, books, type'})
        this.version(3).stores({borrows: '++id, book, user, returnDate'})
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

export async function addUser(user, pass, type) {
    if ( emailCheck.test(user) == true ) { // If input is valid email then move onto next check
        const existCheck = await db.users.where( {email: user} ).first(); // Reads users table to see if email is already taken
        if (existCheck == undefined) { // If input is valid email and is unused then add the user and login
            await db.users.add({
                email: user,
                password: pass,
                books: {},
                currentFee: 0.00,
                type: type
            })
            return true
        } else {
            return false
        }
    }
}

export async function updateUser(newUser, existingUser) {
    await db.users.update(existingUser['id'], newUser)
}

export async function addBorrow(book, user, date, lastChecked) {
    db.borrows.add({
        book: book,
        user: user,
        returnDate: date,
        lastChecked: lastChecked
    })
    db.users.where("id").equals(user.id).modify({books: book})
}

export async function wipeUsers() {
    db.users.clear();
}

export async function addFees(fee, user) {
    //let currentFee = await db.users.where("id").equals(user.id).toArray();
    //db.users.where("id").equals(user.id).modify({currentFee: fee})
    db.users.where("id").equals(user.id).modify(function(value) {
        this.value.currentFee += fee
    })
}

export async function removeFees(fee, user) {
    db.users.where("id").equals(user.id).modify(function(value) {
        this.value.currentFee -= fee
    })
}
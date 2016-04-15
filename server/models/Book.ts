export default class Book {
    author: string;
    title: string;
    publisher: string;
    year: string;
    barcode: string;
    
    constructor(author = null, title = null){
        this.author = author;
        this.title = title;
    }
}
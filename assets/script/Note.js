'use strict';

export default 'Note';

export class Note {
    #id;
    #title;
    #description;
    #category;

    constructor(id, title, description, category) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#category = category;
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get category() {
        return this.#category;
    }
}
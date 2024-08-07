export default class ToDoItem {
    constructor() {
        this._id = null
        this._item = null
        this._checked = false
    }

    getId() {
        return this._id
    }

    setId(id) {
        this._id = id
    }

    getItem(){
        return this._item
    }

    setItem(item) {
        this._item = item
    }

    getChecked() {
        return this._checked
    }

    setChecked(checked) {
        this._checked = checked
    }
}
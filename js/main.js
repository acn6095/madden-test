import ToDoList from "./to-do-list.js"
import ToDoItem from "./to-do-item.js"

const toDoList = new ToDoList()

// Launch app
document.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === "complete") {
        initApp()
    }
})

const initApp = () => {
    //Add listeners
    const taskEntryForm = document.querySelector("#taskEntryForm")
    taskEntryForm.addEventListener("submit", (e) => {
        e.preventDefault()
        processSubmission()
    })
    //Procedural
    loadListObject()
    refreshThePage()

}

const loadListObject = () => {
    const storedList = localStorage.getItem("myToDoList")
    if (typeof storedList !== "string") return
    const parsedList = JSON.parse(storedList)
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item, itemObj._checked)
        toDoList.addItemToList(newToDoItem)
    })
}

const refreshThePage = () => {
    clearListDisplay()
    renderList()
    clearItemEntryField()
    setFocusOnItemEntry()
}

const clearListDisplay = () => {
    const parentElement = document.querySelector("#listItems")
    deleteContents(parentElement)
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild
    while (child) {
        parentElement.removeChild(child)
        child = parentElement.lastElementChild
    }
}

const renderList = () => {
    const list = toDoList.getList()
    list.forEach(item => {
        buildListItem(item)
    })
}

const buildListItem = (item) => {
    const li = document.createElement("li")
    li.className = "item flex items-center mb-2 w-full p-2 border-b border-slate-300"
    const check = document.createElement("input")
    check.type="checkbox"
    check.id = item.getId()
    check.className = "peer"
    check.tabIndex = 0
    if(item.getChecked()) {
        check.setAttribute('checked', true)
    }
    addClickListenerToCheckbox(check)
    const label = document.createElement("label")
    label.htmlFor = item.getId()
    label.className = "w-full text-left pl-2 peer-checked:line-through"
    label.textContent = item.getItem()
    const btn = document.createElement("button")
    btn.className = "text-gray-500 font-semibold hover:text-red-500 focus:text-red-500"
    btn.title = "Remove this task"
    btn.tabIndex = 0
    btn.textContent = 'X'
    btn.setAttribute('data-close', '')
    addClickListenerToCheckboxClose(btn)
    li.appendChild(check)
    li.appendChild(label)
    li.appendChild(btn)
    const container = document.querySelector("#listItems")
    container.appendChild(li)
}

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            e.target.setAttribute('checked', 'true')
            updateListItem(e.target.id, true)
        } else {
            e.target.setAttribute('checked', 'false')
            updateListItem(e.target.id, false)
        }
    })
}


const addClickListenerToCheckboxClose = (btn) => {
    btn.addEventListener("click", (e) => {
        toDoList.removeItemFromList(btn.previousSibling.previousSibling.id)
        updatePersistentData(toDoList["_list"])
        setTimeout(() => {
            refreshThePage()
        }, 100)
    })
}

const updatePersistentData = (listArray) => {
    localStorage.setItem("myToDoList", JSON.stringify(listArray))
}

const clearItemEntryField = () => {
    document.querySelector("#newTask").value = ""
}

const setFocusOnItemEntry = () => {
    document.querySelector("#newTask").focus()
}

const processSubmission = () => {
    const newEntryText = getNewEntry()
    if (!newEntryText.length) return
    const nextItemId = calcNextItemId()
    const toDoItem = createNewItem(nextItemId, newEntryText, false)
    toDoList.addItemToList(toDoItem)
    updatePersistentData(toDoList["_list"])
    refreshThePage()
}

const getNewEntry = () => {
    return document.querySelector("#newTask").value.trim()
}

const calcNextItemId = () => {
    let nextItemId = 1
    const list = toDoList.getList()
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1
    }
    return nextItemId
}

const createNewItem = (itemId, itemText, itemChecked) => {
    const toDo = new ToDoItem()
    toDo.setId(itemId)
    toDo.setItem(itemText)
    toDo.setChecked(itemChecked)
    return toDo
}

const updateListItem = (itemId, itemChecked) => {
    let currentList = toDoList.getList()
    console.log(itemId)
    console.log(itemChecked)
    console.log(currentList)
    currentList.forEach(item => {
        if(item._id == itemId) {
            item._checked = itemChecked
        }
        console.log(item)
    })
    updatePersistentData(currentList)
}
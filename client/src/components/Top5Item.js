import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }
    //handle edit
    function handleToggleEdit(event) {
        event.stopPropagation();
        document.getElementById("close-button").classList.replace("top5-button","top5-button-disabled");
        document.getElementById("undo-button").classList.replace("top5-button","top5-button-disabled");
        document.getElementById("redo-button").classList.replace("top5-button","top5-button-disabled");
        for (let i=0;i<5;i++){
            if (i!==props.index){
                document.getElementById("edit-item-" + i + 1).classList.add("top5-button-disabled");
            }
        }
        console.log("edit-item-" + props.index + 1);
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        // if (newActive) {
        //     store.setIsItemNameEditActive();
        // }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        console.log(props.index);
        if (event.code === "Enter") {
            store.addChangeItemTranscation(props.index, text);
            //store.changeItemName(props.index,text);
            toggleEdit();
            document.getElementById("close-button").classList.replace("top5-button-disabled","top5-button");
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value );
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    // let cardStatus = false;
    // if (store.isItemEditActive) {
    //     cardStatus = true;
    // }
    let Itemelement=<div
            id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            <input
                type="button"
                id={"edit-item-" + index + 1}
                className="list-card-button"
                value={"\u270E"}
                onClick={handleToggleEdit}
            />
            {props.text}
        </div>;
    if (editActive) {
        Itemelement=
        <input
                id={"item-" + index + 1}
                className={itemClass}
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
            />;
    }
    return (
        Itemelement
    );
}

export default Top5Item;
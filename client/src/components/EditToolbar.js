import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    let CanRedo=false;
    let CanUndo=false;
    let CanClose=false;

    function handleUndo() {
        if(CanUndo){
            store.undo();
        }
    }
    function handleRedo() {
        if(CanRedo){
            store.redo();
        }
    }
    function handleClose() {
        if(CanClose){
            history.push("/");
            store.closeCurrentList();
        }
    }

    if(store.isListNameEditActive || store.isItemEditActive || !store.HastransactionToUndo() || store.currentList === null){
        CanUndo = false;
    }
    else{
        CanUndo = true;
    }

    if(store.isListNameEditActive || store.isItemEditActive || !store.HastransactionToRedo() || store.currentList === null){
        CanRedo = false;
    }
    else{
        CanRedo = true;
    }

    if(store.isListNameEditActive || store.isItemEditActive || store.currentList === null){
        console.log("Can not Close");
        CanClose = false;
    }
    else{
        console.log("Current List");
        console.log(store.currentList);
        CanClose = true;
    }

    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={CanUndo ? "top5-button" : "top5-button-disabled"}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={CanRedo ? "top5-button" : "top5-button-disabled"}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={CanClose ? "top5-button" : "top5-button-disabled"}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;
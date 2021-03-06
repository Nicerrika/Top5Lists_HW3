import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import ChangeItem_Transaction from '../transactions/ChangeItem_Transactions';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CHANGE_ITEM_NAME: "CHANGE_ITEM_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_NAME_EDIT_ACTIVE: "SET_ITEM_NAME_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    ADD_NEW_COUNTER:"ADD_NEW_COUNTER",
    SET_ITEM_NAME_EDIT_ACTIVE_FALSE:"SET_ITEM_NAME_EDIT_ACTIVE_FALSE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            //Item UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_ITEM_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                })
            }
            case GlobalStoreActionType.ADD_NEW_COUNTER: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: payload,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            //START EDITING A ITEM NAME
            case GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    listMarkedForDeletion: null,
                    isItemEditActive: true
                });
            }
            case GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE_FALSE:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    listMarkedForDeletion: null,
                    isItemEditActive: false
                });
            }
            case GlobalStoreActionType.Delete_Marked_List:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        console.log(newName);
        if (newName!==""){
            async function asyncChangeListName(id) {
                let response = await api.getTop5ListById(id);
                if (response.data.success) {
                    let top5List = response.data.top5List;
                    top5List.name = newName;
                    async function updateList(top5List) {
                        response = await api.updateTop5ListById(top5List._id, top5List);
                        if (response.data.success) {
                            async function getListPairs(top5List) {
                                response = await api.getTop5ListPairs();
                                if (response.data.success) {
                                    let pairsArray = response.data.idNamePairs;
                                    storeReducer({
                                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                        payload: {
                                            idNamePairs: pairsArray,
                                            top5List: top5List
                                        }
                                    });
                                }
                            }
                            getListPairs(top5List);
                        }
                    }
                    updateList(top5List);
                }
            }
            asyncChangeListName(id);
        }
        // store.closeCurrentList();
    }
    //This Function processes changind the item name
    store.changeItemName = function (index, newName) {
        // GET THE LIST
        if(newName!==""){
        async function asyncChangeItemName() {
            let  top5List= store.currentList;
            top5List.items[index]=newName;
                async function updateList(top5List) {
                    let response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_ITEM_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
        }
        asyncChangeItemName();
    }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        //document.getElementById("close-button").classList.replace("top5-button","top5-button-disabled");
        tps.clearAllTransactions();
        //store.UpdateDisableControl();
    }
    // This Function is to create new list
    store.CreateNewList = function (){
        async function asyncCreateNewList() {
            console.log(store.newListCounter);
            let NewList={
                "name": "Untitled"+store.newListCounter,
                "items":[
                    "?",
                    "?",
                    "?",
                    "?",
                    "?"
                ]
            }
            const response = await api.createTop5List(NewList);
            if (response.data.success) {
                console.log(response);
                storeReducer({
                    type: GlobalStoreActionType.ADD_NEW_COUNTER,
                    payload: store.newListCounter++
                });
                store.loadIdNamePairs();
                store.setCurrentList(response.data.top5List._id);
            }
        }
        asyncCreateNewList();
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        //store.UpdateDisableControl();
        //document.getElementById("close-button").classList.replace("top5-button","top5-button-disabled");
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        if (id.search("-") === -1){
            async function asyncSetCurrentList(id) {
                let response = await api.getTop5ListById(id);
                if (response.data.success) {
                    let top5List = response.data.top5List;

                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: top5List
                        });
                        store.history.push("/top5list/" + top5List._id);
                    }
                }
            }
            asyncSetCurrentList(id);
        }
        //store.UpdateDisableControl();
        //document.getElementById("close-button").classList.replace("top5-button-disabled","top5-button");
        //console.log(store.currentList);
    }
    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
        //store.UpdateDisableControl();
    }
    store.addChangeItemTranscation = function (index,newName){
        let oldName=store.currentList.items[index];
        if (newName!=""){
            let transaction =new ChangeItem_Transaction(store,index,oldName,newName);
            tps.addTransaction(transaction);
        }
        //store.UpdateDisableControl();
        // for (let i=0;i<5;i++){
        //     if(index!=i){
        //         document.getElementById("edit-item-" + i + 1).classList.remove("top5-button-disabled");
        //     }
        // }
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
        //store.UpdateDisableControl();
    }
    store.redo = function () {
        tps.doTransaction();
        //store.UpdateDisableControl();
    }

    store.HastransactionToUndo = function (){
        return tps.hasTransactionToUndo();
    }

    store.HastransactionToRedo = function (){
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: store.currentList
        });
    }

    store.setIsItemNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE,
            payload: store.currentList
        });
    }

    store.setIsItemNameEditActive_false = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE_FALSE,
            payload: store.currentList
        });
    }

    // THIS FUNCTION IS TO SHOW THE delete
    store.deleteMarkedList = function(){
        console.log(store.listMarkedForDeletion);
        let id=store.listMarkedForDeletion._id
        console.log(id);
        async function asyncdeleteMarkedList(id) {
            const response = await api.deleteTop5ListById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                store.closeCurrentList();
                store.hideDeleteListModal();
            }
        }
        asyncdeleteMarkedList(id);
    }

    store.ShowDeleteListModal = function(){
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function(){
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
        store.closeCurrentList();
    }

    store.DeleteList = function(id){
        store.ShowDeleteListModal();
        async function asyncDeleteList(id) {
            let response= await api.getTop5ListById(id);
            let top5List1=response.data.top5List
            if (response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.Delete_Marked_List,
                    payload:top5List1
                });
                console.log(store.listMarkedForDeletion)
            }
        }
        asyncDeleteList(id)
    }

    // store.UpdateDisableControl = function(){
    //     if(tps.hasTransactionToRedo()){
    //         document.getElementById("redo-button").classList.replace("top5-button-disabled","top5-button");
    //     }
    //     else{
    //         document.getElementById("redo-button").classList.replace("top5-button","top5-button-disabled");
    //     }

    //     if(tps.hasTransactionToUndo()){
    //         document.getElementById("undo-button").classList.replace("top5-button-disabled","top5-button");
    //     }
    //     else{
    //         document.getElementById("undo-button").classList.replace("top5-button","top5-button-disabled");
    //     }
    // }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}
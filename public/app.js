// Storage Controller
const StorageCtrl = (()=>{
    return {
        storeItem:(item)=>{
            let items;
            // Check if any items
            if(localStorage.getItem('Items') === null){
                items = [];
                // push new item
                items.push(item);
                // set localStorage
                localStorage.setItem('Items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('Items'));
                // push new item
                items.push(item);
                // Reset items to localstorage
                localStorage.setItem('Items', JSON.stringify(items));
            }
        },
        getItemsFromStorage:()=>{
            let items;
            if(localStorage.getItem('Items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('Items'));
            }

            return items;
        },
        updateItemStorage:(updateditem)=>{
            let items = JSON.parse(localStorage.getItem('Items'));
            items.forEach((item,index)=>{
                if(updateditem.id === item.id){
                    items.splice(index,1,updateditem);
                }
            });
            localStorage.setItem('Items', JSON.stringify(items));     
        },
        deleteItemStoroge:(id)=>{
            let items = JSON.parse(localStorage.getItem('Items'));
            items.forEach((item,index)=>{
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('Items', JSON.stringify(items)); 
            if(localStorage.getItem('Items') === '[]'){
               localStorage.clear();
            }

        },
        clearAllItems:()=>{
            localStorage.clear();
        }
    }
})()



// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure
    const data = {
        items:StorageCtrl.getItemsFromStorage(),
        currentItem:null,
        totalCalories:0
    }

    return{
        addItem:(name,calories)=>{
            // Create id
            let ID = data.items.length;
            if(data.items[0]){
                ID = data.items[data.items.length - 1].id + 1;
            }
            const newItem = new Item(ID,name,Number(calories));
            data.items.push(newItem);
            return newItem;
            // console.log(data.items);
        },
        updateItem:(name,calories)=>{
            // Calories to number
            calories= parseInt(calories);

            let found=null;

            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                };
            })
            return found;
        },
        deleteItem:(id)=>{
            ids = data.items.map((item)=>{
                return item.id
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove intem
            data.items.splice(index,1);

            return index

        },
        clearAllItems:()=>{
            data.items=[];
        },
        getItems: ()=>{
            return data.items;
        },
        getTotalCals:()=>{
            let totalCalories=0;
            data.items.forEach((item)=>{
                totalCalories+=item.calories;
            })
            data.totalCalories=totalCalories;
            return totalCalories;
        },
        getItembyID:(id)=>{
            let found=null;
            data.items.forEach((item)=>{
                if(item.id===id){
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem:(item)=>{
            data.currentItem = item;
        },
        getCurrentItem:()=>{
            return data.currentItem;
        },
        logData: function(){
            return data;
        }

    }
})();



// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList:'#item-list',
        form:'.col',
        listItems:'#item-list li',
        cardTitle:'.card-title',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.del-btn',
        backBtn:'.back-btn',
        clearAll:'.clear-btn',
        itemName:'#item-name',
        itemCal:'#item-cal',
        totalCalories: '.total-cal'
    }

    return{
        getSelectors:()=>{
           return UISelectors;
        },
        autoShowCalories:(calories)=>{
            calories = Math.round(calories);
            document.querySelector(UISelectors.itemCal).value = calories
        },
        addListItem:(item)=>{
            document.querySelector(UISelectors.itemList).style.display='block';
            document.querySelector(UISelectors.itemList).innerHTML+=`
            <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
            `;
            UICtrl.clearInput();

        },
        updateListItem:(item)=>{
            document.querySelector(`#item-${item.id}`).innerHTML=`
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
        },
        clearInput:function(){
            document.querySelector(UISelectors.itemName).value='';
            document.querySelector(UISelectors.itemCal).value='';
        },
        showItems: (items)=>{
            let output='';

            items.forEach((item)=>{
                output+=`
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });
            document.querySelector(UISelectors.itemList).innerHTML=output;
        },
        deleteListItem:(id)=>{
            document.querySelector(`#item-${id}`).remove();
        },
        clearAllListItems:()=>{
            document.querySelector(UISelectors.itemList).innerHTML='';
            UICtrl.hideList();
        },
        getItemInput: ()=>{
            return{
                name:document.querySelector(UISelectors.itemName).value,
                calories:document.querySelector(UISelectors.itemCal).value
            }
        },
        hideList:()=>{
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        showTotalCalories:(total)=>{
            document.querySelector(UISelectors.totalCalories).textContent=total;
        },
        showEditState:()=>{
            document.querySelector(UISelectors.cardTitle).textContent='Update Food Item';
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
            document.querySelector(UISelectors.addBtn).style.display='none';
        },
        clearEditState: ()=>{
            UICtrl.clearInput();
            document.querySelector(UISelectors.cardTitle).textContent='Add Meal / Food Item';
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
            document.querySelector(UISelectors.addBtn).style.display='inline';    
        },
        addItemToForm:()=>{
            document.querySelector(UISelectors.itemName).value= ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCal).value=ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        }
    }
})();

// API Controller
const APICtrl = (function(UICtrl){
    const api = new Nutrition();

    return {
        getCalories : (name)=>{
            api.getNutrients(name)
            .then(data=>{
                let calories = data.nf_calories;
                // console.log(data);
                UICtrl.autoShowCalories(calories);
            })
             .catch(()=>null);
        } ,
        getFats : (name)=>{
            const fats = api.getNutrients(name).then((data)=>data.fields.nf_total_fat).catch(()=>null);
            return fats;
        } 
    }
})(UICtrl)




// App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl,APICtrl){
    const UISelectors = UICtrl.getSelectors();
    
    const loadEventListeners = ()=>{
        // Name Keydown Event 
        document.querySelector(UISelectors.itemName).addEventListener('keyup', autoWriteCalories);

        // Add item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on enter
        document.addEventListener('keypress',(e)=>{
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
            }
        });

        // Back Click Event
        document.querySelector(UISelectors.backBtn).addEventListener('click',backEvent);

        // Delete Click Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);        
        
        // Edit Click Event
        document.querySelector(UISelectors.itemList).addEventListener('click',showEditState);

        // Update Item Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Clear All Event
        document.querySelector(UISelectors.clearAll).addEventListener('click',clearAllEvent);

    }

    const autoWriteCalories = (e)=>{
        let itemName =  document.querySelector(UISelectors.itemName).value;
        let itemCal = document.querySelector(UISelectors.itemCal);
        let re = /^\S/i ; 
        if(itemName!=='' && re.test(itemName)){
            APICtrl.getCalories(itemName)
        }
        if(itemName ===''){
           itemCal.value=``;
        }

        e.preventDefault();
    }

    const itemAddSubmit = (e)=>{
        const input = UICtrl.getItemInput();
        
        // Check for name calories input
        if(input.name!=='' && input.calories!==''){
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCals();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem);
        }
        e.preventDefault();
    }

    const showEditState = (e)=>{
        if(e.target.classList.contains('edit-item') ){
            // Getting ID of list-item
            const itemID = e.target.parentElement.parentElement.id;
            const ID = parseInt(itemID.slice(5,));

            // Get Item
            const itemToEdit = ItemCtrl.getItembyID(ID);
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add Item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    const itemUpdateSubmit = (e)=>{
        // get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);
        UICtrl.updateListItem(updatedItem);   
        StorageCtrl.updateItemStorage(updatedItem);
        const totalCalories = ItemCtrl.getTotalCals();
        UICtrl.showTotalCalories(totalCalories); 
        UICtrl.clearEditState();        
        e.preventDefault();
    };

    const backEvent = (e)=>{
        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = (e)=>{
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        StorageCtrl.deleteItemStoroge(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCals();
        UICtrl.showTotalCalories(totalCalories); 
        UICtrl.clearEditState();
        e.preventDefault();
    };

    const clearAllEvent = (e)=>{
        ItemCtrl.clearAllItems();
        UICtrl.clearAllListItems();
        const totalCalories = ItemCtrl.getTotalCals();
        UICtrl.showTotalCalories(totalCalories);
        StorageCtrl.clearAllItems(); 
        e.preventDefault();
    }

    return{
        init : ()=>{
            const items = ItemCtrl.getItems();
            if(items.length===0){
                UICtrl.hideList();
            }
            UICtrl.showItems(items);
            loadEventListeners();
            const totalCalories = ItemCtrl.getTotalCals();
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.clearEditState();
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl,APICtrl);


// Initializing App
App.init();


// const api  =new Nutrition();
// api.getNutrients('Cheese Sandwich').then(data=>console.log(data));



// Responsive nature


const makeResponsive = ()=>{
    if(window.innerWidth < 600){
        document.querySelector('.brand-logo').classList.add('left');

    }else{
        document.querySelector('.brand-logo').classList.remove('left');
    }

    if(window.innerWidth < 500){
        document.querySelector('.clear-btn').style='font-size:12px';
    }else{
        document.querySelector('.clear-btn').style='font-size:14px';
    }
}


makeResponsive();
window.onresize = makeResponsive;

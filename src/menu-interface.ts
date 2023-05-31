
const MENU_API = "https://lai.git-pages.mst.edu/webdevbasics/menuitems/menuitems.json"
// I would use environment variables, but later
const MENU_ITEMS = "http://localhost:5080/menuitems"
const MENU_TYPES = "http://localhost:5080/menutypes"

export interface FoodItem {
    id: number;
    name: string;
    type_id: number;
    price: number;
    options?: number[];
}

function isFoodItem(obj: any): obj is FoodItem {
    return obj 
        && typeof obj.id === 'number'
        && typeof obj.name === 'string'
        && typeof obj.type_id === 'number'
        && typeof obj.price === 'number'
        && (!obj.options || Array.isArray(obj.options) && obj.options.every((item: any) => typeof item === 'number'));
}

export interface FoodType {
    id: number;
    name: string;
}

export interface MenuAPI {
    items: FoodItem[],
    types: FoodType[],
}

function isFoodType(obj: any): obj is FoodType {
    return obj
      && typeof obj.id === 'number'
      && typeof obj.name === 'string';
}

function isValidMenu(obj: any): obj is MenuAPI {

    return true;
}


export async function getMenu() {

    let items_resp = await fetch(MENU_ITEMS);
    let types_resp = await fetch(MENU_TYPES);
    let items = await items_resp.json();
    let types = await types_resp.json();


    return { items, types }
}


export async function _getMenu() {
    try {
        const response = await fetch(MENU_API);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
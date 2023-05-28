
const MENU_API = "https://lai.git-pages.mst.edu/webdevbasics/menuitems/menuitems.json"


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


export async function _getMenu() {
    const option1 = {
        method: 'GET',
        headers: {
          'xc-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtldmluLmxhaUBrbm93bGVkZ2VsYWtlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfMm9vbzN3dzBiNmE3bGIiLCJyb2xlcyI6eyJvcmctbGV2ZWwtY3JlYXRvciI6dHJ1ZSwic3VwZXIiOnRydWV9LCJ0b2tlbl92ZXJzaW9uIjoiYjc3NzQ4ZDZhZjQ1NTdlZWJmMTFiN2MyOTFiZGI3ODczNmFjYTdjOGE1ZGE3NDUwNTlkN2I4YWM2ODM3ZTY3NGQ0MzM0OGM2YmYyNjYxMDUiLCJpYXQiOjE2ODUxMTIyNDUsImV4cCI6MTY4NTE0ODI0NX0.FQYAyjIADFPdaSfpC5-hfLZiSNldrdDV6Dx836H5sb0'
        }
      };
      
    let response_items = await fetch('http://localhost:8080/api/v1/db/data/noco/p_mkekvxf7b5wanc/FoodItem/views/FoodItem?offset=0&limit=300&where=', option1)
    let items = (await response_items.json()).list

    const options2 = {
        method: 'GET',
        headers: {
          'xc-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtldmluLmxhaUBrbm93bGVkZ2VsYWtlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfMm9vbzN3dzBiNmE3bGIiLCJyb2xlcyI6eyJvcmctbGV2ZWwtY3JlYXRvciI6dHJ1ZSwic3VwZXIiOnRydWV9LCJ0b2tlbl92ZXJzaW9uIjoiYjc3NzQ4ZDZhZjQ1NTdlZWJmMTFiN2MyOTFiZGI3ODczNmFjYTdjOGE1ZGE3NDUwNTlkN2I4YWM2ODM3ZTY3NGQ0MzM0OGM2YmYyNjYxMDUiLCJpYXQiOjE2ODUxMTIyNDUsImV4cCI6MTY4NTE0ODI0NX0.FQYAyjIADFPdaSfpC5-hfLZiSNldrdDV6Dx836H5sb0'
        }
      };
      
    let response_types = await fetch('http://localhost:8080/api/v1/db/data/noco/p_mkekvxf7b5wanc/ItemType/views/ItemType?offset=0&limit=25&where=', options2)
    let types = (await response_types.json()).list

    items = items.map((item, i) => {
            item.id = i
            item.price = parseInt(item.price)
            if (item.options)
                item.options = item.options.split(',').map(Number);
            else {
                item.options = []
            }
            return item;
        }
    )

    types = types.map((type, i) => {
        type.id = i;
        return type
    })

    return { items, types }
}


export async function getMenu() {
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
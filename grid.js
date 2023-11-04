let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar")

// For creating 1 - 100 rows
for(let i=0;i<rows;i++)
{
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col");
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

// for creating A - Z cols
for(let i=0;i<cols;i++)
{
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65+i);
    addressRowCont.appendChild(addressRow); 
}

// for creating cells
for(let i=0;i<rows;i++)
{
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "rowCont");
    for(let j=0;j<cols;j++)
    {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");

        //giving ID's to cells (Attributes for cell and storage identification).
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j)

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsCont.appendChild(rowCont);
}

// for displaying cellID in address-bar.
function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e)=>{
        let rowID = i+1;
        let colID = String.fromCharCode(65+j);
        addressBar.value = `${colID}${rowID}`
    })
}

// By default click on first cell via DOM.
let firstCell = document.querySelector(".cell"); // queryselector gives 1st element only.
firstCell.click();
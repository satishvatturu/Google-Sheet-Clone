let activeSheetColor = "#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click", (e) =>{
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet- ${allSheetFolders.length+1}</div>`;

    sheetsFolderCont.appendChild(sheet);
    //DB
    createSheetDB();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) =>{
        // 0 -> left click, 1 -> mouse scroll, 2 -> right click
        if(e.button !== 2)
        {
            return;
        }

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1)
        {
            alert("You need to have atleast one sheet!!");
            return;
        }
        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if(response === false)
        {
            return;
        }
        let sheetIndex = Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIndex, 1); // for DB
        handleSheetUIRemoval(sheet) // for UI

        // By default assign DB to sheet-1 (active).
        sheetDB = collectedSheetDB[0];

        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++)
    {
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet-${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIndex) {
    sheetDB = collectedSheetDB[sheetIndex];
}

function handleSheetProperties() {
    for(let i=0;i<rows;i++)
    {
        for(let j=0;j<cols;j++)
        {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // By default click on first cell via DOM.
    let firstCell = document.querySelector(".cell"); // queryselector gives 1st element only.
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++)
    {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) =>{
       let sheetIndex = Number(sheet.getAttribute("id"));
       handleSheetDB(sheetIndex);
       handleSheetProperties();
       handleSheetUI(sheet);
    })
}

function createSheetDB() {
    let sheetDB = []; // Main array.

    for(let i=0;i<rows;i++)
    {
        let sheetRow = []; // array for each row(subarray).
        for(let j=0;j<cols;j++)
        {
            let cellProp = {
                bold : false,
                italic : false,
                underline : false,
                alignment : "left", // left, center, right
                fontFamily : "monospace",
                fontSize : "14",
                fontColor : "#000000",
                BGcolor : "#000000", // just for indication purpose
                value : "",
                formula : "",
                children : [],
            }
            sheetRow.push(cellProp); // pushing each object into subarray
        }
        sheetDB.push(sheetRow); // pushing (array of each row) subarray into main array.
    }
    collectedSheetDB.push(sheetDB);
}

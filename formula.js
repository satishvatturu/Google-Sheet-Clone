for(let i=0;i<rows;i++)
{
    for(let j=0;j<cols;j++)
    {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) =>{
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value)
            {
                return;
            }

            cellProp.value = enteredData;
            // if data modifed remove P-C relation, formula empty, update children with new hardcoded (modified) value.
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);

            // console.log(cellProp);
        });
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", (e) =>{
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula) // if key == "Enter" && formulaBar.value is not empty.
    {
        // if change in formula, break old parent-child relation, evaluate new formula, add new parent-child relation.
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula)
        {
            removeChildFromParent(cellProp.formula);
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        // To update UI and cellProp in DB.
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        // To establish parent-child relationship.
        addChildToParent(inputFormula);
        console.log(sheetDB);
        updateChildrenCells(address);
    }
});

// if A1 is parent of B1, B1 is Parent of C2 => if A1 value is changed all its children values must be change.
function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i=0;i<children.length;i++)
    {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90)
        {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90)
        {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let index = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(index, 1);
        }
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90)
        {
           let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
           encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    // UI update
    cell.innerText = evaluatedValue;
    // DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}
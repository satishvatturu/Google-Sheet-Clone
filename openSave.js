let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Download
downloadBtn.addEventListener("click", (e) =>{
    let jsonData = JSON.stringify([sheetDB]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

// Upload
openBtn.addEventListener("click", (e) => {

    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let fileObject = files[0];

        fr.readAsText(fileObject);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            // Basic sheet with default data will be created
            addSheetBtn.click();

            // SheetDB
            sheetDB = readSheetData[0];
            collectedSheetDB[collectedSheetDB.length-1] = sheetDB;
            
            handleSheetProperties();
        })
    })
})
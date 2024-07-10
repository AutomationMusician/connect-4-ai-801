function setupTable() {
    const toolbarElem = document.getElementById("toolbar");
    toolbarElem.colSpan = numWide;

    const tbody = document.getElementById("tbody");
    const rows = [];
    for (let row = 0; row < numHigh; row++) {
        const rowElem = document.createElement("tr");
        for (let col = 0; col < numWide; col++) {
            const dataElem = document.createElement("td");
            dataElem.id = boxId(col, row);
            dataElem.style.background = "white";
            dataElem.onclick = function () { click(col); };
            rowElem.append(dataElem);
        }
        rows.push(rowElem);
    }
    while (rows.length > 0) {
        tbody.append(rows.pop());
    }
    document.getElementById("undo").disabled = true;
}

setupTable();

class DirectoryTreeNode {
    constructor(name, type, lastModifiedTime) {
        this.name = name;
        this.type = type;
        this.lastModifiedTime = lastModifiedTime;
        this.children = [];
    }

    getIconTypeName() {
        if (this.type === "directory") {
            return this.name;
        }

        if (this.type === "file") {
            const dotIndex = this.name.lastIndexOf(".");
            if (dotIndex >= 0) {
                return this.name.substring(dotIndex + 1).toLowerCase();
            }
            return this.name;
        }

        return "";
    }

    addChild(child) {
        this.children.push(child);
    }
}

function updateVisualTree(element, directoryTreeNode) {
    // Create an unordered list to make a UI for the directoryTreeNode
    const ul = document.createElement("ul");
    ul.classList.add("tree");

    // Create a list element for every child of the directoryTreeNode
    console.log(directoryTreeNode);
    console.log(directoryTreeNode.children);
    for (let child of directoryTreeNode.children) {
        updateVisualTreeEntry(ul, child);
    }

    // Update the tree with the newly created unordered list.
    element.appendChild(ul);
}

function updateVisualTreeEntry(treeElement, child) {
    const li = document.createElement("li");
    li.classList.add("tree-entry");

    // Create a list element with a file icon
    if (child.type === "file") {
        li.innerHTML = `
          <div class="tree-entry__disclosure tree-entry__disclosure--disabled></div>
          <img class="tree-entry__icon" src="/icons/file_type_${child.getIconTypeName()}.svg">
          <div class="tree-entry__name">${child.name}</div>
          <div class="tree-entry__time">${child.lastModifiedTime}</div>
        `;

        // Or create a list element with a folder icon
    } else if (child.type === "directory") {
        li.innerHTML = `
          <div class="tree-entry__disclosure tree-entry__disclosure--closed"></div>
          <img class="tree-entry__icon" src="/icons/folder_type_${child.getIconTypeName()}.svg">
          <div class="tree-entry__name">${child.name}</div>
          <div class="tree-entry__time">${child.lastModifiedTime}</div>
        `;
    }

    // Add the newly created list element into the unordered list
    treeElement.appendChild(li);
}

const dataTreeRoot = new DirectoryTreeNode("root", "directory", "");

const populateRootChildren = async () => {
    try {
        const overlay = document.querySelector(".overlay");

        const res = await fetch("/api/path");
        if (!res.ok) {
            throw res;
        } else {
            const data = await res.json();
            for (let file of data) {
                const { name, type, lastModifiedTime } = file;
                const node = new DirectoryTreeNode(
                    name,
                    type,
                    lastModifiedTime
                );

                dataTreeRoot.addChild(node);
                console.log(dataTreeRoot);
            }
            overlay.classList.add("overlay--hidden");
        }
    } catch (e) {
        let data = e.json();
        overlay.classList.add("overlay--error");
        overlay.innerHTML = "Error!";
        alert(data.message);
    }
};

const section = document.querySelector(".tree-section");
populateRootChildren().then(() => {
    updateVisualTree(section, dataTreeRoot);
});

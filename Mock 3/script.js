let sampleProducts = [
    {
        id: "P001",
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 25,
        price: 599,
        supplier: "ABC Supplier",
        description: "Wireless optical mouse",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db"
    },

    {
        id: "P002",
        name: "Keyboard",
        category: "Electronics",
        quantity: 8,
        price: 899,
        supplier: "Tech Supplier",
        description: "USB keyboard for computer",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
    },

    {
        id: "P003",
        name: "Office Chair",
        category: "Furniture",
        quantity: 15,
        price: 4500,
        supplier: "Comfort Ltd",
        description: "Comfortable office chair",
        image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455"
    },

    {
        id: "P004",
        name: "Notebook",
        category: "Stationery",
        quantity: 0,
        price: 80,
        supplier: "Paper House",
        description: "A4 ruled notebook",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57"
    },

    {
        id: "P005",
        name: "Water Bottle",
        category: "Accessories",
        quantity: 6,
        price: 350,
        supplier: "Aqua Supplier",
        description: "Stainless steel water bottle",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8"
    },

    {
        id: "P006",
        name: "Monitor",
        category: "Electronics",
        quantity: 18,
        price: 12000,
        supplier: "Display Hub",
        description: "24 inch LED monitor",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
    },

    {
        id: "P007",
        name: "Pen Set",
        category: "Stationery",
        quantity: 30,
        price: 150,
        supplier: "Paper House",
        description: "Pack of blue ball pens",
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd"
    },

    {
        id: "P008",
        name: "Table Lamp",
        category: "Electronics",
        quantity: 10,
        price: 1200,
        supplier: "Light World",
        description: "LED table lamp",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c"
    }
];

let products = JSON.parse(localStorage.getItem("products"));
if (!products) {
    products = sampleProducts;
    localStorage.setItem("products",JSON.stringify(products));
}

let editProductId = null;
displayProducts();
updateDashboard();
updateCategoryFilter();

function getStatus(quantity) {

    if (quantity == 0) {
        return "Out of Stock";
    }

    else if (quantity <= 10) {
        return "Low Stock";
    }

    else {
        return "In Stock";
    }
}

function displayProducts() {
    let tableBody = document.getElementById("productTableBody")
    let searchText =document.getElementById("searchInput").value.toLowerCase();
    let category =document.getElementById("categoryFilter").value;
    let status =document.getElementById("statusFilter").value;
    tableBody.innerHTML = "";


    let filteredProducts = products.filter(function(product) {
        let searchMatch =product.name.toLowerCase().includes(searchText) ||product.id.toLowerCase().includes(searchText);
        let categoryMatch =category === "" ||product.category === category;
        let statusMatch =status === "" ||getStatus(product.quantity) === status;
        return searchMatch && categoryMatch && statusMatch;
    });

    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="8" class="empty-message">No products found</td></tr>`;
        return;
    }


    filteredProducts.forEach(function(product) {
        let productStatus = getStatus(product.quantity);
        let statusClass = "";

        if (productStatus === "In Stock") {statusClass = "in-stock";}
        else if (productStatus === "Low Stock") {statusClass = "low-stock";}
        else {statusClass = "out-stock";}

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>₹${product.price.toLocaleString("en-IN")}</td>
            <td>${product.supplier}</td>

            <td>
                <span class="status ${statusClass}">${productStatus}</span>
            </td>

            <td>
                <button class="edit-btn"onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete-btn"onclick="deleteProduct('${product.id}')">Delete</button> 
            </td>` ;
        tableBody.appendChild(row);
    });
}

function updateDashboard() {
    document.getElementById("totalProducts").textContent =products.length;
    let lowStockProducts = products.filter(function(product) {
        return product.quantity > 0 &&product.quantity <= 10;
    });

    document.getElementById("lowStock").textContent =lowStockProducts.length;
    let categories = [];
    products.forEach(function(product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    document.getElementById("totalCategories").textContent =categories.length;
    let totalValue = 0;
    products.forEach(function(product) {totalValue +=product.quantity * product.price;});
    document.getElementById("totalStockValue").textContent ="₹" + totalValue.toLocaleString("en-IN");
}

function updateCategoryFilter() {
    let categoryFilter =document.getElementById("categoryFilter");
    let currentValue = categoryFilter.value;
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    let categories = [];
    products.forEach(function(product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.forEach(function(category) {
        let option =document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    categoryFilter.value = currentValue;
}

function openAddForm() {
    editProductId = null;
    document.getElementById("formTitle").textContent ="Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productStatus").value ="";
    document.getElementById("productModal").style.display ="flex";
}

function closeForm() {
    document.getElementById("productModal").style.display ="none";
    document.getElementById("productForm").reset();
    editProductId = null;

}
document.getElementById("productQuantity").addEventListener("input",function() {
        let quantity = Number(this.value);
        if (this.value === "") {
            document.getElementById("productStatus").value ="";
            return;
        }
        document.getElementById("productStatus").value =getStatus(quantity);
    }
);

document.getElementById("productForm").addEventListener("submit",
    function(event) {
        event.preventDefault();
        let name = document.getElementById("productName").value.trim();
        let id = document.getElementById("productSKU").value.trim();
        let category = document.getElementById("productCategory").value.trim();
        let quantity = document.getElementById("productQuantity").value;
        let price = document.getElementById("productPrice").value;
        let supplier = document.getElementById("productSupplier").value.trim();
        let description = document.getElementById("productDescription").value.trim();

        if (
            name === "" ||
            id === "" ||
            category === "" ||
            quantity === "" ||
            price === "" ||
            supplier === "" ||
            description === ""
        ) {
            alert("Please fill all required fields.");
            return;
        }
        quantity = Number(quantity);
        price = Number(price);

        if (quantity < 0) {
            alert("Quantity cannot be negative.");
            return;
        }

        if (price < 0) {
            alert("Price cannot be negative.");
            return;
        }

        let duplicateProduct = products.find(function(product) {
        return product.id.toLowerCase() ===id.toLowerCase() &&product.id !== editProductId;});
        if (duplicateProduct) {
            alert("Product ID / SKU already exists.");
            return;

        }
        let productData = {
            id: id,
            name: name,
            category: category,
            quantity: quantity,
            price: price,
            supplier: supplier,
            description: description

        };

        if (editProductId) {
            let index = products.findIndex(function(product) {
                return product.id === editProductId;

            });
            products[index] = productData;
            alert("Product updated successfully.");

        }

        else {
            products.push(productData);
            alert("Product added successfully.");
        }
        localStorage.setItem("products",JSON.stringify(products));
        displayProducts();
        updateDashboard();
        updateCategoryFilter();
        closeForm();
    }
);

function editProduct(id) {
    let product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) {
        return;
    }

    editProductId = id;
    document.getElementById("formTitle").textContent ="Edit Product";
    document.getElementById("productName").value =product.name;
    document.getElementById("productSKU").value =product.id;
    document.getElementById("productCategory").value =product.category;
    document.getElementById("productQuantity").value =product.quantity;
    document.getElementById("productPrice").value =product.price;
    document.getElementById("productSupplier").value =product.supplier;
    document.getElementById("productDescription").value =product.description;
    document.getElementById("productStatus").value =getStatus(product.quantity);
    document.getElementById("productModal").style.display ="flex";

}
function deleteProduct(id) {

    let product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) {
        return;
    }
    let confirmDelete = confirm("Are you sure you want to delete " +product.name +"?");
    if (!confirmDelete) {
        return;
    }
    products = products.filter(function(product) {
        return product.id !== id;
    });

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    displayProducts();
    updateDashboard();
    updateCategoryFilter();
    alert("Product deleted successfully.");
}
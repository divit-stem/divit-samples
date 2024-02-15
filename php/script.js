const changeSelectValue = () => {
  const selectedEl = document.getElementById("itemType").value;
  const radioClassList = ["retail", "flight"];
  radioClassList.forEach((item) => {
    if (item === selectedEl) {
      document.getElementById(`${item}Form`).classList.add("block");
    } else {
      document.getElementById(`${item}Form`).classList.remove("block");
    }
  });
  calculateTotalPrice();
};

const toggler = document.getElementsByClassName("caret");
let i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

const handleDeleteProduct = (button) => {
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
  calculateTotalPrice();
};

const handleAddProduct = () => {
  const table = document.getElementById("retailTable");
  const row = table.insertRow(-1);
  const totalRows = table.rows.length;

  const tableColumns = ["productTitle", "productQty", "unitPrice"];

  tableColumns.forEach((col, index) => {
    const cell = row.insertCell(index);
    const input = document.createElement("input");
    input.name = `${col}${totalRows}`;
    input.type = col === "productTitle" ? "text" : "number";
    input.className = "table-input";
    if (col !== "productTitle") {
      input.onchange = function () {
        calculateTotalPrice();
      };
    }
    cell.appendChild(input);
  });

  const cell = row.insertCell(tableColumns.length);
  const button = document.createElement("button");
  button.innerHTML = "x";
  button.type = "button";
  button.className = "deleteButton";
  button.onclick = function () {
    handleDeleteProduct(this);
  };
  cell.appendChild(button);

  cell.style.textAlign = "center";
};

const calculateTotalPrice = () => {
  const itemType = document.getElementById("itemType").value;

  if (itemType === "flight") {
    document.getElementById("totalAmount_flight").textContent = `$${parseFloat(
      document.getElementById("ticket-fare").value,
      10
    )}`;
  } else if (itemType === "retail") {
    const table = document.getElementById("retailTable");
    const rows = table.querySelectorAll("tr");
    let totalPrice = 0;

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td input");
      const productQty = parseFloat(cells[1].value);
      const unitPrice = parseFloat(cells[2].value);

      if (!isNaN(productQty) && !isNaN(unitPrice)) {
        totalPrice += productQty * unitPrice;
      }
    }

    document.getElementById(
      "totalAmount_retail"
    ).textContent = `$${totalPrice}`;
  }
};

const getTableData = () => {
  const table = document.getElementById("retailTable");
  const rows = table.querySelectorAll("tr");
  const headers = ["productTitle", "productQty", "unitPrice"];

  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowData = {};
    const cells = row.querySelectorAll("td input");
    for (let j = 0; j < headers.length; j++) {
      if (headers[j] === "productQty") {
        rowData[headers[j]] = parseInt(cells[j].value, 10);
      } else if (headers[j] === "unitPrice") {
        rowData[headers[j]] = parseFloat(cells[j].value, 10);
      } else {
        rowData[headers[j]] = cells[j].value;
      }
    }
    data.push(rowData);
  }
  return data;
};

const formSubmit = (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const language = document.getElementById("language").value;
  const currency = document.getElementById("currency").value;
  const itemType = document.getElementById("itemType").value;
  const orderType = document.getElementById("orderType").value;

  const orderTotal = Number(
    document
      .getElementById(
        itemType === "retail" ? "totalAmount_retail" : "totalAmount_flight"
      )
      .textContent.trim()
      .substring(1)
  );

  if (isNaN(orderTotal) || orderTotal <= 0) {
    alert("invalid order total, please input valid the order items data");
    return;
  }

  // build the payload
  let items = [];
  if (itemType == "retail") {
    items.push(...getTableData());
  } else {
    items.push({
      aircraft: document.getElementById("aircraft1").value,
      departure: document.getElementById("departure1").value,
      departureat: document.getElementById("departureAt1").value,
      arrival: document.getElementById("arrival1").value,
      arriveat: document.getElementById("arriveat1").value,
    });
    items.push({
      aircraft: document.getElementById("aircraft2").value,
      departure: document.getElementById("departure2").value,
      departureat: document.getElementById("departureAt2").value,
      arrival: document.getElementById("arrival2").value,
      arriveat: document.getElementById("arriveat2").value,
    });
  }
  let payload = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    language: language,
    currency: currency,
    itemType: itemType,
    items: items,
    orderTotal: orderTotal,
    orderType: orderType,
  };

  fetch("./main.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let res = JSON.parse(data);
      window.location.href = res.data.redirectURI + "&token=" + res.data.token;
    })
    .catch((error) => {
      // Create order failed
      alert("Sorry, there was a problem!");
      console.error("Error:", error.message);
    });
};

document.getElementById("departureAt1").addEventListener("change", function () {
  const startDateValue = document.getElementById("departureAt1").value;

  document.getElementById("arriveat1").min = startDateValue;
});

document.getElementById("arriveat1").addEventListener("change", function () {
  const startDateValue = document.getElementById("arriveat1").value;

  document.getElementById("departureAt2").min = startDateValue;
});

document.getElementById("departureAt2").addEventListener("change", function () {
  const startDateValue = document.getElementById("departureAt2").value;

  document.getElementById("arriveat2").min = startDateValue;
});

function calculateTotal() {
    const pricePerKg = [80, 75, 110, 70, 70, 40, 40, 40, 40, 40, 60]; 
    const quantities = [
        document.getElementById('quantity1').value,
        document.getElementById('quantity2').value,
        document.getElementById('quantity3').value,
        document.getElementById('quantity4').value,
        document.getElementById('quantity5').value,
        document.getElementById('quantity6').value,
        document.getElementById('quantity7').value,
        document.getElementById('quantity8').value,
        document.getElementById('quantity9').value,
        document.getElementById('quantity10').value,
        document.getElementById('quantity11').value
    ];
    const specialDishChecked = document.getElementById('specialDish').checked;
    const marmitaQuantity = specialDishChecked ? 7 : document.getElementById('marmitaQuantity').value;
    let totalGrams = 0;
    let totalCost = 0;
    let hasGroup1 = false;
    let hasGroup2 = false;
    let validQuantities = true;

    for (let i = 0; i < quantities.length; i++) {
        if (quantities[i]) {
            const quantity = parseInt(quantities[i]);
            if (quantity < 50 || quantity > 250) {
                validQuantities = false;
                break;
            }
            totalGrams += quantity;
            totalCost += (quantity / 1000) * pricePerKg[i];
            if (i < 5) hasGroup1 = true;
            if (i >= 5 && i < 10) hasGroup2 = true;
        }
    }

    if (!validQuantities) {
        document.getElementById('finalCost').textContent = '0.00';
        return;
    }

    if (totalGrams < 250 || totalGrams > 450 || !hasGroup1 || !hasGroup2) {
        totalCost = 0;
    }

    const fixedTax = 0.00;
    const variableCosts = totalCost * 0.00;
    const totalWithCosts = totalCost + fixedTax + variableCosts;
    const profit = totalWithCosts * 0.00;
    let finalCost = totalWithCosts + profit;

    if (totalGrams < 250 || totalGrams > 450 || !hasGroup1 || !hasGroup2 || marmitaQuantity == 0) {
        finalCost = 0;
    } else {
        finalCost = finalCost * marmitaQuantity;
    }

    if (specialDishChecked) {
        finalCost = 99.00; // Preço fixo para o prato especial
    }

    document.getElementById('finalCost').textContent = Math.max(finalCost, 0).toFixed(2);
}

function validateQuantity(input) {
    const quantity = parseInt(input.value);
    if (quantity < 50 || quantity > 250) {
        alert('A quantidade de cada item deve ser entre 50g e 250g.');
        input.value = '';
        const group = input.closest('.calc').getAttribute('data-group');
        const allInputs = document.querySelectorAll(`.calc[data-group="${group}"] input`);
        allInputs.forEach(i => {
            i.disabled = false;
            i.previousElementSibling.classList.remove('strikethrough');
        });
    }
}

function selectOption(input) {
    const group = input.closest('.calc').getAttribute('data-group');
    const allInputs = document.querySelectorAll(`.calc[data-group="${group}"] input`);
    const allLabels = document.querySelectorAll(`.calc[data-group="${group}"] label`);

    if (input.value !== '') {
        allInputs.forEach(i => {
            if (i !== input) {
                i.disabled = true;
                i.previousElementSibling.classList.add('strikethrough');
            }
        });
        allLabels.forEach(label => {
            if (label.htmlFor !== input.id) {
                label.classList.add('strikethrough');
            }
        });
    } else {
        allInputs.forEach(i => {
            i.disabled = false;
            i.previousElementSibling.classList.remove('strikethrough');
        });
        allLabels.forEach(label => {
            label.classList.remove('strikethrough');
        });
    }

    calculateTotal();
}

function togglePureOption() {
    const pureQuantity = document.getElementById('quantity10').value;
    const pureOptionSelect = document.getElementById('pureOption');
    const allInputs = document.querySelectorAll(`.calc[data-group="2"] input:not(#quantity10)`);
    const allLabels = document.querySelectorAll(`.calc[data-group="2"] label:not([for="quantity10"]), label[for="pureOption"]`);

    if (pureQuantity) {
        pureOptionSelect.disabled = false;
        allLabels.forEach(label => {
            if (label.htmlFor === 'pureOption') {
                label.classList.remove('strikethrough');
            }
        });
        allInputs.forEach(i => {
            i.disabled = true;
            i.previousElementSibling.classList.add('strikethrough');
        });
        allLabels.forEach(label => {
            if (label.htmlFor !== 'pureOption') {
                label.classList.add('strikethrough');
            }
        });
    } else {
        pureOptionSelect.value = '';
        pureOptionSelect.disabled = true;
        pureOptionSelect.previousElementSibling.classList.add('strikethrough');
        allInputs.forEach(i => {
            i.disabled = false;
            i.previousElementSibling.classList.remove('strikethrough');
        });
        allLabels.forEach(label => {
            label.classList.remove('strikethrough');
        });
    }
}

function toggleSpecialDish(checkbox) {
    const allInputs = document.querySelectorAll('.calc input:not(#specialDish), .calc select');
    const quantityInput = document.getElementById('marmitaQuantity');
    const labels = document.querySelectorAll('.calc label:not([for="specialDish"])');

    if (checkbox.checked) {
        allInputs.forEach(input => {
            input.disabled = true;
            input.value = ''; // Clear the values of other inputs
        });
        labels.forEach(label => {
            label.classList.add('strikethrough');
        });
        checkbox.disabled = false; // Keep the special dish checkbox enabled
        quantityInput.value = 7;
        quantityInput.disabled = true;
    } else {
        allInputs.forEach(input => {
            input.disabled = false;
        });
        labels.forEach(label => {
            label.classList.remove('strikethrough');
        });
        quantityInput.value = '';
        quantityInput.disabled = false;
    }

    calculateTotal();
}

function addItem() {
    const marmitaQuantity = document.getElementById('marmitaQuantity').value;
    const finalCost = document.getElementById('finalCost').textContent;
    const pureOption = document.getElementById('pureOption').value;
    const pureQuantity = document.getElementById('quantity10').value;
    const specialDish = document.getElementById('specialDish').checked;

    if (pureQuantity && !pureOption) {
        alert("Selecione o tipo de purê.");
        return;
    }

    if (specialDish) {
        if (finalCost == "0.00") {
            alert("*Preencha a quantidade e escolha um carboidrato e uma proteína. \n**A soma total dos itens deve ser entre 250g e 450g. \n***Min de 50g max de 250g por porção");
            return;
        }

        let summaryItems = '<div class="summary-item nodesc">';
        summaryItems += `<p>Arroz: 100g</p>`;
        summaryItems += `<p>Feijão: 100g</p>`;
        summaryItems += `<p>Frango Grelhado: 100g</p>`;
        summaryItems += `<p>Quantia: 7x</p>`;
        summaryItems += `<p>Valor: R$99.00</p>`;
        summaryItems += '<button onclick="removeItem(this)">Excluir</button>';
        summaryItems += '</div><hr>';

        document.getElementById('summaryItems').innerHTML += summaryItems;

        const totalItems = document.getElementById('totalItems');
        totalItems.textContent = parseInt(totalItems.textContent) + 7;

        document.getElementById('specialDish').checked = false;
        toggleSpecialDish(document.getElementById('specialDish'));
    } else {
        if (marmitaQuantity == 0 || finalCost == "0.00") {
            alert("*Preencha a quantidade e escolha um carboidrato e uma proteína. \n**A soma total dos itens deve ser entre 250g e 450g. \n***Min de 50g max de 250g por porção");
            return;
        }

        const productNames = [
            "Peito de Frango Grelhado",
            "Sobrecoxa Desfiada",
            "Carne Moída com Molho",
            "Proteína de Soja",
            "Grão de Bico",
            "Arroz Branco",
            "Arroz Integral",
            "Macarrão",
            "Macarrão Integral",
            "Purê",
            "Mix de Legumes"
        ];
        const quantities = [
            document.getElementById('quantity1').value,
            document.getElementById('quantity2').value,
            document.getElementById('quantity3').value,
            document.getElementById('quantity4').value,
            document.getElementById('quantity5').value,
            document.getElementById('quantity6').value,
            document.getElementById('quantity7').value,
            document.getElementById('quantity8').value,
            document.getElementById('quantity9').value,
            document.getElementById('quantity10').value,
            document.getElementById('quantity11').value
        ];

        let summaryItems = '<div class="summary-item">';
        for (let i = 0; i < quantities.length; i++) {
            if (quantities[i]) {
                if (i == 9) {
                    summaryItems += `<p>${productNames[i]} (${pureOption}): ${quantities[i]}g</p>`;
                } else {
                    summaryItems += `<p>${productNames[i]}: ${quantities[i]}g</p>`;
                }
            }
        }
        summaryItems += `<p>Quantia: ${marmitaQuantity}x</p>`;
        summaryItems += `<p>Valor: R$${finalCost}</p>`;
        summaryItems += '<button onclick="removeItem(this)">Excluir</button>';
        summaryItems += '</div><hr>';

        document.getElementById('summaryItems').innerHTML += summaryItems;

        const totalItems = document.getElementById('totalItems');
        totalItems.textContent = parseInt(totalItems.textContent) + parseInt(marmitaQuantity);
    }

    recalculateTotalValue();
    clearInputs();
}

function clearInputs() {
    const inputs = document.querySelectorAll('.calc input, .calc select');
    inputs.forEach(input => {
        input.value = '';
        input.disabled = false;
        input.previousElementSibling.classList.remove('strikethrough');
    });
    document.getElementById('marmitaQuantity').value = '';
    document.getElementById('finalCost').textContent = '0.00';
    document.getElementById('pureOption').disabled = true;
}

function applyDiscount(totalValue, totalItems) {
    let discount = 0;
    if (totalItems >= 14) {
        discount = 0.10;
    } else if (totalItems >= 7) {
        discount = 0.05;
    }
    return Math.max(totalValue * (1 - discount), 0);
}

function recalculateTotalValue() {
    const summaryItems = document.querySelectorAll('.summary-item');
    let newTotalValue = 0;
    let totalItemsWithoutSpecial = 0;
    let specialDishTotal = 0;

    summaryItems.forEach(item => {
        const itemValue = parseFloat(item.querySelector('p:nth-last-child(2)').textContent.replace('Valor: R$', ''));
        if (!item.classList.contains('nodesc')) {
            newTotalValue += itemValue;
            const itemQuantity = parseInt(item.querySelector('p:nth-last-child(3)').textContent.match(/\d+/)[0]);
            totalItemsWithoutSpecial += itemQuantity;
        } else {
            specialDishTotal += itemValue;
        }
    });

    const totalValue = document.getElementById('totalValue');
    totalValue.textContent = (applyDiscount(newTotalValue, totalItemsWithoutSpecial) + specialDishTotal).toFixed(2);
}

function removeItem(button) {
    const item = button.parentElement;
    const itemQuantity = parseInt(item.querySelector('p:nth-last-child(3)').textContent.match(/\d+/)[0]);

    item.nextElementSibling.remove();
    item.remove();

    const totalItems = document.getElementById('totalItems');
    totalItems.textContent = parseInt(totalItems.textContent) - itemQuantity;

    recalculateTotalValue();
}

function sendOrder() {
    const items = document.querySelectorAll('.summary-item');
    if (items.length === 0) {
        alert("Adicione pelo menos um item ao pedido.");
        return;
    }

    let orderMessage = "Olá, gostaria de realizar meu pedido!\n\n";
    items.forEach(item => {
        const itemDetails = item.querySelectorAll('p');
        itemDetails.forEach(detail => {
            orderMessage += detail.textContent + "\n";
        });
        orderMessage += "---------------------------\n";
    });

    const totalItems = document.getElementById('totalItems').textContent;
    const totalValue = document.getElementById('totalValue').textContent;

    orderMessage += `Total de Itens: ${totalItems}\n`;
    orderMessage += `Valor Total: R$ ${totalValue}\n`;

    const whatsappNumber = "5548991750119";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappLink, '_blank');
}

function Togglemode () {
    const html = document.documentElement
    html.classList.toggle('light')
    const img = document.querySelector('.logo img')

    if(html.classList.contains('light')){
        img.setAttribute("src","./assets/amor.png")    
    } else {
        img.setAttribute("src","./assets/amor (1).png")    
    }
}

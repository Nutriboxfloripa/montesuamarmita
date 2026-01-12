/* ===============================
   CONFIGURAÇÕES
================================ */

const pricePerKg = [80, 75, 110, 70, 70, 40, 40, 40, 40, 40, 60];

let totalMarmitasQty = 0;
let totalMarmitasValue = 0;
let totalSpecialValue = 0;

/* ===============================
   CÁLCULO MARMITA
================================ */

function calculateTotal() {
    const quantities = [
        quantity1.value, quantity2.value, quantity3.value, quantity4.value,
        quantity5.value, quantity6.value, quantity7.value, quantity8.value,
        quantity9.value, quantity10.value, quantity11.value
    ];

    let total = 0;

    quantities.forEach((q, i) => {
        if (q) total += (parseInt(q) / 1000) * pricePerKg[i];
    });

    const qty = parseInt(marmitaQuantity.value) || 0;
    finalCost.textContent = (total * qty).toFixed(2);
}

/* ===============================
   DESCONTO
================================ */

function applyDiscount(value, qty) {
    if (qty >= 10) return value * 0.9;
    if (qty >= 5) return value * 0.95;
    return value;
}

/* ===============================
   ADICIONAR MARMITA
================================ */

function addMarmita() {
    const qty = parseInt(marmitaQuantity.value);
    const value = parseFloat(finalCost.textContent);

    if (!qty || value === 0) {
        alert("Preencha a marmita corretamente.");
        return;
    }

    totalMarmitasQty += qty;
    totalMarmitasValue += value;

    let itemsHTML = "";

    const names = [
        "Peito de Frango Grelhado", "Sobrecoxa Desfiada", "Carne Moída com Molho",
        "Proteína de Soja", "Grão de Bico", "Arroz Branco", "Arroz Integral",
        "Macarrão", "Macarrão Integral", "Purê", "Mix de Legumes"
    ];

    const values = [
        quantity1.value, quantity2.value, quantity3.value, quantity4.value,
        quantity5.value, quantity6.value, quantity7.value, quantity8.value,
        quantity9.value, quantity10.value, quantity11.value
    ];

    values.forEach((v, i) => {
        if (v) {
            itemsHTML += `<p>${names[i]}${i === 9 ? ` (${pureOption.value})` : ""}: ${v}g</p>`;
        }
    });

    summaryItems.innerHTML += `
        <div class="summary-item">
            ${itemsHTML}
            <p>Quantidade: ${qty}</p>
            <p>Valor: R$${value.toFixed(2)}</p>
            <button onclick="removeItem(this, ${qty}, ${value}, false)">X</button>
        </div><hr>
    `;

    clearMarmitaInputs();
    updateTotal();
}

/* ===============================
   PRATOS ESPECIAIS
================================ */

function addSpecialDish() {
    const specials = [
        special_panqueca_frango,
        special_panqueca_carne,
        special_fricasse,
        special_escondidinho_carne,
        special_escondidinho_frango
    ];

    let added = false;

    specials.forEach(select => {
        if (select.value) {
            const [price, qty] = select.value.split("|").map(Number);
            totalSpecialValue += price;

            summaryItems.innerHTML += `
                <div class="summary-item nodesc">
                    <p>${select.previousElementSibling.textContent}</p>
                    <p>Quantidade: ${qty}</p>
                    <p>Valor: R$${price.toFixed(2)}</p>
                    <button onclick="removeItem(this, ${qty}, ${price}, true)">X</button>
                </div><hr>
            `;

            select.value = "";
            added = true;
        }
    });

    if (!added) {
        alert("Selecione um prato especial.");
        return;
    }

    updateTotal();
}

/* ===============================
   REMOVER ITEM
================================ */

function removeItem(btn, qty, value, isSpecial) {
    btn.parentElement.nextElementSibling.remove();
    btn.parentElement.remove();

    if (isSpecial) {
        totalSpecialValue -= value;
    } else {
        totalMarmitasQty -= qty;
        totalMarmitasValue -= value;
    }

    updateTotal();
}

/* ===============================
   TOTAL FINAL
================================ */

function updateTotal() {
    const discountedMarmitas = applyDiscount(
        totalMarmitasValue,
        totalMarmitasQty
    );

    totalItems.textContent = totalMarmitasQty;
    totalValue.textContent = (discountedMarmitas + totalSpecialValue).toFixed(2);
}

/* ===============================
   LIMPAR CAMPOS
================================ */

function clearMarmitaInputs() {
    document.querySelectorAll('.calc input').forEach(i => i.value = "");
    document.querySelectorAll('.calc select').forEach(s => s.value = "");
    marmitaQuantity.value = "";
    finalCost.textContent = "0.00";
}

/* ===============================
   WHATSAPP
================================ */

function sendOrder() {
    const items = document.querySelectorAll('.summary-item');
    if (!items.length) {
        alert("Adicione itens ao pedido.");
        return;
    }

    let msg = "Olá! Gostaria de fazer meu pedido:\n\n";

    items.forEach(item => {
        item.querySelectorAll("p").forEach(p => {
            msg += p.textContent + "\n";
        });
        msg += "--------------------\n";
    });

    msg += `Valor Total: R$${totalValue.textContent}`;

    window.open(
        `https://wa.me/5548991750119?text=${encodeURIComponent(msg)}`,
        "_blank"
    );
}

/* ===============================
   DARK / LIGHT
================================ */

function Togglemode() {
    const html = document.documentElement;
    const img = document.querySelector('.logo img');

    html.classList.toggle('light');
    img.src = html.classList.contains('light')
        ? "./assets/amor.png"
        : "./assets/amor (1).png";
}

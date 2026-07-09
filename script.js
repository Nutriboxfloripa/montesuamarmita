const pricePerKg = [80, 75, 110, 70, 70, 40, 40, 40, 40, 40, 40, 60];

let totalMarmitasQty = 0;
let totalMarmitasValue = 0;
let totalSpecialValue = 0;
let totalSpecialQty = 0;
let deliveryData = null;

const deliveryFees = {
  Centro: 5,
  Agronômica: 5,
  Trindade: 5,
  Pantanal: 5,
  Carvoeira: 5,
  "Saco dos Limões": 5,
  "José Mendes": 5,
  Itacorubi: 5,
  "Córrego Grande": 5,
  "Santa Mônica": 5,
  "João Paulo": 5,
  Serrinha: 5,
  "Monte Verde": 5,
  Estreito: 10,
  Balneário: 10,
  Capoeiras: 10,
  Coqueiros: 10,
  Abraão: 10,
  "Bom Abrigo": 10,
  Cacupé: 10,
  "Lagoa da Conceição": 10,
  Campeche: 15,
  "Rio Tavares": 10,
  "Costeira do Pirajubaé": 10,
  Tapera: 10,
  "Ribeirão da Ilha": 10,
  Carianos: 10,
  Kobrasol: 10,
};

/* ===================== MARMITAS ===================== */

function calculateTotal() {
  const q = [
    quantity1.value,
    quantity2.value,
    quantity3.value,
    quantity4.value,
    quantity5.value,
    quantity6.value,
    quantity7.value,
    quantity8.value,
    quantity9.value,
    quantity10.value,
    quantity11.value,
    quantity12.value,
  ];

  let total = 0;
  q.forEach((v, i) => {
    if (v) total += (parseInt(v) / 1000) * pricePerKg[i];
  });

  const qty = parseInt(marmitaQuantity.value) || 0;
  finalCost.textContent = (total * qty).toFixed(2);
}

function applyDiscount(v, q) {
  if (q >= 10) return v * 0.9;
  if (q >= 5) return v * 0.95;
  return v;
}

function addMarmita() {
  const qty = parseInt(marmitaQuantity.value);
  const value = parseFloat(finalCost.textContent);

  if (!qty || value === 0) {
    alert("Preencha a marmita corretamente.");
    return;
  }

  // 🔒 Purê obrigatório
  if (quantity11.value && !pureOption.value) {
    alert("Selecione o tipo de purê.");
    return;
  }

  // 🔁 Proteína ↔ Carboidrato
  const temProteina = [
    quantity1.value,
    quantity2.value,
    quantity3.value,
    quantity4.value,
    quantity5.value,
  ].some((v) => parseInt(v) > 0);

  const temCarbo = [
    quantity6.value,
    quantity7.value,
    quantity8.value,
    quantity9.value,
    quantity10.value,
    quantity11.value,
  ].some((v) => parseInt(v) > 0);

  if (temProteina && !temCarbo) {
    alert("Escolha pelo menos um carboidrato.");
    return;
  }

  if (temCarbo && !temProteina) {
    alert("Escolha pelo menos uma proteína.");
    return;
  }

  totalMarmitasQty += qty;
  totalMarmitasValue += value;

  const names = [
    "Peito de Frango Grelhado",
    "Sobrecoxa Desfiada",
    "Carne Moída com Molho",
    "Proteína de Soja",
    "Grão de Bico",
    "Arroz Branco",
    "Arroz Integral",
    "Feijão",
    "Macarrão",
    "Macarrão Integral",
    "Purê",
    "Mix de Legumes",
  ];

  const vals = [
    quantity1.value,
    quantity2.value,
    quantity3.value,
    quantity4.value,
    quantity5.value,
    quantity6.value,
    quantity7.value,
    quantity8.value,
    quantity9.value,
    quantity10.value,
    quantity11.value,
    quantity12.value,
  ];

  let html = "";
  vals.forEach((v, i) => {
    if (v) {
      html += `<p>${names[i]}${i === 10 ? ` (${pureOption.value})` : ""}: ${v}g</p>`;
    }
  });

  summaryItems.innerHTML += `
    <div class="summary-item">
      ${html}
      <p>Quantidade: ${qty}</p>
      <p>Valor: R$${value.toFixed(2)}</p>
      <button onclick="removeItem(this,${qty},${value},false)">X</button>
    </div><hr>
  `;

  moveDeliveryToEnd();
  clearMarmitaInputs();
  updateTotal();
}

/* ===================== PRATOS ESPECIAIS ===================== */

function addSpecialDish() {
  const specials = [
    special_panqueca_frango,
    special_panqueca_carne,
    special_fricasse,
    special_escondidinho_carne,
    special_escondidinho_frango,
  ];

  let added = false;

  specials.forEach((s) => {
    if (s.value) {
      const [p, q] = s.value.split("|").map(Number);
      totalSpecialValue += p;
      totalSpecialQty += q;

      summaryItems.innerHTML += `
        <div class="summary-item nodesc">
          <p>${s.previousElementSibling.textContent}</p>
          <p>Quantidade: ${q}</p>
          <p>Valor: R$${p.toFixed(2)}</p>
          <button onclick="removeItem(this,${q},${p},true)">X</button>
        </div><hr>
      `;
      s.value = "";
      added = true;
    }
  });

  if (!added) {
    alert("Selecione um prato especial.");
    return;
  }

  moveDeliveryToEnd();
  updateTotal();
}

/* ===================== ENTREGA / RETIRADA ===================== */

function showEntrega() {
  entregaBox.style.display = "block";
  retiradaBox.style.display = "none";
}

function showRetirada() {
  retiradaBox.style.display = "block";
  entregaBox.style.display = "none";
}

cep.addEventListener("blur", () => {
  const c = cep.value.replace(/\D/g, "");
  if (c.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${c}/json/`)
    .then((r) => r.json())
    .then((d) => {
      rua.value = d.logradouro || "";
      bairro.value = d.bairro || "";
      cidade.value = d.localidade || "";

      const fee = deliveryFees[d.bairro];
      deliveryFeeLabel.textContent =
        fee !== undefined
          ? `Taxa de entrega: R$${fee.toFixed(2)}`
          : "Taxa de entrega: confirmar";

      deliveryFeeLabel.style.display = "block";
    });
});

function addEntrega() {
  if (deliveryData) {
    alert("Remova a opção atual para alterar.");
    return;
  }

  const nome = clienteNome.value.trim();
  const b = bairro.value.trim();
  const num = numero.value.trim();
  const formaPagamentoEl = document.getElementById("formaPagamento");

  if (!nome || !b) {
    alert("Preencha nome e endereço.");
    return;
  }

  if (!num) {
    alert("Preencha o número.");
    return;
  }

  if (!formaPagamentoEl || formaPagamentoEl.selectedIndex === 0) {
    alert("Preencha a forma de pagamento.");
    return;
  }

  const pagamento = formaPagamentoEl.value;
  const fee = deliveryFees[b] || 0;

  deliveryData = {
    type: "Entrega",
    valor: fee,
    texto: `Entrega<br>
    Nome: ${nome}<br>
    ${rua.value}, ${num}<br>
    ${b} - ${cidade.value}<br>
    Valor: R$${fee.toFixed(2)}<br>
    Forma de pagamento: ${pagamento}`,
  };

  renderDelivery();
}

function addRetirada() {
  if (deliveryData) {
    alert("Remova a opção atual para alterar.");
    return;
  }

  if (!diaRetirada.value) {
    alert("Selecione o dia da retirada.");
    return;
  }

  if (!formaPagamento2 || formaPagamento2.selectedIndex === 0) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  deliveryData = {
    type: "Retirada",
    valor: 0,
    texto: `Retirada<br>
    Dia: ${diaRetirada.value}<br>
    R. Marcos Nunes Viêira, 89 - Saco dos Limões<br>
    Forma de pagamento: ${formaPagamento2.value}`,
  };

  renderDelivery();
}

function renderDelivery() {
  document.querySelectorAll(".entrega,.retirada").forEach((e) => {
    e.nextElementSibling?.remove();
    e.remove();
  });

  summaryItems.innerHTML += `
    <div class="summary-item ${deliveryData.type.toLowerCase()}">
      <p>${deliveryData.texto}</p>
      <button onclick="removeEntrega()">X</button>
    </div><hr>
  `;
  updateTotal();
}

function removeEntrega() {
  document.querySelectorAll(".entrega,.retirada").forEach((e) => {
    e.nextElementSibling?.remove();
    e.remove();
  });
  deliveryData = null;
  updateTotal();
}

function moveDeliveryToEnd() {
  const d = document.querySelector(".entrega,.retirada");
  if (!d) return;
  const hr = d.nextElementSibling;
  summaryItems.appendChild(d);
  if (hr) summaryItems.appendChild(hr);
}

/* ===================== GERAL ===================== */

function removeItem(btn, qty, val, isSpecial) {
  btn.parentElement.nextElementSibling.remove();
  btn.parentElement.remove();

  if (isSpecial) {
    totalSpecialValue -= val;
    totalSpecialQty -= qty;
  } else {
    totalMarmitasQty -= qty;
    totalMarmitasValue -= val;
  }
  updateTotal();
}

function updateTotal() {
  const m = applyDiscount(totalMarmitasValue, totalMarmitasQty);
  totalItems.textContent = totalMarmitasQty + totalSpecialQty;
  totalValue.textContent = (
    m +
    totalSpecialValue +
    (deliveryData ? deliveryData.valor : 0)
  ).toFixed(2);
}

function clearMarmitaInputs() {
  document.querySelectorAll(".calc input").forEach((i) => (i.value = ""));
  document.querySelectorAll(".calc select").forEach((s) => (s.value = ""));
  marmitaQuantity.value = "";
  finalCost.textContent = "0.00";
}

function sendOrder() {
  if (totalMarmitasQty === 0 && totalSpecialValue === 0) {
    alert("Adicione pelo menos um item.");
    return;
  }

  if (!deliveryData) {
    alert("Escolha entrega ou retirada.");
    return;
  }

  const items = document.querySelectorAll(".summary-item");
  let msg = "Olá! Gostaria de fazer meu pedido:\n\n";

  items.forEach((i) => {
    i.querySelectorAll("p").forEach((p) => (msg += p.textContent + "\n"));
    msg += "-----------------\n";
  });

  msg += `Valor Total: R$${totalValue.textContent}`;
  window.open(`https://wa.me/5548991750119?text=${encodeURIComponent(msg)}`);
}

function Togglemode() {
  const html = document.documentElement;
  const img = document.querySelector(".logo img");

  html.classList.toggle("light");
  img.src = html.classList.contains("light")
    ? "./assets/amor.png"
    : "./assets/amor (1).png";
}

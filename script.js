const pricePerKg = [80,75,110,70,70,40,40,40,40,40,60]

let totalMarmitasQty = 0
let totalMarmitasValue = 0
let totalSpecialValue = 0
let deliveryData = null

const deliveryFees = {
    "Centro":5,"Agronômica":5,"Trindade":5,"Pantanal":5,"Carvoeira":5,
    "Saco dos Limões":5,"José Mendes":5,"Itacorubi":5,"Córrego Grande":5,
    "Santa Mônica":5,"João Paulo":5,"Serrinha":5,"Monte Verde":5,
    "Estreito":10,"Balneário":10,"Capoeiras":10,"Coqueiros":10,"Abraão":10,
    "Bom Abrigo":10,"Cacupé":10,"Lagoa da Conceição":10,
    "Campeche":15,"Rio Tavares":10,"Costeira do Pirajubaé":10,
    "Tapera":10,"Ribeirão da Ilha":10,"Carianos":10
}

function calculateTotal(){
    const q=[quantity1.value,quantity2.value,quantity3.value,quantity4.value,quantity5.value,
             quantity6.value,quantity7.value,quantity8.value,quantity9.value,quantity10.value,quantity11.value]
    let total=0
    q.forEach((v,i)=>{ if(v) total+=(parseInt(v)/1000)*pricePerKg[i] })
    const qty=parseInt(marmitaQuantity.value)||0
    finalCost.textContent=(total*qty).toFixed(2)
}

function applyDiscount(v,q){
    if(q>=10)return v*0.9
    if(q>=5)return v*0.95
    return v
}

function addMarmita(){
    const qty=parseInt(marmitaQuantity.value)
    const value=parseFloat(finalCost.textContent)
    if(!qty||value===0)return alert("Preencha a marmita corretamente.")
    totalMarmitasQty+=qty
    totalMarmitasValue+=value

    const names=["Peito de Frango Grelhado","Sobrecoxa Desfiada","Carne Moída com Molho","Proteína de Soja","Grão de Bico",
                 "Arroz Branco","Arroz Integral","Macarrão","Macarrão Integral","Purê","Mix de Legumes"]
    const vals=[quantity1.value,quantity2.value,quantity3.value,quantity4.value,quantity5.value,
                quantity6.value,quantity7.value,quantity8.value,quantity9.value,quantity10.value,quantity11.value]

    let html=""
    vals.forEach((v,i)=>{
        if(v) html+=`<p>${names[i]}${i===9?` (${pureOption.value})`:""}: ${v}g</p>`
    })

    summaryItems.innerHTML+=`
    <div class="summary-item">
        ${html}
        <p>Quantidade: ${qty}</p>
        <p>Valor: R$${value.toFixed(2)}</p>
        <button onclick="removeItem(this,${qty},${value},false)">X</button>
    </div><hr>`

    clearMarmitaInputs()
    updateTotal()
}

function addSpecialDish(){
    const specials=[special_panqueca_frango,special_panqueca_carne,special_fricasse,
                    special_escondidinho_carne,special_escondidinho_frango]
    let added=false
    specials.forEach(s=>{
        if(s.value){
            const[p,q]=s.value.split("|").map(Number)
            totalSpecialValue+=p
            summaryItems.innerHTML+=`
            <div class="summary-item nodesc">
                <p>${s.previousElementSibling.textContent}</p>
                <p>Quantidade: ${q}</p>
                <p>Valor: R$${p.toFixed(2)}</p>
                <button onclick="removeItem(this,${q},${p},true)">X</button>
            </div><hr>`
            s.value=""
            added=true
        }
    })
    if(!added)return alert("Selecione um prato especial.")
    updateTotal()
}

function showEntrega(){
    entregaBox.style.display="block"
    retiradaBox.style.display="none"
}

function showRetirada(){
    retiradaBox.style.display="block"
    entregaBox.style.display="none"
}

cep.addEventListener("blur",()=>{
    const c=cep.value.replace(/\D/g,"")
    if(c.length!==8)return
    fetch(`https://viacep.com.br/ws/${c}/json/`)
        .then(r=>r.json())
        .then(d=>{
            rua.value=d.logradouro||""
            bairro.value=d.bairro||""
            cidade.value=d.localidade||""
        })
})

function addEntrega(){
    if(deliveryData)return alert("Remova a opção atual para alterar.")
    const nome=clienteNome.value
    const b=bairro.value
    if(!nome||!b)return alert("Preencha nome e CEP.")
    const fee=deliveryFees[b]
    deliveryData={type:"Entrega",valor:fee||0,texto:`
Entrega
Nome: ${nome}
Endereço: ${rua.value}, ${numero.value}
${b} - ${cidade.value}
Complemento: ${complemento.value}
Valor: ${fee!==undefined?`R$${fee.toFixed(2)}`:"Confirmar valor"}`}
    summaryItems.innerHTML+=`
    <div class="summary-item entrega">
        <p>${deliveryData.texto.replace(/\n/g,"<br>")}</p>
        <button onclick="removeEntrega(this)">X</button>
    </div><hr>`
    updateTotal()
}

function addRetirada(){
    if(deliveryData)return alert("Remova a opção atual para alterar.")
    if(!diaRetirada.value)return alert("Selecione o dia da retirada.")
    deliveryData={type:"Retirada",valor:0,texto:`Retirada<br> Dia: ${diaRetirada.value}<br> 
R. Marcos Nunes Viêira, 89 - Saco dos Limões`}
    summaryItems.innerHTML+=`
    <div class="summary-item retirada">
        <p>${deliveryData.texto}</p>
        <button onclick="removeEntrega(this)">X</button>
    </div><hr>`
    updateTotal()
}

function removeEntrega(btn){
    btn.parentElement.nextElementSibling.remove()
    btn.parentElement.remove()
    deliveryData=null
    updateTotal()
}

function removeItem(btn,qty,val,isSpecial){
    btn.parentElement.nextElementSibling.remove()
    btn.parentElement.remove()
    if(isSpecial) totalSpecialValue-=val
    else{
        totalMarmitasQty-=qty
        totalMarmitasValue-=val
    }
    updateTotal()
}

function updateTotal(){
    const m=applyDiscount(totalMarmitasValue,totalMarmitasQty)
    totalItems.textContent=totalMarmitasQty
    totalValue.textContent=(m+totalSpecialValue+(deliveryData?deliveryData.valor:0)).toFixed(2)
}

function clearMarmitaInputs(){
    document.querySelectorAll('.calc input').forEach(i=>i.value="")
    document.querySelectorAll('.calc select').forEach(s=>s.value="")
    marmitaQuantity.value=""
    finalCost.textContent="0.00"
}

function sendOrder(){

    // 🚫 NOVA VALIDAÇÃO
    if(totalMarmitasQty === 0 && totalSpecialValue === 0){
        return alert("Adicione pelo menos uma marmita ou prato especial para continuar.")
    }

    if(!deliveryData){
        return alert("Escolha entrega ou retirada.")
    }

    const items=document.querySelectorAll('.summary-item')
    let msg="Olá! Gostaria de fazer meu pedido:\n\n"
    items.forEach(i=>{
        i.querySelectorAll("p").forEach(p=>msg+=p.textContent+"\n")
        msg+="-----------------\n"
    })
    msg+=`Valor Total: R$${totalValue.textContent}`
    window.open(`https://wa.me/5548991750119?text=${encodeURIComponent(msg)}`)
}

function Togglemode(){
    const html=document.documentElement
    const img=document.querySelector('.logo img')
    html.classList.toggle('light')
    img.src=html.classList.contains('light')
        ? "./assets/amor.png"
        : "./assets/amor (1).png"
}

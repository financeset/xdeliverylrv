let carrinho = [];

function adicionar(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  atualizarResumo();
}

function remover(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade--;

    if (itemExistente.quantidade <= 0) {
      carrinho = carrinho.filter(item => item.nome !== nome);
    }
  }

  atualizarResumo();
}

function limparCarrinho() {
  carrinho = [];
  atualizarResumo();
}

function atualizarResumo() {
  const resumo = document.getElementById('resumo');
  resumo.innerHTML = '';

  let total = 0;

  if (carrinho.length === 0) {
    resumo.classList.add('resumo-vazio');
    document.body.classList.remove('tem-resumo');
    resumo.innerHTML = '<div class="linha-item">Carrinho vazio</div>';
    return;
  } else {
    resumo.classList.remove('resumo-vazio');
    document.body.classList.add('tem-resumo');
  }

  carrinho.forEach(item => {
    const linha = document.createElement('div');
    linha.className = 'linha-item';
    linha.textContent = `${item.nome} x${item.quantidade} – R$ ${(item.preco * item.quantidade).toFixed(2)}`;
    resumo.appendChild(linha);

    total += item.preco * item.quantidade;
  });

  const totalLinha = document.createElement('div');
  totalLinha.className = 'total-geral';
  totalLinha.textContent = `Total: R$ ${total.toFixed(2)}`;
  resumo.appendChild(totalLinha);
}

function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "🛍️ *Meu Pedido XDelivery*%0A";
  carrinho.forEach(item => {
    mensagem += `• ${item.nome} x${item.quantidade} – R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  mensagem += `%0A*Total:* R$ ${total.toFixed(2)}%0A`;

  const linkCardapio = "https://xdeliverylrv.netlify.app";
  mensagem += `%0A🧾 *Cardápio:* ${encodeURIComponent(linkCardapio)}%0A`;

  if (!navigator.geolocation) {
    alert("Seu navegador não suporta geolocalização.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      const mapa = `https://www.google.com/maps?q=${lat},${lng}`;
      mensagem += `%0A📍 *Minha localização:* ${encodeURIComponent(mapa)}`;

      const telefone = "5565996511760";
      const urlZap = `https://wa.me/${telefone}?text=${mensagem}`;
      window.open(urlZap, "_blank");

      setTimeout(() => {
        limparCarrinho();
        location.reload();
      }, 1500);
    },
    () => {
      alert("Não conseguimos obter sua localização 😕. Ative o GPS e tente novamente.");
    }
  );
}

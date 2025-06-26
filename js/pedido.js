let carrinho = {};

// Adiciona item ao carrinho
function adicionar(nome, preco) {
  if (!carrinho[nome]) {
    carrinho[nome] = { quantidade: 1, preco: preco };
  } else {
    carrinho[nome].quantidade += 1;
  }
  atualizarResumo();
}

// Remove 1 unidade do item
function remover(nome, preco) {
  if (carrinho[nome]) {
    carrinho[nome].quantidade -= 1;
    if (carrinho[nome].quantidade <= 0) {
      delete carrinho[nome];
    }
    atualizarResumo();
  }
}

// Limpa todo o carrinho
function limparCarrinho() {
  carrinho = {};
  atualizarResumo();
}

// Atualiza visualmente o resumo
function atualizarResumo() {
  const resumo = document.getElementById('resumo');
  if (!resumo) return;

  const itens = Object.entries(carrinho);
  if (itens.length === 0) {
    resumo.textContent = 'Carrinho vazio';
    resetarContadores();
    return;
  }

  let texto = '';
  let total = 0;

  resetarContadores();

  for (const [nome, dados] of itens) {
    const subtotal = dados.preco * dados.quantidade;
    total += subtotal;
    texto += `• ${nome} x${dados.quantidade} - R$ ${subtotal.toFixed(2)}\n`;

    // Atualiza contador visual
    const contador = document.getElementById(`quant-${nome}`);
    if (contador) {
      contador.textContent = dados.quantidade;
    }
  }

  texto += `\nTotal: R$ ${total.toFixed(2)}`;
  resumo.textContent = texto;
}

// Reseta todos os contadores para zero
function resetarContadores() {
  document.querySelectorAll('.contador').forEach(el => {
    el.textContent = '0';
  });
}

// Envia pedido via WhatsApp
function enviarPedido() {
  if (Object.keys(carrinho).length === 0) return;

  const resumo = document.getElementById('resumo');
  const texto = resumo ? resumo.textContent : '';
  if (!texto) return;

  const mensagemBase = encodeURIComponent(texto);

  // ⚠️ Mostra alerta ao cliente antes de pedir localização
  if (!navigator.geolocation) {
    alert('Seu navegador não suporta geolocalização.');
    return;
  }

  // Solicita localização
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      const linkMapa = `https://www.google.com/maps?q=${lat},${lng}`;
      const mensagemFinal = `${mensagemBase}%0AMinha localização: ${encodeURIComponent(linkMapa)}`;

      const linkZap = `https://wa.me/5565996511760?text=${mensagemFinal}`;
      window.open(linkZap, '_blank');

      // Aguarda e reseta interface
      setTimeout(() => {
        limparCarrinho();
        location.reload();
      }, 1500);
    },
    function (erro) {
      alert('Não foi possível obter sua localização 😕. Ative a localização e tente novamente.');
    }
  );
}
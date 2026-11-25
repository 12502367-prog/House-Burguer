// Baixa como JSON os produtos exibidos na página atual.
// Formato igual ao que o botão "Importar JSON" do DeliveryCRUD espera.
// O nome do arquivo vem do atributo data-arquivo do botão (padrão: produtos.json).
(function () {
  var botao = document.getElementById('btnExportarJson');
  if (!botao) return;

  // "R$ 29,90" -> 29.9
  function paraNumero(texto) {
    var limpo = texto.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  }

  function lerProdutos() {
    var cartoes = document.querySelectorAll('.cartao-produto');
    return Array.prototype.map.call(cartoes, function (cartao) {
      return {
        nome: cartao.querySelector('h3').textContent.trim(),
        descricao: cartao.querySelector('.descricao').textContent.trim(),
        preco: paraNumero(cartao.querySelector('.preco').textContent)
      };
    });
  }

  function baixarJson(objeto, nomeArquivo) {
    var texto = JSON.stringify(objeto, null, 2);
    var blob = new Blob([texto], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  botao.addEventListener('click', function () {
    var produtos = lerProdutos();
    if (produtos.length === 0) {
      alert('Nenhum produto encontrado nesta página.');
      return;
    }
    baixarJson({ produtos: produtos }, botao.getAttribute('data-arquivo') || 'produtos.json');
  });
})();

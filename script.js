var carrinho = JSON.parse(localStorage.getItem("houseCarrinho")) || [];
var favoritos = JSON.parse(localStorage.getItem("houseFavoritos")) || [];
var pedidos = JSON.parse(localStorage.getItem("housePedidos")) || [];

function salvarCarrinho() {
    localStorage.setItem("houseCarrinho", JSON.stringify(carrinho));
    atualizarContador();
}

function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarContador() {
    var total = 0;
    var links = document.querySelectorAll(".link-carrinho");

    for (var i = 0; i < carrinho.length; i++) {
        total = total + carrinho[i].quantidade;
    }

    for (var i = 0; i < links.length; i++) {
        links[i].textContent = "Carrinho (" + total + ")";
    }
}

function adicionarProduto(nome, preco, imagem) {
    var encontrado = false;

    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].nome == nome) {
            carrinho[i].quantidade++;
            encontrado = true;
        }
    }

    if (encontrado == false) {
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    alert("Produto adicionado ao carrinho!");
}

var produtos = document.querySelectorAll(".cartao-produto");

for (var i = 0; i < produtos.length; i++) {
    var produto = produtos[i];

    var nome = produto.querySelector("h3");
    var preco = produto.querySelector(".preco");
    var imagem = produto.querySelector(".foto-produto img");
    var botao = produto.querySelector(".botao-mais");

    if (botao && nome && preco) {
        botao.onclick = function() {
            var cartao = this.parentElement.parentElement;
            var nomeProduto = cartao.querySelector("h3").textContent;
            var precoProduto = cartao.querySelector(".preco").textContent;
            var foto = cartao.querySelector(".foto-produto img");

            precoProduto = precoProduto.replace("R$", "");
            precoProduto = precoProduto.replace(".", "");
            precoProduto = precoProduto.replace(",", ".");
            precoProduto = Number(precoProduto);

            var imagemProduto = "";

            if (foto) {
                imagemProduto = foto.src;
            }

            adicionarProduto(nomeProduto, precoProduto, imagemProduto);

            return false;
        };
    }

    if (nome) {
        var botaoFavorito = document.createElement("button");
        botaoFavorito.textContent = "♡";
        botaoFavorito.type = "button";

        var fotoProduto = produto.querySelector(".foto-produto");

        if (fotoProduto) {
            fotoProduto.style.position = "relative";
            fotoProduto.appendChild(botaoFavorito);
            botaoFavorito.style.position = "absolute";
            botaoFavorito.style.top = "10px";
            botaoFavorito.style.right = "10px";
            botaoFavorito.style.cursor = "pointer";
        }

        var nomeFavorito = nome.textContent.trim();

        for (var j = 0; j < favoritos.length; j++) {
            if (favoritos[j] == nomeFavorito) {
                botaoFavorito.textContent = "♥";
            }
        }

        botaoFavorito.onclick = function() {
            var nomeAtual = this.parentElement.parentElement.querySelector("h3").textContent.trim();
            var existe = false;

            for (var j = 0; j < favoritos.length; j++) {
                if (favoritos[j] == nomeAtual) {
                    favoritos.splice(j, 1);
                    existe = true;
                    break;
                }
            }

            if (existe == true) {
                this.textContent = "♡";
            } else {
                favoritos.push(nomeAtual);
                this.textContent = "♥";
            }

            localStorage.setItem("houseFavoritos", JSON.stringify(favoritos));
        };
    }
}

function atualizarCarrinho() {
    var lista = document.querySelector(".itens");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    var subtotal = 0;

    if (carrinho.length == 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    for (var i = 0; i < carrinho.length; i++) {
        var produto = carrinho[i];

        subtotal = subtotal + produto.preco * produto.quantidade;

        var item = document.createElement("div");
        item.className = "item";

        item.innerHTML =
            '<div class="miniatura"></div>' +
            '<div class="item-info"><h3>' + produto.nome + '</h3><p>' + dinheiro(produto.preco) + ' cada</p></div>' +
            '<div class="quantidade"><button class="menos" type="button">−</button><strong>' + produto.quantidade + '</strong><button class="mais" type="button">+</button></div>' +
            '<button class="remover" type="button">×</button>';

        if (produto.imagem != "") {
            item.querySelector(".miniatura").innerHTML =
                '<img src="' + produto.imagem + '" width="100%" alt="' + produto.nome + '">';
        } else {
            item.querySelector(".miniatura").textContent = "🍔";
        }

        item.querySelector(".mais").onclick = function() {
            var indice = Number(this.getAttribute("data-indice"));

            if (isNaN(indice)) {
                indice = 0;
                var atual = this.parentElement.parentElement;
                var itens = document.querySelectorAll(".item");

                for (var j = 0; j < itens.length; j++) {
                    if (itens[j] == atual) {
                        indice = j;
                    }
                }
            }

            carrinho[indice].quantidade++;
            salvarCarrinho();
            atualizarCarrinho();
        };

        item.querySelector(".menos").onclick = function() {
            var atual = this.parentElement.parentElement;
            var itens = document.querySelectorAll(".item");
            var indice = 0;

            for (var j = 0; j < itens.length; j++) {
                if (itens[j] == atual) {
                    indice = j;
                }
            }

            carrinho[indice].quantidade--;

            if (carrinho[indice].quantidade <= 0) {
                carrinho.splice(indice, 1);
            }

            salvarCarrinho();
            atualizarCarrinho();
        };

        item.querySelector(".remover").onclick = function() {
            var atual = this.parentElement;
            var itens = document.querySelectorAll(".item");
            var indice = 0;

            for (var j = 0; j < itens.length; j++) {
                if (itens[j] == atual) {
                    indice = j;
                }
            }

            carrinho.splice(indice, 1);
            salvarCarrinho();
            atualizarCarrinho();
        };

        lista.appendChild(item);
    }

    var valores = document.querySelectorAll(".linha-resumo strong");

    if (valores.length >= 3) {
        valores[0].textContent = dinheiro(subtotal);
        valores[2].textContent = dinheiro(subtotal);
    }
}

atualizarContador();
atualizarCarrinho();

var busca = document.querySelectorAll(".busca-pagina, .busca-topo");

for (var i = 0; i < busca.length; i++) {
    busca[i].oninput = function() {
        var termo = this.value.toLowerCase();
        var cartoes = document.querySelectorAll(".cartao-produto");

        for (var j = 0; j < cartoes.length; j++) {
            var texto = cartoes[j].textContent.toLowerCase();

            if (texto.indexOf(termo) != -1) {
                cartoes[j].style.display = "";
            } else {
                cartoes[j].style.display = "none";
            }
        }
    };
}

var cadastro = document.querySelector(".cartao-form");

if (cadastro) {
    var botaoCadastro = cadastro.querySelector(".botao");

    botaoCadastro.onclick = function(evento) {
        evento.preventDefault();

        var campos = cadastro.querySelectorAll("input");

        var nome = campos[0].value;
        var email = campos[1].value;
        var telefone = campos[2].value;
        var senha = campos[3].value;
        var confirmar = campos[4].value;

        if (nome == "" || email == "" || telefone == "" || senha == "" || confirmar == "") {
            alert("Preencha todos os campos.");
        } else if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
            alert("Digite um e-mail válido.");
        } else if (senha.length < 6) {
            alert("A senha precisa ter pelo menos 6 caracteres.");
        } else if (senha != confirmar) {
            alert("As senhas não são iguais.");
        } else {
            var usuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha,
                endereco: ""
            };

            localStorage.setItem("houseUsuario", JSON.stringify(usuario));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        }
    };
}

var login = document.querySelector(".janela");

if (login) {
    var botaoLogin = login.querySelector(".botao:not(.contorno)");

    botaoLogin.onclick = function(evento) {
        evento.preventDefault();

        var campos = login.querySelectorAll("input");
        var usuario = JSON.parse(localStorage.getItem("houseUsuario"));

        if (usuario == null) {
            alert("Você ainda não possui cadastro.");
        } else if (campos[0].value == usuario.email && campos[1].value == usuario.senha) {
            localStorage.setItem("houseLogado", "sim");
            alert("Login realizado com sucesso!");
            window.location.href = "perfil.html";
        } else {
            alert("E-mail ou senha incorretos.");
        }
    };
}

var perfil = document.querySelector(".formulario");

if (perfil) {
    var usuario = JSON.parse(localStorage.getItem("houseUsuario"));
    var camposPerfil = perfil.querySelectorAll("input");

    if (usuario != null) {
        camposPerfil[0].value = usuario.nome;
        camposPerfil[1].value = usuario.email;
        camposPerfil[2].value = usuario.telefone;
        camposPerfil[3].value = usuario.endereco || "";
    }

    var botaoSalvar = perfil.querySelector(".botao:not(.contorno)");

    botaoSalvar.onclick = function(evento) {
        evento.preventDefault();

        if (usuario == null) {
            alert("Faça login primeiro.");
            return;
        }

        usuario.nome = camposPerfil[0].value;
        usuario.email = camposPerfil[1].value;
        usuario.telefone = camposPerfil[2].value;
        usuario.endereco = camposPerfil[3].value;

        localStorage.setItem("houseUsuario", JSON.stringify(usuario));

        alert("Dados salvos com sucesso!");
    };
}

var finalizar = document.querySelector(".resumo .botao");

if (finalizar) {
    finalizar.onclick = function(evento) {
        evento.preventDefault();

        if (carrinho.length == 0) {
            alert("Seu carrinho está vazio.");
        } else if (localStorage.getItem("houseLogado") != "sim") {
            alert("Faça login para finalizar o pedido.");
            window.location.href = "login.html";
        } else {
            var total = 0;
            var itens = "";

            for (var i = 0; i < carrinho.length; i++) {
                total = total + carrinho[i].preco * carrinho[i].quantidade;
                itens = itens + carrinho[i].quantidade + "x " + carrinho[i].nome + " ";
            }

            var pedido = {
                numero: pedidos.length + 1,
                data: new Date().toLocaleDateString("pt-BR"),
                itens: itens,
                total: total
            };

            pedidos.push(pedido);

            localStorage.setItem("housePedidos", JSON.stringify(pedidos));

            carrinho = [];
            salvarCarrinho();
            atualizarCarrinho();

            alert("Pedido realizado com sucesso!");
            window.location.href = "pedidos.html";
        }
    };
}

var gradePedidos = document.querySelector(".grade-pedidos");

if (gradePedidos && pedidos.length > 0) {
    for (var i = 0; i < pedidos.length; i++) {
        var pedido = pedidos[i];

        var cartao = document.createElement("article");
        cartao.className = "pedido";

        cartao.innerHTML =
            "<div class='pedido-topo'><strong>Pedido #" + pedido.numero + "</strong><span class='situacao'>Recebido</span></div>" +
            "<small>" + pedido.data + "</small>" +
            "<p>" + pedido.itens + "</p>" +
            "<span class='valor'>" + dinheiro(pedido.total) + "</span>";

        gradePedidos.appendChild(cartao);
    }
}

var sair = document.querySelectorAll('a[href="index.html"]');

for (var i = 0; i < sair.length; i++) {
    if (sair[i].textContent.toLowerCase().indexOf("sair") != -1) {
        sair[i].onclick = function() {
            localStorage.removeItem("houseLogado");
        };
    }
}
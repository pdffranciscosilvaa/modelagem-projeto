document.addEventListener('DOMContentLoaded', function() {
    // Função para gerar relatório
    window.gerarRelatorio = async function(tipo) {
        const outputElement = document.getElementById('relatorioOutput');
        outputElement.textContent = 'Carregando...';
        
        try {
            const response = await fetch(`/api/relatorios/${tipo}`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            
            // Formatar a saída para melhor visualização
            let formattedOutput = '';
            
            switch(tipo) {
                case 'usuarios':
                    formattedOutput = data.map(user => 
                        `ID: ${user.id}\nNome: ${user.primeiroNome} ${user.sobrenome}\nIdade: ${user.idade}\nEmail: ${user.email}\nTelefone: ${user.telefone}\nCidade: ${user.cidade}\nEstado: ${user.estado}\n---`
                    ).join('\n');
                    break;
                    
                case 'produtos':
                    formattedOutput = data.map(prod => 
                        `ID: ${prod.id}\nTítulo: ${prod.titulo}\nCategoria: ${prod.categoria}\nPreço: R$ ${prod.preco}\nDesconto: ${prod.percentualDesconto}%\nPreço Final: R$ ${(prod.preco * (1 - prod.percentualDesconto / 100)).toFixed(2)}\nEstoque: ${prod.estoque}\nMarca: ${prod.marca}\n---`
                    ).join('\n');
                    break;
                    
                case 'compras':
                    formattedOutput = data.map(compra => {
                        const precoFinal = compra.precoUnitario * compra.quantidade * (1 - compra.descontoAplicado / 100);
                        return `ID: ${compra.idCompra}\nData: ${new Date(compra.dataCompra).toLocaleDateString()}\nQuantidade: ${compra.quantidade}\nPreço Unitário: R$ ${compra.precoUnitario.toFixed(2)}\nDesconto: ${compra.descontoAplicado}%\nPreço Final: R$ ${precoFinal.toFixed(2)}\nForma Pagamento: ${compra.formaPagamento}\nStatus: ${compra.statusCompra}\n---`;
                    }).join('\n');
                    break;
                    
                case 'estoque-critico':
                    formattedOutput = data.map(prod => 
                        `ID: ${prod.id}\nTítulo: ${prod.titulo}\nEstoque: ${prod.estoque}\n---`
                    ).join('\n');
                    break;
                    
                case 'consolidado':
                    formattedOutput = `Total de Compras: ${data.totalCompras}\nValor Total: R$ ${data.valorTotal.toFixed(2)}\nMédia por Compra: R$ ${data.mediaPorCompra.toFixed(2)}\n---\n`;
                    formattedOutput += data.comprasPorStatus.map(item => 
                        `Status: ${item.status}\nQuantidade: ${item.quantidade}\nValor Total: R$ ${item.valorTotal.toFixed(2)}\n---`
                    ).join('\n');
                    break;
                    
                default:
                    formattedOutput = JSON.stringify(data, null, 2);
            }
            
            outputElement.textContent = formattedOutput;
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            outputElement.textContent = `Erro ao carregar o relatório: ${error.message}`;
        }
    };
});
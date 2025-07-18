document.addEventListener('DOMContentLoaded', function() {
  // Carregar gráficos inicialmente
  loadCharts();

  // Configurar evento do formulário de filtro
  document.getElementById('filtroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    loadCharts();
  });
});

async function loadCharts() {
  const idInicial = document.getElementById('idInicial').value || ''; // Usar string vazia se não houver valor
  const idFinal = document.getElementById('idFinal').value || ''; // Usar string vazia se não houver valor

  try {
    // Carregar dados dos produtos
    const produtosResponse = await fetch(`/api/produtos?idInicial=${idInicial}&idFinal=${idFinal}`);
    if (!produtosResponse.ok) {
      throw new Error(`Erro HTTP ao carregar produtos: ${produtosResponse.status}`);
    }
    const produtos = await produtosResponse.json();
    
    // Carregar dados dos usuários
    const usuariosResponse = await fetch(`/api/usuarios?idInicial=${idInicial}&idFinal=${idFinal}`);
    if (!usuariosResponse.ok) {
      throw new Error(`Erro HTTP ao carregar usuários: ${usuariosResponse.status}`);
    }
    const usuarios = await usuariosResponse.json();

    // Destruir gráficos existentes antes de criar novos para evitar sobreposição
    if (window.produtoEstoqueChartInstance) {
      window.produtoEstoqueChartInstance.destroy();
    }
    if (window.usuarioIdadeChartInstance) {
      window.usuarioIdadeChartInstance.destroy();
    }

    // Criar gráfico de Produtos x Estoque
    createProductStockChart(produtos);
    
    // Criar gráfico de Usuários x Idade
    createUserAgeChart(usuarios);
  } catch (error) {
    console.error('Erro ao carregar dados para gráficos:', error);
    alert('Erro ao carregar dados para os gráficos: ' + error.message);
  }
}

function createProductStockChart(produtos) {
  const ctx = document.getElementById('produtoEstoqueChart').getContext('2d');
  
  // Limitar a 10 itens e ordenar por estoque
  const produtosLimitados = produtos
    .slice(0, 10) // Pega os primeiros 10, se houver mais
    .sort((a, b) => b.estoque - a.estoque); // Ordena por estoque decrescente
  
  window.produtoEstoqueChartInstance = new Chart(ctx, { // Armazena a instância
    type: 'bar',
    data: {
      labels: produtosLimitados.map(p => p.titulo),
      datasets: [{
        label: 'Estoque',
        data: produtosLimitados.map(p => p.estoque),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Estoque: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantidade em Estoque'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Produtos'
          }
        }
      }
    }
  });
}

function createUserAgeChart(usuarios) {
  const ctx = document.getElementById('usuarioIdadeChart').getContext('2d');
  
  // Limitar a 10 itens e ordenar por idade
  const usuariosLimitados = usuarios
    .slice(0, 10) // Pega os primeiros 10, se houver mais
    .sort((a, b) => b.idade - a.idade); // Ordena por idade decrescente
  
  window.usuarioIdadeChartInstance = new Chart(ctx, { // Armazena a instância
    type: 'bar',
    data: {
      labels: usuariosLimitados.map(u => `${u.primeiroNome} ${u.sobrenome}`),
      datasets: [{
        label: 'Idade',
        data: usuariosLimitados.map(u => u.idade),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Idade: ${context.raw} anos`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Idade (anos)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Usuários'
          }
        }
      }
    }
  });
}

if (!produtos.length || !usuarios.length) {
  alert('Nenhum dado encontrado para os filtros selecionados');
  return;
}
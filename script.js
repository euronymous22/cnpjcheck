document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');
    
    if (cnpj) {
        mostrarLoading();
        document.getElementById('cnpj-input').value = cnpj;
        buscarCNPJ();
    }

    if (window.self !== window.top) {
        ajustarParaIframe();
    }
});

function ajustarParaIframe() {
    document.body.style.fontSize = '12px';
    const container = document.querySelector('.container');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.padding = '10px';
    container.style.boxShadow = 'none';
    container.style.borderRadius = '0';
}

function mostrarLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}

function esconderLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

async function buscarCNPJ() {
    const cnpj = document.getElementById('cnpj-input').value;
    if (!cnpj) {
        alert('Por favor, insira um CNPJ válido.');
        esconderLoading();
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados.');
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        document.getElementById('result').innerText = 'Erro ao buscar os dados. Verifique o CNPJ e tente novamente.';
        esconderLoading();
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <table>
            <tr><td>Razão Social</td><td>${data.razao_social ?? 'Não cadastrado'}</td></tr>
            <tr><td>Nome Fantasia</td><td>${data.nome_fantasia ?? 'Não cadastrado'}</td></tr>
            <tr><td>Idade da Empresa</td><td>${calcularIdadeEmpresa(data.data_inicio_atividade) ?? 'Não cadastrado'}</td></tr>
            <tr><td>Descrição da Situação Cadastral</td><td>${data.descricao_situacao_cadastral ?? 'Não cadastrado'}</td></tr>
            <tr><td>Descrição do CNAE Fiscal</td><td>${data.cnae_fiscal_descricao ?? 'Não cadastrado'}</td></tr>
            <tr><td>Telefone 1</td><td>${formatPhoneNumber(data.ddd_telefone_1) ?? 'Não cadastrado'}</td></tr>
            <tr><td>Telefone 2</td><td>${formatPhoneNumber(data.ddd_telefone_2) ?? 'Não cadastrado'}</td></tr>
            <tr><td>Email</td><td>${data.email ?? 'Não cadastrado'}</td></tr>
            <tr><td>Capital Social</td><td>${formatCurrency(data.capital_social)}</td></tr>
        </table>
    `;

    esconderLoading();
}

input {
    padding: 10px;
    width: 200px;
    margin-right: 10px;
}

button {
    padding: 10px;
}

#result {
    text-align: left;
    display: none;
    font-size: 12px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

td {
    padding: 4px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

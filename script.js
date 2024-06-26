document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');
    
    if (cnpj) {
        document.getElementById('container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
        buscarCNPJ(cnpj);
    }

    if (window.self !== window.top) {
        ajustarParaIframe();
    }
});

function ajustarParaIframe() {
    document.body.style.fontSize = '12px';
    const container = document.querySelector('#result-container');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.padding = '10px';
    container.style.boxShadow = 'none';
    container.style.borderRadius = '0';
}

async function buscarCNPJ(cnpj) {
    if (!cnpj) {
        cnpj = document.getElementById('cnpj-input').value;
    }
    if (!cnpj) {
        alert('Por favor, insira um CNPJ válido.');
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
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    const idadeEmpresa = calcularIdadeEmpresa(data.data_inicio_atividade);

    resultDiv.innerHTML = `
        <table>
            <tr><td>Razão Social</td><td>${data.razao_social ?? 'Não cadastrado'}</td></tr>
            <tr><td>Fantasia</td><td>${data.nome_fantasia ?? 'Não cadastrado'}</td></tr>
            <tr><td>Idade</td><td>${idadeEmpresa ?? 'Não cadastrado'}</td></tr>
            <tr><td>Status</td><td>${data.descricao_situacao_cadastral ?? 'Não cadastrado'}</td></tr>
            <tr><td>CNAE</td><td>${data.cnae_fiscal_descricao ?? 'Não cadastrado'}</td></tr>
            <tr><td>Telefone 1</td><td>${formatPhoneNumber(data.ddd_telefone_1) ?? 'Não cadastrado'}</td></tr>
            <tr><td>Telefone 2</td><td>${formatPhoneNumber(data.ddd_telefone_2) ?? 'Não cadastrado'}</td></tr>
            <tr><td>Email</td><td>${data.email ?? 'Não cadastrado'}</td></tr>
            <tr><td>Capital Social</td><td>${formatCurrency(data.capital_social)}</td></tr>
        </table>
    `;
}

function calcularIdadeEmpresa(dataInicio) {
    if (!dataInicio) return 'Não cadastrado';

    const dataAtual = new Date();
    const dataInicioAtividade = new Date(dataInicio);
    const diferencaAnos = dataAtual.getFullYear() - dataInicioAtividade.getFullYear();
    const diferencaMeses = dataAtual.getMonth() - dataInicioAtividade.getMonth();
    const diferencaDias = dataAtual.getDate() - dataInicioAtividade.getDate();

    let anos = diferencaAnos;
    let meses = diferencaMeses;

    if (diferencaMeses < 0 || (diferencaMeses === 0 && diferencaDias < 0)) {
        anos--;
        meses += 12;
    }

    if (diferencaDias < 0) {
        meses--;
        if (meses < 0) {
            anos--;
            meses += 12;
        }
    }

    if (meses === 0) {
        return `${anos} anos`;
    } else if (meses === 1) {
        return `${anos} anos e 1 mês`;
    } else {
        return `${anos} anos e ${meses} meses`;
    }
}

function formatPhoneNumber(number) {
    if (!number) return null;

    // Remove o zero à esquerda, se houver
    const cleaned = number.replace(/^0+/, '').replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

    if (match) {
        return ['(', match[1], ') ', match[2], '-', match[3]].join('');
    }

    return number;
}

function formatCurrency(value) {
    if (!value) return 'Não cadastrado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
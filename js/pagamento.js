let selectedPayment = null;

function selectPayment(method) {
    // Remove seleção anterior
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.payment-details').forEach(details => {
        details.style.display = 'none';
    });

    // Seleciona novo método
    selectedPayment = method;
    document.getElementById(method).checked = true;
    document.querySelector(`#${method}`).parentElement.classList.add('selected');
    
    // Mostra detalhes do método selecionado
    const details = document.getElementById(`${method}-details`);
    if (details) {
        details.style.display = 'block';
    }
}

// Formatação do número do cartão
document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Formatação da data de validade
document.getElementById('expiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Formatação do CVV
document.getElementById('cvv')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

document.getElementById('mbwayPhone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Apenas números

    // Remove o prefixo 351 se estiver presente
    if (value.startsWith('351')) {
        value = value.slice(3);
    }

    // Limita a 9 dígitos nacionais
    value = value.slice(0, 9);

    // Aplica formatação: 999 999 999
    let formatted = '+351';

    if (value.length > 0) {
        formatted += ' ' + value.slice(0, 3);
    }
    if (value.length > 3) {
        formatted += ' ' + value.slice(3, 6);
    }
    if (value.length > 6) {
        formatted += ' ' + value.slice(6, 9);
    }

    e.target.value = formatted;
});


function processPayment() {
    if (!selectedPayment) {
        alert('⚠️ Por favor, selecione um método de pagamento.');
        return;
    }

    const button = document.querySelector('.pay-button');
    const originalText = button.innerHTML;

    button.innerHTML = '⏳ Processando...';
    button.disabled = true;
    button.style.opacity = '0.7';

    setTimeout(() => {
        alert(`✅ Pagamento processado com sucesso!\n\nMétodo: ${getPaymentMethodName(selectedPayment)}\nValor: €20,90\n\nObrigado por sua compra!`);
        
        // Redireciona após o utilizador clicar em OK
        window.location.href = 'index.html';

        // (Opcional) Restaura o botão — pode remover estas linhas se fores redirecionar mesmo
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, 2000);
}


function getPaymentMethodName(method) {
    const names = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'mbway': 'MB WAY',
        'paypal': 'PayPal',
        
    };
    return names[method] || method;
}

// Animação de entrada dos elementos
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.payment-option');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-20px)';
            element.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
});
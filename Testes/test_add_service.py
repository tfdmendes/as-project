from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import time
import os

def testar_add_service(nome, descricao, preco, localizacao, espera_sucesso=True):
    resultado = ""
    driver = webdriver.Chrome()
    driver.get("https://tfdmendes.github.io/criar_servico.html")
    driver.maximize_window()
    time.sleep(2)

    try:
        nome_input = driver.find_element(By.ID, "serviceName")
        descricao_input = driver.find_element(By.ID, "serviceDescription")
        preco_input = driver.find_element(By.ID, "servicePrice")
        localizacao_input = driver.find_element(By.ID, "locationInput")
        
        nome_input.clear()
        descricao_input.clear()
        preco_input.clear()
        localizacao_input.clear()
        nome_input.send_keys(nome)
        descricao_input.send_keys(descricao)
        preco_input.send_keys(preco)
        localizacao_input.send_keys(localizacao)

        nome_valido = driver.execute_script("return arguments[0].checkValidity();", nome_input)
        descricao_valido = driver.execute_script("return arguments[0].checkValidity();", descricao_input)
        preco_valido = driver.execute_script("return arguments[0].checkValidity();", preco_input)
        localizacao_valido = driver.execute_script("return arguments[0].checkValidity();", localizacao_input)

        driver.find_element(By.CSS_SELECTOR, ".btn-primary").click()
        time.sleep(2)
        
        if not nome_valido or not descricao_valido or not preco_valido or not localizacao_valido:
            resultado = "Formulário bloqueado pelo navegador\n"
            if not nome_valido:
                msg = driver.execute_script("return arguments[0].validationMessage;", nome_input)
                resultado += f" - Nome inválido: '{msg}'\n"
            if not descricao_valido:
                msg = driver.execute_script("return arguments[0].validationMessage;", descricao_input)
                resultado += f" - Descricao inválida: '{msg}'\n"
            if not preco_valido:
                msg = driver.execute_script("return arguments[0].validationMessage;", preco_input)
                resultado += f" - Preço inválido: '{msg}'\n"
            if not localizacao_valido:
                msg = driver.execute_script("return arguments[0].validationMessage;", localizacao_input)
                resultado += f" - Localização inválida: '{msg}'\n"
        else:
            if espera_sucesso:
                titulo = driver.title
                if "Pet-o-Tel | Os meus Serviços" in titulo:
                    resultado = f"Serviço adicionado com sucesso: PASSOU\n"
                else:
                    resultado = f"Serviço adiconado com sucesso, mas falhou - Título inesperado: {titulo}\n"

            else:
                try:
                    erro_elemento = driver.find_element(By.ID, "successMessage")
                    erro_texto = erro_elemento.text.strip()
                    if erro_texto:
                        resultado = f"Serviço não foi adicionado: PASSOU - Mensagem de erro: '{erro_texto}'\n"
                    else:
                        resultado = f"Serviço não adicionado como esperado, mas sem mensagem de erro\n"
                except NoSuchElementException:
                    resultado = f"Erro esperado, mas sem elemento de erro visível\n"

    except Exception as e:
        resultado = f"Erro inesperado: {str(e)}\n"

    finally:
        driver.quit()

    return resultado

testes_servico = [
    ("Banho & Tosquia Profissional", "Ofereço serviços profissionais de banho e tosquia para cães e gatos há mais de 5 anos. Trabalho com carinho e dedicação, garantindo o bem-estar e conforto dos seus pets. Uso apenas produtos de qualidade e técnicas seguras.", "25", "Aveiro, Portugal", True),
    ("", "Sem título - Descrição deve ter no minimo 50 caracteres para funcionar", "70", "Angra do Heroísmo, Portugal", False),
    ("Cortamento de pelo", "", "50", "Praia da Vitória, Portugal", False),
    ("Consultas", "Sem preço - Descrição deve ter no minimo 50 caracteres para funcionar", "", "Porto Judeu, Portugal", False),
    ("Passeios", "Sem Localização - Descrição deve ter no minimo 50 caracteres para funcionar", "35", "", False),
    ("Hospedagem", "outros - Descrição deve ter no minimo 50 caracteres para funcionar", "100", "Vladivostok, Russia", True),
    ("", "", "", "", False),
]

with open("test_add_service_results.txt", "a", encoding="utf-8") as f:
    for nome, descricao, preco, localizacao, sucesso in testes_servico:
        resultado = testar_add_service(nome, descricao, preco, localizacao, sucesso)
        entrada = (
            "\n---\n"
            f"Teste com:\n"
            f"Nome: '{nome}'\n"
            f"Descrição: '{descricao}'\n"
            f"Preço: '{preco}'\n"
            f"Localização: '{localizacao}'\n"
            f"{resultado}"
        )
        f.write(entrada)
        print(entrada)

print("Testes finalizados. Resultados guardados em:", os.path.abspath("test_add_service_results.txt"))

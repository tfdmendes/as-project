from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import time
import os

def testar_add_pet(nome, especie, raca="", idade="", descricao="", espera_sucesso=True):
    resultado = ""
    driver = webdriver.Chrome()
    driver.get("https://tfdmendes.github.io/account-edit.html")
    driver.maximize_window()
    time.sleep(2)

    try:
        driver.find_element(By.ID, "addPetButton").click()
        time.sleep(1)
        
        name_input = driver.find_element(By.ID, "petName")
        species_select = driver.find_element(By.ID, "petSpecies")

        name_input.send_keys(nome)
        Select(species_select).select_by_value(especie)
        
        nome_valido = driver.execute_script("return arguments[0].checkValidity();", name_input)
        especie_valido = driver.execute_script("return arguments[0].checkValidity();", species_select)

        if raca:
            driver.find_element(By.ID, "petBreed").send_keys(raca)
        if idade:
            driver.find_element(By.ID, "petAge").send_keys(idade)
        if descricao:
            driver.find_element(By.ID, "petDescription").send_keys(descricao)

        driver.find_element(By.CSS_SELECTOR, ".btn-submit").click()
        time.sleep(2)
        
        if not nome_valido or not especie_valido:
            nome_msg = driver.execute_script("return arguments[0].validationMessage;", name_input)
            especie_msg = driver.execute_script("return arguments[0].validationMessage;", species_select)
            resultado = f"Formulário bloqueado pelo navegador\n"
            if not nome_valido:
                resultado += f" - Nome inválido: '{nome_msg}'\n"
            if not especie_valido:
                resultado += f" - Especie inválida: '{especie_msg}'\n"
        else:
            if espera_sucesso:
                msg_element = driver.find_element(By.XPATH, "//*[contains(text(), 'Pet adicionado com sucesso')]")
                if msg_element.is_displayed():
                    resultado = f"Pet '{nome}' adicionado com sucesso: PASSOU\n"
                else:
                    resultado = f"Mensagem de sucesso não visível: FALHOU\n"
            else:
                try:
                    erro_elemento = driver.find_element(By.ID, "errorMessage")
                    erro_texto = erro_elemento.text.strip()
                    if erro_texto:
                        resultado = f"Pet não foi adicionado: PASSOU - Mensagem de erro: '{erro_texto}'\n"
                    else:
                        resultado = f"Pet não adicionado esperado, mas sem mensagem visível\n"
                except NoSuchElementException:
                    resultado = f"Login incorreto esperado, mas sem elemento de erro\n"

    except Exception as e:
        resultado = f"Erro inesperado: {str(e)}\n"

    finally:
        driver.quit()

    return resultado

testes = [
    ("Bobby", "dog", "Labrador", "3 anos", "Vacinas em dia", True),
    ("", "cat", "", "", "", False),
    ("Simba", "", "", "", "", False),
    ("Luna", "rabbit", "", "1 ano", "", True),
    ("", "", "", "", "", False),
]

with open("test_add_pet_results.txt", "a", encoding="utf-8") as f:
    for nome, especie, raca, idade, descricao, sucesso in testes:
        resultado = testar_add_pet(nome, especie, raca, idade, descricao, sucesso)
        entrada = (
            "\n---\n"
            f"Teste com:\n"
            f"Nome: '{nome}'\n"
            f"Espécie: '{especie}'\n"
            f"Raça: '{raca}'\n"
            f"Idade: '{idade}'\n"
            f"Descrição: '{descricao}'\n"
            f"{resultado}"
        )
        f.write(entrada)
        print(entrada) 

print("Testes finalizados. Resultados guardados em:", os.path.abspath("test_add_pet_results.txt"))
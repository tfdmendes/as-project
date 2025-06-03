from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time
import os

def testar_login(email, password, esperado_sucesso=True):
    resultado = ""
    driver = webdriver.Chrome()
    driver.get("https://tfdmendes.github.io/login.html")
    driver.maximize_window()
    time.sleep(2)

    try:
        email_input = driver.find_element(By.ID, "email")
        password_input = driver.find_element(By.ID, "password")

        email_input.clear()
        password_input.clear()
        email_input.send_keys(email)
        password_input.send_keys(password)

        email_valido = driver.execute_script("return arguments[0].checkValidity();", email_input)
        password_valido = driver.execute_script("return arguments[0].checkValidity();", password_input)

        if not email_valido or not password_valido:
            email_msg = driver.execute_script("return arguments[0].validationMessage;", email_input)
            pass_msg = driver.execute_script("return arguments[0].validationMessage;", password_input)
            resultado = f"Formulário bloqueado pelo navegador\n"
            if not email_valido:
                resultado += f" - Email inválido: '{email_msg}'\n"
            if not password_valido:
                resultado += f" - Password inválida: '{pass_msg}'\n"
        else:
            driver.find_element(By.CSS_SELECTOR, "button.btn-login").click()
            time.sleep(3)

            if esperado_sucesso:
                titulo = driver.title
                if "Editar Perfil" in titulo or "Prestador de Serviços" in titulo:
                    resultado = f"Login com sucesso para {email}: PASSOU\n"
                else:
                    resultado = f"Login esperado com sucesso, mas falhou - Título inesperado: {titulo}\n"
            else:
                try:
                    erro_elemento = driver.find_element(By.ID, "errorMessage")
                    erro_texto = erro_elemento.text.strip()
                    if erro_texto:
                        resultado = f"Login incorreto para {email}: PASSOU - Mensagem de erro: '{erro_texto}'\n"
                    else:
                        resultado = f"Login incorreto esperado, mas sem mensagem visível\n"
                except NoSuchElementException:
                    resultado = f"Login incorreto esperado, mas sem elemento de erro\n"

    except Exception as e:
        resultado = f"Erro inesperado com {email}: {str(e)}\n"
    finally:
        driver.quit()

    return resultado

testes = [
    ("user@petotel.com", "user123", True),
    ("prestador@petotel.com", "prestador123", True),
    ("user@petotel.com", "senhaErrada", False),
    ("emailinvalido@", "qualquer", False),
    ("", "", False),
    ("", "senha123", False),
    ("user@petotel.com", "", False),
]

with open("test_login_results.txt", "a", encoding="utf-8") as f:
    for email, senha, sucesso in testes:
        resultado = testar_login(email, senha, esperado_sucesso=sucesso)
        entrada = f"\n---\nTeste com:\nEmail: '{email}'\nPassword: '{senha}'\n{resultado}"
        f.write(entrada)
        print(entrada) 

print("Testes finalizados. Resultados guardados em:", os.path.abspath("test_login_results.txt"))

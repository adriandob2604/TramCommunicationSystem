# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.action_chains import ActionChains
# options = Options()
# options.add_experimental_option("detach", True)
# url = "https://mapa.ztm.gda.pl/"
# driver = webdriver.Chrome(options=options)
# driver.get(url)


# wait = WebDriverWait(driver, 1)

# starting_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="cdk-dialog-0"]/ztm-install-sheet/div/div/button[2]')))
# popup = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="mat-mdc-dialog-0"]/div/div/ztm-cookies-consent/div/div/button')))
# tram_details = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="mat-mdc-slide-toggle-1-button"]')))
# # current_trams = wait.until(EC.invisibility_of_element_located((By.TAG_NAME, 'mat-option')))
# starting_button.click()
# popup.click()
# tram_details.click()
# input_element = wait.until(EC.element_to_be_clickable((By.ID, "mat-input-1")))
# input_element.click()
# wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'mat-option')))
# mat_options = driver.find_elements(By.TAG_NAME, "mat-option")
# for tram in mat_options:
#     if tram.get_attribute("aria-disabled") == "false":
#         tram.click()
#         input_element.click()
    
# # actions = ActionChains(driver)
# # actions.move_to_element(mat_option).click().perform()
# # current_trams.click()
# # driver.quit()